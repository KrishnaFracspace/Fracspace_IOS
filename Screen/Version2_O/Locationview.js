import {
  View,
  Text,
  Alert,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import MapView, {Marker} from 'react-native-maps';
import IconF from 'react-native-vector-icons/FontAwesome6';
import {AppContext} from '../Context/AppContext';
import {useNavigation} from '@react-navigation/native';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


export default function Locationview(props) {
  const {globalState, setGlobalState} = useContext(AppContext);

  const navigation = useNavigation();
  const [region, setRegion] = useState(null);
  const [Address, setAdress] = useState('');
  const [LivelocationAddress, setLivelocationAddress] = useState({
    Address: '',
    Pincode: '',
    City: '',
  });

  const getLocation = () => {
  
    Geolocation.getCurrentPosition(
      position => {
        //openMap({ latitude: 78.42718862140957, longitude: 78.42718862140957 });
        const lon = position?.coords?.longitude;
        const lat = position?.coords?.latitude;
        // Alert.alert(lon);
        setRegion({
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
       // console.log('fnu');
        console.log(position?.coords?.latitude, position?.coords?.longitude);
        GetAddress(position?.coords?.latitude, position?.coords?.longitude);
        // Alert.alert('map latitude', JSON.stringify(position))
        // console.log(position?.coords?.latitude, position?.coords?.longitude);
        // Geocoder.init("AIzaSyA3ZlDDtq14fvyne4xX1eXDWn9QKsIRsjw");
        // Geocoder.from(position?.coords?.latitude, position?.coords?.longitude).then(json => {
        //     const addressComponents = json.results[0].address_components;

        //     const address = json.results[0].formatted_address;
        //     const city = addressComponents.find(component =>
        //         component.types.includes("locality")
        //     )?.long_name || "City not found";

        //     const pincode = addressComponents.find(component =>
        //         component.types.includes("postal_code")
        //     )?.long_name || "Pincode not found";
        //     console.log(address, pincode, city);

       
        //  Alert.alert('map addressError', JSON.stringify(city))
        // })
        //     .catch(error => Alert.alert('map addressError', JSON.stringify(error)));
        //  console.log(json.results[0].address_components[0]);
        //   Alert.alert('map address', JSON.stringify(addressComponent));
        //   Alert.alert('map addressSec', `${addressComponent?.origin?.results}`);

        // })
        //   .catch(error =>Alert.alert('map addressError', JSON.stringify(error)));
        // getAddress(position?.coords?.latitude,position?.coords?.longitude);
      },
      error => {
        console.log(error.code, error.message);
        // See error code charts below.
        Alert.alert('Map address Error', `${error.message}`);
       
      },
      {enableHighAccuracy: true},
    );
  };
  const GetAddress = (latitude, longitude) => {
    Geocoder.init('AIzaSyA3ZlDDtq14fvyne4xX1eXDWn9QKsIRsjw');
    Geocoder.from(latitude, longitude)
      .then(json => {
        const addressComponents = json.results[0].address_components;

        const address = json.results[0].formatted_address;
        const city =
          addressComponents.find(component =>
            component.types.includes('locality'),
          )?.long_name || 'City not found';

        const pincode =
          addressComponents.find(component =>
            component.types.includes('postal_code'),
          )?.long_name || 'Pincode not found';
        //  console.log(address, pincode, city);
        setLivelocationAddress({
          Address: address,
          Pincode: pincode,
          City: city,
        });
        //  setLocation({ address, city, pincode });
       // console.log(address);
        setAdress(address);

        //  Alert.alert('map addressError', JSON.stringify(city))
      })
      .catch(error => Alert.alert('map addressError', JSON.stringify(error)));
  };



  // const checkPermission = async () => {
  //   let permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  //   console.log(permission);
  //   // For iOS 14 and later, the permission handling changed slightly
  //   if (Platform.OS === 'ios') {
  //     try {
  //       const status = await check(permission);
  //       console.log(status);
  //       //setPermissionStatus(status);
  //       if (status === RESULTS.GRANTED) {
  //         getLocation();
  //       } else {
  //         requestPermission(permission);
  //       } 
  //       // else if (status === RESULTS.BLOCKED) {
  //       //   showAlert('Permission Blocked', 'Please enable location access in settings.');
  //       // }
  //     } catch (error) {
  //       console.log('Permission check error: ', error);
  //     }
  //   }
  // };

  // const requestPermission = async (permission) => {
  //   try {
  //     const result = await request(permission);
  //     if (result === RESULTS.GRANTED) {
  //       getLocation();
  //     } else if (result === RESULTS.DENIED) {
  //       showAlert('Permission Denied', 'Location permission is needed for this feature.');
  //     } else if (result === RESULTS.BLOCKED) {
  //       showAlert('Permission Blocked', 'Please enable location access in your settings.');
  //     }
  //   } catch (error) {
  //     console.log('Permission request error: ', error);
  //   }
  // };













  useEffect(() => {
    //checkPermission();
    getLocation();
  }, []);
  return (
    <View style={styles.container}>
      {region && (
        <>
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation={true} // Show the user's location on the map
          >
            <Marker
              draggable
              coordinate={region}
              title="You are here"
              onDragEnd={e =>
                GetAddress(
                  e?.nativeEvent?.coordinate?.latitude,
                  e?.nativeEvent?.coordinate?.longitude,
                )
              }
            />
          </MapView>

          <View style={{height: '40%', padding: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <IconF name={'location-dot'} color={'#021265'} size={22} />
              <Text
                style={{
                  marginTop: -4,
                  fontSize: 18,
                  opacity: 0.75,
                  fontFamily: 'WorkSans-Bold',
                  color: '#000000',
                }}>
                {' '}
                {LivelocationAddress?.City}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                opacity: 0.75,
                fontFamily: 'WorkSans-Medium',
                color: '#979797',
              }}>
              {LivelocationAddress?.Address}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 30,
                backgroundColor: '#021265',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 5,
              }}
              onPress={() => {
                //  console.log(props?.route?.params?.screen);
                if (props?.route?.params?.screen == 'PropertyList') {
                  setGlobalState(prevState => ({
                    ...prevState,
                    currentLocation: LivelocationAddress,
                  }));
                  navigation.push('PropertyFormSec');
                } else if (props?.route?.params?.screen == 'Commercial') {
                  setGlobalState(prevState => ({
                    ...prevState,
                    currentLocation: LivelocationAddress,
                  }));
                  navigation.push('InteriorFormSec');
                } else if (props?.route?.params?.screen == 'Residential') {
                  setGlobalState(prevState => ({
                    ...prevState,
                    currentLocation: LivelocationAddress,
                  }));
                  navigation.push('InteriorFormThird');
                } else {
                  navigation.push('PropertyManagment', {
                    Livelocation: LivelocationAddress,
                  });
                }
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#FFFFFF',
                }}>
                Confirm Location
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 15,
                backgroundColor: '#D70040',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 5,
                marginBottom:15
              }}
              onPress={() => {
                //  console.log(props?.route?.params?.screen);
                if (props?.route?.params?.screen == 'PropertyList') {
                 
                  navigation.push('PropertyFormSec');
                } else if (props?.route?.params?.screen == 'Commercial') {
                 
                  navigation.push('InteriorFormSec');
                } else if (props?.route?.params?.screen == 'Residential') {
                
                  navigation.push('InteriorFormThird');
                } else {
                  navigation.push('PropertyManagment');
                }
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#FFFFFF',
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '70%',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
