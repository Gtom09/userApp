import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Dimensions, 
  Platform, 
  TouchableOpacity,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { Search, MapPin, X, Navigation, Edit2, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ServiceCategoryGrid from '@/components/home/ServiceCategoryGrid';
import FeaturedProviders from '@/components/home/FeaturedProviders';
import RecentBookings from '@/components/home/RecentBookings';

// Mock locations data
const SAVED_LOCATIONS = [
  { id: '1', name: 'Home', address: '147, 12th cross, Rachenahalli, Yelahanka, Bengaluru' },
  { id: '2', name: 'Office', address: 'Tech Park, Whitefield, Bengaluru' },
  { id: '3', name: 'Current Location', address: 'Using device location' },
];

export default function HomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(SAVED_LOCATIONS[0]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<typeof SAVED_LOCATIONS[0] | null>(null);
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLocationSelect = (location: typeof SAVED_LOCATIONS[0]) => {
    setSelectedLocation(location);
    setShowLocationModal(false);
  };

  const handleUseCurrentLocation = () => {
    Alert.alert(
      'Location Access',
      'Allow app to access your location?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: () => {
            setSelectedLocation(SAVED_LOCATIONS[2]);
            setShowLocationModal(false);
          },
        },
      ]
    );
  };

  const handleEditLocation = (location: typeof SAVED_LOCATIONS[0]) => {
    setEditingLocation(location);
    setLocationName(location.name);
    setLocationAddress(location.address);
    setShowEditModal(true);
  };

  const handleSaveLocation = () => {
    if (!locationName.trim() || !locationAddress.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // In a real app, you would update the location in your storage/backend
    Alert.alert('Success', 'Location updated successfully');
    setShowEditModal(false);
    setEditingLocation(null);
  };

  const handleAddNewLocation = () => {
    setEditingLocation(null);
    setLocationName('');
    setLocationAddress('');
    setShowEditModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationNumber}>{selectedLocation.name}</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {selectedLocation.address}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={() => setShowLocationModal(true)}
            >
              <MapPin size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Location Selection Modal */}
        <Modal
          visible={showLocationModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowLocationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Location</Text>
                <TouchableOpacity 
                  onPress={() => setShowLocationModal(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color="#1E293B" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.currentLocationButton}
                onPress={handleUseCurrentLocation}
              >
                <Navigation size={20} color="#3B82F6" />
                <Text style={styles.currentLocationText}>Use Current Location</Text>
              </TouchableOpacity>

              <View style={styles.savedLocationsContainer}>
                <View style={styles.savedLocationsHeader}>
                  <Text style={styles.savedLocationsTitle}>Saved Locations</Text>
                  <TouchableOpacity 
                    style={styles.addLocationButton}
                    onPress={handleAddNewLocation}
                  >
                    <Plus size={20} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
                {SAVED_LOCATIONS.map((location) => (
                  <View key={location.id} style={styles.locationItemContainer}>
                    <TouchableOpacity
                      style={[
                        styles.locationItem,
                        selectedLocation.id === location.id && styles.selectedLocationItem
                      ]}
                      onPress={() => handleLocationSelect(location)}
                    >
                      <View style={styles.locationItemContent}>
                        <Text style={styles.locationItemName}>{location.name}</Text>
                        <Text style={styles.locationItemAddress} numberOfLines={1}>
                          {location.address}
                        </Text>
                      </View>
                      {selectedLocation.id === location.id && (
                        <View style={styles.selectedIndicator} />
                      )}
                    </TouchableOpacity>
                    {location.id !== '3' && ( // Don't show edit button for current location
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditLocation(location)}
                      >
                        <Edit2 size={18} color="#64748B" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Location Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingLocation ? 'Edit Location' : 'Add New Location'}
                </Text>
                <TouchableOpacity 
                  onPress={() => setShowEditModal(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color="#1E293B" />
                </TouchableOpacity>
              </View>

              <View style={styles.editForm}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Location Name</Text>
                  <TextInput
                    style={styles.input}
                    value={locationName}
                    onChangeText={setLocationName}
                    placeholder="e.g., Home, Office"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <TextInput
                    style={[styles.input, styles.addressInput]}
                    value={locationAddress}
                    onChangeText={setLocationAddress}
                    placeholder="Enter full address"
                    placeholderTextColor="#94A3B8"
                    multiline
                  />
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveLocation}
                >
                  <Text style={styles.saveButtonText}>Save Location</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for 'Interior Designers'"
            placeholderTextColor="#94A3B8"
          />
        </View>
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Services Grid */}
          <View style={styles.sectionContainer}>
            <ServiceCategoryGrid />
          </View>
          
          {/* Featured Professionals */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Featured Professionals</Text>
            <FeaturedProviders />
          </View>
          
          {/* Recent Bookings */}
          <View style={[styles.sectionContainer, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <RecentBookings />
          </View>
        </ScrollView>
      </Animated.View>
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
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flex: 1,
  },
  locationNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
  },
  locationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 25,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  lastSection: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  currentLocationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
  },
  savedLocationsContainer: {
    marginTop: 8,
  },
  savedLocationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  selectedLocationItem: {
    backgroundColor: '#EFF6FF',
  },
  locationItemContent: {
    flex: 1,
  },
  locationItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  locationItemAddress: {
    fontSize: 14,
    color: '#64748B',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  savedLocationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addLocationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
  editForm: {
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});