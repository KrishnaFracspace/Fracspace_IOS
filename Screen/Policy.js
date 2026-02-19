import { View, Text, } from 'react-native'
import React, { useState } from 'react'
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Policy(props) {
    const [loading, setLoading] = useState(true);
    const handlePageLoad = () => {
        setLoading(false);
    };
    return (
        <SafeAreaView style={{flex:1}}>
        <WebView source={{ uri: props?.route?.params?.Link }} style={{ width: '100%' }} scalesPageToFit={false}
            onLoad={handlePageLoad} />
            </SafeAreaView>
    )
}