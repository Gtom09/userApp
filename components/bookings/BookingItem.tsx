import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Platform,
  Modal as RNModal,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { Calendar, MessageCircle, Star, X, XCircle } from 'lucide-react-native';
import { Modal } from '@/components/common/Modal';

interface BookingProps {
  booking: {
    id: string;
    serviceName: string;
    providerName: string;
    date: string;
    status: string;
    imageUrl: string;
  };
  onStatusChange?: (bookingId: string, newStatus: string) => void;
}

const CANCELLATION_REASONS = [
  'Change of plans',
  'Found another provider',
  'Service no longer needed',
  'Price concerns',
  'Schedule conflict',
  'Other'
];

export function BookingItem({ booking, onStatusChange }: BookingProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    buttons?: { text: string; onPress: () => void; style?: 'primary' | 'secondary' | 'destructive' }[];
  }>({
    title: '',
    message: '',
    type: 'info',
  });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

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

  const handleCancelBooking = () => {
    setShowCancelModal(true);
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning', buttons?: { text: string; onPress: () => void; style?: 'primary' | 'secondary' | 'destructive' }[]) => {
    setAlertConfig({ title, message, type, buttons });
    setShowAlertModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedReason) {
      showAlert('Reason Required', 'Please select a reason for cancellation.', 'warning');
      return;
    }

    if (selectedReason === 'Other' && !otherReason.trim()) {
      showAlert('Reason Required', 'Please provide a reason for cancellation.', 'warning');
      return;
    }

    setIsCancelling(true);
    try {
      // Simulate API call to cancel booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update booking status
      if (onStatusChange) {
        onStatusChange(booking.id, 'cancelled');
      }
      
      setShowCancelModal(false);
      setSelectedReason('');
      setOtherReason('');
      
      showAlert(
        'Booking Cancelled',
        'Your booking has been cancelled successfully.',
        'success',
        [{ text: 'OK', onPress: () => setShowAlertModal(false), style: 'primary' }]
      );
    } catch (error) {
      showAlert('Error', 'Failed to cancel booking. Please try again.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const submitRating = async () => {
    if (rating === 0) {
      showAlert('Rating Required', 'Please select a rating before submitting.', 'warning');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit rating
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowRatingModal(false);
      setRating(0);
      setComment('');
      
      showAlert(
        'Thank You!',
        'Your rating has been submitted successfully.',
        'success',
        [{ text: 'OK', onPress: () => setShowAlertModal(false), style: 'primary' }]
      );
    } catch (error) {
      showAlert('Error', 'Failed to submit rating. Please try again.', 'error');
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

          {booking.status === 'upcoming' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancelBooking}
              disabled={isCancelling}
            >
              <XCircle size={16} color="#EF4444" />
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                {isCancelling ? 'Cancelling...' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Rating Modal */}
      <RNModal
        visible={showRatingModal}
        animationType="slide"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.ratingContainer}>
          <View style={styles.ratingHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRatingModal(false)}
            >
              <X size={24} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.ratingTitle}>Rate Service</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.ratingContent}>
            <View style={styles.serviceInfo}>
              <Image source={{ uri: booking.imageUrl }} style={styles.modalProviderImage} />
              <View>
                <Text style={styles.modalServiceName}>{booking.serviceName}</Text>
                <Text style={styles.modalProviderName}>{booking.providerName}</Text>
              </View>
            </View>

            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>How was your experience?</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    style={styles.starButton}
                    onPress={() => setRating(star)}
                  >
                    <Star
                      size={40}
                      color={star <= rating ? '#F59E0B' : '#E2E8F0'}
                      fill={star <= rating ? '#F59E0B' : 'none'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingDescription}>
                {rating === 1 ? 'Poor' :
                 rating === 2 ? 'Fair' :
                 rating === 3 ? 'Good' :
                 rating === 4 ? 'Very Good' :
                 rating === 5 ? 'Excellent' : 'Select a rating'}
              </Text>
            </View>

            <View style={styles.commentSection}>
              <Text style={styles.commentLabel}>Add a comment (optional)</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Share your experience..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, !rating && styles.submitButtonDisabled]}
              onPress={submitRating}
              disabled={!rating}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </RNModal>

      {/* Cancel Reason Modal */}
      <RNModal
        visible={showCancelModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowCancelModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={styles.modalContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.bookingSummary}>
              <Image source={{ uri: booking.imageUrl }} style={styles.modalProviderImage} />
              <View style={styles.bookingDetails}>
                <Text style={styles.modalServiceName}>{booking.serviceName}</Text>
                <Text style={styles.modalProviderName}>{booking.providerName}</Text>
                <View style={styles.bookingDateContainer}>
                  <Calendar size={16} color="#64748B" />
                  <Text style={styles.modalDate}>{booking.date}</Text>
                </View>
              </View>
            </View>

            <View style={styles.reasonSection}>
              <Text style={styles.reasonTitle}>Why are you cancelling?</Text>
              <Text style={styles.reasonSubtitle}>Please select a reason to help us improve our service</Text>
              
              <View style={styles.reasonsContainer}>
                {CANCELLATION_REASONS.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reasonOption,
                      selectedReason === reason && styles.selectedReasonOption
                    ]}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <View style={styles.reasonContent}>
                      <View style={[
                        styles.reasonRadio,
                        selectedReason === reason && styles.reasonRadioSelected
                      ]}>
                        {selectedReason === reason && (
                          <View style={styles.reasonRadioInner} />
                        )}
                      </View>
                      <Text style={[
                        styles.reasonText,
                        selectedReason === reason && styles.selectedReasonText
                      ]}>
                        {reason}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedReason === 'Other' && (
                <View style={styles.otherReasonContainer}>
                  <Text style={styles.otherReasonLabel}>Please specify your reason</Text>
                  <TextInput
                    style={styles.otherReasonInput}
                    placeholder="Type your reason here..."
                    placeholderTextColor="#94A3B8"
                    value={otherReason}
                    onChangeText={setOtherReason}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, styles.modalButton]}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalButtonText}>Keep Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalConfirmButton,
                  (!selectedReason || (selectedReason === 'Other' && !otherReason)) && styles.disabledButton,
                ]}
                onPress={handleCancelConfirm}
                disabled={!selectedReason || (selectedReason === 'Other' && !otherReason)}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </RNModal>

      <Modal
        visible={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={alertConfig.buttons}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  details: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 6,
  },
  cancelButton: {
    backgroundColor: '#FEF2F2',
  },
  cancelButtonText: {
    color: '#EF4444',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  placeholder: {
    width: 32,
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    padding: 16,
  },
  bookingSummary: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  modalProviderImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  bookingDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  modalServiceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  modalProviderName: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  bookingDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalDate: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  reasonSection: {
    marginBottom: 24,
  },
  reasonTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  reasonSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  reasonsContainer: {
    marginBottom: 16,
  },
  reasonOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedReasonOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  reasonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  reasonRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonRadioSelected: {
    borderColor: '#3B82F6',
  },
  reasonRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  reasonText: {
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  selectedReasonText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  otherReasonContainer: {
    marginTop: 8,
  },
  otherReasonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  otherReasonInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 100,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F1F5F9',
  },
  modalConfirmButton: {
    backgroundColor: '#EF4444',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    marginBottom: 24,
  },
  // Updated Rating Modal Styles
  ratingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  ratingContent: {
    flex: 1,
  },
  ratingSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  ratingLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    marginHorizontal: 8,
  },
  ratingDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
    textAlign: 'center',
  },
  commentSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 24,
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