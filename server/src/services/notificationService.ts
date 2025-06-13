import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'PAYMENT_RECEIVED' | 'REVIEW_RECEIVED' | 'CHAT_MESSAGE' | 'SYSTEM_UPDATE',
  data?: any
): Promise<void> => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        data
      }
    });

    // Here you can add push notification logic
    // For example, using Firebase Cloud Messaging (FCM)
    
  } catch (error) {
    console.error('Create notification error:', error);
  }
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
): Promise<boolean> => {
  try {
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId
      },
      data: {
        read: true
      }
    });

    return true;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return false;
  }
};

export const getUserNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  try {
    const skip = (page - 1) * limit;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false }
    });

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        hasMore: notifications.length === limit
      }
    };
  } catch (error) {
    console.error('Get user notifications error:', error);
    return null;
  }
};