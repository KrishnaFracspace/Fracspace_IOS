import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function CameraScreen() {
  return (
    <SafeAreaView style={{flex:1}}>
 <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        //source={require('../assets/camera-sdk/index.html')}
        
         source={{ uri: 'http://192.168.0.9:8080/index.html'}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowingReadAccessToURL={'file://'}
      />
    </View>
    </SafeAreaView>
   
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});