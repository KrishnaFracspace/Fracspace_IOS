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
// dot-circle-o   circle-check   checkmark-circle   ellipse-outline  checkmark-circle
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
import {Dropdown} from 'react-native-element-dropdown';
import {AppContext} from '../Context/AppContext';
import IconFo from 'react-native-vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function InteriorFormSec(props) {
  const {globalState, setGlobalState} = useContext(AppContext);
  const navigation = useNavigation();
  const [Form, setForm] = useState(props?.route?.params?.Data || null);
  const [PropertySize, setPropertySize] = useState('');
  const [DesignRooms, setDesignRooms] = useState([]);
  const [Location, setLocation] = useState(globalState?.currentLocation?.City||'Hyderabad');
  const [Adress, setAdress] = useState('');
  const [AdressSec, setAdressSec] = useState(globalState?.currentLocation?.Address);
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

  return (
     <SafeAreaView style={{ flex: 1 ,}}>
    <ScrollView style={{backgroundColor: '#FFFFFF'}}>
      {globalState?.ConstructionFData?.PropertyKind == 'Residential' ? (
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
                navigation.navigate('InteriorFSec');
              }}>
              <Icon name="chevron-back-outline" size={25} color={'#000'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1,  paddingVertical: 15}}
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
            <View
              style={{
                borderBottomWidth: 1.5,
                flex: 1,
                // marginRight: 5,
                borderBottomColor: '#DDDDDD',
              }}></View>
            <Icon name="ellipse-outline" size={25} color={'#DDDDDD'} />
          </View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'WorkSans-Medium',
              color: '#000000',
              marginTop: 20,
            }}>
            Pick the spaces for a interior makeover. *
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (DesignRooms.includes('Living Room')) {
                let Design = DesignRooms.filter(item => item != 'Living Room');
                setDesignRooms(Design);
              } else {
                setDesignRooms([...DesignRooms, 'Living Room']);
              }
            }}
            style={{
              marginVertical: 20,
              borderRadius: 5,
              padding: 15,
              width: '100%',
              backgroundColor: DesignRooms.includes('Living Room')
                ? '#021265'
                : '#FFFFFF',
              borderWidth: 1,
              borderColor: '#DCDCDC',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'WorkSans-Medium',
                color: DesignRooms.includes('Living Room')
                  ? '#FFFFFF'
                  : '#000000',
                //  marginTop: 20
              }}>
              Living Room
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (DesignRooms.includes('Kitchen')) {
                let Design = DesignRooms.filter(item => item != 'Kitchen');
                setDesignRooms(Design);
              } else {
                setDesignRooms([...DesignRooms, 'Kitchen']);
              }
            }}
            style={{
              borderRadius: 5,
              padding: 15,
              width: '100%',
              backgroundColor: DesignRooms.includes('Kitchen')
                ? '#021265'
                : '#FFFFFF',
              borderWidth: 1,
              borderColor: '#DCDCDC',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'WorkSans-Medium',
                color: DesignRooms.includes('Kitchen') ? '#FFFFFF' : '#000000',
                //  marginTop: 20
              }}>
              Kitchen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (DesignRooms.includes('Bedroom')) {
                let Design = DesignRooms.filter(item => item != 'Bedroom');
                setDesignRooms(Design);
              } else {
                setDesignRooms([...DesignRooms, 'Bedroom']);
              }
            }}
            style={{
              marginVertical: 20,
              borderRadius: 5,
              padding: 15,
              width: '100%',
              backgroundColor: DesignRooms.includes('Bedroom')
                ? '#021265'
                : '#FFFFFF',
              borderWidth: 1,
              borderColor: '#DCDCDC',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'WorkSans-Medium',
                color: DesignRooms.includes('Bedroom') ? '#FFFFFF' : '#000000',
                //  marginTop: 20
              }}>
              Bedroom
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (DesignRooms.includes('Bathroom')) {
                let Design = DesignRooms.filter(item => item != 'Bathroom');
                setDesignRooms(Design);
              } else {
                setDesignRooms([...DesignRooms, 'Bathroom']);
              }
            }}
            style={{
              borderRadius: 5,
              padding: 15,
              width: '100%',
              backgroundColor: DesignRooms.includes('Bathroom')
                ? '#021265'
                : '#FFFFFF',
              borderWidth: 1,
              borderColor: '#DCDCDC',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'WorkSans-Medium',
                color: DesignRooms.includes('Bathroom') ? '#FFFFFF' : '#000000',
                //  marginTop: 20
              }}>
              Bathroom
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (DesignRooms.includes('Balcony')) {
                let Design = DesignRooms.filter(item => item != 'Balcony');
                setDesignRooms(Design);
              } else {
                setDesignRooms([...DesignRooms, 'Balcony']);
              }
            }}
            style={{
              marginVertical: 20,
              borderRadius: 5,
              padding: 15,
              width: '100%',
              backgroundColor: DesignRooms.includes('Balcony')
                ? '#021265'
                : '#FFFFFF',
              borderWidth: 1,
              borderColor: '#DCDCDC',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'WorkSans-Medium',
                color: DesignRooms.includes('Balcony') ? '#FFFFFF' : '#000000',
                //  marginTop: 20
              }}>
              Balcony
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (DesignRooms.includes('Dining Area')) {
                let Design = DesignRooms.filter(item => item != 'Dining Area');
                setDesignRooms(Design);
              } else {
                setDesignRooms([...DesignRooms, 'Dining Area']);
              }
            }}
            style={{
              borderRadius: 5,
              padding: 15,
              width: '100%',
              backgroundColor: DesignRooms.includes('Dining Area')
                ? '#021265'
                : '#FFFFFF',
              borderWidth: 1,
              borderColor: '#DCDCDC',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'WorkSans-Medium',
                color: DesignRooms.includes('Dining Area')
                  ? '#FFFFFF'
                  : '#000000',
                //  marginTop: 20
              }}>
              Dining Area
            </Text>
          </TouchableOpacity>

          <View
            style={{
              justifyContent: 'flex-end',
              paddingVertical: 20,
              flex: 1,
              marginTop: height * 0.15,
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
                if (DesignRooms.length == 0) {
                  Alert.alert(
                    'Mandatory section required',
                    'Please select the rooms you’d like us to design.',
                  );
                } else {
                  navigation.navigate('InteriorFormThird', {
                    Data: {Form, DesignRooms: DesignRooms},
                  });
                }
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#FFFFFF',
                }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
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
                navigation.navigate('InteriorForm');
              }}>
              <Icon name="chevron-back-outline" size={25} color={'#000'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1,  paddingVertical: 15}}
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
            <IconF name="dot-circle-o" size={25} color={'#021265'} />
            <View
              style={{
                borderBottomWidth: 1.5,
                flex: 1,
                borderBottomColor: '#DDDDDD',
                // marginRight: 5
              }}></View>
            <Icon name="ellipse-outline" size={25} color={'#DDDDDD'} />
          </View>
          {globalState?.userEvent != 'Construction' && (
            <>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'WorkSans-Medium',
                  color: '#000000',
                  marginTop: 20,
                }}>
                Area *
              </Text>
              <View style={[styles.input, {marginBottom: 10, marginTop: 15}]}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    paddingHorizontal: 10,
                    // paddingVertical: 5,
                  }}>
                  <View style={{paddingHorizontal: 10, flex: 2}}>
                    <TextInput
                      style={{
                        width: '100%',
                        height: 40,
                        // paddingLeft: 30,
                        color: '#1E2135',
                        fontFamily: 'Poppins-Regular',
                      }}
                      placeholder=""
                      //multiline
                      keyboardType={'numeric'}
                      //placeholderTextColor={'#000'}

                      value={PropertySize}
                      onChangeText={txt => {
                        setPropertySize(txt);
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      color: '#1A1A1A',
                      opacity: 0.6,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                    }}>
                    sq ft
                  </Text>
                </View>
              </View>
            </>
          )}
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'WorkSans-Medium',
              color: '#000000',
              marginTop: 20,
            }}>
            Enter locality *
          </Text>
          <View
            style={{
              paddingTop: 10,
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
            // renderLeftIcon={() => (
            //   <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            // )}
          />

          <TouchableOpacity
            onPress={() => {
              // getLocation();
              navigation.navigate('Locationview', {screen: 'Commercial'});
              //GgoToYosemite(PropertiesArray?.Location);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: 5,
            }}>
            <IconFo name={'location-crosshairs'} color={'#021265'} size={15} />
            <Text
              style={{
                color: '#021265',
                fontFamily: 'WorkSans-SemiBold',
                fontSize: 12,
              }}>
              {' '}
              Detect my location
            </Text>
          </TouchableOpacity>

          {globalState?.userEvent == 'Construction' && (
            <>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'WorkSans-Medium',
                  color: '#000000',
                  marginTop: 20,
                }}>
                Area *
              </Text>
              <View style={[styles.input, {marginBottom: 10, marginTop: 15}]}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    paddingHorizontal: 10,
                    // paddingVertical: 5,
                  }}>
                  <View style={{paddingHorizontal: 10, flex: 2}}>
                    <TextInput
                      style={{
                        width: '100%',
                        height: 40,
                        // paddingLeft: 30,
                        color: '#1E2135',
                        fontFamily: 'Poppins-Regular',
                      }}
                      placeholder=""
                      keyboardType="numeric"
                      //multiline
                      //placeholderTextColor={'#000'}

                      value={PropertySize}
                      onChangeText={txt => {
                        setPropertySize(txt);
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      color: '#1A1A1A',
                      opacity: 0.6,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                    }}>
                    sq ft
                  </Text>
                </View>
              </View>
            </>
          )}

          <View
            style={{
              justifyContent: 'flex-end',
              paddingVertical: 20,
              flex: 1,
              marginTop: height * 0.15,
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
                if (Adress == '' && Pin == '' && PropertySize == '') {
                  Alert.alert(
                    'Mandatory section required',
                    'Please provide the information in all required fields',
                  );
                } else if (Pin.length < 6) {
                  Alert.alert(
                    'Pin code error',
                    'Please enter a valid pin code.',
                  );
                } else if (PropertySize == '') {
                  Alert.alert(
                    'Area field empty ',
                    'Please enter the area of your property.',
                  );
                } else if (Adress == '') {
                  Alert.alert(
                    'Location field empty ',
                    'Please field location section.',
                  );
                } else {
                  navigation.navigate('InteriorFormThird', {
                    Data: {
                      Form,
                      PropertySize: PropertySize,
                      City: Location,
                      Pincode: Pin,
                      Adress: Adress,
                      AdressSec: AdressSec,
                    },
                  });
                }
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#FFFFFF',
                }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    padding: 8,
    borderColor: '#EAEAEA',
    borderBottomWidth: 1,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,

    // elevation: 2,
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
