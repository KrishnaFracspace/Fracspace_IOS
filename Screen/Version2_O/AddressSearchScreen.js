import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Feather';
import { GOOGLE_MAPS_API_KEY } from '../Services/googleConfig';
import { AppContext } from '../Context/AppContext';

export default function AddressSearchScreen({ navigation }) {
  const { setGlobalState } = useContext(AppContext);

  const handleSelectAddress = async (data, details = null) => {
    const formattedAddress = details?.formatted_address || data?.description || '';
    const lat = details?.geometry?.location?.lat ?? null;
    const lng = details?.geometry?.location?.lng ?? null;

    let postalCode = details?.address_components?.find(component =>
      component?.types?.includes('postal_code')
    )?.long_name || '';

    if (lat !== null && lng !== null) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const geoData = await response.json();

        if (geoData?.results && Array.isArray(geoData.results)) {
          for (const result of geoData.results) {
            const pincodeComponent = result?.address_components?.find(comp =>
              comp?.types?.includes('postal_code')
            );
            if (pincodeComponent?.long_name) {
              postalCode = pincodeComponent.long_name;
              break;
            }
          }
        }
      } catch (error) {
        console.log('Reverse geocoding error:', error);
      }
    }

    setGlobalState(prevState => ({
      ...prevState,
      verificationAddress: formattedAddress,
      verificationLatitude: lat,
      verificationLongitude: lng,
      verificationPincode: postalCode,
    }));

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
      <GooglePlacesAutocomplete
        placeholder="Search your residential address"
        fetchDetails={true}
        debounce={300}
        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        minLength={2}
        onPress={handleSelectAddress}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
        styles={{
          container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
          },
          textInputContainer: {
            paddingHorizontal: 15,
            paddingBottom: 10,
          },
          textInput: {
            height: 48,
            color: '#000000',
            fontSize: 16,
            backgroundColor: '#F5F5F5',
            borderRadius: 8,
            paddingHorizontal: 12,
            fontFamily: 'WorkSans-Regular',
          },
          listView: {
            backgroundColor: '#FFFFFF',
          },
          row: {
            backgroundColor: '#FFFFFF',
            padding: 13,
            height: 44,
            flexDirection: 'row',
          },
          separator: {
            height: 0.5,
            backgroundColor: '#DDDDDD',
          },
          description: {
            color: '#000000',
            fontSize: 14,
            fontFamily: 'WorkSans-Regular',
          },
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
});
