import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/AntDesign';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DreamscapeHotels } from '../Services/UserApi';

const {width, height} = Dimensions.get('window');
export default function VideoTour(props) {
    const [videoUrl,setVideoUrl] = useState(props?.route?.params?.vlink);
    const [hotelName,setHotelName]= useState(props?.route?.params?.location); 
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [paused, setPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const videoRef = useRef(null);
    const [like, setLike] = useState(false);
    const [hotelDetails, setHotelDetails] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const navigation = useNavigation();

    const handleListedHotels = async () => { 
        try {
            let {data : res} = await DreamscapeHotels();
             console.log("Response: ",res?.hotels);
            const data = res?.hotels;
            setHotelDetails(data);
        } catch (error) {
            console.log("Errorin Listed Hotels: ",error);
        }
    };

    useEffect(() => {
        handleListedHotels();
    }, []);

    const roomDetails = hotelDetails?.find(hotel => hotel?.name === hotelName); 
    const onProgress = (data) => {
        setCurrentTime(data.currentTime);
    };
    const onLoad = (data) => {
        setDuration(data.duration);
    };
    const togglePlayPause = () => setPaused(!paused);
    const handleSeek = (value) => {
        videoRef.current.seek(value);
        setCurrentTime(value);
    }  
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

  return (
       <SafeAreaView style={{flex:1}}>
        <View style={{flex:1,}}>
        <TouchableOpacity activeOpacity={1}
         onPress={() => {
            togglePlayPause();
        }} style={{width:width,top:0,left:0,right:0,bottom:0,position:'absolute'}} >
            <Video
                ref={videoRef}
                resizeMode='cover'
                source={{ uri:videoUrl }}
                onProgress={onProgress}
                onLoad={onLoad}
                style={{ top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: width,
                    position:'absolute', 
                    flex:1}}
                paused={paused} 
                repeat 
                onError={(e) => console.log('Error loading video:', e)} />
        </TouchableOpacity>

        <View style={{flex:1,flexDirection:'column'}}>
            <View style={{flex:1}}>
                <View style={{flexDirection:'row',paddingVertical:20,paddingHorizontal:20,alignItems:'center',justifyContent:'space-between'}}>
                    <TouchableOpacity  onPress={() => {
                            navigation.goBack();
                        }} style={{flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity onPress={() => {
                            navigation.goBack();
                        }}>
                            <Icon name={'left'} size={20} color={'#FFFFFF'}/>
                        </TouchableOpacity>
                        <View style={{marginLeft:20}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#FFFFFF'}}>{roomDetails?.name}</Text>
                            <Text style={{fontFamily:'Poppins-Regular',fontSize:12,color:'#FFFFFF'}}>{roomDetails?.location?.city}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{flex:1,flexDirection:'column',justifyContent:'space-between'}}>
                { paused && <View style={{alignItems:'center',marginTop:-25,flex:1}}>
                    <Icon name={'play'} size={50} color={'#FFFFFF'}/>
                </View> }
                <View style={{padding:20,justifyContent:'flex-end',flex:1}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',}}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("SelectRoom", {detail: roomDetails});
                        }} style={{backgroundColor:'#0424CBC9',borderRadius:10,padding:10,alignItems:'center',flexDirection:'row',alignSelf:'flex-end'}}>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:12,color:'#FFFFFF'}}>Book Now</Text>
                            <Icon name={'arrowright'} size={20} color={'#FFFFFF'} style={{marginLeft:10}}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{width:'80%'}}>
                        <View style={{marginVertical:15}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:12,color:'#FFFFFF'}}>
                                {hotelDetails?.description}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.controls}>
                        <Text style={styles.time}>{formatTime(currentTime)}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={currentTime}
                            onSlidingComplete={handleSeek}
                            minimumTrackTintColor="white"
                            maximumTrackTintColor="gray"
                            thumbTintColor="white"
                        />
                        <Text style={styles.time}>{formatTime(duration)}</Text>
                    </View>
                </View>
            </View>
        </View>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    controls: { flexDirection: "row", alignItems: "center", padding: 10 },
    slider: { flex: 1, marginHorizontal: 10 },
    time: { color: "white", fontSize: 14 },
  });