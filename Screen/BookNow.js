import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useContext, useState} from 'react';
const {width, height} = Dimensions.get('window');
import Octicons from 'react-native-vector-icons/Octicons';
import Font from 'react-native-vector-icons/Fontisto';
import Upload from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import PinIcon from 'react-native-vector-icons/SimpleLineIcons';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from './Context/AppContext';
import DocumentPicker from 'react-native-document-picker';
import {ProfileVerification} from './Services/UserApi';
import {Image} from 'react-native-animatable';
import * as ImagePicker from 'react-native-image-picker';
import Back from './Back';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function BookNow(props) {
  //console.log(props?.route?.params);
  const {globalState, setGlobalState} = useContext(AppContext);
  const [loader, setLoader] = useState(false);
  //console.log(globalState?.userDetails);
  const navigation = useNavigation();
  const [Address, setAddreess] = useState('');
  const [Email, setEmail] = useState(globalState?.userDetails?.email);
  const [Phone, setPhone] = useState(globalState?.userDetails?.phoneNumber);
  const [Pin, setPin] = useState('');
  const [Name, setName] = useState(globalState?.userDetails?.userName);
  const [PickedAadhar, setPickedAadhar] = useState(null);
  const [PickedPan, setPickedPan] = useState(null);
  const [PickedCheque, setPickedCheque] = useState(null);
  const [Property, setProperty] = useState(
    props?.route?.params?.property || null,
  );
 

  const PickAadhar = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // You can specify the types of documents you want to pick
      });
      setPickedAadhar(res);
      //setError('');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Error picking document:', err);
      }
    }
  };


  const launchGalleryPan = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.2,
    };
    ImagePicker.launchImageLibrary(options, async response => {
      //console.log('check response ',response);
      if (response.didCancel != true) {
        // setProfileDisplay(response?.assets[0]?.uri);
        setPickedPan(response.assets);
        //setModalVisible(false);
        // handleProfilePic(response?.assets);
        // navigation.push(Screens.Post, {images:response.assets})
        //  return response.assets;
      } else {
        Alert.alert('Error', 'Image not selected');
      }
    });
  };

  const launchGalleryCheque = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.2,
    };
    ImagePicker.launchImageLibrary(options, async response => {
      //console.log('check response ',response);
      if (response.didCancel != true) {
        //setProfileDisplay(response?.assets[0]?.uri);
        // setPickedPan(res);
        setPickedCheque(response.assets);
        //setModalVisible(false);
        // handleProfilePic(response?.assets);
        // navigation.push(Screens.Post, {images:response.assets})
        //  return response.assets;
      } else {
        Alert.alert('Error', 'Image not selected');
      }
    });
  };

  const handleProfileVerify = async () => {
    var form = new FormData();
    form.append('email', Email);
    form.append('postalAddress', Address);
    form.append('pincode', Pin);
    form.append('phoneNumber', Phone);
    form.append('aadhar', {
      uri: PickedAadhar[0].uri,
      type: PickedAadhar[0].type,
      name: PickedAadhar[0].name,
      size: PickedAadhar[0].size,
    });
    form.append('pan', {
      uri: PickedPan[0].uri,
      type: PickedPan[0].type,
      name: PickedPan[0].fileName,
      // size: PickedPan[0].size,
    });
    form.append('chequebook', {
      uri: PickedCheque[0].uri,
      type: PickedCheque[0].type,
      name: PickedCheque[0].fileName,
      // size: PickedCheque[0].size,
    });
    //  console.log(PickedCheque);
    let payload = form;
    //console.log('payload', payload);
    try {
      let {data: res} = await ProfileVerification(payload);
      //console.log('response', res);
      if (res?.success) {
        // if (props?.route?.params?.screen == 'Profile') {
        //   Alert.alert(
        //     'Thanks for your submission!',
        //     'Our team is currently reviewing your profile verification status. Please allow us upto 24 hours to verify your profile.',
        //   );
        //   navigation.navigate('Profile');
        //   setLoader(false);
        // } else {
        //   setLoader(false);
        //   navigation.navigate('Book', {property: Property});
        // }
        Alert.alert(
          'Thanks for your submission!',
          'Our team is currently reviewing your profile verification status. Please allow us upto 24 hours to verify your profile.',
        );
        navigation.navigate('Profile');
        setLoader(false);
      }
    } catch (error) {
      if (error?.response) {
        setLoader(false);
        Alert.alert('Response Error', 'Please upload supported file formats ');

        // Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        setLoader(false);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        //console.log(error);
        setLoader(false);
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  return (
     <SafeAreaView style={{flex: 1}}>
      <Back title={'Profile Verification'}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            width: '100%',
            flex: 1,
          }}>
          {props?.route?.params?.screen == 'Profile' ? (
            <Text
              style={{
                color: '#252B5C',
                fontSize: 28,
                fontFamily: 'Montserrat-Bold',
              }}>
              Hurry ! Verify Your Account
            </Text>
          ) : (
            <Text
              style={{
                color: '#252B5C',
                fontSize: 28,
                fontFamily: 'Montserrat-Bold',
              }}>
              Hurry ! Book your property now
            </Text>
          )}

          <View style={{marginTop: 20}}>
            <View style={styles.input}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  paddingLeft: 10,
                }}>
                <Octicons name="person" size={22} color="#1E2135" />
                <TextInput
                  style={{
                    width: '100%',
                    paddingLeft: 10,
                    color: '#1E2135',
                    paddingVertical: 10,
                  }}
                  placeholder=""
                  value={Name}
                  onChangeText={txt => {
                    setName(txt);
                  }}
                />
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 16,
                  },
                ]}>
                Your Name
              </Text>
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <View style={styles.input}>
              <View
                style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '90%',
                    paddingLeft: 10,
                  }}>
                  <Font name="email" size={22} color="#1E2135" />
                  <TextInput
                    editable={false}
                    style={{
                      width: '90%',
                      paddingLeft: 10,
                      color: 'gray',
                      paddingVertical: 10,
                    }}
                    placeholder=""
                    placeholderTextColor={'#000'}
                    value={Email}
                    onChangeText={txt => {
                      setEmail(txt);
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 16,
                    // color: 'Red' ,
                  },
                ]}>
                Email
              </Text>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <View style={styles.input}>
              <View
                style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '90%',
                    paddingLeft: 10,
                  }}>
                  <Icon name="call-outline" size={22} color="#1E2135" />
                  <TextInput
                    editable={false}
                    style={{
                      width: '90%',
                      paddingLeft: 10,
                      color: 'gray',
                      paddingVertical: 10,
                    }}
                    placeholder=""
                    value={Phone}
                    placeholderTextColor={'#000'}
                    onChangeText={txt => {
                      setPhone(txt);
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 16,
                    // color: 'Red' ,
                  },
                ]}>
                Phone Number
              </Text>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <View style={styles.input}>
              <View
                style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '90%',
                    paddingLeft: 10,
                  }}>
                  <PinIcon name="location-pin" size={22} color="#1E2135" />
                  <TextInput
                    style={{
                      width: '90%',
                      paddingLeft: 10,
                      color: '#1E2135',
                      paddingVertical: 10,
                    }}
                    placeholder=""
                    value={Pin}
                    placeholderTextColor={'#000'}
                    onChangeText={txt => {
                      setPin(txt);
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 16,
                    // color: 'Red' ,
                  },
                ]}>
                Pincode
              </Text>
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <View style={styles.input}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  paddingLeft: 10,
                }}>
                <PinIcon name="location-pin" size={22} color="#1E2135" />
                <TextInput
                  style={{
                    width: '100%',
                    paddingLeft: 10,
                    color: '#1E2135',
                    paddingVertical: 10,
                  }}
                  placeholder=""
                  value={Address}
                  onChangeText={txt => {
                    setAddreess(txt);
                  }}
                />
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 16,
                  },
                ]}>
                Address
              </Text>
            </View>
          </View>

          {Phone.startsWith('+91') && Phone.length==13 ?
            <>
          <View style={{marginTop: 20}}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 16,
                  // color: 'Red' ,
                },
              ]}>
              Upload Aadhar Card
            </Text>
            <TouchableOpacity
              onPress={() => {
                PickAadhar();
                // console.log('submit');
              }}
              style={{
                alignItems: 'center',
                backgroundColor: '#f5f7fe',
                padding: 8,
                borderColor: '#043862',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 10,
              }}>
              {/* {PickedAadhar!=null?
            <Image source={{uri:PickedAadhar[0]?.uri}} style={{width:'100%',height:80,flex:1}}/>
            
            :<> */}
              <Upload name="cloud-upload" size={28} color="#043862" />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#000000',
                }}>
                Upload Aadhar front & back side image
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#A0A0A0',
                }}>
                Supports pdf only
              </Text>

              {/* </>} */}
            </TouchableOpacity>
            {PickedAadhar != null && (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#008000',
                }}>
                {' '}
                Aadhar Uploaded
              </Text>
            )}
          </View>
          <View style={{marginTop: 20}}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 16,
                  // color: 'Red' ,
                },
              ]}>
              Upload PAN Card
            </Text>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                backgroundColor: '#f5f7fe',
                padding: 10,
                borderColor: '#043862',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 10,
              }}
              onPress={() => {
                launchGalleryPan();
                //console.log('submit');
              }}>
              <Upload name="cloud-upload" size={28} color="#043862" />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#000000',
                }}>
                Upload pan card image here
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#A0A0A0',
                }}>
                Supports JPG,JPEG,PNG & GIF
              </Text>
            </TouchableOpacity>
            {PickedPan != null && (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#008000',
                }}>
                {' '}
                Pan Card Uploaded
              </Text>
            )}
          </View>
          <View style={{marginTop: 20}}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 16,
                  // color: 'Red' ,
                },
              ]}>
              Upload Cancelled Cheque
            </Text>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                backgroundColor: '#f5f7fe',
                padding: 10,
                borderColor: '#043862',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 10,
              }}
              onPress={() => {
                launchGalleryCheque();
                //console.log('submit');
              }}>
              <Upload name="cloud-upload" size={28} color="#043862" />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#000000',
                }}>
                Upload Cancelled Cheque image here
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#A0A0A0',
                }}>
                Supports JPG,JPEG,PNG & GIF
              </Text>
            </TouchableOpacity>
            {PickedCheque != null && (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#008000',
                }}>
                {' '}
                Cancelled Cheque Uploaded
              </Text>
            )}
          </View>
          </>:
           <>
           <View style={{marginTop: 20}}>
             <Text
               style={[
                 styles.label,
                 {
                   fontSize: 16,
                   // color: 'Red' ,
                 },
               ]}>
               Upload Government Issued Photo ID
             </Text>
             <TouchableOpacity
               onPress={() => {
                 PickAadhar();
                 // console.log('submit');
               }}
               style={{
                 alignItems: 'center',
                 backgroundColor: '#f5f7fe',
                 padding: 8,
                 borderColor: '#043862',
                 borderWidth: 1,
                 borderRadius: 10,
                 marginTop: 10,
               }}>
               {/* {PickedAadhar!=null?
             <Image source={{uri:PickedAadhar[0]?.uri}} style={{width:'100%',height:80,flex:1}}/>
             
             :<> */}
               <Upload name="cloud-upload" size={28} color="#043862" />
               <Text
                 style={{
                   fontSize: 14,
                   fontFamily: 'Poppins-SemiBold',
                   color: '#000000',
                 }}>
                 Upload Government Issued Photo ID
               </Text>
               <Text
                 style={{
                   fontSize: 12,
                   fontFamily: 'Poppins-SemiBold',
                   color: '#A0A0A0',
                 }}>
                 Supports pdf only
               </Text>
 
               {/* </>} */}
             </TouchableOpacity>
             {PickedAadhar != null && (
               <Text
                 style={{
                   fontSize: 14,
                   fontFamily: 'Poppins-SemiBold',
                   color: '#008000',
                 }}>
                 {' '}
                 Government Issued Photo ID Uploaded
               </Text>
             )}
           </View>
          
           </>
          }
          <TouchableOpacity
            onPress={() => {
              // console.log('submit');
              setLoader(true);
              handleProfileVerify();
              // navigation.navigate('Book')
            }}
            style={{
              alignItems: 'center',
              backgroundColor: '#043862',
              padding: 20,
              borderColor: '#043862',
              borderWidth: 1,
              borderRadius: 10,
              marginTop: 30,
            }}>
            {loader == true ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-SemiBold',
                  color: 'white',
                }}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iphone13Mini9: {
    backgroundColor: '#f5f7fe',
    //flex: 1,
    // overflow: 'hidden',
    //width: '100%',
  },
  labelContainer: {
    position: 'absolute',
    left: width * 0.04,
    // top: -(height*0.2),
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',

    // color: '#1E2135'
  },
  input: {
    // marginTop:20,
    padding: 10,
    borderColor: '#B9C4CA',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
  },

  maskGroupIconLayout: {
    // width: 110,
    // height: 110,
    width: width * 0.3,
    height: height * 0.16,
  },
});



