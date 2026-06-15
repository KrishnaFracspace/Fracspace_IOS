import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons';
import Pdf from 'react-native-pdf';
import { useNavigation } from '@react-navigation/native';

export default function ViewAgreement(props) {
    const {width, height} = Dimensions.get('window');
    const [agreement, setAgreement] = useState(props?.route?.params?.data);
    const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#ac935ca2'}}>
        <View style={{flex:1}}>
            <View style={{flexDirection: 'row',justifyContent: 'space-between',width: '100%',paddingHorizontal: 15,paddingVertical: 20,backgroundColor: '#ac935c',}}>
                <TouchableOpacity onPress={() => {navigation.goBack();}}>
                    <Icon name="chevron-back" size={20} color="#ffff" />
                </TouchableOpacity>
            </View>
            <Pdf
                source={{
                    uri: `data:application/pdf;base64,${agreement}`
                }}
                style={{width: width, height:'100%' ,backgroundColor: '#FFF'}}
                trustAllCerts={false}
                horizontal={false}
                enablePaging={false}
                showsVerticalScrollIndicator={true}
                spacing={10}
                onLoadComplete={(pages) => {console.log('PDF Pages =>', pages);}}
                onPageChanged={(page, pages) => {console.log(`${page}/${pages}`);}}
                onError={(error) => {console.log('PDF ERROR =>', error);}}
            />
        </View>
    </SafeAreaView>
  )
}