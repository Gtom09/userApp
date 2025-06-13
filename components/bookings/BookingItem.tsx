import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Platform 
} from 'react-native';
import { Calendar, MessageCircle, Star } from 'lucide-react-native';

interface BookingProps {
  booking: {
    id: string;
    serviceName: string;
    providerName: string;
    date: string;
    status: string;
    imageUrl: string;
  };
}

export function BookingItem({ booking }: BookingProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          bg: '#EFF6FF',
          text: '#3B82F6',
        };
      case 'completed':
        return {
          bg: '#ECFDF5',
          text: '#10B981',
        };
      case 'cancelled':
        return {
          bg: '#FEF2F2',
          text: '#EF4444',
        };
      default:
        return {
          bg: '#F1F5F9',
          text: '#64748B',
        };
    }
  };

  const statusStyle = getStatusColor(booking.status);

  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.providerInfo}>
          <Image source={{ uri: booking.imageUrl }} style={styles.providerImage} />
          <View>
            <Text style={styles.serviceName}>{booking.serviceName}</Text>
            <Text style={styles.providerName}>{booking.providerName}</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: statusStyle.bg }
        ]}>
          <Text style={[
            styles.statusText,
            { color: statusStyle.text }
          ]}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Calendar size={16} color="#64748B" />
          <Text style={styles.detailText}>{booking.date}</Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={16} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        
        {booking.status === 'completed' && (
          <TouchableOpacity style={styles.actionButton}>
            <Star size={16} color="#F59E0B" />
            <Text style={styles.actionButtonText}>Rate</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  serviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  providerName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  details: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 6,
  },
});