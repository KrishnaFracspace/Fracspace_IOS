import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { AreaChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { G, Text as SvgText } from 'react-native-svg';
import Icon from 'react-native-vector-icons/AntDesign';
import Ico from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-element-dropdown';
import { AppContext } from './Context/AppContext';
import { GetAllCustomer } from './Services/UserApi';
import Footer from './Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuarterlyBarChart from './components/QuarterlyBarChart ';
import { profileDetails } from './redux/reducer/profileReducer';

export default function Owned() {
  const { globalState, setGlobalState } = useContext(AppContext);
  const [value, setValue] = useState(null);
  const { width, height } = Dimensions.get('window');
  // const [OwnedData, setOwnedData] = useState(globalState?.userDetails?.ownedProperties || []);
  const [OwnedData, setOwnedData] = useState(
    globalState?.userDetails?.ownedProperties?.filter(
      item => item?.status === 'active'
    ) || []
  );
  const navigation = useNavigation();
  const investedAmount = 1500000;
  const data = globalState?.userDetails?.addProfit?.map(change => investedAmount + change);
  const investmentEvents = [
    { index: 1, type: 'initial', amount: 10000 },
    { index: 3, type: 'deposit', amount: 5000 },
    { index: 4, type: 'withdrawal', amount: 5000 },
  ];

  const profile = globalState?.userDetails;
 
  const Labels = ({ x, y, data }) => (
    <G>
      {data?.map((value, index) => {
        if (index === 0 || index === data.length - 1) return null;
        const xVal = x(index);
        const yVal = y(value);
        const color = value >= investedAmount ? 'blue' : 'red';
        const diff = value - investedAmount;

        return (
          <SvgText
            key={index}
            x={xVal}
            y={yVal - 10}
            fontSize={12}
            fontFamily="Poppins-SemiBold"
            fill={color}
            textAnchor="middle">
            {`${diff >= 0 ? '+' : ''}₹${Math.abs(diff).toLocaleString()}`}
          </SvgText>
        );
      })}

      {globalState?.userDetails?.investmentEvents.map((event, i) => {
        const xVal = x(event.index);
        const yVal = y(data[event.index]);
        const isDeposit = event.type === 'initial' || event.type === 'deposit';
        const color = isDeposit ? 'green' : 'red';
        const label = `(${event.amount.toLocaleString()})`;

        return (
          <SvgText
            key={`inv-${i}`}
            x={xVal}
            y={yVal + 8}
            fontSize={12}
            fontFamily="Poppins-Medium"
            fill={color}
            textAnchor="middle">
            {isDeposit
              ? `(+${event.amount.toLocaleString()})`
              : `(-${event.amount.toLocaleString()})`}
          </SvgText>
        );
      })}
      {globalState?.userDetails?.QPaymentInfo.map((month, index) => {
        const xVal = x(index + 1);
        const yVal = y(Math.min(...data)) + 35; // below lowest point
        return (
          <SvgText
            key={`month - ${index}`}
            x={xVal}
            y={yVal}
            fontSize={11}
            fontFamily="Poppins-Medium"
            fill="#000000"
            textAnchor="middle">
            {month?.label}
          </SvgText>
        );
      })}
    </G>
  );
// console.log("====", profile?.verification,"====dd")
  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:profile?.verification ? '#F6F6F6':"#C7E5FD"}}>
      {profile?.verification ?

        <View style={{ flex: 1 }}>
          {OwnedData.length != 0 ?
            (
              <ScrollView
              showsVerticalScrollIndicator={false}
                style={{ flex: 1, backgroundColor: '#F6F6F6', padding: 20 ,marginBottom:52}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 20,
                      color: '#021265',
                      textAlign: "center",
                      marginLeft: 65,
                    }}>
                    Investment Portfolio{' '}
                  </Text>
                </View>
                <>
                  <View
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 16,
                      padding: 20,
                      marginVertical: 30,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                          style={{
                            backgroundColor: '#F6F6F6',
                            borderRadius: 10,
                            padding: 10,
                          }}>
                          <Ico name={'dollar'} size={20} color={'#081F62'} />
                        </View>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Bold',
                            fontSize: 13,
                            color: '#000000',
                            marginLeft: 10,
                          }}>
                          P/L Summary
                        </Text>
                      </View>

                    </View>

                    {profile?.QPaymentInfo.length != 0 && profile?.addProfit.length != 0 ?
                      <View style={{ width: '100%', height: 320, marginTop: 20 }}>

                        <QuarterlyBarChart
                          data={profile?.QPaymentInfo}
                        />
                      </View>
                      :
                      <View style={{ alignItems: 'center', marginVertical: 15 }}>
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/NoPayouts.png' }} style={{ width: width * 0.6, height: height * 0.2 }} />
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000', textAlign: 'center', marginTop: 10 }}>Your payout is scheduled and will be released soon</Text>
                      </View>
                    }

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 10,
                        marginTop: 10,
                      }}>
                      <View>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 15,
                            color: '#000000B3',
                          }}>
                          Capital Invested
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'WorkSans-SemiBold',
                            fontSize: 15,
                            color: '#000000',
                          }}>
                          {globalState?.userDetails?.investedAmount}
                        </Text>
                      </View>
                     
                      {profile?.currentAmount != "" ?
                        <View>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#000000B3' }}>Earnings Received</Text>
                          <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>{profile?.currentAmount}</Text>
                        </View>
                        :
                        <View>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#000000B3' }}>Earnings Received</Text>
                          <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>Released Soon</Text>
                        </View>
                      }
                    </View>
                  </View>

                  <View style={{ paddingBottom: 20 }}>
                    {OwnedData.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          //console.log(item?.propertyDetails?.location);
                          if(item?.exitStatus == 'requested' || item?.exitStatus == 'inProgress'){
                            
                          }else{
                            navigation.navigate('Dashboard', {
                              ownedProDetails: item,

                            });
                          }
                          // navigation.navigate('PropertyDetails');
                        }}
                        style={{
                          backgroundColor: '#FFFFFF',
                          padding: 12,
                          borderRadius: 10,
                          flexDirection: 'row',
                          marginBottom: 20,
                          width: '100%',
                          flex: 1,
                        }}>
                        <View>
                          <Image
                            resizeMode="cover"
                            source={{ uri: item?.propertyDetails?.image?.Image1 }}
                            style={{
                              width: width * 0.32,
                              height: 150,
                              borderRadius: 8,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            width: '60%',
                            justifyContent: 'space-between',
                            marginLeft: 10,
                          }}>
                          <View style={{ gap: 5, width: '100%' }}>
                            <Text
                              style={{
                                fontFamily: 'Montserrat-Bold',
                                fontSize: 15,
                                color: '#5C5CB1',
                                flexShrink: 1,
                              }}>
                              {item?.propertyDetails?.name}
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-Regular',
                                fontSize: 13,
                                color: '#7E7A7A',
                              }}>
                              {item?.propertyDetails?.location}
                            </Text>
                          </View>
                          <View
                            style={{
                              borderColor: '#EFE8E8',
                              borderWidth: 0.7,
                            }}></View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-Medium',
                                fontSize: 14,
                                color: '#000000',
                              }}>
                              Collective cost{' '}
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-Medium',
                                fontSize: 13,
                                color: '#000088',
                                textAlign: 'right',
                              }}>
                              ₹{item?.propertyDetails?.Price}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-Medium',
                                fontSize: 14,
                                color: '#000000',
                              }}>
                              Investment
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-Medium',
                                fontSize: 13,
                                color: '#000088',
                                textAlign: 'right',
                              }}>
                              ₹{item?.totalInvestment}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-Regular',
                                fontSize: 13,
                                color: '#000000',
                              }}>
                              {item?.numberOfOwners} Fracs
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                              <Image
                                source={require('./assets/NewProfileimage.jpg')}
                                style={{ width: 30, height: 30, borderRadius: 30 }}
                              />
                              <Image
                                source={require('./assets/NewProfileimage.jpg')}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 30,
                                  marginLeft: -15,
                                }}
                              />
                              <Image
                                source={require('./assets/NewProfileimage.jpg')}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 30,
                                  marginLeft: -15,
                                }}
                              />
                            </View>
                          </View>
                        </View>
                        {(item?.exitStatus == 'requested' || item?.exitStatus == 'inProgress') &&
                          <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'#000000b0',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:16,color:'#FFF'}}>
                              {item?.exitStatus == 'requested' ? 'Exit request is in process' : 'Transfer request is in process'}
                            </Text>
                          </View>
                        }
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              </ScrollView>
            ) : (
              <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <LinearGradient colors={['#c7e5fd', '#FFF']} style={{ width: width, height: height * 0.3, padding: 20, alignItems: 'center' }}></LinearGradient>
                <View style={{ position: 'absolute', top: height * 0.25, backfaceVisibility: 'visible', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', }}>
                  <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
                    <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/PortfolioEmpty.png' }} style={{ width: width * 0.5, height: height * 0.21 }} />
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#0F1130', textAlign: 'center', marginTop: 10 }}>Your property portfolio is empty.</Text>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#00000070', textAlign: 'center', marginVertical: 15 }}>
                      Start exploring exclusive properties and grow your real estate assets with shared ownership
                    </Text>
                    <TouchableOpacity onPress={() => {
                      //  GgoToYosemite(PropertiesArray?.Location);
                      navigation.navigate('Home', { details: globalState?.ProDetails });
                      // navigation.navigate('PropertyListing');
                    }} style={{ backgroundColor: '#021265', borderRadius: 30, paddingHorizontal: 50, marginTop: 15, paddingVertical: 10, borderColor: '#C0D5F3', borderWidth: 1 }}>
                      <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Explore </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          }
        </View>
        :
    <View style={{ flex: 1 }}>
  
  {/* Background Gradient */}
  <LinearGradient
    colors={['#C7E5FD', '#FFF','#FFF']}
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 }}>
    <View style={{ alignItems: 'center' }}>
      {/* Image */}
      <Image
        source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/PortfolioEmpty.png' }}
        style={{
          width: width * 0.5,
          height: height * 0.22,
          resizeMode: 'contain',
        }}
      />

      {/* Title */}
      <Text
        style={{
          fontFamily: 'WorkSans-SemiBold',
          fontSize: 20,
          color: '#0F1130',
          textAlign: 'center',
          marginTop: 20,
        }}
      >
        Your property portfolio is empty
      </Text>

      {/* Description */}
      <Text
        style={{
          fontFamily: 'Montserrat-SemiBold',
          fontSize: 13,
          color: '#00000070',
          textAlign: 'center',
          marginTop: 10,
          lineHeight: 18,
        }}
      >
        Start exploring exclusive properties and grow your real estate
        assets with shared ownership.
      </Text>

      {/* Button */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Home', { details: globalState?.ProDetails })
        }
        style={{
          backgroundColor: '#021265',
          borderRadius: 30,
          paddingHorizontal: 50,
          paddingVertical: 12,
          marginTop: 25,
        }}
      >
        <Text
          style={{
            fontFamily: 'WorkSans-SemiBold',
            fontSize: 16,
            color: '#FFFFFF',
          }}
        >
          Explore
        </Text>
      </TouchableOpacity>

    </View>

  </LinearGradient>

</View>
      }
    </SafeAreaView>
  );
}
