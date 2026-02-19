import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from './Context/AppContext';
import {EnquireDetails, ProfileDetails, StayBooking} from './Services/UserApi';
const {width, height} = Dimensions.get('window');
import DatePicker from 'react-native-date-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import Back from './Back';

export default function Enquire(props) {
  const {globalState, setGlobalState} = useContext(AppContext);
  const navigation = useNavigation();
  const [CheckIn, setCheckIn] = useState('');
  const [Email, setEmail] = useState(globalState?.userDetails?.email);
  const [Guest, setGuest] = useState('');
  const [Name, setName] = useState(globalState?.userDetails?.userName);
  const [PropertyName, setPropertyName] = useState(
    props?.route?.params?.propertyid,
  );
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [date, setDate] = useState(new Date());
  const [CheckOut, setCheckOut] = useState('');

  const handleBooking= async () => {

    let payload = JSON.stringify({
      propertyName: PropertyName,
      email: Email,
      checkInDate: CheckIn,
      checkOutDate: CheckOut,
      numberOfGuests: Guest
    });
   // console.log(payload);
  
    try {
      let {data: res} = await StayBooking(payload);
    // console.log(res);

      if (res?.success) {
        Alert.alert(
          'Thanks for your submission!',
          'Our team is currently reviewing your booking request. Please allow us upto 24 hours to confirm your booking status.',
        );
      navigation.navigate('Dashboard');
      
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Response error:', `${error?.response?.data?.message}`);
      } else if (error.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
       // Alert.alert('Request error:', `${JSON.stringify(error)}`);
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };


  return (
       <SafeAreaView style={{flex: 1}}>
    <Back title={"Complimentary Stay"}/>
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={[styles.iphone13Mini9]}>
        
      <Text
        style={{
          color: '#252B5C',
          fontSize: 28,
          fontFamily: 'OpenSans-Bold',
          paddingTop: 35,
          paddingBottom:10,
          paddingHorizontal:20
        }}>
        Enjoy ! Your Complimentary Stay
      </Text>

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <Text
          style={[
            styles.label,
            {
              fontSize: 15,
              /// marginTop: 20
            },
          ]}>
          {' '}
          Your Name
        </Text>
        <TextInput
          style={{
            width: '60%',
            // paddingLeft: 10,
            color: '#1E2135',
            borderWidth: 1,
            borderColor: '#B9C4CA',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
          placeholder=""
          value={Name}
          onChangeText={txt => {
            setName(txt);
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <Text
          style={[
            styles.label,
            {
              fontSize: 15,
              /// marginTop: 20
            },
          ]}>
          {' '}
          Email
        </Text>
        <TextInput
          style={{
            width: '60%',
            // paddingLeft: 10,
            color: '#1E2135',
            borderWidth: 1,
            borderColor: '#B9C4CA',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
          placeholder=""
          value={Email}
          onChangeText={txt => {
            setEmail(txt);
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <Text
          style={[
            styles.label,
            {
              fontSize: 15,
              /// marginTop: 20
            },
          ]}>
          {' '}
          Property Name
        </Text>
        <TextInput
          style={{
            width: '60%',
            // paddingLeft: 10,
            color: '#1E2135',
            borderWidth: 1,
            borderColor: '#B9C4CA',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
          placeholder=""
          value={PropertyName}
          onChangeText={txt => {
            setPropertyName(txt);
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <Text
          style={[
            styles.label,
            {
              fontSize: 15,
              /// marginTop: 20
            },
          ]}>
          {' '}
          No. of Guest
        </Text>
        <TextInput
          style={{
            width: '60%',
            // paddingLeft: 10,
            color: '#1E2135',
            borderWidth: 1,
            borderColor: '#B9C4CA',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
          placeholder=""
          value={Guest}
          onChangeText={txt => {
            setGuest(txt);
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <Text
          style={[
            styles.label,
            {
              fontSize: 15,
              /// marginTop: 20
            },
          ]}>
          {' '}
          Check-in Date
        </Text>
        <TouchableOpacity
         onPress={() => {
          setOpen(!open);
          // navigation.navigate('Location');
        }}
          style={{
            width: '60%',
            // paddingLeft: 10,
            color: '#1E2135',
            borderWidth: 1,
            borderColor: '#B9C4CA',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}>
             <Text>{CheckIn}</Text>
            </TouchableOpacity>
        
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <Text
          style={[
            styles.label,
            {
              fontSize: 15,
              /// marginTop: 20
            },
          ]}>
          {' '}
          Check-out Date
        </Text>
        <TouchableOpacity
         onPress={() => {
          setOpen1(true);
          // navigation.navigate('Location');
        }}
          style={{
            width: '60%',
            // paddingLeft: 10,
            color: '#1E2135',
            borderWidth: 1,
            borderColor: '#B9C4CA',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}>
            <Text>{CheckOut}</Text>
            </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          handleBooking();
          // navigation.navigate('Location');
        }}
        style={{
          alignItems: 'center',
          // backgroundColor: '#0B0B45',
          backgroundColor: '#043862',
          borderRadius: 12,
          padding: 20,
          marginTop: 10,
          marginBottom: 30,
          marginHorizontal: 20,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontFamily: 'OpenSans-SemiBold',
          }}>
          Submit
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={open}
        date={date}
       //textColor='green'
        title={'Unlock Your Visit Date : Request for Complimentary Stay!'}
        onConfirm={(date) => {
          console.log('dtafsghysy',date);
          setCheckIn(new Date(date).toLocaleString());
          setOpen(false)
          //setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
       <DatePicker
        modal
        open={open1}
        date={date}
       //textColor='green'
        title={'Unlock Your Visit Date : Request for Complimentary Stay!'}
        onConfirm={(date) => {
          console.log('dtafsghysy',date);
          setCheckOut(new Date(date).toLocaleString());
          setOpen(false)
          //setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  iphone13Mini9: {
    backgroundColor: '#f5f7fe',
    //flex: 1,
    overflow: 'hidden',
    width: '100%',
  },
  labelContainer: {
    position: 'absolute',
    left: 16,
    top: -6,
    paddingHorizontal: 8,
    backgroundColor: '#f5f7fe',
  },
  label: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#000000',

    // color: 'black'
  },
  input: {
    // marginTop:20,
    padding: 10,
    borderColor: '#B9C4CA',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },

  maskGroupIconLayout: {
    width: 110,
    height: 110,
  },
});
