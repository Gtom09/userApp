import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { Calendar, ChevronRight } from 'lucide-react-native';

const BOOKINGS = [
  {
    id: '1',
    serviceName: 'Plumbing Repair',
    date: 'Today, 3:00 PM',
    status: 'upcoming',
  },
  {
    id: '2',
    serviceName: 'Wall Painting',
    date: 'Tomorrow, 10:00 AM',
    status: 'upcoming',
  },
];

export default function RecentBookings() {
  if (BOOKINGS.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No recent bookings</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book a Service</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {BOOKINGS.map((booking) => (
        <TouchableOpacity 
          key={booking.id} 
          style={styles.bookingItem}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Calendar size={20} color="#3B82F6" />
          </View>
          <View style={styles.bookingInfo}>
            <Text style={styles.serviceName}>{booking.serviceName}</Text>
            <Text style={styles.bookingDate}>{booking.date}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge, 
              booking.status === 'upcoming' ? styles.upcomingBadge : {}
            ]}>
              <Text style={[
                styles.statusText,
                booking.status === 'upcoming' ? styles.upcomingText : {}
              ]}>
                {booking.status === 'upcoming' ? 'Upcoming' : booking.status}
              </Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </View>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View All Bookings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#CBD5E1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 4,
  },
  bookingDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#64748B',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
  },
  upcomingBadge: {
    backgroundColor: '#EFF6FF',
  },
  upcomingText: {
    color: '#3B82F6',
  },
  viewAllButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#CBD5E1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bookButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});