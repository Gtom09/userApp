import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  Phone,
  CreditCard,
  CheckCircle
} from 'lucide-react-native';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
];

const DATES = [
  { date: 'Today', day: 'Mon', number: '9' },
  { date: 'Tomorrow', day: 'Tue', number: '10' },
  { date: 'Wed', day: 'Wed', number: '11' },
  { date: 'Thu', day: 'Thu', number: '12' },
  { date: 'Fri', day: 'Fri', number: '13' },
  { date: 'Sat', day: 'Sat', number: '14' },
  { date: 'Sun', day: 'Sun', number: '15' },
];

export default function BookingScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock provider data
  const provider = {
    id: providerId,
    name: 'Rajesh Kumar',
    specialty: 'Plumber',
    rating: 4.8,
    price: '₹500/hr',
    location: 'Sector 15, Noida',
    services: ['Pipe Repair', 'Bathroom Fitting', 'Water Tank Installation', 'Leak Repair'],
  };

  const handleBooking = () => {
    if (!selectedTime || !selectedService) {
      Alert.alert('Incomplete Selection', 'Please select a time slot and service');
      return;
    }

    setLoading(true);
    
    // Simulate booking API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Booking Confirmed!', 
        `Your booking with ${provider.name} has been confirmed for ${DATES[selectedDate].date} at ${selectedTime}`,
        [
          { text: 'View Bookings', onPress: () => router.push('/(tabs)/bookings') },
          { text: 'Go Home', onPress: () => router.push('/(tabs)') }
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Provider Info */}
        <View style={styles.providerCard}>
          <View style={styles.providerInfo}>
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
              <View style={styles.providerMeta}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>⭐ {provider.rating}</Text>
                </View>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#64748B" />
                  <Text style={styles.location}>{provider.location}</Text>
                </View>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{provider.price}</Text>
            </View>
          </View>
        </View>

        {/* Service Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          <View style={styles.servicesGrid}>
            {provider.services.map((service, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.serviceOption,
                  selectedService === service && styles.selectedServiceOption
                ]}
                onPress={() => setSelectedService(service)}
              >
                <Text style={[
                  styles.serviceText,
                  selectedService === service && styles.selectedServiceText
                ]}>
                  {service}
                </Text>
                {selectedService === service && (
                  <CheckCircle size={16} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesContainer}
          >
            {DATES.map((dateItem, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateOption,
                  selectedDate === index && styles.selectedDateOption
                ]}
                onPress={() => setSelectedDate(index)}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate === index && styles.selectedDateText
                ]}>
                  {dateItem.day}
                </Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === index && styles.selectedDateText
                ]}>
                  {dateItem.number}
                </Text>
                <Text style={[
                  styles.dateLabel,
                  selectedDate === index && styles.selectedDateText
                ]}>
                  {dateItem.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeOption,
                  selectedTime === time && styles.selectedTimeOption
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Clock size={16} color={selectedTime === time ? '#FFFFFF' : '#64748B'} />
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedTimeText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          
          <View style={styles.summaryRow}>
            <User size={16} color="#64748B" />
            <Text style={styles.summaryLabel}>Provider:</Text>
            <Text style={styles.summaryValue}>{provider.name}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Calendar size={16} color="#64748B" />
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>
              {selectedDate !== null ? DATES[selectedDate].date : 'Not selected'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Clock size={16} color="#64748B" />
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>
              {selectedTime || 'Not selected'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <CreditCard size={16} color="#64748B" />
            <Text style={styles.summaryLabel}>Service:</Text>
            <Text style={styles.summaryValue}>
              {selectedService || 'Not selected'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Cost:</Text>
            <Text style={styles.totalValue}>{provider.price}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedTime || !selectedService || loading) && styles.bookButtonDisabled
          ]}
          onPress={handleBooking}
          disabled={!selectedTime || !selectedService || loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? 'Confirming Booking...' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
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
  providerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  providerSpecialty: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  providerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    marginRight: 16,
  },
  rating: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  selectedServiceOption: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  serviceText: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
  selectedServiceText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  datesContainer: {
    paddingRight: 20,
  },
  dateOption: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 80,
  },
  selectedDateOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dateDay: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    minWidth: 100,
  },
  selectedTimeOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  timeText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  selectedTimeText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bookButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonDisabled: {
    opacity: 0.5,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});