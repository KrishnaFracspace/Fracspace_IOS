import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Text
} from 'react-native';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';

export default function PdfViewerScreen() {
  const navigation = useNavigation();

  const source = {
    uri: 'https://d1nj26fz89n9xw.cloudfront.net/fracspace_properties_images/altaira/Altaira++-+Concept+Proposal+(28th+Nov+2025)_compressed_compressed.pdf',
    cache: true,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={{flexDirection:'row',padding:10,alignItems:"center",width:300,justifyContent:"space-between"}}>
          <View>
            <TouchableOpacity
                   style={styles.backBtn}
                   onPress={() => navigation.goBack()}
                   activeOpacity={0.7}>
                   <Icon1 name="chevron-left" size={20} color="#fff" />
                 </TouchableOpacity>
          </View>
           
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="arrow-back" size={26} color="#000" />
        </TouchableOpacity> */}
         <View>
         <Text style={{fontSize:15,fontWeight:'600'}}>Project Concept Overview</Text>
    </View>
      </View>

      {/* PDF VIEW */}
      <Pdf
        source={source}
        style={styles.pdf}
        onLoadComplete={(pages) => {
          console.log(`Loaded ${pages} pages`);
        }}
        onError={(error) => {
          console.log('PDF error:', error);
        }}
        renderActivityIndicator={() => (
          <ActivityIndicator size="large" color="#6200EE" />
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },

  backBtn: {
    width: 35,
    height: 35,
    justifyContent: 'center',
     borderRadius: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,

  },

  pdf: {
    flex: 1,
  },
    backBtn1: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
