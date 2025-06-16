import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Switch,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight, Settings, MapPin, CreditCard, Bell, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3, Camera, Star, Shield, Gift, Users, FileText, X, ArrowLeft } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    location: 'New Delhi, India',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/(auth)/login')
        }
      ]
    );
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleMyBookings = () => {
    router.push('/(tabs)/bookings');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings screen would open here');
  };

  const saveProfile = () => {
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <Edit3 size={20} color="#3B82F6" />,
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          onPress: handleEditProfile,
        },
        {
          icon: <CreditCard size={20} color="#3B82F6" />,
          title: 'Payment Methods',
          subtitle: 'Manage your payment options',
          onPress: () => Alert.alert('Payment Methods', 'Payment methods screen would open here'),
        },
        {
          icon: <MapPin size={20} color="#3B82F6" />,
          title: 'Addresses',
          subtitle: 'Manage your saved addresses',
          onPress: () => Alert.alert('Addresses', 'Addresses screen would open here'),
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell size={20} color="#3B82F6" />,
          title: 'Notifications',
          subtitle: 'Customize notification settings',
          onPress: () => {},
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
        },
        {
          icon: <Shield size={20} color="#3B82F6" />,
          title: 'Privacy & Security',
          subtitle: 'Manage your privacy settings',
          onPress: () => Alert.alert('Privacy & Security', 'Privacy settings screen would open here'),
        },
      ]
    },
    {
      title: 'More',
      items: [
        {
          icon: <Gift size={20} color="#3B82F6" />,
          title: 'Refer Friends',
          subtitle: 'Earn rewards by referring friends',
          onPress: () => Alert.alert('Refer Friends', 'Referral screen would open here'),
        },
        {
          icon: <Star size={20} color="#3B82F6" />,
          title: 'Rate App',
          subtitle: 'Help us improve the app',
          onPress: () => Alert.alert('Thank you!', 'Redirecting to app store...'),
        },
        {
          icon: <HelpCircle size={20} color="#3B82F6" />,
          title: 'Help & Support',
          subtitle: 'Get help with your account',
          onPress: () => Alert.alert('Help & Support', 'Support screen would open here'),
        },
        {
          icon: <FileText size={20} color="#3B82F6" />,
          title: 'Terms & Privacy',
          subtitle: 'Read our terms and privacy policy',
          onPress: () => Alert.alert('Terms & Privacy', 'Terms and privacy screen would open here'),
        },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: userProfile.image }} 
                  style={styles.profileImage} 
                />
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.name}</Text>
                <View style={styles.profileDetails}>
                  <View style={styles.detailItem}>
                    <MapPin size={14} color="#64748B" />
                    <Text style={styles.detailText}>{userProfile.location}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailText}>{userProfile.email}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem} onPress={handleMyBookings}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.optionsList}>
              {section.items.map((item, itemIndex) => (
                <MenuItem 
                  key={itemIndex}
                  {...item}
                  isLast={itemIndex === section.items.length - 1}
                />
              ))}
            </View>
          </View>
        ))}
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={saveProfile}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalImageContainer}>
              <Image source={{ uri: userProfile.image }} style={styles.modalProfileImage} />
              <TouchableOpacity style={styles.modalCameraButton}>
                <Camera size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Full Name</Text>
              <TextInput
                style={styles.formInput}
                value={userProfile.name}
                onChangeText={(text) => setUserProfile(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={styles.formInput}
                value={userProfile.email}
                onChangeText={(text) => setUserProfile(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone Number</Text>
              <TextInput
                style={[styles.formInput, styles.disabledInput]}
                value={userProfile.phone}
                editable={false}
                placeholder="Enter your phone number"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.disabledText}>Mobile number cannot be changed</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Location</Text>
              <TextInput
                style={styles.formInput}
                value={userProfile.location}
                onChangeText={(text) => setUserProfile(prev => ({ ...prev, location: text }))}
                placeholder="Enter your location"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function MenuItem({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  hasSwitch, 
  switchValue, 
  onSwitchChange, 
  isLast 
}: any) {
  return (
    <TouchableOpacity 
      style={[styles.menuItem, isLast && styles.menuItemLast]} 
      onPress={onPress}
      disabled={hasSwitch}
    >
      <View style={styles.menuIconContainer}>
        {icon}
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <ChevronRight size={20} color="#94A3B8" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  headerWrapper: {
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    backgroundColor: '#F8FAFC',
    paddingTop: 24,
    paddingBottom: 24,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  profileDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 24,
    shadowColor: '#CBD5E1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  optionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#CBD5E1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 32,
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
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
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  modalImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  modalProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  modalCameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  disabledText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
});