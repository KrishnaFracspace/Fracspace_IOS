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

const UpdatePopup = ({
  visible,
  title,
  message,
  forceUpdate,
  onLater,
  onUpdate,
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
  presentationStyle="overFullScreen"
      animationType="fade"
      onRequestClose={() => {
        if (!forceUpdate && onLater) {
          onLater();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🚀</Text>
          </View>
          <Text style={styles.title}>{title || 'Update Available'}</Text>
          <Text style={styles.message}>
            {message || 'A new version of Fracspace is available. Please update to continue.'}
          </Text>

          <View style={styles.buttonContainer}>
            {!forceUpdate && (
              <TouchableOpacity
                style={styles.laterButton}
                activeOpacity={0.7}
                onPress={() => {
    onLater?.();
  }}
              >
                <Text style={styles.laterButtonText}>Later</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.updateButton,
                forceUpdate && styles.fullWidthUpdateButton,
              ]}
              activeOpacity={0.8}
              onPress={onUpdate}
            >
              <Text style={styles.updateButtonText}>Update</Text>
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
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F0FE',
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
  message: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
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
    fontSize: 15,
    color: '#666666',
  },
  updateButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#021265',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthUpdateButton: {
    marginLeft: 0,
  },
  updateButtonText: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});

export default UpdatePopup;
