
let introPlayed = false;

import { View, Text,  Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import Ico from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { GetLabelsProp } from '../Services/UserApi';
import { useDispatch, useSelector } from 'react-redux';
import { labelProperty } from '../redux/reducer/propertyReducer';


export default function LableProperty() {

    const { width, height } = Dimensions.get('window');
    const navigation = useNavigation();
    //const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(false);
   // const userEmail = "kg983825@gmail.com";
    const [videoDone, setVideoDone] = useState(false);
      const dispatch = useDispatch();
  const property = useSelector(state => state.property.labelProperties);

  //console.log(Offer,"=====offf====")

 // const loading = useSelector(state => state.home.loading);

  useEffect(() => {
    dispatch(labelProperty());
  }, []);

    useEffect(() => {
        if (!introPlayed) {
            introPlayed = true;
            setVideoDone(true);
        }
    }, []);
    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            // const fetchData = async () => {
            //     setLoading(true);
            //     try {
            //         const { data: res } = await GetLabelsProp();
            //         if (res.success && isMounted) {
            //             const data = res.properties;
            //             const labelProperties = data.filter(item => item.PropertyType === "Label");
            //             setProperty(labelProperties);
            //         }
            //     } catch (error) {
            //         if (isMounted) {
            //             console.log("Error in fetching labels prop: ", error.message);
            //         }
            //     } finally {
            //         if (isMounted) setLoading(false);
            //     }
            // };

            // fetchData();

            // cleanup: runs when screen loses focus or unmounts
            return () => {
                isMounted = false;
            };
        }, [])
    );

  return (
    <SafeAreaView style={{flex:1}}>

        {videoDone ? 
            <Video
                source={{uri: 'https://duixj37yn5405.cloudfront.net/hls-videos/31bee48c-8919-401f-b41c-3cb701c421ed/1080p/index.m3u8'}}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                paused={false}         
                onEnd={() => setVideoDone(false)}  
                onError={(e) => console.log(e,"=========errooovideo")}
            />
            :
            <View style={{flex:1}}>
                {loading && (
                    <View style={{
                        position: 'absolute',
                        top: 0, bottom: 0, left: 0, right: 0,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                )}

                <View style={{flex:1,backgroundColor:'#E9E8E5'}}>
                    <View style={{padding:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('HomePage');
                        }} style={{}}>
                            <Icon name={'chevron-left'} size={20} color={'#1a1a1a'}/>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:18,color:'#1a1a1a'}}>Discover Altaira</Text>
                        <View style={{width:30}}></View>
                    </View>

                    {property.map((item, index) => (
                        <View key={index} style={{width:width*0.9,backgroundColor:'#F6F6F6',elevation:1,borderRadius:25,alignSelf:'center'}}>
                            <View style={{width:'100%'}}>
                                <Image resizeMode='cover' source={{uri: item.image.Image1}} style={{width:'100%',height:222,borderTopLeftRadius:25,borderTopRightRadius:25}}/>
                                <View style={{position:'absolute',top:20,left:20,}}>
                                    <View style={{borderColor:'#fff',borderWidth:1,borderRadius:20,paddingHorizontal:13,paddingVertical:8,alignItems:'center'}}>
                                        <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:12,color:'#fff'}}>🚀Pre-Launch</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{width:width*0.58,backgroundColor:'#F6F6F6',elevation:5,height:80,borderRadius:13,alignSelf:'center',marginTop:-40,alignItems:'center',justifyContent:'center'}}>
                                <View style={{alignItems:'center'}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#0B2C0B'}}>{item.name}</Text>
                                    <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>
                                        <Ico name={'location-outline'} size={15} color={'#000'}/>
                                        <Text style={{fontFamily:'Montserrat-Regular',fontSize:13,color:'#000',marginLeft:5}}>{item.Location}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap',justifyContent:'space-between',gap:20,paddingHorizontal:25,paddingVertical:20}}>
                                <View style={{flexDirection:'row',alignItems:'center',}}>
                                    <View style={{flex:1}}>
                                        <Text style={{fontFamily:'Montserrat-Medium',fontSize:13,color:'#000'}}>{item?.EnclBalconyArea}</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text style={{fontFamily:'Montserrat-Medium',fontSize:13,color:'#000'}}>{item?.Type}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <View style={{flex:1,}}>
                                        <Text style={{fontFamily:'Montserrat-Medium',fontSize:13,color:'#000'}}>{item?.UseableArea}</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text style={{fontFamily:'Montserrat-Medium',fontSize:13,color:'#000'}}>{item?.TerraceBalconyArea}</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => {
                                navigation.navigate('LablePropertyDis', { data: item });
                            }} style={{alignItems:'center',marginBottom:20}}>
                                <View style={{width:width*0.5,height:45,backgroundColor:'#C6AF83',borderRadius:7,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#FFF'}}>Explore Altaira</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        }
    </SafeAreaView>
  )
}