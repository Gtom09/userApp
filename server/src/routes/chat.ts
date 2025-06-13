import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { io } from '../index';

const router = express.Router();
const prisma = new PrismaClient();

// Get user chats
router.get('/', async (req: any, res) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { customerId: req.user.id },
          { providerId: req.user.id }
        ]
      },
      include: {
        booking: {
          include: {
            service: true,
            customer: {
              select: { id: true, name: true, profileImage: true }
            },
            provider: {
              select: { id: true, name: true, profileImage: true }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get chat messages
router.get('/:chatId/messages', async (req: any, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Verify user has access to this chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.params.chatId,
        OR: [
          { customerId: req.user.id },
          { providerId: req.user.id }
        ]
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const messages = await prisma.message.findMany({
      where: { chatId: req.params.chatId },
      include: {
        sender: {
          select: { id: true, name: true, profileImage: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        chatId: req.params.chatId,
        senderId: { not: req.user.id },
        readAt: null
      },
      data: { readAt: new Date() }
    });

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/:chatId/messages', [
  body('content').trim().isLength({ min: 1 }),
  body('type').optional().isIn(['TEXT', 'IMAGE'])
], async (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, type = 'TEXT', imageUrl } = req.body;

    // Verify user has access to this chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.params.chatId,
        OR: [
          { customerId: req.user.id },
          { providerId: req.user.id }
        ]
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        chatId: req.params.chatId,
        senderId: req.user.id,
        content,
        type,
        imageUrl
      },
      include: {
        sender: {
          select: { id: true, name: true, profileImage: true }
        }
      }
    });

    // Update chat last message
    await prisma.chat.update({
      where: { id: req.params.chatId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date()
      }
    });

    // Emit message to chat room
    io.to(req.params.chatId).emit('receive_message', {
      chatId: req.params.chatId,
      message
    });

    // Send notification to the other user
    const recipientId = req.user.id === chat.customerId ? chat.providerId : chat.customerId;
    
    // You can implement push notification here
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;