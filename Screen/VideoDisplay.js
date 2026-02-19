import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Video from 'react-native-video';
import Back from './Back';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function VideoDisplay(props) {
   const navigation = useNavigation();
  const [Pau,setPau]=useState(false);
 

  return (
    <SafeAreaView style={{flex: 1,}}>
    {/* <Back title={'Testimonials'} /> */}

      {/* <View>
        <TouchableOpacity  onPress={() => navigation.goBack()}
       style={{marginLeft:3,borderWidth:1}}
       >
        <Icon name="arrow-back" size={26} color="#000" />
      </TouchableOpacity>
      </View> */}
    
    
    <Video
      source={{uri:props?.route?.params?.vlink}}
      //fullscreen={true}
      paused={Pau}
     resizeMode={'contain'}
      seekIncrementMS={10000}
      hideShutterView={true}
      style={styles.backgroundVideo}
    />
    <TouchableOpacity onPress={()=>{
      setPau(!Pau)
    }}
    style={{position:'absolute',alignItems:'center',justifyContent:'center',width:'100%',height:'80%',marginTop:'30%'}}>
      {Pau==true &&<Icon name={'caret-forward'} size={40} color={'#AEAEAE'}/>}
    </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  active: {
    backgroundColor: '#000000',
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});






