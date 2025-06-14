import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle,
  Calendar,
  Shield,
  Award,
  Clock
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock provider data - in a real app, this would come from an API
const PROVIDER_DATA = {
  '1': {
    id: '1',
    name: 'Rajesh Kumar',
    businessName: 'Kumar Plumbing Services',
    specialty: 'Plumber',
    rating: 4.8,
    reviews: 124,
    experience: '8 years',
    price: '₹500/hr',
    location: 'Sector 15, Noida',
    phone: '+91 9876543210',
    image: 'https://images.pexels.com/photos/8961127/pexels-photo-8961127.jpeg?auto=compress&cs=tinysrgb&w=600',
    verified: true,
    services: ['Pipe Repair', 'Bathroom Fitting', 'Water Tank Installation', 'Leak Repair', 'Drain Cleaning'],
    availability: 'Available Today',
    description: 'Professional plumbing services with 8+ years of experience. Specialized in residential and commercial plumbing solutions. Available for emergency repairs and scheduled maintenance.',
    portfolio: [
      'https://images.pexels.com/photos/8961127/pexels-photo-8961127.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/8961382/pexels-photo-8961382.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/8943644/pexels-photo-8943644.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    recentReviews: [
      {
        id: '1',
        userName: 'Priya Sharma',
        rating: 5,
        comment: 'Excellent service! Very professional and completed the work on time.',
        date: '2 days ago',
        service: 'Pipe Repair'
      },
      {
        id: '2',
        userName: 'Amit Singh',
        rating: 4,
        comment: 'Good work quality. Would recommend for plumbing needs.',
        date: '1 week ago',
        service: 'Bathroom Fitting'
      },
      {
        id: '3',
        userName: 'Neha Gupta',
        rating: 5,
        comment: 'Quick response and fair pricing. Very satisfied with the service.',
        date: '2 weeks ago',
        service: 'Leak Repair'
      }
    ]
  }
};

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const provider = PROVIDER_DATA[id as keyof typeof PROVIDER_DATA];

  if (!provider) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Provider not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBookNow = () => {
    router.push(`/booking/${provider.id}`);
  };

  const handleCall = () => {
    // In a real app, you would use Linking.openURL(`tel:${provider.phone}`)
    console.log('Calling:', provider.phone);
  };

  const handleMessage = () => {
    // Navigate to chat or messaging screen
    console.log('Opening chat with:', provider.name);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Provider Info Card */}
        <View style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <Image source={{ uri: provider.image }} style={styles.providerImage} />
            <View style={styles.providerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.providerName}>{provider.name}</Text>
                {provider.verified && (
                  <View style={styles.verifiedBadge}>
                    <Shield size={16} color="#10B981" />
                  </View>
                )}
              </View>
              <Text style={styles.businessName}>{provider.businessName}</Text>
              <Text style={styles.specialty}>{provider.specialty}</Text>
              
              <View style={styles.ratingRow}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.rating}>{provider.rating}</Text>
                <Text style={styles.reviews}>({provider.reviews} reviews)</Text>
              </View>

              <View style={styles.locationRow}>
                <MapPin size={14} color="#64748B" />
                <Text style={styles.location}>{provider.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Award size={20} color="#3B82F6" />
              <Text style={styles.statValue}>{provider.experience}</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Clock size={20} color="#10B981" />
              <Text style={styles.statValue}>{provider.price}</Text>
              <Text style={styles.statLabel}>Starting Price</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Calendar size={20} color="#F59E0B" />
              <Text style={styles.statValue}>{provider.availability}</Text>
              <Text style={styles.statLabel}>Availability</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{provider.description}</Text>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services Offered</Text>
          <View style={styles.servicesGrid}>
            {provider.services.map((service, index) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Portfolio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.portfolioContainer}
          >
            {provider.portfolio.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Image 
                  source={{ uri: image }} 
                  style={[
                    styles.portfolioImage,
                    selectedImageIndex === index && styles.selectedPortfolioImage
                  ]} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {provider.recentReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.reviewerName}>{review.userName}</Text>
                  <Text style={styles.reviewService}>{review.service}</Text>
                </View>
                <View style={styles.reviewMeta}>
                  <View style={styles.reviewRating}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Phone size={20} color="#FFFFFF" />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
          <MessageCircle size={20} color="#3B82F6" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBackButton: {
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
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#CBD5E1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  providerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 4,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
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
  description: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceTagText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  portfolioContainer: {
    paddingRight: 20,
  },
  portfolioImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
  selectedPortfolioImage: {
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  reviewService: {
    fontSize: 12,
    color: '#64748B',
  },
  reviewMeta: {
    alignItems: 'flex-end',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginLeft: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  reviewComment: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 14,
    borderRadius: 12,
  },
  messageButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 6,
  },
  bookButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});