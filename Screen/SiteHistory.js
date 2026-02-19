import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useContext, useState,useEffect } from 'react';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Feather';
import { AppContext } from './Context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Back from './Back';

export default function SiteHistory(props) {
  const[SiteData,setSiteData]=useState(props?.route?.params?.site||[]);
  const {globalState, setGlobalState} = useContext(AppContext);
  

  
  return (
     <SafeAreaView style={{flex: 1,}}>
    <View style={{flex: 1}}>
      <Back title={"Properties Visit Status"}/>
      <ScrollView style={{backgroundColor: '#f5f7fe'}}>
      {SiteData.length==0?  <Text style={{color:'#043862',fontSize:18,fontFamily: 'Poppins-SemiBold',textAlign:'center',marginTop:10,paddingHorizontal:20}}>No site visit is scheduled; kindly arrange your preferred time for the visit.</Text>
      :
        <>
      {SiteData.map((item, index) => ( <View
            key={index}
          style={{
            width: '100%',
            borderBlockColor: '#DADADA',
            borderBottomWidth: 1,
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: 'white',
            //  marginBottom: 20,
          }}>
          <Image
            style={{
              width: width * 0.3,
              height: 100,
              borderRadius: 15,
            }}
            source={{uri: item?.propertyDetails?.image?.Image1}}
           
          />
          <View
            style={{
              paddingLeft:10,
              flex:1
            }}>
            <View style={{paddingLeft: 20}}>
              <Text
                style={{
                  color: '#1E2135',
                  fontSize: 16,
                  fontFamily: 'OpenSans-Bold',
                  paddingVertical: 2,
                }}>
                {item?.propertyDetails?.name}
              </Text>
             <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
              

             <Text
                style={{
                  color:  '#1E2135',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  paddingVertical: 2,
                }}>
                Status :- 
              </Text>

              <Text
                style={{
                  color:item?.status=='Visited'?'#008000': '#FF0000',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  paddingVertical: 2,
                }}>
                 {item?.status}
              </Text>
              </View> 
              <Text
                style={{
                    color: item?.status=='Visited'?'#008000':'#FF0000',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  paddingVertical: 2,
                }}>
                {item?.time}
              </Text>
            </View>
          </View>
        </View>))}
        </>
        
       

       }

   
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}
