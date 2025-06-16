import React, { useEffect } from 'react';
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
} from 'react-native';
import { Search, ShoppingCart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ServiceCategoryGrid from '@/components/home/ServiceCategoryGrid';
import FeaturedProviders from '@/components/home/FeaturedProviders';
import RecentBookings from '@/components/home/RecentBookings';

export default function HomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleCartPress = () => {
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationNumber}>147,12th cross</Text>
              <Text style={styles.locationText}>Rachenahalli- Yelahanka- Bengalur...</Text>
            </View>
            {/* <TouchableOpacity 
              style={styles.cartButton}
              onPress={handleCartPress}
            >
              <ShoppingCart size={24} color="#1E293B" />
            </TouchableOpacity> */}
          </View>
        </View>
        
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
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
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
});