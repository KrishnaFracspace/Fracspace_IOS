import { View, Text, SafeAreaView, ScrollView, Dimensions, Image, TouchableOpacity, Alert, Animated, StyleSheet, Modal } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather';
import Ico from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../Context/AppContext';
import { ProfileDetails, Verification } from '../Services/UserApi';
import { launchImageLibrary } from 'react-native-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileVerification() {
    const { width, height } = Dimensions.get('window');
    const [uploadedDocs, setUploadedDocs] = useState({
        aadhaar: null,
        pan: null,
        cheque: null,
    });
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { globalState, setGlobalState } = useContext(AppContext);
    const navigation = useNavigation();
    const animatedWidth = useRef(new Animated.Value(0)).current;
    const email = globalState?.userEmail;
    const phoneNumber = globalState?.userPhone;
    // const phoneNumber = "7167678";

    const profile = globalState?.userDetails;
    const interpolatedWidth = animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });
  
const pickDocuments= async (doc) => {
  try {
    if (doc.key === 'aadhaar') {
      // Keep document picker for PDF-only
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],   // be strict
      });
      setUploadedDocs(prev => ({ ...prev, [doc.key]: result }));
    } else {
      // PAN & Cheque → use image picker (supports jpg, png, also pdf in many cases)
      const response = await new Promise((resolve, reject) => {
        launchImageLibrary(
          {
            mediaType: 'photo',           // or 'mixed' if you want to allow PDF too
            includeBase64: false,
            selectionLimit: 1,
          },
          (res) => {
            if (res.didCancel) reject('cancelled');
            else if (res.errorCode) reject(res.errorMessage);
            else resolve(res.assets?.[0]);
          }
        );
      });

      const image = response; // ImagePickerAsset

      // Normalize shape to look similar to DocumentPicker result
      const normalizedFile = {
        uri: image.uri,
        name: image.fileName || `${doc.key}.${image.type?.split('/')[1] || 'jpg'}`,
        type: image.type || 'image/jpeg',
        size: image.fileSize,
      };

      setUploadedDocs(prev => ({ ...prev, [doc.key]: normalizedFile }));
    }
  } catch (err) {
    if (!DocumentPicker.isCancel(err) && err !== 'cancelled') {
      console.log('Picker error:', err);
      // Alert.user...
    }
  }
};
const allDocumentsUploaded = uploadedDocs?.aadhaar && uploadedDocs?.pan && uploadedDocs?.cheque;


  const UploadDoc = async () => {
    const { aadhaar, pan, cheque } = uploadedDocs;
if(phoneNumber.startsWith("+91")){
    if (!aadhaar || !pan || !cheque) {
        Alert.alert('Error', 'Please upload all required documents: Aadhaar, PAN & Cheque');
        return;
    }
     if (aadhaar.type !== 'application/pdf') {
        Alert.alert('Invalid File', 'Aadhaar must be a PDF file');
        return;
    }
}
    // Validation
    // if (aadhaar?.type !== 'application/pdf') {
    //     Alert.alert('Invalid File', 'Aadhaar must be a PDF file');
    //     return;
    // }

    // const formData = new FormData();
    // formData.append('email', email);

    // // Append files safely
    // formData.append('aadhar', {
    //     uri: aadhaar?.uri,
    //     name: aadhaar?.name || 'aadhaar.pdf',
    //     type: aadhaar?.type,
    // });

    // formData.append('pan', {
    //     uri: pan?.uri,
    //     name: pan?.name || 'pan.jpg',
    //     type: pan?.type,
    // });

    // formData.append('chequebook', {
    //     uri: cheque?.uri,
    //     name: cheque?.name || 'cheque.jpg',
    //     type: cheque?.type,
    // });

    const formData = new FormData();

        // 3️⃣ Append email or userId
        formData.append('email', email);

        // 4️⃣ Append Aadhaar
        formData.append('aadhar', aadhaar != null ? {
            uri: aadhaar.uri,
            name: aadhaar.name || 'aadhaar.pdf',
            type: aadhaar.type,
        } : null);

        // 5️⃣ Append PAN
        formData.append('pan', pan != null ? {
            uri: pan.uri,
            name: pan.name || 'pan.jpg',
            type: pan.type,
        } : null);

        // 6️⃣ Append Cheque
        formData.append('chequebook', {
            uri: cheque?.uri,
            name: cheque?.name || 'cheque.jpg',
            type: cheque?.type,
        });

    setIsUploading(true);
    Animated.timing(animatedWidth, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
    }).start();

    try {
        const response = await Verification(formData);        // ← Don't destructure here
        const res = response?.data;                           // ← Get data safely

      //  console.log('Full Response:', response);
      //  console.log('Response Data:', res);

        if (res?.success) {
            console.log('Uploaded Successfully');
            handleProfile();
            setShowSuccess(true);
        } else {
            Alert.alert('Upload Failed', res?.message || 'Server rejected the upload.');
        }
    } catch (error) {
        console.error('❌ Upload error:', error?.response?.data || error.message || error);

        const errorMsg = error?.response?.data?.message 
            || error.message 
            || 'Something went wrong. Please try again.';

        Alert.alert('Upload Failed', errorMsg);
    } finally {
        setTimeout(() => {
            setIsUploading(false);
            animatedWidth.setValue(0);
        }, 300);
    }
};
    const handleProfile = async () => {
        const tokenid = await AsyncStorage.getItem('mytoken');
        const emailId = await AsyncStorage.getItem('Email');
        let payload = JSON.stringify({
          email: emailId,
        });
    
        try {
          let response = await ProfileDetails(payload, tokenid);
           const res = response?.data;   
    
    console.log( res,"=========res123",response)
          if (res?.success) {
            setGlobalState(prevState => ({
              ...prevState,
            //   userName: res?.data?.userName,
            //   userEmail: emailId,
            //   userPhone: res?.data?.phoneNumber,
            //   token: tokenid,
              userDetails: res?.data,
            //   userProfile: res?.data?.profilePicture,
            }));
    
          }
        } catch (error) {
          if (error?.response) {
            if (error?.response?.data?.message == 'Invalid token.') {
              navigation.navigate('NewLogin');
            } else {
              Alert.alert(
                'Response ErrorProfile',
                `${error?.response?.data?.message}`,
              );
            }
          } else if (error?.request) {
            //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
            //console.log('profilr',`${JSON.stringify(error?.request)}`);
            //Alert.alert('Request error:', 'Please Check Your Internet Connection');
          } else {
            Alert.alert('Error:', `${error}`);
          }
        }
      };

    const pickDocument = async (doc) => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
            });
            setUploadedDocs(prev => ({
                ...prev,
                [doc.key]: result,
            }));
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.log('File pick error:', err);
            }
        }
    };

    const deleteDocument = (key) => {
        setUploadedDocs(prev => ({
            ...prev,
            [key]: null,
        }));
    };

    const DOCUMENTS = phoneNumber?.startsWith("+91") ?
    [
        {
            key: 'aadhaar',
            docName: 'Aadhaar Card',
            uploadName: 'Aadhaar Card',
            fileFormat: 'PDF only',
            size: '10 MB',
            allowedTypes: ['public.pdf-document'],
            logo: "https://duixj37yn5405.cloudfront.net/appImages/Aadhaar.png",
        },
        {
            key: 'pan',
            docName: 'PAN Card',
            uploadName: 'PAN Card',
            fileFormat: 'PDF / JPG / PNG',
            size: '10 MB',
            allowedTypes: ['public.pdf-document', 'public.jpeg', 'public.png'],
            logo: "https://duixj37yn5405.cloudfront.net/appImages/Pan.png",
        },
        {
            key: 'cheque',
            docName: 'Cancelled Cheque',
            uploadName: 'Cancelled Cheque',
            fileFormat: 'PDF / JPG / PNG',
            size: '10 MB',
            allowedTypes: ['public.pdf-document', 'public.jpeg', 'public.png'],
            logo: "https://duixj37yn5405.cloudfront.net/appImages/Cheque.png",
        },
    ]:
    [
        {
            key: 'cheque',
            docName: 'Goverment Issued Photo Id',
            uploadName: 'Goverment Id',
            fileFormat: 'PDF / JPG / PNG',
            size: '10 MB',
            allowedTypes: ['public.pdf-document', 'public.jpeg', 'public.png'],
            logo: "https://duixj37yn5405.cloudfront.net/appImages/Cheque.png",
        }
    ]


    return (
        <SafeAreaView style={{ flex: 1 }}>
            {profile?.documents?.length === 0 && profile?.verification == false ?
                <ScrollView style={{ backgroundColor: '#FFF' }}>
                    <LinearGradient colors={['#C7E5FD', '#FFFFFF']}
                        style={{ width: width, padding: 20, alignItems: 'center' }}
                    >
                        <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000' }}>Verify Your Profile</Text>
                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#000', marginTop: 15 }}>One quick step to unlock investing</Text>
                        </View>
                    </LinearGradient>

                    {DOCUMENTS.map((item) => {
                        const uploadedFile = uploadedDocs[item.key];
                        // console.log('file: ',uploadedDocs[item.key]);
                        const fileSize = uploadedDocs[item.key]?.size;
                        const size = `${Math.round(fileSize / 1024)} KB`

                        return (
                            <TouchableOpacity
                                disabled={!!uploadedFile}
                                onPress={() => pickDocuments(item)}
                                key={item.key} style={{ margin: 20 }}
                            >
                                <View style={{ borderWidth: 0.7, borderColor: '#000', borderRadius: 10, padding: 20 }}>

                                    {/* Logo */}
                                    <View style={{ position: 'absolute', top: -35, alignSelf: 'center' }}>
                                        <View style={{ backgroundColor: '#FFF', padding: 15 }}>
                                            <Image source={{ uri: item.logo }} style={{ width: 60, height: 30 }} resizeMode="contain" />
                                        </View>
                                    </View>

                                    <Text style={{ fontFamily: 'WorkSans-Regular', color: '#000', textAlign: 'center', marginTop: 10, fontSize: 16 }}>{item.docName}</Text>

                                    <View style={{ borderTopWidth: 0.5, marginVertical: 20 }} />

                                    {/* Upload / File info */}
                                    <View
                                        // disabled={!!uploadedFile}
                                        // onPress={() => pickDocument(item)}
                                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 20 }}>
                                            {uploadedFile && item?.key != "aadhaar" ? 
                                                <View>
                                                    <Image source={{uri: uploadedFile?.uri}} style={{width:60,height:40}}/>
                                                </View>
                                                :
                                                <View style={{ backgroundColor: '#021265', width: 25, height: 25, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Icon name="upload" size={15} color="#FFF" />
                                                </View>
                                            }

                                            <View style={{ marginLeft: 15 }}>
                                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, color: '#000' }}>
                                                    {uploadedFile ? uploadedFile.name : `Upload ${item.uploadName}`}
                                                </Text>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000099', marginTop: 5 }}>
                                                    Allowed: {item.fileFormat}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Delete */}
                                        {uploadedFile && (
                                            <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => deleteDocument(item.key)}>
                                                <Ico name="trash" size={24} color="#000" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                <View style={{ margin: 5 }}>
                                    {uploadedFile ?
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#00000099' }}>File uploaded • {size}</Text>
                                            <Ico name={'checkmark-circle'} size={18} color={'#61dd23ff'} style={{ marginLeft: 8 }} />
                                        </View>
                                        :
                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#00000099' }}>
                                            Size must be less than {item.size}
                                        </Text>
                                    }
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    <TouchableOpacity disabled={isUploading} activeOpacity={0.8} onPress={() => {
                        UploadDoc();
                    }} style={{ backgroundColor: '#021265', padding: 10, borderRadius: 5, alignItems: 'center', marginHorizontal: 20, marginBottom: 100, }}>
                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 18, color: '#FFF' }}> <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 18, color: '#FFF' }}>
        {isUploading ? 'Uploading...' : 'Submit'}
    </Text></Text>

                        {isUploading && (
                            <Animated.View style={[styles.overlay, { width: interpolatedWidth }]} />
                        )}
                    </TouchableOpacity>

                    <Modal visible={showSuccess} modalWidth={{ width }} transparent animationType='fade'>
                        <TouchableOpacity onPress={() => {
                            setShowSuccess(false);
                            navigation.navigate('HomeStack');
                        }} style={{ flex: 1, backgroundColor: '#00000069', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ backgroundColor: '#FFF', width: width * 0.75, alignItems: 'center', padding: 30, borderRadius: 10 }}>
                                <Ico name={'checkmark-circle'} size={45} color={'#61dd23ff'} />
                                <View style={{ marginTop: 15 }}>
                                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000', textAlign: 'center' }}>
                                        <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>Thank you</Text> for uploading your documents. Our team is reviewing them, and verification may take up to <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>1-2 business days.</Text>
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </ScrollView>
                :
                <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                    <LinearGradient colors={['#C7E5FD', '#FFF']}
                        style={{ width: width, padding: 20, alignItems: 'center', height: height * 0.3 }}
                    >
                        <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000' }}>
                                We’ve received your documents!
                            </Text>
                        </View>
                    </LinearGradient>
                    <View style={{ position: 'absolute', top: height * 0.25, alignItems: 'center' }}>
                        <View style={{ alignItems: 'center', marginHorizontal: 50 }}>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#00000099', textAlign: 'center' }}>
                                Verification is in progress and may take up to <Text style={{ fontFamily: 'WorkSans-SemiBold', color: '#000' }}>1-2 business days</Text>
                            </Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Image resizeMode='contain' source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/DocSubmitted.png' }} style={{ width: width * 0.7, height: height * 0.3 }} />
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#000', textAlign: 'center' }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>Thank you</Text> for your patience - you’ll be notified soon.
                            </Text>
                        </View>
                    </View>
                </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        position: 'absolute',
        top: 0, left: 0, bottom: 0, zIndex: 1
    }
})