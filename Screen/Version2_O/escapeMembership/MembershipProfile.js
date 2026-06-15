import { View, Text, ScrollView, ImageBackground, Image, Dimensions, Modal, TextInput, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Alert, Linking, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/FontAwesome';
import { InvestmentDetailsForEscape, UpdateBankForMembers } from '../../Services/UserApi';
import { AppContext } from '../../Context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function MembershipProfile(props) {

    const {width, height} = Dimensions.get('window');
    const [investmentDetails, setInvestmentDetails] = useState(props?.route?.params?.data);
    const [plan, setPlan] = useState(props?.route?.params?.plan);
    // console.log("plan data: ",props?.route?.params?.plan);
    const [viewBank, setViewBank] = useState(false);
    const [showInvestment, setShowInvestment] = useState('');
    const {globalState, setGlobalState} = useContext(AppContext);
    // console.log(globalState?.userDetails);
    const userId = globalState?.userDetails?._id;
    const userName = globalState?.userDetails?.userName;
    const [holderName, setHolderName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const [activeInvestment, setActiveInvestment] = useState(null);
    
    useEffect(() => {
        if (investmentDetails?.length > 0) {

            const activeData = investmentDetails.find(
            item => item.status === 'active'
            );

            setActiveInvestment(activeData || null);
        }
    }, [investmentDetails]);

    const updateBank = async() => {
        const isValid = validateForm();
        if (!isValid) {
            return;
        }
        let payload = JSON.stringify({
            id: activeInvestment?._id,
            bankDetails: {
                accountNumber: accountNumber,
                ifscCode: ifscCode,
                bankName: bankName,
                accountHolderName: holderName,
                upiId: ""
            }
        });
        console.log("Payload: ", payload);
        try{
            let {data: res} = await UpdateBankForMembers(payload);
            console.log("Response: ",res);
            if(res?.success){
                setViewBank(false);
                // await showInvestmentForEscape();
                navigation.navigate('MembershipHome');
                Alert.alert('Success', 'Bank details updated successfully');
            }
        }catch(error){
            console.error('Error in Updating bank: ', error?.response?.data || error?.response?.data);
        }
    }

    const validateForm = () => {
        if (!accountNumber?.trim()) {
            Alert.alert('Validation Error', 'Please enter Account Number');
            return false;
        }

        if (!ifscCode?.trim()) {
            Alert.alert('Validation Error', 'Please enter Ifsc Code');
            return false;
        }

        if (!bankName?.trim()) {
            Alert.alert('Validation Error', 'Please enter Bank Name');
            return false;
        }

        if (!holderName?.trim()) {
            Alert.alert('Validation Error', 'Please enter Holder Name');
            return false;
        }
        return true;
    };

    const formattedDate = new Date(investmentDetails[0]?.investedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    let lastFiveChars = activeInvestment?.memberDetails?.accountNumber.slice(-5) || '';
    let maskedPart = "*".repeat(activeInvestment?.memberDetails?.accountNumber?.length - 5);
    let maskedAccount = maskedPart + lastFiveChars;

    const handleCallNow = Phone => {
        const phoneNumber = Phone;
        const phoneUrl = `tel:${phoneNumber}`;
        Linking.openURL(phoneUrl)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Error', 'Phone number is not supported');
                }
            })
            .catch(error => console.log('Error making phone call:', error));
    };

    const formatIndianAmount = (amount) => {
        if (amount == null) return '0';
        return Number(amount).toLocaleString('en-IN');
    };

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#ac935ca2'}}>
            <ImageBackground source={{uri: 'https://duixj37yn5405.cloudfront.net/appImages/BGHome.png'}} style={{flex:1}}>
                <ScrollView style={{}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:20}}>
                        <TouchableOpacity onPress={() => {navigation.goBack()}} style={{backgroundColor: '#8D8D8D80',padding:5,borderRadius:20}}>
                            <Icon name={'chevron-back'} size={20} color={'#FFF'}/>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Profile</Text>
                        <View style={{width:20}}/>
                    </View>
                    <ImageBackground resizeMode='cover' source={{uri: 'https://duixj37yn5405.cloudfront.net/appImages/profileBg.png'}} style={{width:width*0.88,height:85,borderRadius:15,padding:12,marginHorizontal:20,marginTop:20}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{backgroundColor:'#FFF',padding:5,borderRadius:40}}>
                                    {globalState?.userDetails?.profilePicture ?
                                        <Image source={{uri: globalState?.userDetails?.profilePicture}} style={{width:50,height:50,borderRadius:35}}/>
                                        :
                                        <Image source={{uri:'https://duixj37yn5405.cloudfront.net/appImages/profile11.png'}} style={{width:50,height:50,borderRadius:35}}/>
                                    }
                                </View>
                                <View style={{marginLeft:15}}>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:20,color:'#FFF'}}>{userName}</Text>
                                    {activeInvestment &&
                                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:11,color:'#AC935C',marginTop:6}}>FS MEMBER • <Text style={{color:'#FFFFFF80',textTransform:'uppercase'}}>SINCE {formattedDate}</Text></Text>
                                    }
                                </View>
                            </View>
                            <Image source={{uri:'https://duixj37yn5405.cloudfront.net/appImages/membershipLogo.png'}} style={{width:34,height:34}}/>
                        </View>
                    </ImageBackground>

                    {activeInvestment &&
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15,marginHorizontal:20}}>
                            <View style={{backgroundColor:'#f6f6f6',borderRadius:10,flex:1,alignItems:'center',padding:15,elevation:2}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>Investment Amount</Text>
                                <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#AC935C'}}>₹{formatIndianAmount(activeInvestment?.investmentPlan?.minimumInvestment)}</Text>
                            </View>
                            <View style={{backgroundColor:'#f6f6f6',borderRadius:10,flex:1,alignItems:'center',padding:15,marginLeft:15,elevation:2}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>Membership Validity</Text>
                                <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#AC935C'}}>{activeInvestment?.validityInYears || "10"} Years</Text>
                            </View>
                        </View>
                    }

                    {activeInvestment &&
                        <View style={{marginTop:15,marginHorizontal:20}}>
                            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#000'}}>Bank Details</Text>
                            <View style={{backgroundColor:'#f6f6f6',borderRadius:10,padding:15,marginTop:12,elevation:3}}>
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#AC935C'}}>PRIMARY ACCOUNT</Text>
                                    <TouchableOpacity onPress={() => {setViewBank(true)}} style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#AC935C',marginRight:5}}>EDIT</Text>
                                        <Icon name={'pencil'} size={12} color={'#AC935C'}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                                    <View>
                                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#000'}}>{activeInvestment?.memberDetails?.bankName}</Text>
                                        <View style={{flexDirection:'row',alignItems:'center',marginTop:5, gap:10}}>
                                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#00000080'}}>{visible ? activeInvestment?.memberDetails?.accountNumber : maskedAccount}</Text>
                                            <TouchableOpacity onPress={() => {
                                                setVisible(!visible);
                                            }}>
                                                {visible ?
                                                    <Icon name={'eye-outline'} size={18} color={'#000'}/>
                                                    :
                                                    <Icon name={'eye-off-outline'} size={18} color={'#000'}/>
                                                }
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row',alignItems:'center',gap:20}}>
                                        
                                        <Ico name={'bank'} size={18} color={'#AC935C'}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }

                    {activeInvestment &&
                        <View style={{marginTop:15,marginHorizontal:20}}>
                            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#000'}}>Membership Document</Text>
                            <View style={{backgroundColor:'#f6f6f6',borderRadius:10,padding:15,marginTop:12,elevation:3}}>
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <View>
                                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#AC935C'}}>MEMBERSHIP CREDENTIALS</Text>
                                        <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>
                                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#00000080'}}>Digital Document</Text>
                                            <View style={{backgroundColor:'#209120',borderRadius:20,paddingHorizontal:10,paddingVertical:3,marginLeft:10}}>
                                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#FFF'}}>• Active</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Ico name={'vcard-o'} size={20} color={'#AC935C'}/>
                                </View>

                                <TouchableOpacity 
                                    onPress={() => {navigation.navigate('DisplayDoc', {Link: activeInvestment?.agreementUrl})}} 
                                    style={{borderColor:'#AC935C',borderWidth:0.5,borderRadius:5,alignItems:'center',padding:8,marginTop:20}}
                                >
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#AC935C'}}>View Agreement</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                    <View style={{marginTop:15,marginHorizontal:20}}>
                        <TouchableOpacity onPress={() => {navigation.navigate('TranHisForEscape', {data: investmentDetails})}} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#000'}}>Transaction History</Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#AC935C'}}>View All →</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {navigation.navigate('TranHisForEscape', {data: investmentDetails})}} style={{backgroundColor:'#f6f6f6',borderRadius:10,padding:15,marginTop:12,elevation:3}}>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#00000080'}}>{formattedDate}</Text>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <View style={{gap:5}}>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>{investmentDetails[0]?.investmentPlan?.name}</Text>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#00000080'}}>{investmentDetails[0]?.paymentProof?.paymentMethod}</Text>
                                </View>
                                <View style={{gap:5}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#AC935C'}}>₹{formatIndianAmount(investmentDetails[0]?.paymentProof?.paidAmount) || formatIndianAmount(investmentDetails[0]?.principalAmount)}</Text>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#000'}}>Status: <Text style={{color:'#D59233'}}>{investmentDetails[0]?.status}</Text></Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop:15,marginHorizontal:20}}>
                        <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#000'}}>Support/Concierge</Text>
                        <View style={{backgroundColor:'#000',borderRadius:15,padding:20,alignItems:'center',gap:12,marginVertical:12}}>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#FFF',textAlign:'center'}}>Need assistance with membership benefits? Our concierge team is here to help.</Text>
                            <TouchableOpacity onPress={() => {
                                const phone = activeInvestment
                                    ? plan[0]?.memberContactNumber
                                    : plan[0]?.contactNumber;

                                handleCallNow(phone);
                            }} style={{backgroundColor:'#AC935C',borderRadius:5,padding:5,paddingHorizontal:10,alignItems:'center'}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#FFF'}}>Call: +91 {activeInvestment ? plan[0]?.memberContactNumber : plan[0]?.contactNumber}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <Modal visible={viewBank} transparent animationType='fade'>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{flex: 1,width:'100%',}}
                    >
                        <View style={{flex:1}}>
                            <TouchableWithoutFeedback onPress={() => {setViewBank(false)}}>
                                <View style={styles.modalOverlay}>
                                    <TouchableWithoutFeedback>
                                        <View style={{backgroundColor:'#F6F6F6',borderRadius:12,padding:20,width:width*0.9}}>
                                            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#000',alignSelf:'center'}}>Bank Details</Text>

                                            <View style={{marginTop:15}}>
                                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>Account Holder Name</Text>
                                                <View style={{borderWidth:0.5,borderRadius:5,borderColor:'#000',marginTop:10,padding:12}}>
                                                    <TextInput
                                                        placeholder='John Doe'
                                                        placeholderTextColor={'#00000080'}
                                                        value={holderName}
                                                        onChangeText={setHolderName}
                                                        style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}
                                                    />
                                                </View>
                                            </View>

                                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15}}>
                                                <View style={{flex:1}}>
                                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>Account Number</Text>
                                                    <View style={{borderWidth:0.5,borderRadius:5,borderColor:'#000',marginTop:10,padding:12}}>
                                                        <TextInput
                                                            placeholder='123456789012'
                                                            placeholderTextColor={'#00000080'}
                                                            value={accountNumber}
                                                            keyboardType={'numeric'}
                                                            onChangeText={setAccountNumber}
                                                            style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{flex:1,marginLeft:15}}>
                                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>IFSC Code</Text>
                                                    <View style={{borderWidth:0.5,borderRadius:5,borderColor:'#000',marginTop:10,padding:12}}>
                                                        <TextInput
                                                            placeholder='HDFC4001'
                                                            placeholderTextColor={'#00000080'}
                                                            value={ifscCode}
                                                            onChangeText={setIfscCode}
                                                            style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{marginTop:15}}>
                                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>Bank Name</Text>
                                                <View style={{borderWidth:0.5,borderRadius:5,borderColor:'#000',marginTop:10,padding:12}}>
                                                    <TextInput
                                                        placeholder='HDFC Bank Limited'
                                                        placeholderTextColor={'#00000080'}
                                                        value={bankName}
                                                        onChangeText={setBankName}
                                                        style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}
                                                    />
                                                </View>
                                            </View>

                                            <TouchableOpacity onPress={() => {
                                                updateBank();
                                            }} style={{backgroundColor:'#AC935C',borderRadius:10,padding:10,alignItems:'center',marginTop:20}}>
                                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#FFF'}}>Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

                
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
})