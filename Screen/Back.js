import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

export default function Back({ title, isBack }) {
  // const[isBack,setIsBack] = useState(false)
  const navigation = useNavigation();
  return (
    <>
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.8, backgroundColor: '#021265', paddingVertical: 20, paddingLeft: 10, paddingRight: 25
      }}>
        <View>
          {isBack === false ? null :
            <TouchableOpacity onPress={() => {
              navigation.goBack();
            }} activeOpacity={0.7} style={{
              borderRadius: 50, padding: 1.5,
              justifyContent: "center",
              alignItems: "center",
            }}>
              <Icon name="chevron-back" size={23} color="#ffff" />
            </TouchableOpacity>}
        </View>
        <Text style={{ color: "#ffff", fontSize: 18, fontFamily: 'WorkSans-SemiBold', paddingTop: 4, textAlign: "center" }}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate('HomePage')
            // navigation.popToTop();    
          }}>
          {/* <View>
          {isBack === false ?  null:  <Text style={{color:"#ffff",fontSize:16,fontFamily:'WorkSans-Medium',paddingTop:4}}>Exit</Text>}
            </View> */}

        </TouchableOpacity>
      </View>
    </>

  )
}