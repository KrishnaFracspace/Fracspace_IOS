
let introPlayed = false;

import { View, Text,  Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import Ico from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { videoSource } from '../utils/videoSource';
import { GetLabelsProp } from '../Services/UserApi';
import { useDispatch, useSelector } from 'react-redux';
import { labelProperty } from '../redux/reducer/propertyReducer';
import { altairaImgIcon } from '../assets';
import { AltairaLogo, fracspaceLogo, fracspaceLogos } from './assets';


// Master playlist, so the player can drop to 720p/360p on a slow network
// (the fixed 1080p rendition is one 3.5 MB segment and froze on mobile data).
const INTRO_VIDEO = 'https://duixj37yn5405.cloudfront.net/hls-videos/31bee48c-8919-401f-b41c-3cb701c421ed/master.m3u8';
// Skip the intro if it stalls this long, instead of leaving a frozen frame.
const INTRO_STALL_MS = 6000;

export default function LableProperty() {

    const { width, height } = Dimensions.get('window');
    const navigation = useNavigation();
  // Release video players when this screen isn't the visible one.
  const isFocused = useIsFocused();
    //const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(false);
   // const userEmail = "kg983825@gmail.com";
    const [videoDone, setVideoDone] = useState(false);
    const [introBuffering, setIntroBuffering] = useState(true);
    const stallTimer = useRef(null);
    const endIntro = useCallback(() => {
        clearTimeout(stallTimer.current);
        setVideoDone(false);
    }, []);
    const onIntroBuffer = useCallback(({ isBuffering }) => {
        setIntroBuffering(isBuffering);
        clearTimeout(stallTimer.current);
        if (isBuffering) {
            stallTimer.current = setTimeout(endIntro, INTRO_STALL_MS);
        }
    }, [endIntro]);
    useEffect(() => () => clearTimeout(stallTimer.current), []);
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
    <SafeAreaView style={{flex:1,backgroundColor:"#E9E8E5"}}>

        {videoDone && isFocused ? 
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <View style={{ flex: 1 }} pointerEvents="none">
                    <Video
                        source={videoSource(INTRO_VIDEO)}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                        paused={false}
                        onReadyForDisplay={() => setIntroBuffering(false)}
                        onBuffer={onIntroBuffer}
                        onEnd={endIntro}
                        onError={endIntro}
                    />
                </View>
                {introBuffering && (
                    <ActivityIndicator size="large" color="#fff" style={{ position: 'absolute', alignSelf: 'center', top: '48%' }} />
                )}
                <TouchableOpacity
                    onPress={endIntro}
                    style={{ position: 'absolute', top: 50, right: 20, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <Text style={{ color: '#fff', fontFamily: 'Montserrat-SemiBold', fontSize: 14 }}>Skip</Text>
                </TouchableOpacity>
            </View>
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

                <View style={{backgroundColor:'#E9E8E5'}}>
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
                                    <View style={{backgroundColor:'rgba(222, 213, 196, 1)',borderRadius:20,paddingHorizontal:13,paddingVertical:8,alignItems:'center'}}>
                                        <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:12,color:'#000'}}>🚀Pre-Launch</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{alignItems:"center"}}>
                                {/* <Image source={AltairaLogo} style={{height:100,width:100,alignSelf:"center",zIndex:-10,borderRadius:100,marginTop:-55, shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 10,
                                    elevation: 10}}/> */}
                                <Image source={AltairaLogo} style={{height:100,width:100,alignSelf:'center',borderRadius:50,marginTop:-55,shadowOffset:{width:0, height:8},
                                    shadowOpacity: 0.2,
                                    shadowRadius: 10
                                }}/>
                                 <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>
                                        <Ico name={'location-outline'} size={15} color={'#000'}/>
                                        <Text style={{fontFamily:'Montserrat-Regular',fontSize:13,color:'#000',marginLeft:5}}>{item.Location}</Text>
                                    </View>
                                </View>
<View style={{borderBottomWidth:1,borderBottomColor:"rgba(0, 0, 0, 0.3)",width:"80%",justifyContent:"center"
    ,alignSelf:"center",paddingVertical:7}}/>
                            {/* <View style={{width:width*0.58,backgroundColor:'#F6F6F6',elevation:5,height:80,borderRadius:13,alignSelf:'center',marginTop:-40,alignItems:'center',justifyContent:'center',  shadowColor: "#fff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    // Android shadow
    elevation: 10,borderWidth:1,
      borderWidth: 3,
    borderColor: "white",}}>
                                <View style={{alignItems:'center'}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#0B2C0B'}}>{item.name}</Text>
                                    <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>
                                        <Ico name={'location-outline'} size={15} color={'#000'}/>
                                        <Text style={{fontFamily:'Montserrat-Regular',fontSize:13,color:'#000',marginLeft:5}}>{item.Location}</Text>
                                    </View>
                                </View>
                            </View> */}

                            <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap',justifyContent:'space-between',gap:20,paddingHorizontal:25,paddingVertical:20,}}>
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
                <View style={{justifyContent:"center",alignItems:"center",marginTop:20}}>
<Text style={{color:"rgba(0, 0, 0, 0.7)",fontFamily:"WorkSans-Regular"}}>A landmark experience by</Text>
<Image source={fracspaceLogos} style={{height:60,width:'65%'}} resizeMode='cover'/>
                </View>
                
            </View>
        }
    </SafeAreaView> 
  )
}