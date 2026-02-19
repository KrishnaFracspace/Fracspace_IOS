import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Feather';
import IconCheck from 'react-native-vector-icons/Ionicons';
import Back from './Back';
import {GetBookingCancleedCoOwned} from './Services/UserApi';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function BookingHistory(props) {
  const [Status, setStatus] = useState([]);
  const [Bookingdata, setBookingdata] = useState(
    props?.route?.params?.booking || [],
  );
  const handleBookingCancel = async (bookingId, propertyId) => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      bookingReference: bookingId,
      propertyId: propertyId,
    });
    try {
      let {data: res} = await GetBookingCancleedCoOwned(payload);
      // console.log(res);

      if (res?.success) {
        Alert.alert('Cancellation Request:', `${res?.message}`);
      }
    } catch (error) {
      if (error.response) {
        // console.log(error?.response?.data?.message);
        //Alert.alert('Response error:', `${error?.response?.data?.message}`);
      } else if (error.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', ${JSON.stringify(error)});
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Back title={'Purchase History'} />
        <ScrollView style={{backgroundColor: '#FAFAFF', padding: 10}}>
          {Bookingdata.map((item, index) => (
            <View style={{width: '100%', flex: 1}} key={index}>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  padding: 10,
                  margin: 10,
                }}>
                <Text
                  style={{
                    color: '#000000',
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 16,
                  }}>
                  {item?.propertyName}
                </Text>
                <View
                  style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <View style={{marginTop: 10}}>
                    <View style={{paddingBottom: 0, marginRight: 8}}>
                      {item?.bookingStatus == 'Success' ? (
                        <IconCheck
                          name="checkmark-circle"
                          size={25}
                          color="#0E9625"
                        />
                      ) : (
                        <IconCheck
                          name="close-circle"
                          size={25}
                          color="#B60505"
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        paddingLeft: 30,
                        borderStyle: 'dashed',
                        borderColor: '#000000',
                        borderBottomWidth: 2,
                        marginTop: 10,
                        transform: [{rotate: '90deg'}],
                      }}>
                      {'   '}
                    </Text>
                    <View style={{paddingTop: 5}}>
                      {item?.stage == 'full Payment' ? (
                        <IconCheck
                          name="checkmark-circle"
                          size={25}
                          color="#0E9625"
                        />
                      ) : (
                        <IconCheck
                          name="ellipse-outline"
                          size={25}
                          color="#919398"
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        borderStyle: 'dashed',
                        borderColor: '#000000',
                        borderBottomWidth: 2,
                        marginTop: 10,
                        transform: [{rotate: '90deg'}],
                      }}>
                      {''}
                    </Text>
                    <View style={{paddingTop: 5}}>
                      <IconCheck
                        name="ellipse-outline"
                        size={25}
                        color="#919398"
                      />
                      {/* <IconCheck name="checkmark-circle" size={25} color="#0E9625" /> */}
                    </View>
                  </View>
                  <View style={{marginLeft: -10, flex: 1}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        borderBottomWidth: 1,
                        borderColor: '#F6F6F6',
                        paddingVertical: 10,
                        width: '100%',
                        flex: 1,
                      }}>
                      <View style={{}}>
                        <Text
                          style={{
                            color: '#000000',
                            fontFamily: 'WorkSans-Medium',
                            fontSize: 14,
                          }}>
                          Booking Amount Paid
                        </Text>
                        {item?.bookingStatus == 'Success' ? (
                          <Text
                            style={{
                              color: '#000000',
                              fontFamily: 'WorkSans-Regular',
                              fontSize: 12,
                            }}>
                            Paid on {item?.bookingDate}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              color: '#B60505',
                              fontFamily: 'WorkSans-Regular',
                              fontSize: 12,
                            }}>
                            Status : Failed
                          </Text>
                        )}
                      </View>
                      <Text
                        style={{
                          color: '#000000',
                          fontFamily: 'WorkSans-Medium',
                          fontSize: 14,
                          textAlign: 'right',
                        }}>
                        ₹{item?.totalBookingAmount}/-
                      </Text>
                    </View>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#F6F6F6',
                        paddingVertical: 10,
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          fontFamily: 'WorkSans-Medium',
                          fontSize: 14,
                        }}>
                        Frac Full Payment
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          fontFamily: 'WorkSans-Regular',
                          fontSize: 12,
                        }}>
                        Status:
                        {item?.stage == 'full Payment'
                          ? ' Paid'
                          : ' Yet to pay'}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#F6F6F6',
                        paddingVertical: 10,
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          fontFamily: 'WorkSans-Medium',
                          fontSize: 14,
                        }}>
                        Frac Allotment
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          fontFamily: 'WorkSans-Regular',
                          fontSize: 12,
                        }}>
                        Status: Yet to allocate
                      </Text>
                    </View>
                  </View>
                </View>
                {item?.bookingStatus == 'Success' && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                      }}>
                      <TouchableOpacity
                        disabled={
                          item?.freeCancellationDuration != 0 ? false : true
                        }
                        onPress={() => {
                          handleBookingCancel(
                            item?.bookingReference,
                            item?.propertyId,
                          );
                        }}
                        style={{
                          borderRadius: 10,
                          backgroundColor:
                            item?.freeCancellationDuration != 0
                              ? '#B605051A'
                              : '#AEAEAE',
                          paddingVertical: 10,
                          paddingHorizontal: 30,
                          borderColor:
                            item?.freeCancellationDuration != 0
                              ? '#B60505'
                              : '#E2E2E2',
                          borderWidth: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color:
                              item?.freeCancellationDuration != 0
                                ? '#B60505'
                                : '#E2E2E2',
                            fontFamily: 'Poppins-Medium',
                            fontSize: 12,
                          }}>
                          Cancel Booking
                        </Text>
                      </TouchableOpacity>
                      <View></View>
                    </View>

                    <Text
                      style={{
                        color: '#000000',
                        fontFamily: 'WorkSans-Regular',
                        fontSize: 12,
                      }}>
                      Note: 7-day free cancellation. Platform fee is
                      non-refundable.
                    </Text>
                  </>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
