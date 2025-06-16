import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingItem } from '@/components/bookings/BookingItem';

// Dummy data for bookings
const DUMMY_BOOKINGS = [
  {
    id: '1',
    serviceName: 'Haircut & Styling',
    providerName: 'John Smith',
    date: 'March 15, 2024 - 2:00 PM',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGUlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '2',
    serviceName: 'Facial Treatment',
    providerName: 'Sarah Johnson',
    date: 'March 10, 2024 - 11:00 AM',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww',
  },
  {
    id: '3',
    serviceName: 'Manicure & Pedicure',
    providerName: 'Emily Davis',
    date: 'March 5, 2024 - 3:30 PM',
    status: 'cancelled',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGUlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D',
  },
];

const BOOKING_STATUSES = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export default function BookingsScreen() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS);

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      )
    );
  };

  const filteredBookings = bookings.filter(booking => {
    if (selectedStatus === 'All') return true;
    return booking.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={BOOKING_STATUSES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatus === item && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedStatus(item)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedStatus === item && styles.filterButtonTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={filteredBookings}
        contentContainerStyle={styles.bookingsList}
        renderItem={({ item }) => (
          <BookingItem 
            booking={item} 
            onStatusChange={handleStatusChange}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  bookingsList: {
    padding: 16,
  },
});