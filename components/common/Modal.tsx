import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  buttons?: {
    text: string;
    onPress: () => void;
    style?: 'primary' | 'secondary' | 'destructive';
  }[];
  children?: React.ReactNode;
}

export function Modal({
  visible,
  onClose,
  title,
  message,
  type = 'info',
  buttons,
  children,
}: ModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={48} color="#10B981" />;
      case 'error':
        return <AlertCircle size={48} color="#EF4444" />;
      case 'warning':
        return <AlertCircle size={48} color="#F59E0B" />;
      default:
        return <Info size={48} color="#3B82F6" />;
    }
  };

  const getIconContainerStyle = (): ViewStyle => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#ECFDF5' };
      case 'error':
        return { backgroundColor: '#FEF2F2' };
      case 'warning':
        return { backgroundColor: '#FFFBEB' };
      default:
        return { backgroundColor: '#EFF6FF' };
    }
  };

  const getButtonStyle = (style?: 'primary' | 'secondary' | 'destructive'): ViewStyle => {
    switch (style) {
      case 'primary':
        return { backgroundColor: '#3B82F6' };
      case 'destructive':
        return { backgroundColor: '#EF4444' };
      default:
        return { backgroundColor: '#F1F5F9' };
    }
  };

  const getButtonTextStyle = (style?: 'primary' | 'secondary' | 'destructive'): TextStyle => {
    switch (style) {
      case 'primary':
        return { color: '#FFFFFF' };
      case 'destructive':
        return { color: '#FFFFFF' };
      default:
        return { color: '#64748B' };
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, getIconContainerStyle()]}>
            {getIcon()}
          </View>

          <Text style={styles.title}>{title}</Text>
          
          {message && <Text style={styles.message}>{message}</Text>}
          
          {children}

          {buttons && (
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    getButtonStyle(button.style),
                    index > 0 && styles.buttonMargin
                  ]}
                  onPress={button.onPress}
                >
                  <Text style={[styles.buttonText, getButtonTextStyle(button.style)]}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMargin: {
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 