import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, Dimensions, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import Ico from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SelectRoom(props) {
      // console.log("Selected: ",props?.route?.params?.detail)
      const [RoomDetails,setRoomDetails] = useState(props?.route?.params?.detail);
      const [image,setImage] = useState(props?.route?.params?.detail?.images);
      const navigation = useNavigation();
      const { width, height } = Dimensions.get('window');
  return (
      <SafeAreaView style={{flex:1}}>
    <ScrollView>
        <View style={{backgroundColor:'#0D2038',paddingVertical:20,paddingHorizontal:20,flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity onPress={() => {
                // if(props?.route?.params?.nav=='DSHome'){
                    navigation.navigate('DreamscapeHome');
                // }
                //navigation.goBack();


            }}>
                <Icon name={'left'} size={20} color={'#FFFFFF'}/>
            </TouchableOpacity>
            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:18,color:'#FFFFFF'}}>{RoomDetails?.name}</Text>
            {/* <Icon name={'phone'} size={20} color={'#FFFFFF'} style={{transform: [{ rotate: '90deg' }]}}/> */}
            <View></View>
        </View>

        <View style={{margin:20}}>
            { RoomDetails?.roomsAndCorrespondingPrice.map((item, index) => (
                <TouchableOpacity onPress={() => {
                    navigation.navigate('RoomDescription',{detail:RoomDetails,name:item,});
                }} key={ index } style={{backgroundColor:'#FFFFFF',borderRadius:25,marginHorizontal:20,marginVertical:15,elevation:5,alignSelf:'center',width:width*0.9,overflow:'hidden'}}>
                    <View>
                        {/* <FlatList
                            ref={flatListRef}
                            data={image}
                            horizontal
                            pagingEnabled
                            nestedScrollEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            keyExtractor={(id, index) => index.toString()}
                            style={{width:'100%',height:height * 0.2}}
                            renderItem={({ item }) => (
                                <Image source={{uri : item}} style={{width:width*0.9,height:height*0.22,}} />
                            )}
                        /> */}
                        {/* <Swiper
                            style={{ height: height * 0.22 }}
                            showsPagination={true}
                            loop={true}
                            dotStyle={{ backgroundColor: '#0E213861', width: 8, height: 8, borderRadius: 4 }}
                            activeDotStyle={{ backgroundColor: '#0E2138', width: 8, height: 8, borderRadius: 4 }}
                            autoplay={true}
                        >
                            {image.map((img, imgIndex) => (
                                <Image key={imgIndex} source={{ uri: img }} style={{ width: width * 0.9, height: height * 0.22 }} />
                            ))}
                        </Swiper> */}
                        <Swiper
                            style={{ height: height * 0.22 }}
                            showsPagination={true}
                            loop={true}
                            paginationStyle={{
                                bottom: 10,
                              }}
                            dotStyle={{ backgroundColor: '#0E213861', width: 8, height: 8, borderRadius: 4 }}
                            activeDotStyle={{ backgroundColor: '#0E2138', width: 8, height: 8, borderRadius: 4 }}
                            autoplay={true}
                        >
                            {RoomDetails?.name === "DREAMSCAPE" ?
                            item?.roomImages.map((img, imgIndex) => (
                                <Image key={imgIndex} source={{ uri: img }} style={{ width: width * 0.9, height: height * 0.22 }} />
                            )) :
                            RoomDetails?.images.map((img, imgIndex) => (
                                <Image key={imgIndex} source={{ uri: img }} style={{ width: width * 0.9, height: height * 0.22 }} />
                            ))}
                        </Swiper>









                        <View style={{position: "absolute",top: 15,left: 15,}}>
                            <LinearGradient colors={['#0000006B','#9999996B']} style={{padding:8,borderRadius:25,paddingHorizontal:10,borderColor:'#FFFFFF',borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontFamily:'Montserrat-Bold',fontSize:12,color:'#FFFFFF'}}>{RoomDetails?.offers}</Text>
                            </LinearGradient>
                        </View>

                        <TouchableOpacity onPress={() => {
                                if (RoomDetails?.name == 'DREAMSCAPE') {
                                    navigation.navigate('VideoTour', { vlink: `https://duixj37yn5405.cloudfront.net/videos/dreamscapes-video1.mp4`, location: 'DREAMSCAPE' });
                                } else if (RoomDetails?.name == 'Fracspace Abode') {
                                    navigation.navigate('VideoTour', { vlink: `https://duixj37yn5405.cloudfront.net/videos/abode-video1.mp4`, location: 'Fracspace Abode' });

                                } else if (RoomDetails?.name == 'Eleven Views') {
                                    navigation.navigate('VideoTour', { vlink: `https://duixj37yn5405.cloudfront.net/videos/IMG_4124.MP4`, location: 'Eleven Views' });

                                } else if (RoomDetails?.name == 'Hilltop By Fracspace') {

                                    navigation.navigate('VideoTour', { vlink: `https://duixj37yn5405.cloudfront.net/videos/MunnarVideo.mp4`, location: 'Hilltop By Fracspace' });

                                }





                                //navigation.navigate('RoomDescription',{detail:RoomDetails,name:item});
                            }} style={{ position: "absolute", bottom: 10, right: 15 }}>
                                <View style={{ backgroundColor: 'rgba(153, 153, 153, 0.42)', width: 35, height: 30, borderRadius: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFFFFF33' }}>
                                    <Image resizeMode='contain' source={{uri:'https://duixj37yn5405.cloudfront.net/appImages/videoo.png'}} style={{ width: 20, height: 20 }} />
                                </View>
                            </TouchableOpacity>
                    </View>
                    <View style={{padding:10,flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{flex:1}}>
                            <View style={{}}>
                                <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:17,color:'#000000'}}>{item?.type}</Text>
                                {/* <Text style={{fontFamily:'Montserrat-Medium',fontSize:13,color:'#0E2037'}}>{( Deluxe Room )}</Text> */}
                            </View>
                            <View style={{borderTopWidth:1,borderColor:'#F0EFFB',marginVertical:5}}></View>
                            {/* <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Ico name={'check'} size={15} color={'#262D3D'}/>
                                <Text style={{fontFamily:'Montserrat-Bold',fontSize:12,color:'#262D3D',marginLeft:5}}>Room with Breakfast, Lunch & Dinner</Text>
                            </View> */}
                            <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                                <Ico name={'check'} size={15} color={'#262D3D'}/>
                                <Text style={{fontFamily:'Montserrat-Bold',fontSize:12,color:'#262D3D',marginLeft:5}}>{`${item?.amenities[0]}, ${item?.amenities[1]}`}</Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('RoomDescription',{detail:RoomDetails,name:item});
                            }} style={{padding:5,marginLeft:15}}>
                                <Text style={{fontFamily:'Montserrat-Bold',fontSize:12,color:'#405DF5',textDecorationLine:'underline'}}>View More Details</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{alignItems:'flex-end',}}>
                            <Text style={{fontFamily:'Montserrat-Bold',fontSize:17,color:'#0D2038'}}>{`₹ ${item?.price} /-`}</Text>
                            <Text style={{fontFamily:'Montserrat-Medium',fontSize:9,color:'#0E2037'}}>+ taxes & fees </Text>
                            <Text style={{fontFamily:'Montserrat-Medium',fontSize:10,color:'#0E2037',}}>Per Night</Text>

                            <TouchableOpacity onPress={() => {
                                navigation.navigate('EnquirtyFS', { Hotel_id: RoomDetails?._id });
                            }} style={{borderWidth:1,borderColor:'#0424CB33',backgroundColor:'#405DF51C',borderRadius:5,paddingVertical:8,paddingHorizontal:10,marginTop:12}}>
                                <Text style={{fontFamily:'Montserrat-Bold',fontSize:12,color:'#405DF5'}}>Select Room</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>))
            }
        </View>
    </ScrollView>
    </SafeAreaView>
  )
}