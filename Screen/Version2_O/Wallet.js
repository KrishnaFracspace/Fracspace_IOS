import { View, Text,  Image, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Wallet() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 ,backgroundColor:'#C7E5FD'}}>
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <LinearGradient colors={['#C7E5FD', '#FFFFFF']}
                    style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Icon name={'chevron-left'} size={20} color={'#000000'} />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 18, color: '#000000' }}>Your Wallet</Text>
                        <View></View>
                    </View>

                    <View style={{ alignSelf: 'center', alignItems: 'center', marginTop: 20, }}>
                        <Image resizeMode='contain' source={{uri:'https://duixj37yn5405.cloudfront.net/appImages/Wave.png'}} style={{ width: 40, height: 20 }} />
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#000000B0', marginTop: 5 }}>Total Earnings</Text>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 35, color: '#000000' }}>₹00.<Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 22, color: '#000000' }}>00</Text></Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#2AA804' }}>---</Text>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#000000E5', marginLeft: 10 }}>Last Payout</Text>
                        </View>
                        <FastImage
                            source={require('./assets/WalletAnim.gif')}
                            style={{ width: 180, height: 100 }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>

                </LinearGradient>

                <View style={{ flex: 1.5, alignItems: 'center', marginTop: 20 }}>
                    <View style={{ marginTop: 30 }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, color: '#000000', textAlign: 'center' }}>Oops! No earnings history yet.</Text>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: '#000000', textAlign: 'center', marginHorizontal: 10, textAlign: 'center' }}> No earnings yet. Real estate investments can unlock consistent rental returns over time.</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Home');
                        }}
                        style={{ backgroundColor: '#021265', borderRadius: 50, paddingHorizontal: 15, paddingVertical: 7, marginTop: 20, borderColor: '#FFFFFF', borderWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Poppins-Meidum', fontSize: 14, color: '#FFFFFF' }}>Invest Now</Text>
                        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 5, marginLeft: 5 }}>
                            <Icon name={'arrow-up-right'} size={15} color={'#000000'} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}