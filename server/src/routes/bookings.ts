import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { createNotification } from '../services/notificationService';

const router = express.Router();
const prisma = new PrismaClient();

// Create booking
router.post('/', [
  body('providerId').exists(),
  body('serviceId').exists(),
  body('scheduledDate').isISO8601(),
  body('scheduledTime').exists(),
  body('address').trim().isLength({ min: 10 }),
  body('estimatedPrice').isFloat({ min: 0 })
], async (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      providerId,
      serviceId,
      scheduledDate,
      scheduledTime,
      address,
      latitude,
      longitude,
      description,
      estimatedPrice
    } = req.body;

    // Verify provider exists and is available
    const provider = await prisma.user.findFirst({
      where: {
        id: providerId,
        userType: 'SERVICE_PROVIDER',
        isActive: true,
        serviceProvider: {
          isAvailable: true
        }
      }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found or unavailable' });
    }

    // Verify service exists
    const service = await prisma.service.findFirst({
      where: { id: serviceId, isActive: true }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerId: req.user.id,
        providerId,
        serviceId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        address,
        latitude,
        longitude,
        description,
        estimatedPrice
      },
      include: {
        customer: {
          select: { name: true, phone: true }
        },
        provider: {
          select: { name: true, phone: true }
        },
        service: true
      }
    });

    // Create chat for this booking
    await prisma.chat.create({
      data: {
        bookingId: booking.id,
        customerId: req.user.id,
        providerId
      }
    });

    // Send notification to provider
    await createNotification(
      providerId,
      'New Booking Request',
      `You have a new booking request for ${service.name}`,
      'BOOKING_CONFIRMED',
      { bookingId: booking.id }
    );

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get booking details
router.get('/:id', async (req: any, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { customerId: req.user.id },
          { providerId: req.user.id }
        ]
      },
      include: {
        customer: {
          select: { id: true, name: true, phone: true, profileImage: true }
        },
        provider: {
          select: { id: true, name: true, phone: true, profileImage: true }
        },
        service: true,
        review: true,
        payment: true,
        chat: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking status
router.put('/:id/status', [
  body('status').isIn(['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
], async (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, cancellationReason } = req.body;

    const booking = await prisma.booking.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { customerId: req.user.id },
          { providerId: req.user.id }
        ]
      },
      include: {
        customer: true,
        provider: true,
        service: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
        ...(status === 'CANCELLED' && { 
          cancelledAt: new Date(),
          cancellationReason 
        })
      },
      include: {
        customer: {
          select: { id: true, name: true, phone: true }
        },
        provider: {
          select: { id: true, name: true, phone: true }
        },
        service: true
      }
    });

    // Send notification to the other party
    const notificationUserId = req.user.id === booking.customerId 
      ? booking.providerId 
      : booking.customerId;

    const notificationMessage = `Booking for ${booking.service.name} has been ${status.toLowerCase()}`;

    await createNotification(
      notificationUserId,
      'Booking Update',
      notificationMessage,
      'BOOKING_CONFIRMED',
      { bookingId: booking.id }
    );

    // Update provider stats if completed
    if (status === 'COMPLETED') {
      await prisma.serviceProvider.update({
        where: { userId: booking.providerId },
        data: {
          completedBookings: { increment: 1 }
        }
      });
    }

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Add review to booking
router.post('/:id/review', [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim()
], async (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment, images = [] } = req.body;

    const booking = await prisma.booking.findFirst({
      where: {
        id: req.params.id,
        customerId: req.user.id,
        status: 'COMPLETED'
      }
    });

    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found or not eligible for review' 
      });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: req.params.id }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already exists for this booking' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId: req.params.id,
        userId: req.user.id,
        rating,
        comment,
        images
      }
    });

    // Update provider rating
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: booking.providerId }
    });

    if (provider) {
      const newTotalReviews = provider.totalReviews + 1;
      const newRating = ((provider.rating * provider.totalReviews) + rating) / newTotalReviews;

      await prisma.serviceProvider.update({
        where: { userId: booking.providerId },
        data: {
          rating: newRating,
          totalReviews: newTotalReviews
        }
      });

      // Send notification to provider
      await createNotification(
        booking.providerId,
        'New Review',
        `You received a ${rating}-star review`,
        'REVIEW_RECEIVED',
        { bookingId: booking.id, reviewId: review.id }
      );
    }

    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

export default router;