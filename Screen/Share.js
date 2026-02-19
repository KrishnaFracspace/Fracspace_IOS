import { View, Text , TouchableOpacity,  StyleSheet,} from 'react-native';
import React from 'react';
import IconChat from 'react-native-vector-icons/FontAwesome';

export default function Share() {
  return (
    <View
    style={{
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      backgroundColor: 'transparent',
      position: 'absolute',
      bottom: 60,
      left: 0,
      right: 0,
    
    }}>
    <View style={{}}>
      <TouchableOpacity
        style={{
          paddingBottom: 10,
          alignItems: 'flex-end',
          padding: 0,
          margin: 10,
          borderRadius: 10,
          alignItems:'center',justifyContent:'center'
        }}
        onPress={() => {
          //  const name = item?.name;
          //navigation.navigate('Chat');
        }}>
           <View style={{backgroundColor:'white',padding:18,position:'absolute'}}></View>
        {/* <Image source={require('./assets/Vector.png')}  /> */}
      
        {/* <IconChat name="chatbox" size={70} color="#043862" /> */}
        <IconChat name="share-alt-square" size={70} color='#043862' />
      </TouchableOpacity>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
    mdilocationParent: {
      flexDirection: 'row',
    },
    frameParent: {
      width: '100%',
  
      //position: "absolute",
      backgroundColor: '#043862',
    },
    mdilocationIcon: {
      height: 24,
      width: 24,
      overflow: 'hidden',
    },
    loremIpsumDolor: {
      lineHeight: 21,
      fontFamily: 'Poppins-Regular',
      width: 278,
      marginLeft: 24,
      color: '#fff',
      fontSize: 14,
    },
    parentSpaceBlock: {
      marginTop: 9,
      flexDirection: 'row',
    },
    submitClr: {
      color: '#fff',
      textAlign: 'left',
    },
    text: {
      marginLeft: 24,
    },
    mdiemailParent: {
      alignItems: 'center',
    },
    fracspaceltdgmailcom: {
      marginLeft: 20,
    },
    textTypo: {
      fontFamily: 'Poppins-Regular',
      color: '#fff',
      fontSize: 16,
      lineHeight: 20,
      textAlign: 'left',
    },
    iphone13Mini9: {
      backgroundColor: '#f5f7fe',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      // flex: 1,
      //overflow: 'hidden',
      // width: '100%',
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
      fontWeight: 600,
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
  























// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, Platform, TouchableOpacity, Image, Dimensions, ScrollView, Modal, } from 'react-native';
// import Icon from 'react-native-vector-icons/AntDesign';
// import Ico from 'react-native-vector-icons/FontAwesome';
// import { useNavigation } from '@react-navigation/native';
// // import { AppContext } from './Context/AppContext';
// import Svg, { Text as SvgText } from 'react-native-svg';
// import { LineChart } from 'react-native-chart-kit';
// // import Footer from './Footer';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import { ProfileDetails } from './PortfolioApi';
// import { AppContext } from './Context/AppContext';
// export default function Dashboard() {
// //   const { globalState, setGlobalState } = useContext(AppContext);
// //   const [profile, setProfile] = useState({});
//   const [value, setValue] = useState(null);
//   const { width, height } = Dimensions.get('window');
//   const {globalState} = useContext(AppContext);

//   const profile = globalState?.userDetails;
//   // console.log("Profile: ",profile?.verification);

//   // useEffect(() => {
//   //   // handleProfle();
//   // }, []);

//   // const [OwnedData, setOwnedData] = useState(profile?.ownedProperties || [])
//   // const navigation = useNavigation();

//   // const investedAmount = 1500000;
//   // const addProf = profile?.addProfit;
//   // const extendedData = [0, ...addProf, 0];
//   // const data = extendedData.map(change => investedAmount + change);

//   // const startingBooking = 0;
//   //   const numbersOfBooking = [10, 5, 7, 2, 5, 3, 10];
//   //   const extendedBooking = [0, ...numbersOfBooking, 0]; // Include padding
//   //   // const data = extendedBooking.map(change => investedAmount + change);
//   //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Apr'];

//   //   const paddedLabels = ['', ...months, ''];

//   // const monthLabels = profile?.QPaymentInfo.map(item => item.label);
//   // const extendedMonths = monthLabels.length == 0 ? [] : ['', ...monthLabels, ''];
//   // const screenWidth = Math.max(data.length * 100, Dimensions.get('window').width);

//   //   const { globalState, setGlobalState } = useContext(AppContext);
//   // const [value, setValue] = useState(null);
//   // const { width } = Dimensions.get('window');

//   const [OwnedData, setOwnedData] = useState(profile?.ownedProperties || [])
//   const navigation = useNavigation();
//   // console.log("Owned: ",profile?.ownedProperties);

//   const investedAmount = 1500000;
//   const data = profile?.addProfit.map(change => investedAmount + change);


//   const monthLabels = profile?.QPaymentInfo.map(item => item.label);
//   const extendedMonths = monthLabels.length == 0 ? [] : ['', ...monthLabels, ''];
//   const screenWidth = Math.max(data.length * 100, Dimensions.get('window').width);



//   return (
//     <SafeAreaView style={{ flex: 1 ,backgroundColor:'#021265'}}>
//       <View style={{ flex: 1, width: '100%',backgroundColor:'#FFF' }}>
//         {profile?.verification ? 

//         <View style={{flex:1}}>
//             {OwnedData.length != 0 ?
//                 <ScrollView style={{ flex: 1, width: '100%', padding: 20, backgroundColor: '#F6F6F6' }}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center',alignSelf:'center' }}>
//                         {/* <TouchableOpacity onPress={() => {
                    
//                         //   navigation.navigate('Home',{details:globalState?.ProDetails}); 
//                         }} style={{ borderColor: '#BFBFC0', borderWidth: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 17, borderRadius: 15 }}>
//                         <Icon name={'left'} size={20} color={'#000088'} />
//                         </TouchableOpacity> */}
//                         <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 24, color: '#021265', }}>Investment Portfolio</Text>
//                     </View>
//                     <View style={{ flex: 1, width: '100%' }}>
//                         <View style={{  backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginVertical: 30,elevation:1 }}>

//                             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                     <View style={{ backgroundColor: '#F6F6F6', borderRadius: 10, padding: 10, }}>
//                                     <Ico name={'dollar'} size={20} color={'#081F62'} />
//                                     </View>
//                                     <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 13, color: '#000000', marginLeft: 10 }}>P/L Summary</Text>
//                                 </View>
//                             </View>

//                             {profile.QPaymentInfo.length != 0 && profile.addProfit.length != 0 ?
//                                 <View style={{ height: 320, width: '100%', }}>
//                                     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
//                                         <View style={{ backgroundColor: '#FFFFFF' }}>
//                                         {/* {extendedMonths.length > 2 &&  */}
//                                         <LineChart
//                                             data={{
//                                             labels: extendedMonths,
//                                             //   labels: paddedLabels,
//                                             datasets: [{ data }]
//                                             }}
//                                             width={screenWidth}
//                                             height={280}
//                                             withDots={true}
//                                             withInnerLines={true}
//                                             withOuterLines={true}
//                                             withShadow={true}
//                                             withVerticalLabels={true}
//                                             withHorizontalLabels={false}
//                                             bezier
//                                             style={{ marginLeft: -40, paddingTop: 30, width: '100%' }}
//                                             chartConfig={{
//                                             backgroundGradientFrom: '#ffffff',
//                                             backgroundGradientTo: '#ffffff',
//                                             decimalPlaces: 0,
//                                             color: () => '#4169E1',
//                                             labelColor: () => '#000',
//                                             fillShadowGradient: '#4A90E2',
//                                             fillShadowGradientOpacity: 0.25,
//                                             strokeWidth: 2,
//                                             propsForBackgroundLines: {
//                                                 stroke: 'transparent',

//                                             },
//                                             }}
//                                             decorator={() => (
//                                             <Svg>
//                                                 {
//                                                 data.map((value, index) => {
//                                                     if (index === 0 || index === data.length - 1) return null;
//                                                     const diff = value - investedAmount;
//                                                     const color = diff >= 0 ? '#000088' : '#000';
//                                                     const x = (index) * (screenWidth / data.length) + 30;
//                                                     const y = 280 - ((value - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 200;

//                                                     return (
//                                                     <SvgText
//                                                         key={`pl-${index}`}
//                                                         x={x - 20}
//                                                         y={y - 58}
//                                                         fontSize="12"
//                                                         fontFamily="Poppins-SemiBold"
//                                                         fill={color}
//                                                         textAnchor="start"
//                                                     >
//                                                         {`${diff >= 0 ? '+' : ''}₹${Math.abs(diff).toLocaleString()}`}
//                                                     </SvgText>
//                                                     );
//                                                 })
//                                                 }

//                                                 {profile?.investmentEvents.map((event, i) => {
//                                                 const x = (event.index) * (screenWidth / data.length) + 30;
//                                                 const y = 280 - ((data[event.index] - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 200;
//                                                 const color = (event.type === 'initial' || event.type === 'deposit') ? 'green' : 'red';
//                                                 const symbol = (event.type === 'initial' || event.type === 'deposit') ? '+' : '-';

//                                                 return (
//                                                     <SvgText
//                                                     key={`event-${i}`}
//                                                     x={x - 24}
//                                                     y={y - 72}
//                                                     fontSize="12"
//                                                     fontFamily="Poppins-Bold"
//                                                     fill={color}
//                                                     textAnchor="start"
//                                                     >
//                                                     ({symbol}{event.amount.toLocaleString()})
//                                                     </SvgText>
//                                                 );
//                                                 })
//                                                 }
//                                             </Svg>
//                                             )}
//                                         />
//                                         {/* // } */}
//                                         </View>
//                                     </ScrollView>
//                                 </View>
//                                 :
//                                 <View style={{alignItems:'center',marginVertical:15}}>
//                                   <Image source={{uri: 'https://duixj37yn5405.cloudfront.net/appImages/NoPayouts.png'}} style={{width:width*0.6,height:height*0.2}}/>
//                                   <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#000',textAlign:'center',marginTop:10}}>Your payout is scheduled and will be released soon</Text>
//                                 </View>
                                
//                             }

//                             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10 }}>
//                                 <View>
//                                     <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#000000B3' }}>Capital Invested</Text>
//                                     <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>{profile?.investedAmount}</Text>
//                                 </View>
//                                 {profile?.currentAmount != "" ?
//                                   <View>
//                                       <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#000000B3' }}>Earnings Received</Text>
//                                       <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>{profile?.currentAmount}</Text>
//                                   </View>
//                                   :
//                                   <View>
//                                       <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#000000B3' }}>Earnings Received</Text>
//                                       <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>Released Soon</Text>
//                                   </View>
//                                 }
//                             </View>
//                         </View>

//                         <View style={{ marginBottom: 80 }}>
//                             {OwnedData.map((item, index) => (<TouchableOpacity key={index} onPress={() => {
//                             //console.log(item?.propertyDetails?.location);
//                             // navigation.navigate('PropertyDetails', { details: item });
//                             navigation.navigate('Dashboard', { ownedProDetails: item });
//                             // navigation.navigate('PropertyDetails');
//                             }} style={{ backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, flexDirection: 'row', marginBottom: 20, width: '100%', flex: 1 }}>
//                             <View>
//                                 <Image resizeMode='cover' source={{ uri: item?.propertyDetails?.image?.Image1 }} style={{ width: width * 0.32, height: 150, borderRadius: 8 }} />
//                             </View>
//                             <View style={{ width: '60%', justifyContent: 'space-between', marginLeft: 10 }}>
//                                 <View style={{ gap: 5, width: '100%' }}>
//                                 <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 15, color: '#5C5CB1', flexShrink: 1 }}>{item?.propertyDetails?.name}</Text>
//                                 <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#7E7A7A' }}>{item?.propertyDetails?.location}</Text>
//                                 </View>
//                                 <View style={{ borderColor: '#EFE8E8', borderWidth: 0.7 }}></View>
//                                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                                 <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000' }}>Collective cost </Text>
//                                 <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000088', textAlign: 'right' }}>₹{item?.propertyDetails?.Price}</Text>
//                                 </View>
//                                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                                 <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000' }}>Investment</Text>
//                                 <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000088', textAlign: 'right' }}>₹{item?.totalInvestment}</Text>
//                                 </View>
//                                 <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//                                 <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#000000' }}>{item?.numberOfOwners} Fracs</Text>
//                                 <View style={{ flexDirection: 'row' }}>
//                                     {/* <Image source={require('./assets/NewProfileImage.jpg')} style={{ width: 30, height: 30, borderRadius: 30 }} />
//                                     <Image source={require('./assets/NewProfileImage.jpg')} style={{ width: 30, height: 30, borderRadius: 30, marginLeft: -15 }} />
//                                     <Image source={require('./assets/NewProfileImage.jpg')} style={{ width: 30, height: 30, borderRadius: 30, marginLeft: -15 }} /> */}
//                                 </View>
//                                 </View>
//                             </View>
//                             </TouchableOpacity>))}

//                         </View>
//                     </View> 
//                 </ScrollView>
//                 :
//                 <View style={{flex:1, backgroundColor:'#FFF'}}>
//                     <LinearGradient colors={['#c7e5fd', '#FFF']} style={{width:width,height:height*0.3,padding:20,alignItems:'center'}}></LinearGradient>
//                     <View style={{position:'absolute',top:height*0.25,backfaceVisibility:'visible',alignSelf:'center', alignItems: 'center', justifyContent: 'center', }}>
//                         <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
//                             <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/PortfolioEmpty.png' }} style={{ width: width * 0.5, height: height*0.21}} />
//                             <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#0F1130', textAlign: 'center' ,marginTop:10}}>Your property portfolio is empty.</Text>
//                             <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#00000070', textAlign: 'center', marginVertical: 15 }}>
//                                 Start exploring exclusive properties and grow your real estate assets with shared ownership
//                             </Text>
//                             <TouchableOpacity onPress={() => {
//                                 //  GgoToYosemite(PropertiesArray?.Location);
//                                 navigation.navigate('Home',{details:globalState?.ProDetails});
//                                 // navigation.navigate('PropertyListing');
//                             }} style={{ backgroundColor: '#021265', borderRadius: 30, paddingHorizontal: 50, marginTop: 15, paddingVertical: 10, borderColor: '#C0D5F3', borderWidth: 1 }}>
//                                 <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Explore </Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             }
//         </View>
//         : 
//         <View style={{flex:1,backgroundColor:'#FFF'}}>
//           <LinearGradient colors={['#C7E5FD', '#FFF']} style={{width:width,height:height*0.3,padding:20,alignItems:'center'}}>
//           </LinearGradient>
//           <View style={{position:'absolute',top:height*0.25,backfaceVisibility:'visible',alignSelf:'center', alignItems: 'center', justifyContent: 'center', }}>
//             <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
//               <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/PortfolioEmpty.png' }} style={{ width: width * 0.5, height: height*0.21}} />
//               <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#0F1130', textAlign: 'center' ,marginTop:10}}>Your property portfolio is empty.</Text>
//               <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#00000070', textAlign: 'center', marginVertical: 15 }}>
//                 Start exploring exclusive properties and grow your real estate assets with shared ownership
//               </Text>
//               <TouchableOpacity onPress={() => {
//                 //  GgoToYosemite(PropertiesArray?.Location);
//                 navigation.navigate('Home',{details:globalState?.ProDetails});
//                 // navigation.navigate('Home');
//               }} style={{ backgroundColor: '#021265', borderRadius: 30, paddingHorizontal: 50, marginTop: 15, paddingVertical: 10, borderColor: '#C0D5F3', borderWidth: 1 }}>
//                 <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Explore </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//         }
//         {/* <Footer navigation={navigation} activeFooterTab={'owned'} /> */}
//       </View>

//     </SafeAreaView>






//   );
// };