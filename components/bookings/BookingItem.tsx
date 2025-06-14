import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Platform,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Calendar, MessageCircle, Star, X } from 'lucide-react-native';

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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleRateService = () => {
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit rating
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowRatingModal(false);
      setRating(0);
      setComment('');
      
      Alert.alert('Thank You!', 'Your rating has been submitted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusStyle = getStatusColor(booking.status);

  return (
    <>
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
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleRateService}
            >
              <Star size={16} color="#F59E0B" />
              <Text style={styles.actionButtonText}>Rate</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowRatingModal(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Rate Service</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.serviceInfo}>
              <Image source={{ uri: booking.imageUrl }} style={styles.modalProviderImage} />
              <View>
                <Text style={styles.modalServiceName}>{booking.serviceName}</Text>
                <Text style={styles.modalProviderName}>{booking.providerName}</Text>
              </View>
            </View>

            <Text style={styles.ratingLabel}>How was your experience?</Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Star
                    size={40}
                    color={star <= rating ? "#F59E0B" : "#E5E7EB"}
                    fill={star <= rating ? "#F59E0B" : "transparent"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.commentLabel}>Add a comment (optional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Share your experience..."
              placeholderTextColor="#94A3B8"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={submitRating}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  placeholder: {
    width: 24,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  modalProviderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  modalServiceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  modalProviderName: {
    fontSize: 14,
    color: '#64748B',
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  starButton: {
    marginHorizontal: 8,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 32,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});