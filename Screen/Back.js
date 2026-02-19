import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');

export default function Back({title,isBack}) {
  // const[isBack,setIsBack] = useState(false)
    const navigation = useNavigation();
  return (
    <TouchableOpacity  style={{flexDirection:'row',justifyContent:'space-between',borderBottomColor:'#D2D2D2',borderBottomWidth:0.8,backgroundColor:'#081F62', paddingVertical:20,width:'100%',paddingRight:5}}
     onPress={() => {
        navigation.goBack();     
          }}>
            <View>
              {isBack === false ?  null: <Icon name="chevron-back" size={28} color="#ffff" />}
            </View>

         <Text style={{color:"#ffff",fontSize:16,fontFamily:'WorkSans-SemiBold',paddingTop:4,textAlign:"center"}}>{title}</Text>
      <TouchableOpacity  
     onPress={() => {
        // navigation.navigate('HomePage')
        navigation.popToTop();    
          }}>
            <View>
          {isBack === false ?  null:  <Text style={{color:"#ffff",fontSize:16,fontFamily:'WorkSans-Medium',paddingTop:4}}>Exit</Text>}
            </View>
     
      </TouchableOpacity>
      </TouchableOpacity>
  )
}