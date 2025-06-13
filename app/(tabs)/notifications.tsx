import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, CheckCircle, AlertCircle, Calendar, Star } from 'lucide-react-native';

const DUMMY_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Booking Confirmed',
    message: 'Your plumbing service booking has been confirmed for today at 3:00 PM',
    time: '2 hours ago',
    type: 'booking',
    read: false,
  },
  {
    id: '2',
    title: 'Payment Successful',
    message: 'Payment of ₹1,500 for electrical repair service has been processed',
    time: '5 hours ago',
    type: 'payment',
    read: false,
  },
  {
    id: '3',
    title: 'Service Completed',
    message: 'Your painting service has been completed. Please rate your experience',
    time: '1 day ago',
    type: 'service',
    read: true,
  },
  {
    id: '4',
    title: 'New Message',
    message: 'You have a new message from your service provider',
    time: '2 days ago',
    type: 'message',
    read: true,
  },
  {
    id: '5',
    title: 'Booking Reminder',
    message: 'Your marble installation service is scheduled for tomorrow at 10:00 AM',
    time: '3 days ago',
    type: 'reminder',
    read: true,
  },
  {
    id: '6',
    title: 'Special Offer',
    message: 'Get 20% off on your next cleaning service booking',
    time: '1 week ago',
    type: 'offer',
    read: true,
  },
];

export default function NotificationsScreen() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar size={20} color="#3B82F6" />;
      case 'payment':
        return <CheckCircle size={20} color="#10B981" />;
      case 'service':
        return <Star size={20} color="#F59E0B" />;
      case 'message':
        return <Bell size={20} color="#8B5CF6" />;
      case 'reminder':
        return <AlertCircle size={20} color="#EF4444" />;
      case 'offer':
        return <Star size={20} color="#EC4899" />;
      default:
        return <Bell size={20} color="#64748B" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'booking':
        return '#EFF6FF';
      case 'payment':
        return '#ECFDF5';
      case 'service':
        return '#FFFBEB';
      case 'message':
        return '#F3E8FF';
      case 'reminder':
        return '#FEF2F2';
      case 'offer':
        return '#FDF2F8';
      default:
        return '#F8FAFC';
    }
  };

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification
      ]}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        { backgroundColor: getNotificationBgColor(item.type) }
      ]}>
        {getNotificationIcon(item.type)}
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[
            styles.notificationTitle,
            !item.read && styles.unreadTitle
          ]}>
            {item.title}
          </Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const unreadCount = DUMMY_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        <FlatList
          data={DUMMY_NOTIFICATIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Bell size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptyText}>
                You'll see updates about your bookings and services here
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  unreadNotification: {
    backgroundColor: '#FEFEFE',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});