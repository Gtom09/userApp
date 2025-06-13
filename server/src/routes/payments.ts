import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Create payment intent
router.post('/create-intent', [
  body('bookingId').exists(),
  body('amount').isFloat({ min: 1 })
], async (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookingId, amount } = req.body;

    // Verify booking exists and belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        customerId: req.user.id,
        status: 'CONFIRMED'
      },
      include: {
        service: true,
        provider: {
          select: { name: true }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or not eligible for payment' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'inr',
      metadata: {
        bookingId,
        userId: req.user.id,
        serviceId: booking.serviceId
      }
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId: req.user.id,
        amount,
        currency: 'INR',
        stripePaymentId: paymentIntent.id,
        status: 'PENDING'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment
router.post('/confirm', [
  body('paymentId').exists(),
  body('paymentIntentId').exists()
], async (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentId, paymentIntentId } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not successful' });
    }

    // Update payment record
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
        transactionId: paymentIntent.id
      },
      include: {
        booking: {
          include: {
            service: true,
            provider: {
              select: { name: true }
            }
          }
        }
      }
    });

    // Update booking final price
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { finalPrice: payment.amount }
    });

    res.json({
      message: 'Payment confirmed successfully',
      payment
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Get payment history
router.get('/history', async (req: any, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      include: {
        booking: {
          include: {
            service: true,
            provider: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.payment.count({
      where: { userId: req.user.id }
    });

    res.json({
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

export default router;