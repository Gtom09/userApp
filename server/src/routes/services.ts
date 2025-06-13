import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all services
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    const where: any = { isActive: true };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service providers by category
router.get('/providers', async (req, res) => {
  try {
    const { 
      category, 
      city, 
      minRating = 0, 
      maxPrice, 
      page = 1, 
      limit = 10,
      sortBy = 'rating'
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build where clause
    const where: any = {
      user: { isActive: true },
      isAvailable: true
    };

    if (city) {
      where.user.city = { contains: city as string, mode: 'insensitive' };
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating as string) };
    }

    if (maxPrice) {
      where.hourlyRate = { lte: parseFloat(maxPrice as string) };
    }

    // Filter by category through services
    if (category) {
      where.services = {
        some: {
          service: {
            category: category as string
          }
        }
      };
    }

    // Build orderBy clause
    let orderBy: any = { rating: 'desc' };
    if (sortBy === 'price') {
      orderBy = { hourlyRate: 'asc' };
    } else if (sortBy === 'experience') {
      orderBy = { experience: 'desc' };
    }

    const providers = await prisma.serviceProvider.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            city: true,
            state: true
          }
        },
        services: {
          include: {
            service: true
          }
        },
        portfolioImages: {
          take: 3
        }
      },
      orderBy,
      skip,
      take: parseInt(limit as string)
    });

    const total = await prisma.serviceProvider.count({ where });

    res.json({
      providers,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get service providers error:', error);
    res.status(500).json({ error: 'Failed to fetch service providers' });
  }
});

// Get service provider details
router.get('/providers/:id', async (req, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            city: true,
            state: true,
            phone: true
          }
        },
        services: {
          include: {
            service: true
          }
        },
        portfolioImages: true
      }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // Get recent reviews
    const reviews = await prisma.review.findMany({
      where: {
        booking: {
          providerId: provider.user.id
        }
      },
      include: {
        user: {
          select: { name: true, profileImage: true }
        },
        booking: {
          select: { service: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      provider,
      reviews
    });
  } catch (error) {
    console.error('Get provider details error:', error);
    res.status(500).json({ error: 'Failed to fetch provider details' });
  }
});

// Get service categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.service.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        category: true
      }
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;