import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFa from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
import {Dropdown} from 'react-native-element-dropdown';
import {AppContext} from '../Context/AppContext';
import {ConstructionForm, InteriorForm} from '../Services/UserApi';
import IconFo from 'react-native-vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function InteriorFormThird(props) {
  const {globalState, setGlobalState} = useContext(AppContext);
  const [InteriorData, setInteriorData] = useState(props?.route?.params?.Data);
  const [InteriorAlso,setInteriorAlso]=useState(false);
  const navigation = useNavigation();
  const [P_Type, setP_Type] = useState(globalState?.ConstructionFData?.PropertyKind == 'Residential' ? 'R' : 'C');
  const [PropertyPreference, setPropertyPreference] = useState('');
  //console.log(globalState?.currentLocation?.City);
  const [Budget, setBudget] = useState('');
  const [Location, setLocation] = useState(globalState?.currentLocation?.City||'Hyderabad');
  const [Adress, setAdress] = useState('');
  const [AdressSec, setAdressSec] = useState(globalState?.currentLocation?.Address||'');
  const [Pin, setPin] = useState(globalState?.currentLocation?.Pincode);

 const CityData = [
    { label: 'Agartala', value: 'Agartala' },
    { label: 'Agra', value: 'Agra' },
    { label: 'Ahmedabad', value: 'Ahmedabad' },
    { label: 'Aizawl', value: 'Aizawl' },
    { label: 'Ajmer', value: 'Ajmer' },
    { label: 'Amaravati', value: 'Amaravati' },
    { label: 'Amritsar', value: 'Amritsar' },
    { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
    { label: 'Bengaluru', value: 'Bengaluru' },
    { label: 'Bhagalpur', value: 'Bhagalpur' },
    { label: 'Bhopal', value: 'Bhopal' },
    { label: 'Bhubaneswar', value: 'Bhubaneswar' },
    { label: 'Bihar', value: 'Bihar' },
    { label: 'Bilaspur', value: 'Bilaspur' },
    { label: 'Chandigarh', value: 'Chandigarh' },
    { label: 'Chennai', value: 'Chennai' },
    { label: 'Chhattisgarh', value: 'Chhattisgarh' },
    { label: 'Coimbatore', value: 'Coimbatore' },
    { label: 'Cuttack', value: 'Cuttack' },
    { label: 'Dhanbad', value: 'Dhanbad' },
    { label: 'Dharamshala', value: 'Dharamshala' },
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Dehradun', value: 'Dehradun' },
    { label: 'Dibrugarh', value: 'Dibrugarh' },
    { label: 'Dimapur', value: 'Dimapur' },
    { label: 'Dispur', value: 'Dispur' },
    { label: 'Durg', value: 'Durg' },
    { label: 'Durgapur', value: 'Durgapur' },
    { label: 'Faridabad', value: 'Faridabad' },
    { label: 'Gaya', value: 'Gaya' },
    { label: 'Gangtok', value: 'Gangtok' },
    { label: 'Ghaziabad', value: 'Ghaziabad' },
    { label: 'Goa', value: 'Goa' },
    { label: 'Greater Noida', value: 'Greater Noida' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Guntur', value: 'Guntur' },
    { label: 'Gurugram', value: 'Gurugram' },
    { label: 'Guwahati', value: 'Guwahati' },
    { label: 'Gwalior', value: 'Gwalior' },
    { label: 'Haridwar', value: 'Haridwar' },
    { label: 'Haryana', value: 'Haryana' },
    { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
    { label: 'Hisar', value: 'Hisar' },
    { label: 'Howrah', value: 'Howrah' },
    { label: 'Hubli', value: 'Hubli' },
    { label: 'Hyderabad', value: 'Hyderabad' },
    { label: 'Imphal', value: 'Imphal' },
    { label: 'Itanagar', value: 'Itanagar' },
    { label: 'Jaipur', value: 'Jaipur' },
    { label: 'Jabalpur', value: 'Jabalpur' },
    { label: 'Jalandhar', value: 'Jalandhar' },
    { label: 'Jodhpur', value: 'Jodhpur' },
    { label: 'Jharkhand', value: 'Jharkhand' },
    { label: 'Kanpur', value: 'Kanpur' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: ' Kerala', value: ' Kerala' },
    { label: 'Kochi', value: 'Kochi' },
    { label: 'Kohima', value: 'Kohima' },
    { label: 'Kolkata', value: 'Kolkata' },
    { label: 'Kollam', value: 'Kollam' },
    { label: 'Korba', value: 'Korba' },
    { label: 'Kozhikode', value: 'Kozhikode' },
    { label: 'Lucknow', value: 'Lucknow' },
    { label: 'Ludhiana', value: 'Ludhiana' },
    { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
    { label: 'Madurai', value: 'Madurai' },
    { label: 'Mandi', value: 'Mandi' },
    { label: 'Manipur', value: 'Manipur' },
    { label: 'Mangalore', value: 'Mangalore' },
    { label: 'Margao', value: 'Margao' },
    { label: 'Meghalaya', value: 'Meghalaya' },
    { label: 'Mizoram', value: 'Mizoram' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Muzaffarpur', value: 'Muzaffarpur' },
    { label: 'Mysuru', value: 'Mysuru' },
    { label: 'Nagaland', value: 'Nagaland' },
    { label: 'Nagpur', value: 'Nagpur' },
    { label: 'Naharlagun', value: 'Naharlagun' },
    { label: 'Nainital', value: 'Nainital' },
    { label: 'Nashik', value: 'Nashik' },
    { label: 'Odisha', value: 'Odisha' },
    { label: 'Panaji', value: 'Panaji' },
    { label: 'Patna', value: 'Patna' },
    { label: 'Pasighat', value: 'Pasighat' },
    { label: 'Pune', value: 'Pune' },
    { label: 'Punjab', value: 'Punjab' },
    { label: 'Raipur', value: 'Raipur' },
    { label: 'Rajasthan', value: 'Rajasthan' },
    { label: 'Rajkot', value: 'Rajkot' },
    { label: 'Ranchi', value: 'Ranchi' },
    { label: 'Rourkela', value: 'Rourkela' },
    { label: 'Shimla', value: 'Shimla' },
    { label: 'Shillong', value: 'Shillong' },
    { label: 'Sikkim', value: 'Sikkim' },
    { label: 'Silchar', value: 'Silchar' },
    { label: 'Siliguri', value: 'Siliguri' },
    { label: 'Surat', value: 'Surat' },
    { label: 'Thiruvananthapuram', value: 'Thiruvananthapuram' },
    { label: 'Thoubal', value: 'Thoubal' },
    { label: 'Tiruchirappalli', value: 'Tiruchirappalli' },
    { label: 'Tura', value: 'Tura' },
    { label: 'Udaipur', value: 'Udaipur' },
    { label: 'Vadodara', value: 'Vadodara' },
    { label: 'Varanasi', value: 'Varanasi' },
    { label: 'Vasco da Gama', value: 'Vasco da Gama' },
    { label: 'Vijayawada', value: 'Vijayawada' },
    { label: 'Visakhapatnam', value: 'Visakhapatnam' },
    { label: 'Warangal', value: 'Warangal' },
];

  const handleInteriorListing = async () => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      projectType: P_Type == 'R' ? 'Residential' : 'Commercial',
      residentialType:
        P_Type == 'R'
          ? globalState?.ConstructionFData?.PropertyTypeR +
            globalState?.ConstructionFData?.ifOtherPropertyType
          : InteriorData?.Form?.Form1?.PropertyTypeC +
            globalState?.ConstructionFData?.ifOtherPropertyTypeC,
      propertyConfiguration:
        P_Type == 'R' ? InteriorData?.Form?.PropertyConfiguration : '',
      bhkSize:
        P_Type == 'R'
          ? InteriorData?.Form?.PropertySize
          : InteriorData?.PropertySize,
      location: P_Type == 'R' ? Location : InteriorData?.City,
      locationDetails: {
        longitude: 77.2195,
        latitude: 28.6315,
        place: '',
        address:
          P_Type == 'R'
            ? Adress + ' ' + AdressSec
            : InteriorData?.Adress + '' + InteriorData?.AdressSec,
        city: P_Type == 'R' ? Location : InteriorData?.City,
        state: '',
        country: 'India',
        postalCode: P_Type == 'R' ? Pin : InteriorData?.Pincode,
        currentLocation: false,
      },
      rooms: {
        bedrooms: 0,
        bathrooms: 0,
        kitchen: 0,
        livingRoom: 0,
        balcony: 0,
      },
      roomsToDesign: P_Type == 'R' ? InteriorData?.DesignRooms : [],
      finishingLevel: PropertyPreference,
      hasBudget: true,
      budget: Budget,
      specialRequirements: '', //optional
    });
    //console.log(payload);

    try {
      let {data: res} = await InteriorForm(payload);
      //console.log('prpty', res?.data);

      if (res?.success) {
        Alert.alert(
          'Thank you for submitting your request!',
          'Our concierge will get back to you within 24 hours.',
        );
        navigation.navigate('HomePage');
      }
    } catch (error) {
      if (error?.response) {
        // console.log('Response Error', error?.response?.data);
        Alert.alert('Response ErrorPPP', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //  console.log('Request error:', ${JSON.stringify(error?.request)});
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', ${JSON.stringify(error?.request)});
      } else {
        //  console.log('error');
        Alert.alert('Error:', `${error}`);
      }
    }
  };

  const handleContructionListing = async () => {
    let payload = JSON.stringify({
      projectType: P_Type == 'R' ? 'Residential' : 'Commercial',
      configuration: P_Type == 'R' ? InteriorData?.PropertyConfiguration : '',
      commercialType:
        P_Type == 'R'
          ? globalState?.ConstructionFData?.PropertyTypeR +
            globalState?.ConstructionFData?.ifOtherPropertyType
          : globalState?.ConstructionFData?.PropertyTypeC +
            globalState?.ConstructionFData?.ifOtherPropertyTypeC,
      finishingLevel: 'Premium',
      needDesignAssistance: Budget,
      hasBudget: true, ////not need
      budget: 0, ///not need
      specialRequirements: '',
      area: InteriorData?.PropertySize,
      email: globalState?.userEmail,
      locationDetails: {
        longitude: 77.5946,
        latitude: 12.9716,
        place: P_Type == 'R' ? Location : InteriorData?.City,
        address:
          P_Type == 'R'
            ? Adress + ' ' + AdressSec
            : InteriorData?.Adress + '' + InteriorData?.AdressSec,
        city: P_Type == 'R' ? Location : InteriorData?.City,
        state: 'Karnataka',
        country: 'India',
        postalCode: P_Type == 'R' ? Pin : InteriorData?.Pincode,
        currentLocation: true,
        interiorAlso:InteriorAlso
      },
    });
    //console.log(payload);

    try {
      let {data: res} = await ConstructionForm(payload);
      //console.log('prpty', res?.data);

      if (res?.success) {
        Alert.alert(
          'Thank you for submitting your request!',
          'Our concierge will get back to you within 24 hours.',
        );
        navigation.navigate('HomePage');
      }
    } catch (error) {
      if (error?.response) {
        console.log('Response Error', error?.response?.data);
        Alert.alert('Response ErrorPPP', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //  console.log('Request error:', ${JSON.stringify(error?.request)});
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', ${JSON.stringify(error?.request)});
      } else {
        //  console.log('error');
        Alert.alert('Error:', `${error}`);
      }
    }
  };

  return (
     <SafeAreaView style={{ flex: 1}}>
    <ScrollView style={{width: '100%', backgroundColor: '#FFFFFF'}}>
      <View
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 15,
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <TouchableOpacity
            style={{flex: 1,  paddingVertical: 15}}
            onPress={() => {
              if (globalState?.userEvent == 'Construction' && P_Type == 'R') {
                navigation.navigate('InteriorFSec');
              } else {
                navigation.navigate('InteriorFormSec');
              }
            }}>
            <Icon name="chevron-back-outline" size={25} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, paddingVertical: 15}}
            onPress={() => {
              navigation.navigate('HomePage');
            }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'WorkSans-SemiBold',
                color: '#0424CB',
                textAlign: 'right',
                paddingRight: 3,
              }}>
              EXIT
            </Text>
          </TouchableOpacity>
        </View>

        {P_Type == 'C' ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: '100%',
                marginVertical: 10,
                alignItems: 'center',
              }}>
              <Icon name="checkmark-circle" size={25} color={'#021265'} />
              <View
                style={{
                  borderBottomWidth: 1.5,
                  borderBottomColor: '#021265',
                  flex: 1,
                  // marginRight: 5
                }}></View>
              <Icon name="checkmark-circle" size={25} color={'#021265'} />
              <View
                style={{
                  borderBottomWidth: 1.5,
                  flex: 1,
                  borderBottomColor: '#021265',
                  // marginRight: 5
                }}></View>
              <IconF name="dot-circle-o" size={25} color={'#021265'} />
              {/* <Icon name="ellipse-outline" size={25} color={'#DDDDDD'} /> */}
            </View>

            <Text
              style={{
                fontSize: 14,
                fontFamily: 'WorkSans-Medium',
                color: '#000000',
              }}>
              Choose your preference *
            </Text>

            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  setPropertyPreference('Standard');
                }}
                style={{
                  borderWidth: PropertyPreference == 'Standard' ? 2 : 0,
                  borderColor: '#021265',
                  borderRadius: 12,
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 5,
                  marginTop: 20,
                }}>
                <Image
                  //resizeMode="stretch"
                  resizeMode="contain"
                  style={{width: width * 0.9, flex: 1, height: height * 0.18}}
                  source={
                    globalState?.userEvent == 'Construction'
                      ? require('./assets/construction1.png')
                      : require('./assets/Standard.png')
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPropertyPreference('Premium');
                }}
                style={{
                  borderWidth: PropertyPreference == 'Premium' ? 2 : 0,
                  borderColor: '#021265',
                  borderRadius: 9,
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 13,
                }}>
                <Image
                  //resizeMode="stretch"
                  resizeMode="contain"
                  style={{width: width * 0.9, flex: 1, height: height * 0.18}}
                  source={
                    globalState?.userEvent == 'Construction'
                      ? require('./assets/construction2.png')
                      : require('./assets/Premium.png')
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPropertyPreference('Elite');
                }}
                style={{
                  borderWidth: PropertyPreference == 'Elite' ? 2 : 0,
                  borderColor: '#021265',
                  borderRadius: 9,
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 13,
                }}>
                <Image
                  //resizeMode="stretch"
                  resizeMode="contain"
                  style={{width: width * 0.9, flex: 1, height: height * 0.18}}
                  source={
                    globalState?.userEvent == 'Construction'
                      ? require('./assets/construction3.png')
                      : require('./assets/Elite.png')
                  }
                />
              </TouchableOpacity>
            </View>

            {globalState?.userEvent != 'Construction' && (
              <>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 25,
                    paddingBottom: 25,
                  }}>
                  What is your budget? *{' '}
                </Text>
                <View style={styles.input}>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      paddingHorizontal: 10,
                      // paddingVertical: 5,
                    }}>
                    <TextInput
                      style={{
                        width: '100%',
                        height: 45,
                        // paddingLeft: 30,
                        color: '#1E2135',
                        fontFamily: 'Poppins-Regular',
                      }}
                      placeholder=""
                      // multiline
                      placeholderTextColor={'#000'}
                      value={Budget}
                      onChangeText={txt => {
                        setBudget(txt);
                      }}
                    />
                  </View>
                </View>
              </>
            )}

            {globalState?.userEvent == 'Construction' && (
              <>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 25,
                    paddingBottom: 25,
                  }}>
                  Do you require elevation design assistance? *{' '}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setBudget('Yes, I need help');
                    }}
                    style={{
                      borderColor: '#E8E8E8',
                      borderWidth: 1,
                      paddingHorizontal: 30,
                      paddingVertical: 10,
                      backgroundColor:
                        Budget == 'Yes, I need help' ? '#021265' : '#FFFFFF',
                      borderRadius: 20,
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'WorkSans-Medium',
                        color:
                          Budget == 'Yes, I need help' ? '#FFFFFF' : '#000000',
                        opacity: Budget == 'Yes, I need help' ? 1 : 0.6,
                      }}>
                      Yes, I need help
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setBudget('No, I have designs');
                    }}
                    style={{
                      borderColor: '#E8E8E8',
                      borderWidth: 1,
                      paddingHorizontal: 30,
                      paddingVertical: 10,
                      backgroundColor:
                        Budget == 'No, I have designs' ? '#021265' : '#FFFFFF',
                      borderRadius: 20,
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'WorkSans-Medium',
                        color:
                          Budget == 'No, I have designs'
                            ? '#FFFFFF'
                            : '#000000',
                        opacity: Budget == 'No, I have designs' ? 1 : 0.6,
                      }}>
                      No, I have designs
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
            onPress={() => {
              setInteriorAlso(!InteriorAlso);
            }}
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'row',
              paddingVertical: 30,
              paddingHorizontal:5,
              // marginVertical: 15,
              alignItems: 'center'
            }}>

            <View style={styles.option}>
              <View style={[styles.checkbox, {
                backgroundColor: InteriorAlso? '#021265' : '#ffffff', borderWidth: 1,
              }]}>
                {InteriorAlso&& (
                  <IconFa name="check" size={10} color="#ffffff" />
                )}
              </View>
            </View>

            <Text style={{
               fontSize: 14,
               fontFamily: 'WorkSans-Medium',
             
              color: '#000000',
              // opacity: 0.6
            }}> Include Interiors</Text>

          </TouchableOpacity>
              </>
            )}
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: '100%',
                marginVertical: 10,
                alignItems: 'center',
              }}>
              <Icon name="checkmark-circle" size={25} color={'#021265'} />
              <View
                style={{
                  borderBottomWidth: 1.5,
                  borderBottomColor: '#021265',
                  flex: 1,
                  // marginRight: 5
                }}></View>
              <Icon name="checkmark-circle" size={25} color={'#021265'} />
              {globalState?.userEvent != 'Construction' && (
                <>
                  <View
                    style={{
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#021265',
                      flex: 1,
                      // marginRight: 5
                    }}></View>
                  <Icon name="checkmark-circle" size={25} color={'#021265'} />
                </>
              )}
              <View
                style={{
                  borderBottomWidth: 1.5,
                  flex: 1,
                  borderBottomColor: '#021265',
                  // marginRight: 5
                }}></View>
              <IconF name="dot-circle-o" size={25} color={'#021265'} />
              {/* <Icon name="ellipse-outline" size={25} color={'#DDDDDD'} /> */}
            </View>

            <Text
              style={{
                fontSize: 14,
                fontFamily: 'WorkSans-Medium',
                color: '#000000',
                marginTop: 20,
                marginBottom: 10,
              }}>
              Enter locality *
            </Text>
            <View
              style={{
                paddingTop: 5,
                marginBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#E8E8E8',
              }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  // paddingHorizontal: 5,

                  // paddingVertical: 5,
                }}>
                <TextInput
                  style={{
                    width: '100%',
                    // height: 40,
                    // paddingTop:5,
                    // paddingLeft: 30,
                    // borderBlockColor: '#EAEAEA',\
                    // borderBottomColor:'#EAEAEA',
                    //  borderWidth: 1,
                    color: '#1E2135',
                    fontFamily: 'Poppins-Regular',
                  }}
                  placeholder="HOUSE/ FLAT/ BLOCK NO."
                  multiline
                  placeholderTextColor={'#C0C0C0'}
                  //placeholderStyle={{ paddingTop:5}}

                  value={Adress}
                  onChangeText={txt => {
                    setAdress(txt);
                  }}
                />
              </View>
            </View>
            <View
              style={{
                paddingTop: 10,
                marginBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#E8E8E8',
              }}>
              <TextInput
                style={{
                  width: '100%',
                  // paddingLeft: 30,
                  //   height: 40,
                  color: '#1E2135',
                  fontFamily: 'Poppins-Regular',
                }}
                placeholder="APARTMENT/ ROAD/ AREA (Optional)"
                multiline
                placeholderTextColor={'#C0C0C0'}
                // placeholderTextColor={'#000'}
                value={AdressSec}
                onChangeText={txt => {
                  setAdressSec(txt);
                }}
              />
              {/* </View> */}
            </View>
            <View
              style={{
                paddingTop: 15,
                marginBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#E8E8E8',
              }}>
              <TextInput
                style={{
                  width: '100%',
                  // height: 40,
                  // paddingLeft: 30,
                  color: '#1E2135',
                  fontFamily: 'Poppins-Regular',
                }}
                placeholder="PINCODE"
                keyboardType={'numeric'}
                maxLength={6}
                placeholderTextColor={'#C0C0C0'}
                // placeholderTextColor={'#000'}
                value={Pin}
                onChangeText={txt => {
                  setPin(txt);
                }}
              />
              {/* </View> */}
            </View>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              itemTextStyle={styles.itemTextStyle}
              data={CityData}
              // search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Hyderabad"
              searchPlaceholder="Search..."
              value={Location}
              onChange={item => {
                setLocation(item.value);
              }}
            />

              <TouchableOpacity onPress={() => {
                // getLocation();
                navigation.navigate('Locationview', { screen :'Residential'});
                //GgoToYosemite(PropertiesArray?.Location);

            }} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 5 }}>
                <IconFo name={'location-crosshairs'} color={"#021265"} size={15} />
                <Text style={{ color: '#021265', fontFamily: 'WorkSans-SemiBold', fontSize: 12 }}> Detect my location</Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 14,
                fontFamily: 'WorkSans-Medium',
                color: '#000000',
                marginTop: 25,
              }}>
              Choose your preference *
            </Text>

            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  setPropertyPreference('Standard');
                }}
                style={{
                  borderWidth: PropertyPreference == 'Standard' ? 2 : 0,
                  borderColor: '#021265',
                  borderRadius: 12,
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 5,
                  marginTop: 20,
                }}>
                <Image
                  //resizeMode="stretch"
                  resizeMode="contain"
                  style={{width: width * 0.9, flex: 1, height: height * 0.18}}
                  source={
                    globalState?.userEvent == 'Construction'
                      ? require('./assets/construction6.png')
                      : require('./assets/StandardR.png')
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPropertyPreference('Premium');
                }}
                style={{
                  borderWidth: PropertyPreference == 'Premium' ? 2 : 0,
                  borderColor: '#021265',
                  borderRadius: 9,
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 13,
                }}>
                <Image
                  //resizeMode="stretch"
                  resizeMode="contain"
                  style={{width: width * 0.9, flex: 1, height: height * 0.18}}
                  source={
                    globalState?.userEvent == 'Construction'
                      ? require('./assets/construction5.png')
                      : require('./assets/PermiumR.png')
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPropertyPreference('Elite');
                }}
                style={{
                  borderWidth: PropertyPreference == 'Elite' ? 2 : 0,
                  borderColor: '#021265',
                  borderRadius: 9,
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 13,
                }}>
                <Image
                  //resizeMode="stretch"
                  resizeMode="contain"
                  style={{width: width * 0.9, flex: 1, height: height * 0.18}}
                  source={
                    globalState?.userEvent == 'Construction'
                      ? require('./assets/construction4.png')
                      : require('./assets/EliteR.png')
                  }
                />
              </TouchableOpacity>
            </View>

            {globalState?.userEvent != 'Construction' && (
              <>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 25,
                    paddingBottom: 25,
                  }}>
                  What is your budget? *{' '}
                </Text>
                <View style={styles.input}>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      paddingHorizontal: 10,
                      // paddingVertical: 5,
                    }}>
                    <TextInput
                      style={{
                        width: '100%',
                        height: 45,
                        // paddingLeft: 30,
                        color: '#1E2135',
                        fontFamily: 'Poppins-Regular',
                      }}
                      placeholder=""
                      keyboardType="numeric"
                      // multiline
                      placeholderTextColor={'#000'}
                      value={Budget}
                      onChangeText={txt => {
                        setBudget(txt);
                      }}
                    />
                  </View>
                </View>
              </>
            )}

            {globalState?.userEvent == 'Construction' && (
              <>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 25,
                    paddingBottom: 25,
                  }}>
                  Do you require elevation design assistance? *{' '}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setBudget('Yes, I need help');
                    }}
                    style={{
                      borderColor: '#E8E8E8',
                      borderWidth: 1,
                      paddingHorizontal: 30,
                      paddingVertical: 10,
                      backgroundColor:
                        Budget == 'Yes, I need help' ? '#021265' : '#FFFFFF',
                      borderRadius: 20,
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'WorkSans-Medium',
                        color:
                          Budget == 'Yes, I need help' ? '#FFFFFF' : '#000000',
                        opacity: Budget == 'Yes, I need help' ? 1 : 0.6,
                      }}>
                      Yes, I need help
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setBudget('No, I have designs');
                    }}
                    style={{
                      borderColor: '#E8E8E8',
                      borderWidth: 1,
                      paddingHorizontal: 30,
                      paddingVertical: 10,
                      backgroundColor:
                        Budget == 'No, I have designs' ? '#021265' : '#FFFFFF',
                      borderRadius: 20,
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'WorkSans-Medium',
                        color:
                          Budget == 'No, I have designs'
                            ? '#FFFFFF'
                            : '#000000',
                        opacity: Budget == 'No, I have designs' ? 1 : 0.6,
                      }}>
                      No, I have designs
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
            onPress={() => {
              setInteriorAlso(!InteriorAlso);
            }}
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'row',
              paddingVertical: 30,
              paddingHorizontal:5,
              // marginVertical: 15,
              alignItems: 'center'
            }}>

            <View style={styles.option}>
              <View style={[styles.checkbox, {
                backgroundColor: InteriorAlso? '#021265' : '#ffffff', borderWidth: 1,
              }]}>
                {InteriorAlso&& (
                  <IconFa name="check" size={10} color="#ffffff" />
                )}
              </View>
            </View>

            <Text style={{
               fontSize: 14,
               fontFamily: 'WorkSans-Medium',
             
              color: '#000000',
              // opacity: 0.6
            }}> Include Interiors</Text>

          </TouchableOpacity>
              </>
            )}
          </>
        )}

        <View
          style={{
            justifyContent: 'flex-end',
            paddingVertical: 20,
            flex: 1,
            marginTop: 40,
            width: '100%',
          }}>
          <TouchableOpacity
            style={{
              marginHorizontal: 30,
              backgroundColor: '#021265',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 5,
            }}
            onPress={() => {
              if (PropertyPreference == '') {
                Alert.alert(
                  'Mandatory section required',
                  'Please provide the information in all required fields.',
                );
              } else if (Budget == '') {
                Alert.alert(
                  'Mandatory section required',
                  'Please provide the information in all required fields.',
                );
              } else if (P_Type == 'R' && Adress == '' && Pin == '') {
                Alert.alert(
                  'Mandatory section required',
                  'Please provide the information in all required fields.',
                );
              } else if (P_Type == 'R' && Pin?.length < 6) {
                Alert.alert('Pin code error', 'Please enter a valid pin code.');
              } else if (globalState?.userEvent == 'Construction') {
                handleContructionListing();
              } else {
                handleInteriorListing();
              }
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'WorkSans-SemiBold',
                color: '#FFFFFF',
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  checkbox:{
    height:16,
    width:16,
    borderColor:'#292D32',
    borderRadius:3,
    borderWidth:5,
    alignItems:'center',
    justifyContent:'center',
   backgroundColor:'#021265'
  },
  input: {
    borderColor: '#EAEAEA',
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
  },
  image: {
    width: width,
    height: 190,
    flex: 1,
  },
  dropdown: {
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    borderColor: '#EAEAEA',
    borderBottomWidth: 1,
  },
  placeholderStyle: {
    color: '#000000',
  },
  selectedTextStyle: {
    color: '#000000',
  },
  itemTextStyle: {
    color: '#000000',
  },
});
