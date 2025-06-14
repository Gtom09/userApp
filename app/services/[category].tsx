import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  Search, 
  Star, 
  MapPin, 
  Filter,
  Heart,
  Phone,
  MessageCircle,
  X,
  Sliders
} from 'lucide-react-native';

// Mock data for different service categories
const SERVICE_PROVIDERS = {
  plumber: [
    {
      id: '1',
      name: 'Rajesh Kumar',
      rating: 4.8,
      reviews: 124,
      experience: '8 years',
      price: '₹500/hr',
      location: 'Sector 15, Noida',
      image: 'https://images.pexels.com/photos/8961127/pexels-photo-8961127.jpeg?auto=compress&cs=tinysrgb&w=600',
      verified: true,
      services: ['Pipe Repair', 'Bathroom Fitting', 'Water Tank Installation'],
      availability: 'Available Today',
    },
    {
      id: '2',
      name: 'Suresh Sharma',
      rating: 4.6,
      reviews: 89,
      experience: '5 years',
      price: '₹450/hr',
      location: 'Lajpat Nagar, Delhi',
      image: 'https://images.pexels.com/photos/8961382/pexels-photo-8961382.jpeg?auto=compress&cs=tinysrgb&w=600',
      verified: true,
      services: ['Leak Repair', 'Drain Cleaning', 'Faucet Installation'],
      availability: 'Available Tomorrow',
    },
    {
      id: '3',
      name: 'Amit Singh',
      rating: 4.9,
      reviews: 156,
      experience: '12 years',
      price: '₹600/hr',
      location: 'Connaught Place, Delhi',
      image: 'https://images.pexels.com/photos/8943644/pexels-photo-8943644.jpeg?auto=compress&cs=tinysrgb&w=600',
      verified: true,
      services: ['Complete Plumbing', 'Emergency Repairs', 'New Installations'],
      availability: 'Available Today',
    },
  ],
  painter: [
    {
      id: '4',
      name: 'Vikram Yadav',
      rating: 4.7,
      reviews: 98,
      experience: '6 years',
      price: '₹400/hr',
      location: 'Karol Bagh, Delhi',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600',
      verified: true,
      services: ['Interior Painting', 'Exterior Painting', 'Wall Texturing'],
      availability: 'Available Today',
    },
    {
      id: '5',
      name: 'Ravi Gupta',
      rating: 4.5,
      reviews: 76,
      experience: '4 years',
      price: '₹350/hr',
      location: 'Dwarka, Delhi',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600',
      verified: false,
      services: ['Room Painting', 'Furniture Painting', 'Touch-ups'],
      availability: 'Available Tomorrow',
    },
  ],
  electrician: [
    {
      id: '6',
      name: 'Mohan Electricals',
      rating: 4.8,
      reviews: 142,
      experience: '10 years',
      price: '₹550/hr',
      location: 'Ghaziabad, UP',
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600',
      verified: true,
      services: ['Wiring', 'Fan Installation', 'Switch Board Repair'],
      availability: 'Available Today',
    },
  ],
  'civil-engineer': [
    {
      id: '7',
      name: 'Dr. Priya Mehta',
      rating: 4.9,
      reviews: 203,
      experience: '15 years',
      price: '₹1500/hr',
      location: 'Gurgaon, Haryana',
      image: 'https://images.pexels.com/photos/8005376/pexels-photo-8005376.jpeg?auto=compress&cs=tinysrgb&w=600',
      verified: true,
      services: ['Structural Design', 'Site Supervision', 'Quality Control'],
      availability: 'Available This Week',
    },
  ],
  'marble-provider': [
    {
      id: '8',
      name: 'Marble Palace',
      rating: 4.6,
      reviews: 145,
      experience: '10 years',
      price: '₹800/sq ft',
      location: 'Kirti Nagar, Delhi',
      image: 'https://images.pexels.com/photos/7218663/pexels-photo-7218663.jpeg?auto=compress&cs=tinysrgb&w=600',
      verified: true,
      services: ['Italian Marble', 'Indian Marble', 'Installation'],
      availability: 'Available Today',
    },
  ],
  laborer: [
    {
      id: '9',
      name: 'Construction Crew',
      rating: 4.4,
      reviews: 67,
      experience: '3 years',
      price: '₹300/day',
      location: 'Multiple Locations',
      image: 'https://images.pexels.com/photos/8961315/pexels-photo-8961315.jpeg?auto=compress&cs=tinysrgb&w=600',
      verified: true,
      services: ['General Labor', 'Material Handling', 'Site Cleaning'],
      availability: 'Available Today',
    },
  ],
};

const CATEGORY_NAMES = {
  plumber: 'Plumbers',
  painter: 'Painters',
  electrician: 'Electricians',
  'civil-engineer': 'Civil Engineers',
  'marble-provider': 'Marble Providers',
  laborer: 'Laborers',
  transport: 'Transport Services',
  bathroom: 'Bathroom Specialists',
};

export default function ServiceListingScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 1000,
    experience: 0,
    verified: false,
    availability: 'all'
  });
  const [tempFilters, setTempFilters] = useState(filters);

  const providers = SERVICE_PROVIDERS[category as keyof typeof SERVICE_PROVIDERS] || [];
  const categoryName = CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES] || 'Services';

  const filteredProviders = providers.filter(provider => {
    // Search filter
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.services.some(service => 
        service.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Rating filter
    const matchesRating = provider.rating >= filters.minRating;

    // Price filter (extract numeric value from price string)
    const priceValue = parseInt(provider.price.replace(/[^\d]/g, ''));
    const matchesPrice = priceValue <= filters.maxPrice;

    // Experience filter
    const experienceValue = parseInt(provider.experience.replace(/[^\d]/g, ''));
    const matchesExperience = experienceValue >= filters.experience;

    // Verified filter
    const matchesVerified = !filters.verified || provider.verified;

    // Availability filter
    const matchesAvailability = filters.availability === 'all' || 
      provider.availability.toLowerCase().includes(filters.availability);

    return matchesSearch && matchesRating && matchesPrice && 
           matchesExperience && matchesVerified && matchesAvailability;
  });

  const toggleFavorite = (providerId: string) => {
    setFavorites(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleBookNow = (providerId: string) => {
    router.push(`/booking/${providerId}`);
  };

  const handleProviderPress = (providerId: string) => {
    router.push(`/provider/${providerId}`);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      minRating: 0,
      maxPrice: 1000,
      experience: 0,
      verified: false,
      availability: 'all'
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  const renderProvider = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.providerCard}
      onPress={() => handleProviderPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.image }} style={styles.providerImage} />
        <View style={styles.providerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.providerName}>{item.name}</Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.ratingRow}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews} reviews)</Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Heart 
            size={20} 
            color={favorites.includes(item.id) ? "#EF4444" : "#94A3B8"}
            fill={favorites.includes(item.id) ? "#EF4444" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Experience</Text>
            <Text style={styles.detailValue}>{item.experience}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.priceValue}>{item.price}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Availability</Text>
            <Text style={styles.availabilityValue}>{item.availability}</Text>
          </View>
        </View>

        <View style={styles.servicesContainer}>
          <Text style={styles.servicesLabel}>Services:</Text>
          <View style={styles.servicesTags}>
            {item.services.slice(0, 2).map((service: string, index: number) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>{service}</Text>
              </View>
            ))}
            {item.services.length > 2 && (
              <Text style={styles.moreServices}>+{item.services.length - 2} more</Text>
            )}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => handleBookNow(item.id)}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={24} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${categoryName.toLowerCase()}...`}
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredProviders.length} {categoryName.toLowerCase()} found
        </Text>
      </View>

      <FlatList
        data={filteredProviders}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {categoryName.toLowerCase()} found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Minimum Rating</Text>
              <View style={styles.ratingOptions}>
                {[0, 3, 4, 4.5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingOption,
                      tempFilters.minRating === rating && styles.selectedOption
                    ]}
                    onPress={() => setTempFilters(prev => ({ ...prev, minRating: rating }))}
                  >
                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingOptionText}>
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Maximum Price (₹/hr)</Text>
              <View style={styles.priceOptions}>
                {[500, 750, 1000, 1500].map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.priceOption,
                      tempFilters.maxPrice === price && styles.selectedOption
                    ]}
                    onPress={() => setTempFilters(prev => ({ ...prev, maxPrice: price }))}
                  >
                    <Text style={styles.priceOptionText}>₹{price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Experience Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Minimum Experience</Text>
              <View style={styles.experienceOptions}>
                {[0, 2, 5, 10].map((exp) => (
                  <TouchableOpacity
                    key={exp}
                    style={[
                      styles.experienceOption,
                      tempFilters.experience === exp && styles.selectedOption
                    ]}
                    onPress={() => setTempFilters(prev => ({ ...prev, experience: exp }))}
                  >
                    <Text style={styles.experienceOptionText}>
                      {exp === 0 ? 'Any' : `${exp}+ years`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Verified Filter */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.verifiedFilter}
                onPress={() => setTempFilters(prev => ({ ...prev, verified: !prev.verified }))}
              >
                <View style={[
                  styles.checkbox,
                  tempFilters.verified && styles.checkedBox
                ]}>
                  {tempFilters.verified && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.verifiedText}>Verified providers only</Text>
              </TouchableOpacity>
            </View>

            {/* Availability Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Availability</Text>
              <View style={styles.availabilityOptions}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'today', label: 'Available Today' },
                  { key: 'tomorrow', label: 'Available Tomorrow' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.availabilityOption,
                      tempFilters.availability === option.key && styles.selectedOption
                    ]}
                    onPress={() => setTempFilters(prev => ({ ...prev, availability: option.key }))}
                  >
                    <Text style={styles.availabilityOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  filterButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
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
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1E293B',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
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
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 8,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  availabilityValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
  },
  servicesContainer: {
    marginBottom: 16,
  },
  servicesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  servicesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  serviceTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  serviceTagText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  moreServices: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  bookButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  resetText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  ratingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  ratingOptionText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  priceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceOption: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priceOptionText: {
    fontSize: 14,
    color: '#64748B',
  },
  experienceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  experienceOption: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  experienceOptionText: {
    fontSize: 14,
    color: '#64748B',
  },
  verifiedFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  availabilityOptions: {
    gap: 8,
  },
  availabilityOption: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  availabilityOptionText: {
    fontSize: 14,
    color: '#64748B',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});