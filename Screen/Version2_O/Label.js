
import { View, Text, TouchableOpacity, Image, Modal, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import StaggeredList from '@mindinventory/react-native-stagger-view';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Label(props) {

    const [images, setImages] = useState(props?.route?.params?.data);
    const { width, height } = Dimensions.get('window');
    const [viewImg, setViewImg] = useState('');
    const [fullImg, setFullImg] = useState(false);

    const navigation = useNavigation();

  return (
     <SafeAreaView style={{flex:1}}>
    <View style={{flex:1,backgroundColor:'#FFF',padding:20}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#000'}}>Property Gallery</Text>
            <TouchableOpacity onPress={() => {
                navigation.goBack();
            }} style={{backgroundColor:'#D9D9D9AB',width:25,height:25,borderRadius:15,alignItems:'center',justifyContent:'center'}}>
                <Icon name={'cross'} size={20} color={'#000'}/>
            </TouchableOpacity>
        </View>

        <View style={{flex:1,marginTop:20}}>
            <StaggeredList
                data={images}
                numColumns={2}
                key={(item) => item.id}
                renderItem={({item}) => {
                    const randomHeight = Math.floor(Math.random() * 100) + 180;
                    return (
                        <TouchableOpacity onPress={() => {
                            setViewImg(item);
                            setFullImg(true);
                        }} style={{margin:10,borderRadius:10,overflow:'hidden'}}>
                            <Image source={{uri: item}} style={{width:'100%',height:randomHeight}}/>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>

        <Modal visible={fullImg} transparent animationType='fade'>
            <TouchableOpacity onPress={() => {
                setFullImg(false);
            }} style={{backgroundColor:'#000000b3',flex:1,alignItems:'center',justifyContent:'center'}}>
                <View style={{borderWidth:2,borderColor:'#fff',borderRadius:10}}>
                    <Image source={{uri: viewImg}} style={{width: width*0.8,height:height*0.5,borderRadius:10}}/>
                </View>
            </TouchableOpacity>
        </Modal>
    </View>
    </SafeAreaView> 
  )
}