import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const CompleteProfilePopup = ({ visible, onComplete, onLater }) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onLater}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>👤</Text>
          </View>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.description}>
            Please complete your profile by adding your profile picture and residential address to continue enjoying all Fracspace features.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.laterButton}
              activeOpacity={0.7}
              onPress={onLater}
            >
              <Text style={styles.laterButtonText}>Later</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.completeButton}
              activeOpacity={0.8}
              onPress={onComplete}
            >
              <Text style={styles.completeButtonText}>Complete Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C7E5FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: '#021265',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  laterButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  laterButtonText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
    color: '#666666',
  },
  completeButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#021265',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default CompleteProfilePopup;
