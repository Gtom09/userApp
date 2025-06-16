import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingItem } from '@/components/bookings/BookingItem';
import BookingStatusFilter from '@/components/bookings/BookingStatusFilter';

const DUMMY_BOOKINGS = [
  {
    id: '1',
    serviceName: 'Plumbing Repair',
    providerName: 'John Smith',
    date: 'Today, 3:00 PM',
    status: 'upcoming',
    imageUrl: 'https://images.pexels.com/photos/3760610/pexels-photo-3760610.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '2',
    serviceName: 'Wall Painting',
    providerName: 'Mike Johnson',
    date: 'Tomorrow, 10:00 AM',
    status: 'upcoming',
    imageUrl: 'https://images.pexels.com/photos/8961382/pexels-photo-8961382.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '3',
    serviceName: 'Floor Tiling',
    providerName: 'Robert Davis',
    date: 'Oct 15, 2:30 PM',
    status: 'completed',
    imageUrl: 'https://images.pexels.com/photos/8005397/pexels-photo-8005397.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '4',
    serviceName: 'Electrical Repair',
    providerName: 'David Wilson',
    date: 'Oct 10, 11:00 AM',
    status: 'completed',
    imageUrl: 'https://images.pexels.com/photos/8943644/pexels-photo-8943644.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '5',
    serviceName: 'Bathroom Renovation',
    providerName: 'Alan Thompson',
    date: 'Oct 8, 9:00 AM',
    status: 'cancelled',
    imageUrl: 'https://images.pexels.com/photos/7218663/pexels-photo-7218663.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function BookingsScreen() {
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  
  const filteredBookings = selectedStatus === 'all' 
    ? DUMMY_BOOKINGS 
    : DUMMY_BOOKINGS.filter(booking => booking.status === selectedStatus);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Bookings</Text>
        </View>
        
        <BookingStatusFilter 
          selectedStatus={selectedStatus} 
          onSelectStatus={setSelectedStatus} 
        />
        
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookingItem booking={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bookings found</Text>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#1E293B',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#94A3B8',
  },
});