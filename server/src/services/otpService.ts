import { PrismaClient } from '@prisma/client';
import twilio from 'twilio';

const prisma = new PrismaClient();
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
export const sendOTP = async (
  phone: string, 
  type: 'PHONE_VERIFICATION' | 'AADHAAR_VERIFICATION' | 'PASSWORD_RESET',
  email?: string
): Promise<boolean> => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await prisma.oTP.create({
      data: {
        phone,
        email,
        code: otp,
        type,
        expiresAt
      }
    });

    // Send SMS using Twilio
    if (process.env.NODE_ENV === 'production') {
      await twilioClient.messages.create({
        body: `Your OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
    } else {
      // In development, just log the OTP
      console.log(`📱 OTP for ${phone}: ${otp}`);
    }

    return true;
  } catch (error) {
    console.error('Send OTP error:', error);
    return false;
  }
};

// Verify OTP
export const verifyOTP = async (
  phone: string,
  code: string,
  type: 'PHONE_VERIFICATION' | 'AADHAAR_VERIFICATION' | 'PASSWORD_RESET'
): Promise<boolean> => {
  try {
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        phone,
        code,
        type,
        verified: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!otpRecord) {
      return false;
    }

    // Mark OTP as verified
    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    });

    return true;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return false;
  }
};

// Clean up expired OTPs (run this periodically)
export const cleanupExpiredOTPs = async (): Promise<void> => {
  try {
    await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Cleanup OTPs error:', error);
  }
};