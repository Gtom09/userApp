import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jwt';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { sendOTP, verifyOTP } from '../services/otpService';

const router = express.Router();
const prisma = new PrismaClient();

// Register user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('en-IN'),
  body('name').trim().isLength({ min: 2 }),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phone, name, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email or phone number' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        name,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        userType: true
      }
    });

    // Send phone verification OTP
    await sendOTP(phone, 'PHONE_VERIFICATION');

    res.status(201).json({
      message: 'User registered successfully. Please verify your phone number.',
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        serviceProvider: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify phone OTP
router.post('/verify-phone', [
  body('phone').isMobilePhone('en-IN'),
  body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, otp } = req.body;

    const isValid = await verifyOTP(phone, otp, 'PHONE_VERIFICATION');
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update user phone verification status
    await prisma.user.update({
      where: { phone },
      data: { phoneVerified: true }
    });

    res.json({ message: 'Phone number verified successfully' });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ error: 'Phone verification failed' });
  }
});

// Verify Aadhaar
router.post('/verify-aadhaar', [
  body('aadhaarNumber').isLength({ min: 12, max: 12 }).isNumeric(),
  body('userId').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { aadhaarNumber, userId } = req.body;

    // Check if Aadhaar is already registered
    const existingAadhaar = await prisma.user.findFirst({
      where: { aadhaarNumber }
    });

    if (existingAadhaar && existingAadhaar.id !== userId) {
      return res.status(400).json({ 
        error: 'This Aadhaar number is already registered' 
      });
    }

    // Update user with Aadhaar number
    await prisma.user.update({
      where: { id: userId },
      data: { aadhaarNumber }
    });

    // Send Aadhaar verification OTP (simulate)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true }
    });

    if (user?.phone) {
      await sendOTP(user.phone, 'AADHAAR_VERIFICATION');
    }

    res.json({ message: 'Aadhaar OTP sent successfully' });
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    res.status(500).json({ error: 'Aadhaar verification failed' });
  }
});

// Verify Aadhaar OTP
router.post('/verify-aadhaar-otp', [
  body('phone').isMobilePhone('en-IN'),
  body('otp').isLength({ min: 6, max: 6 }),
  body('userId').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, otp, userId } = req.body;

    const isValid = await verifyOTP(phone, otp, 'AADHAAR_VERIFICATION');
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update user Aadhaar verification status
    const user = await prisma.user.update({
      where: { id: userId },
      data: { aadhaarVerified: true },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        aadhaarVerified: true,
        userType: true
      }
    });

    res.json({ 
      message: 'Aadhaar verified successfully',
      user 
    });
  } catch (error) {
    console.error('Aadhaar OTP verification error:', error);
    res.status(500).json({ error: 'Aadhaar OTP verification failed' });
  }
});

// Resend OTP
router.post('/resend-otp', [
  body('phone').isMobilePhone('en-IN'),
  body('type').isIn(['PHONE_VERIFICATION', 'AADHAAR_VERIFICATION'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, type } = req.body;

    await sendOTP(phone, type);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

export default router;