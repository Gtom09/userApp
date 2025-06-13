import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Plumbing Repair',
        description: 'General plumbing repairs and maintenance',
        category: 'plumber',
        basePrice: 500,
        unit: 'per hour'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Pipe Installation',
        description: 'New pipe installation and replacement',
        category: 'plumber',
        basePrice: 800,
        unit: 'per hour'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Interior Painting',
        description: 'Interior wall and ceiling painting',
        category: 'painter',
        basePrice: 400,
        unit: 'per sq ft'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Exterior Painting',
        description: 'Exterior wall painting and waterproofing',
        category: 'painter',
        basePrice: 600,
        unit: 'per sq ft'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Electrical Wiring',
        description: 'Electrical wiring and installation',
        category: 'electrician',
        basePrice: 550,
        unit: 'per hour'
      }
    }),
    prisma.service.create({
      data: {
        name: 'AC Installation',
        description: 'Air conditioner installation and repair',
        category: 'electrician',
        basePrice: 1200,
        unit: 'per unit'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Structural Design',
        description: 'Building structural design and consultation',
        category: 'civil-engineer',
        basePrice: 1500,
        unit: 'per hour'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Marble Installation',
        description: 'Marble flooring and wall installation',
        category: 'marble-provider',
        basePrice: 800,
        unit: 'per sq ft'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Construction Labor',
        description: 'General construction and manual labor',
        category: 'laborer',
        basePrice: 300,
        unit: 'per day'
      }
    })
  ]);

  console.log('✅ Services created');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create customers
  const customers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'customer1@example.com',
        phone: '+919876543210',
        name: 'Rahul Sharma',
        password: hashedPassword,
        userType: 'CUSTOMER',
        phoneVerified: true,
        aadhaarNumber: '123456789012',
        aadhaarVerified: true,
        city: 'Delhi',
        state: 'Delhi',
        address: '123 Main Street, Connaught Place'
      }
    }),
    prisma.user.create({
      data: {
        email: 'customer2@example.com',
        phone: '+919876543211',
        name: 'Priya Patel',
        password: hashedPassword,
        userType: 'CUSTOMER',
        phoneVerified: true,
        aadhaarNumber: '123456789013',
        aadhaarVerified: true,
        city: 'Mumbai',
        state: 'Maharashtra',
        address: '456 Park Avenue, Bandra'
      }
    })
  ]);

  console.log('✅ Customers created');

  // Create service providers
  const providers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'plumber1@example.com',
        phone: '+919876543212',
        name: 'Rajesh Kumar',
        password: hashedPassword,
        userType: 'SERVICE_PROVIDER',
        phoneVerified: true,
        aadhaarNumber: '123456789014',
        aadhaarVerified: true,
        city: 'Delhi',
        state: 'Delhi',
        address: '789 Service Lane, Karol Bagh',
        serviceProvider: {
          create: {
            businessName: 'Kumar Plumbing Services',
            description: 'Professional plumbing services with 8+ years experience',
            experience: 8,
            hourlyRate: 500,
            verified: true,
            rating: 4.8,
            totalReviews: 124,
            totalBookings: 156,
            completedBookings: 142
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'painter1@example.com',
        phone: '+919876543213',
        name: 'Vikram Yadav',
        password: hashedPassword,
        userType: 'SERVICE_PROVIDER',
        phoneVerified: true,
        aadhaarNumber: '123456789015',
        aadhaarVerified: true,
        city: 'Delhi',
        state: 'Delhi',
        address: '321 Paint Street, Lajpat Nagar',
        serviceProvider: {
          create: {
            businessName: 'Yadav Painting Works',
            description: 'Quality painting services for residential and commercial',
            experience: 6,
            hourlyRate: 400,
            verified: true,
            rating: 4.7,
            totalReviews: 98,
            totalBookings: 112,
            completedBookings: 105
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'electrician1@example.com',
        phone: '+919876543214',
        name: 'Mohan Singh',
        password: hashedPassword,
        userType: 'SERVICE_PROVIDER',
        phoneVerified: true,
        aadhaarNumber: '123456789016',
        aadhaarVerified: true,
        city: 'Ghaziabad',
        state: 'Uttar Pradesh',
        address: '654 Electric Avenue, Vaishali',
        serviceProvider: {
          create: {
            businessName: 'Singh Electrical Works',
            description: 'Licensed electrician with expertise in residential and commercial electrical work',
            experience: 10,
            hourlyRate: 550,
            verified: true,
            rating: 4.8,
            totalReviews: 142,
            totalBookings: 178,
            completedBookings: 165
          }
        }
      }
    })
  ]);

  console.log('✅ Service providers created');

  // Link services to providers
  const plumberServices = [services[0], services[1]]; // Plumbing services
  const painterServices = [services[2], services[3]]; // Painting services
  const electricianServices = [services[4], services[5]]; // Electrical services

  // Get service provider records
  const serviceProviders = await prisma.serviceProvider.findMany({
    include: { user: true }
  });

  // Link plumber services
  const plumberProvider = serviceProviders.find(sp => sp.user.email === 'plumber1@example.com');
  if (plumberProvider) {
    await Promise.all(plumberServices.map(service =>
      prisma.serviceProviderService.create({
        data: {
          serviceProviderId: plumberProvider.id,
          serviceId: service.id,
          customPrice: service.basePrice,
          description: `Professional ${service.name.toLowerCase()} service`
        }
      })
    ));
  }

  // Link painter services
  const painterProvider = serviceProviders.find(sp => sp.user.email === 'painter1@example.com');
  if (painterProvider) {
    await Promise.all(painterServices.map(service =>
      prisma.serviceProviderService.create({
        data: {
          serviceProviderId: painterProvider.id,
          serviceId: service.id,
          customPrice: service.basePrice,
          description: `Professional ${service.name.toLowerCase()} service`
        }
      })
    ));
  }

  // Link electrician services
  const electricianProvider = serviceProviders.find(sp => sp.user.email === 'electrician1@example.com');
  if (electricianProvider) {
    await Promise.all(electricianServices.map(service =>
      prisma.serviceProviderService.create({
        data: {
          serviceProviderId: electricianProvider.id,
          serviceId: service.id,
          customPrice: service.basePrice,
          description: `Professional ${service.name.toLowerCase()} service`
        }
      })
    ));
  }

  console.log('✅ Service provider services linked');

  // Create sample bookings
  const sampleBookings = await Promise.all([
    prisma.booking.create({
      data: {
        customerId: customers[0].id,
        providerId: providers[0].id,
        serviceId: services[0].id,
        scheduledDate: new Date('2024-01-15T15:00:00Z'),
        scheduledTime: '3:00 PM',
        status: 'COMPLETED',
        address: '123 Main Street, Connaught Place, Delhi',
        estimatedPrice: 1500,
        finalPrice: 1500,
        completedAt: new Date('2024-01-15T17:30:00Z')
      }
    }),
    prisma.booking.create({
      data: {
        customerId: customers[0].id,
        providerId: providers[1].id,
        serviceId: services[2].id,
        scheduledDate: new Date('2024-01-20T10:00:00Z'),
        scheduledTime: '10:00 AM',
        status: 'CONFIRMED',
        address: '123 Main Street, Connaught Place, Delhi',
        estimatedPrice: 2000
      }
    })
  ]);

  console.log('✅ Sample bookings created');

  // Create sample review
  await prisma.review.create({
    data: {
      bookingId: sampleBookings[0].id,
      userId: customers[0].id,
      rating: 5,
      comment: 'Excellent service! Very professional and completed the work on time.'
    }
  });

  console.log('✅ Sample review created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });