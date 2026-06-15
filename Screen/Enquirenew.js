import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import {useContext, useState} from 'react';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Feather';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconLocation from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import {AppContext} from './Context/AppContext';
import {SiteVisit} from './Services/UserApi';
import Back from './Back';


export default function Enquirenew(props) {
  const {globalState, setGlobalState} = useContext(AppContext);
 // console.log('check', props?.route?.params?.property);
  const [PropertiesArray, setPropertiesArray] = useState(
    props?.route?.params?.property,
  );
  const [chosenDate, setChosenDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const featuresData = [
  {
    id: '1',
    image: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V10.png',
    title1: 'Risk',
    title2: 'Mitigation',
  },
  {
    id: '2',
    image: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V11.png',
    title1: 'Transparent',
    title2: 'and Secure',
  },
  {
    id: '3',
    image: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V13.png',
    title1: 'Global reach,',
    title2: 'Local expertise',
  },
  {
    id: '4',
    image: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V12.png',
    title1: 'Built for',
    title2: 'everyone',
  },
  {
    id: '5',
    image: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V14.png',
    title1: 'Easy exit',
    title2: '',
  },
];


  const handleCallNow = () => {
    const phoneNumber = '+919880626111';
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl)
      .then(supported => {
        if (!supported) {
          console.log('Phone number is not supported');
        } else {
          console.log('Phone call initiated');
        }
      })
      .catch(error => console.log('Error making phone call:', error));
  };
  const handleMail= () => {
    const mailto = 'mailto:support@fracspace.com';
    Linking.openURL(mailto)
      .catch((err) => console.error('An error occurred', err));
  };

  const handleSiteVist = async date => {
    // console.log(date);
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      userName: globalState?.userName,
      propertyId: PropertiesArray?._id,
      propertyName: PropertiesArray?.name,
      price: PropertiesArray?.Price,
      FC_Price: PropertiesArray?.FC_Price,
      phoneNumber: globalState?.userDetails?.phoneNumber,
      date: date,
      time: date,
    });
  //  console.log(payload);

    try {
      let {data: res} = await SiteVisit(payload);

      if (res?.success) {
        Alert.alert(
          'Successful Schedule Site Visit',
          `Your Site Visit Schedule is ${date}`,
        );
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        // console.log('Request error:', `${JSON.stringify(error)}`);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  return (
      <SafeAreaView style={{flex: 1,backgroundColor:"#021265"}}>
      <Back title={'Enquire Now'} />

      <ScrollView style={{backgroundColor: '#FAFAFF', padding: 15}}>
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: '#f5f7fe',
            // padding: 0,
          }}>
          <Image
            style={{width: '100%', height: 200, borderRadius: 5}}
            //source={{ uri: item?.image?.Image1 }}
            source={{uri: PropertiesArray?.image?.Image1}}
          />
          <Text
            style={{
              color: '#081F62',
              fontFamily: 'Montserrat-Bold',
              fontSize: 13,
              paddingVertical: 8,
            }}>
            {PropertiesArray?.name}
          </Text>

          <Text
            style={{
              color: '#000000',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 13,
              paddingVertical: 8,
            }}>
            Why choose fracspace?
          </Text>
          <View style={{flexDirection: 'row',paddingVertical:15}}>
          <FlatList
  data={featuresData}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View
      style={{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.01,
        shadowRadius: 1,
        backgroundColor: '#ffffff',
        elevation: 1,
        marginRight: 20,
        borderRadius: 15,
        borderColor: '#DCDCDC',
        borderWidth: 1,
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        justifyContent: 'center',
      }}>
      
      <Image
        style={{ width: 60, height: 60 }}
        resizeMode="contain"
        source={{ uri: item.image }}
      />

      <Text
        style={{
          lineHeight: 20,
          color: '#021265',
          fontFamily: 'Montserrat-Medium',
          fontSize: 14,
        }}>
        {item.title1}
      </Text>

      {item.title2 !== '' && (
        <Text
          style={{
            lineHeight: 20,
            color: '#021265',
            fontFamily: 'Montserrat-Medium',
            fontSize: 14,
          }}>
          {item.title2}
        </Text>
      )}
    </View>
  )}
/>

          </View>
          <Text
            style={{
              color: '#000000',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 13,
              paddingVertical: 1,
              paddingTop:15
            }}>
            {' '}
            Contact us
          </Text>
          <View
            style={{
              flex: 1,
              width: '100%',
            }}>
            <View style={{}}>
              <TouchableOpacity
                onPress={() => {
                  handleCallNow();
                }}
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#021265',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderColor: '#2276E9',
                  borderWidth: 1,
                  borderRadius: 8,
                  // borderBottomLeftRadius:30,
                  // borderTopLeftRadius:30,
                  marginTop: 20,
                  width: '100%',
                  // margin: 20,
                  //marginLeft:'40%'
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name="phone" size={18} color="#ffff" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'WorkSans-Medium',
                      color: '#ffff',
                      paddingLeft: 20,
                    }}>
                    Call Us
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'WorkSans-Medium',
                    color: '#ffff',
                  }}>
                  +919880626111
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleMail();
                 // setOpen(true);
                  //console.log('submit');
                }}
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // backgroundColor: '#043862',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderColor: '#357EE1',
                  borderWidth: 1,
                  borderRadius: 8,
                  marginTop: 20,
                  width: '100%',
                }}>
                <View style={{flexDirection: 'row',alignItems:'center'}}>
                  <Icon
                    name="mail"
                    size={22}
                    color="#021265"
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'WorkSans-Medium',
                      color: '#222F78',
                      paddingLeft: 20,
                    }}>
                    Mail Us
                  </Text>
                </View>
                <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'WorkSans-Medium',
                    color: '#222F78',
                  }}>
                  support@fracspace.com
                </Text>
                </View>
                {/* <IconLocation
                  name="chevron-down-outline"
                  size={22}
                  color="#000000"
                /> */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setOpen(true);
                  //console.log('submit');
                }}
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // backgroundColor: '#043862',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderColor: '#357EE1',
                  borderWidth: 1,
                  borderRadius: 8,
                  marginTop: 20,
                  width: '100%',
                  marginBottom:50
                }}>
                <View style={{flexDirection: 'row'}}>
                  <IconM
                    name="calendar-clock-outline"
                    size={22}
                    color="#021265"
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'WorkSans-Medium',
                      color: '#222F78',
                      paddingLeft: 20,
                    }}>
                    Schedule site visit
                  </Text>
                </View>
                <IconLocation
                  name="chevron-down-outline"
                  size={22}
                  color="#000000"
                />
              </TouchableOpacity>

             
            </View>
          </View>
          <DatePicker
            modal
            open={open}
            date={date}
            //textColor='green'
            title={'Unlock Your Visit Date : Reserve Your Property Preview!'}
            onConfirm={date => {
              //console.log('dtafsghysy',new Date(date).toLocaleString());
              handleSiteVist(new Date(date).toLocaleString());
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
