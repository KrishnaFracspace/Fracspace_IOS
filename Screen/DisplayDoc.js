import {View, Text, Image, StyleSheet,PermissionsAndroid,TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
// import { PdfView } from 'react-native-pdf-light';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/Ionicons';
import IconDown from 'react-native-vector-icons/MaterialIcons';
// import RNFetchBlob from 'rn-fetch-blob';
import { useNavigation } from '@react-navigation/native';
import Back from './Back';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DisplayDoc(props) {
  //console.log(props?.route?.params);
  const [pdfLink,setPdfLink]=useState(props?.route?.params?.Link);
 
  const navigation = useNavigation();
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Downloader App Storage Permission',
          message:
            'Download App needs access to your Storage' +
            'so you can download files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Storage');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
        
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: 15,
          paddingVertical: 30,
          backgroundColor: '#1E2135',
        }}>
          <TouchableOpacity
          onPress={() => {
           // requestStoragePermission();
            // setModalVisible(!modalVisible);
          //   if(props?.route?.params?.screen=="Doc"){
          //     navigation.navigate('Profile');

          //   }
          //   else if (props?.route?.params?.screen=="Rev"){
          //     navigation.navigate('Review');

          //   }else{
          //   navigation.navigate('Dashboard');
          // }
          navigation.goBack();
          }}>
        <Icon name="arrow-back-outline" size={25} color="#ffff" />
        
        </TouchableOpacity>
        {/* {props?.route?.params?.screen=="Doc" ||props?.route?.params?.screen=="Rev"?<></>:<TouchableOpacity
          onPress={() => {
           /// requestStoragePermission();
        
          }}>
          <IconDown name={'download'} size={25} color={'#ffff'} />
        </TouchableOpacity>} */}
        {/* <Icon name={'cross'} size={30} color={'#ffff'} /> */}
      </View>
      <Pdf
        trustAllCerts={false}
        source={{
          uri: pdfLink,
          cache: true,
        }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfViewstyle: {
    flex: 1,
    width: '100%',
  },
  title: {
    color: '#252b5d',
    fontFamily:'OpenSans-ExtraBold',
    fontSize: 18,
    paddingBottom: 10,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    // justifyContent: 'center',
    //alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#2E2E2E',
    // opacity: 0.9,
  },
  cardTypo: {
    left: 10,
    color: '#1e2135',
    //fontFamily: 'Inter-Regular',
    textAlign: 'left',
    fontSize: 16,
    fontFamily:'Poppins-Medium',
    flex: 1,
  },
  reviewChildLayout: {
    height: 50,
    width: 90,
    borderRadius: 5,
    // left: 32,
    //position: 'absolute',
  },
});
