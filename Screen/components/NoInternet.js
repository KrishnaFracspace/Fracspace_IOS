import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';


export default function NoInternet ({ onRetry }) {
  const [loading, setLoading] = useState(false);
  const { width, height } = Dimensions.get('window');

  const handleRetry = async () => {
    setLoading(true);
    const netInfo = await NetInfo.fetch();
    setLoading(false);
    if (netInfo.isConnected) {
      onRetry(); // Call the function passed from App.js
    }
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems:'center'}}>
        <Image resizeMode='contain' source={require('../assets/NoInternet.png')} style={{width:width, height:300,marginBottom:30}}/>
        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000000'}}>Lost Connection</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRetry} disabled={loading}>
        { loading
            ? <ActivityIndicator color="white" />  
            : <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                <Icon name={'refresh'} size={20} color={'#FFFFFF'} />
                <Text style={styles.buttonText}>Retry</Text>
            </View>
        }
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0D52A5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop:30
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily:'Poppins-Medium'
  },
});