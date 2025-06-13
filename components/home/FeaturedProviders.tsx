import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Platform
} from 'react-native';
import { Star } from 'lucide-react-native';

const PROVIDERS = [
  {
    id: '1',
    name: 'John Smith',
    specialty: 'Plumber',
    rating: 4.8,
    reviews: 124,
    price: '₹500/hr',
    verified: true,
    image: 'https://images.pexels.com/photos/8961127/pexels-photo-8961127.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '2',
    name: 'Mike Johnson',
    specialty: 'Painter',
    rating: 4.7,
    reviews: 98,
    price: '₹450/hr',
    verified: true,
    image: 'https://images.pexels.com/photos/8961367/pexels-photo-8961367.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '3',
    name: 'Robert Davis',
    specialty: 'Civil Engineer',
    rating: 4.9,
    reviews: 156,
    price: '₹1200/hr',
    verified: true,
    image: 'https://images.pexels.com/photos/8961382/pexels-photo-8961382.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '4',
    name: 'David Wilson',
    specialty: 'Electrician',
    rating: 4.6,
    reviews: 87,
    price: '₹550/hr',
    verified: false,
    image: 'https://images.pexels.com/photos/8943644/pexels-photo-8943644.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function FeaturedProviders() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {PROVIDERS.map((provider) => (
        <TouchableOpacity 
          key={provider.id} 
          style={styles.providerCard}
          activeOpacity={0.8}
        >
          <Image 
            source={{ uri: provider.image }} 
            style={styles.providerImage} 
          />
          <View style={styles.providerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.providerName}>{provider.name}</Text>
              {provider.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.specialty}>{provider.specialty}</Text>
            <View style={styles.ratingRow}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.rating}>{provider.rating}</Text>
              <Text style={styles.reviews}>({provider.reviews})</Text>
            </View>
            <Text style={styles.price}>{provider.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 20,
  },
  providerCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
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
  providerImage: {
    width: '100%',
    height: 140,
  },
  providerInfo: {
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  providerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
  },
  verifiedBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#3B82F6',
  },
  specialty: {
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 4,
  },
  reviews: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
  price: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
});