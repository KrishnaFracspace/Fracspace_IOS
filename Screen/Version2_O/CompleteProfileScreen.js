import React, { useContext, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import Ico from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { AppContext } from '../Context/AppContext';
import { Verification } from '../Services/UserApi';
import { profileDetails } from '../redux/reducer/profileReducer';

const { width } = Dimensions.get('window');
const DEFAULT_PROFILE_IMAGE =
  'https://fracspace-user-data.s3.ap-south-1.amazonaws.com/defaultProfile/Profile.jpeg';

export default function CompleteProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { globalState } = useContext(AppContext);
  const userProfile = useSelector(state => state.profile?.user);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const email = useMemo(() => {
    return userProfile?.email || globalState?.userEmail || '';
  }, [userProfile?.email, globalState?.userEmail]);

  const displayAddress = useMemo(() => {
    return globalState?.verificationAddress || userProfile?.postalAddress || '';
  }, [globalState?.verificationAddress, userProfile?.postalAddress]);

  const displayPincode = useMemo(() => {
    return globalState?.verificationPincode || userProfile?.pincode || '';
  }, [globalState?.verificationPincode, userProfile?.pincode]);

  const imageUri = useMemo(() => {
    if (selectedImage?.uri) {
      return selectedImage.uri;
    }
    if (userProfile?.profilePicture) {
      return userProfile.profilePicture;
    }
    return DEFAULT_PROFILE_IMAGE;
  }, [selectedImage, userProfile?.profilePicture]);

  const handlePickImage = useCallback(async () => {
    try {
      const response = await new Promise((resolve, reject) => {
        launchImageLibrary(
          {
            mediaType: 'photo',
            includeBase64: false,
            selectionLimit: 1,
          },
          res => {
            if (res.didCancel) reject('cancelled');
            else if (res.errorCode) reject(res.errorMessage);
            else resolve(res.assets?.[0]);
          }
        );
      });

      if (response) {
        const normalized = {
          uri: response.uri,
          name: response.fileName || `profile_${Date.now()}.jpg`,
          type: response.type || 'image/jpeg',
        };
        setSelectedImage(normalized);
      }
    } catch (err) {
      if (err !== 'cancelled') {
        Toast.show({
          type: 'error',
          text1: 'Image Picker Error',
          text2: 'Unable to select image. Please try again.',
        });
      }
    }
  }, []);

  const handleAddressPress = useCallback(() => {
    navigation.navigate('AddressSearchScreen');
  }, [navigation]);

  const handleSave = useCallback(async () => {
    if (isUploading) return;

    const hasProfilePic =
      selectedImage ||
      (userProfile?.profilePicture &&
        userProfile.profilePicture !== DEFAULT_PROFILE_IMAGE);

    if (!hasProfilePic) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select a profile picture.',
      });
      return;
    }

    if (!displayAddress || displayAddress.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select your residential address.',
      });
      return;
    }

    if (!displayPincode || displayPincode.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Unable to determine pincode. Please select a more specific address.',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);

      if (selectedImage) {
        formData.append('profile', {
          uri: selectedImage.uri,
          name: selectedImage.name || 'profile.jpg',
          type: selectedImage.type || 'image/jpeg',
        });
      }

      formData.append('postalAddress', displayAddress);
      formData.append('pincode', displayPincode);

      const response = await Verification(formData);
      const res = response?.data;

      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile updated successfully!',
        });

        if (email) {
          dispatch(profileDetails({ email }));
        }

        navigation.navigate('BottomNavigations', { screen: 'Home' });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: res?.message || 'Failed to update profile.',
        });
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMsg,
      });
    } finally {
      setIsUploading(false);
    }
  }, [
    isUploading,
    selectedImage,
    userProfile?.profilePicture,
    displayAddress,
    displayPincode,
    email,
    dispatch,
    navigation,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#C7E5FD', '#FFFFFF']}
          style={styles.headerGradient}
        >
          <View style={styles.topHeader}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Icon name="arrow-left" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Complete Profile</Text>
            <View style={{ width: 24 }} />
          </View>
          <Text style={styles.subTitle}>
            Add your profile picture and address to continue
          </Text>
        </LinearGradient>

        <View style={styles.cardContainer}>
          {/* Profile Picture Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Profile Picture</Text>
            <View style={styles.avatarSection}>
              <TouchableOpacity
                onPress={handlePickImage}
                activeOpacity={0.8}
                style={styles.avatarContainer}
              >
                <Image source={{ uri: imageUri }} style={styles.avatar} />
                <View style={styles.cameraBadge}>
                  <Icon name="camera" size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.uploadHint}>
              Tap to upload a new profile picture (JPG / PNG)
            </Text>
          </View>

          {/* Residential Address Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddressPress}
            style={styles.card}
          >
            <Text style={styles.cardLabel}>Residential Address</Text>
            <View style={styles.addressBox}>
              <Text
                style={[
                  styles.addressText,
                  !displayAddress && styles.placeholderText,
                ]}
                numberOfLines={3}
              >
                {displayAddress ? displayAddress : 'Search your residential address'}
              </Text>
              <Ico name="location-outline" size={22} color="#021265" />
            </View>
            {!!displayPincode && (
              <Text style={styles.pincodeBadge}>Pincode: {displayPincode}</Text>
            )}
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            disabled={isUploading}
            activeOpacity={0.8}
            onPress={handleSave}
            style={[styles.saveButton, isUploading && styles.disabledButton]}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save & Complete</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerGradient: {
    width: width,
    padding: 20,
    alignItems: 'center',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
  subTitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#333333',
    marginTop: 10,
    marginBottom: 15,
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  card: {
    borderWidth: 0.7,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  cardLabel: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
    color: '#021265',
    marginBottom: 15,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#021265',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  uploadHint: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginTop: 8,
  },
  addressBox: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 14,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
  },
  addressText: {
    flex: 1,
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: '#000000',
    marginRight: 10,
  },
  placeholderText: {
    color: '#999999',
  },
  pincodeBadge: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 12,
    color: '#021265',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#021265',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
