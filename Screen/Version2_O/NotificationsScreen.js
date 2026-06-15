import { View, Text, Image, ScrollView, TouchableOpacity, Linking, PermissionsAndroid, Platform, Alert, Dimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import Ico from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import moment from 'moment';
import { DeleteNotification, GetAllNotification, MonitorNotification } from '../Services/UserApi';
import { AppContext } from '../Context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeBlobUtil from 'react-native-blob-util';


export default function NotificationsScreen(props) {
    const { globalState, setGlobalState } = useContext(AppContext);
    const [OwnedData, setOwnedData] = useState(globalState?.userDetails?.ownedProperties || [])
    // console.log("DTA: ",globalState?.userDetails?.ownedProperties);
    const [notification, setNotification] = useState([]);
    const navigation = useNavigation();
    const {width, height} = Dimensions.get('window');
    const [expandedItems, setExpandedItems] = useState({});
    const appVersion = '2.1.9';
    const liveVersion = globalState?.liveVersion;

    useEffect(() => {
        FetchAllNotification();
    }, []);
    
    // useFocusEffect(
    //     useCallback(() => {
    //         FetchAllNotification();
    //     }, [])
    // );

    const FetchAllNotification = async () => {
        let payload = JSON.stringify(
            {
                email: globalState?.userEmail
            }
        );
        try {
            let { data: res } = await GetAllNotification(payload);
            // console.log(res);
            const filteredNumbers = OwnedData.filter(number => number?.propertyDetails?.name == 'FRACSPACE ABODE-II');
            const filteredNumbers1 = OwnedData.filter(number => number?.propertyDetails?.name == 'FRACSPACE ABODE-I');
            if (filteredNumbers?.length == 0 || filteredNumbers1?.length == 0) {
                const filteredNumbers = res?.data.filter(number => number?.relatedTo != 'FRACSPACE ABODE-II' && number?.relatedTo != 'FRACSPACE ABODE-I');
                // console.log(filteredNumbers);
                setNotification(filteredNumbers);

            } else {
                setNotification(res?.data);
            }
        } catch (error) {
            console.error("Error in Fetching All Notification: ", error);
        }
    }

    const deleteNotification = async(notificationId) => {
        let payload = JSON.stringify({
            notificationId: notificationId
        });
        console.log("Payload: ", payload);
        try {
            let {data: res} = await DeleteNotification(payload);
            if(res?.success){
                console.log("Notification deleted successfully");
            }
        } catch (error) {
            console.log('Error in deleting notification: ', error?.response?.message || error?.response?.data);
        }
    }

    const handleNotification = async (notificationId, item) => {
        let payload = JSON.stringify(
            {
                notificationId: notificationId,
                email: globalState?.userEmail,
                type: "click"
            }
        );
        // console.log(payload);

        try {
            let { data: res } = await MonitorNotification(payload);
            //  let { data: res } = await Like(payload);
            // console.log("Reponse Monitor: ", res);
            const fileUrl = item?.buttonLink;
            if (res?.success) {
                if (item?.relatedTo === 'newsletter') {
                    downloadFile(fileUrl);
                } else if (item?.relatedTo == 'FRACSPACE ABODE-I') {
                    if (globalState?.userDetails?.verification) {
                        //handleNotification(notificationId);
                        const filteredNumbers = OwnedData.filter(number => number?.propertyDetails?.name == 'FRACSPACE ABODE-I');
                        navigation.navigate('Dashboard', { ownedProDetails: filteredNumbers[0] });
                    }
                } else if (item?.relatedTo == 'FRACSPACE ABODE-II') {
                    if (globalState?.userDetails?.verification) {
                       // handleNotification(notificationId);
                        const filteredNumbers = OwnedData.filter(number => number?.propertyDetails?.name == 'FRACSPACE ABODE-II');
                        //  console.log('check', filteredNumbers);
                        navigation.navigate('Dashboard', { ownedProDetails: filteredNumbers[0] });
                    }
                } else if (item?.relatedTo == 'Stories') {
                   // handleNotification(notificationId);
                    navigation.navigate('Blogs', { Blogfor: 'VaranasiBlog' });
                } else if (item?.relatedTo == 'Wallet') {
                   // handleNotification(notificationId);
                    navigation.navigate('WalletAmount');
                } else if (item?.relatedTo == 'appUpdate') {
                    //handleNotification(notificationId,item);
                    Linking.openURL(item?.sourceLink);
                    if(appVersion == liveVersion){
                        deleteNotification(notificationId);
                    }
                } else if (item?.relatedTo == 'inAppNav') {
                    navigation.navigate(item?.screen);
                } else {
                    Linking.openURL(item?.buttonLink);
                }
            }
        } catch (error) {
            console.error("Error in Monitoring Notification: ", error);
            if (error?.response) {
                console.log('Response Error', `${error?.response?.data?.message}`);
                Alert.alert('Response Error', `${error?.response?.data?.message}`);
            } else if (error?.request) {
                console.log('Response Error', `${error?.request?.data?.message}`);
                Alert.alert('Request error:', 'Please Check Your Internet Connection');
            } else {
                Alert.alert('Error:', `${error?.message}`);
            }
        }
    }

    const unreadCount = notification.filter(item =>
        !item.buttonClicks.some(click => click.email === globalState?.userEmail)
    )?.length;

    const filteredNotifications = notification.filter(item => {
        const createdDate = moment(item.date || item.createdAt);
        const daysDiff = moment().diff(createdDate, 'days');

        return daysDiff <= 45;
    });

    const groupedNotifications = {};

    filteredNotifications.forEach(item => {
        const date = moment(item.date || item.createdAt);
        const today = moment();
        const yesterday = moment().subtract(1, 'days');

        let sectionTitle;
        if (date.isSame(today, 'day')) {
            sectionTitle = 'Today';
        } else if (date.isSame(yesterday, 'day')) {
            sectionTitle = 'Yesterday';
        } else {
            sectionTitle = date.format('MMMM D, YYYY');
        }

        if (!groupedNotifications[sectionTitle]) {
            groupedNotifications[sectionTitle] = [];
        }

        groupedNotifications[sectionTitle].push(item);
    });


    // const downloadFile = async (fileUrl, fileName = 'downloaded_file.pdf') => {
    //     try {
    //         // Ask for permission on Android < 13 (API 33)
    //         const isAndroid = Platform.OS === 'android';
    //         const androidVersion = Platform.Version;

    //         if (isAndroid && androidVersion < 33) {
    //             const granted = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //                 {
    //                     title: 'Storage Permission Required',
    //                     message: 'App needs access to your storage to download files',
    //                     buttonNeutral: 'Ask Me Later',
    //                     buttonNegative: 'Cancel',
    //                     buttonPositive: 'OK',
    //                 }
    //             );

    //             if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //                 Alert.alert('Permission Denied', 'Storage permission is required to save the file.');
    //                 return;
    //             }
    //         }

    //         // Save to public Downloads folder (visible in file manager)
    //         const downloadDest = isAndroid
    //             ? `${RNFS.DownloadDirectoryPath}/${fileName}`
    //             : `${RNFS.DocumentDirectoryPath}/${fileName}`;

    //         const options = {
    //             fromUrl: fileUrl,
    //             toFile: downloadDest,
    //         };

    //         const result = await RNFS.downloadFile(options).promise;

    //         if (result.statusCode === 200) {
    //             Alert.alert('Success', `File saved to: ${downloadDest}`);
    //         } else {
    //             Alert.alert('Failed', `Download failed with code: ${result.statusCode}`);
    //         }
    //     } catch (err) {
    //         console.error('Download error:', err);
    //         Alert.alert('Error', err.message);
    //     }
    // };

    const downloadFile = async (fileUrl, fileName = 'news_letter.pdf') => {
        try{
            console.log('Downloading =>', fileUrl);
            const {config, fs } = ReactNativeBlobUtil;
            const downloads = fs.dirs.DownloadDir;
            const path = `${downloads}/${fileName}`;
            const res = await config({
                fileCache: true,
                appendExt: 'pdf',
                path,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    title: fileName,
                    description: 'Downloading file...',
                    mime: 'application/pdf',
                    mediaScannable: true,
                    path,
                },
            }).fetch('GET', fileUrl);
            console.log('File saved: ', res?.path());
            Alert.alert('Download Complete', 'File saved in Downloads folder');
        }catch(error) {
            console.log('Download Error => ', error);
            Alert.alert('Download Failed: ', error?.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
            <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
                {notification?.length === 0 ?
                    <View style={{flex:1,backgroundColor:'#FFF',alignItems:'center'}}>
                        <LinearGradient colors={['#C7E5FD', '#FFF']} style={{width: width, height: height*0.3,padding:20,}}>
                            <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-between',paddingVertical:20}}>
                                <TouchableOpacity onPress={() => {
                                    navigation.goBack();
                                }}>
                                    <Icon name={'chevron-left'} size={20} color={'#000'}/>
                                </TouchableOpacity>
                                <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#000'}}>Notification</Text>
                                <View/>
                            </View>
                        </LinearGradient>
                        <View style={{position:'absolute',top:height*0.2,alignItems:'center'}}>
                            <Image resizeMode='contain' source={{uri: "https://duixj37yn5405.cloudfront.net/appImages/NoNotification.png"}} style={{width:width*0.55,height:height*0.25}}/>
                            <View style={{alignItems:'center'}}>
                                <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#000'}}>No Notifications</Text>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:13,color:'#00000099',marginTop:10}}>There are no notifications yet</Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                navigation.goBack();
                            }} style={{backgroundColor:'#021265',padding:10,paddingHorizontal:35,borderRadius:30,alignItems:'center',marginTop:20}}>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:16,color:'#FFF'}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <>
                        <View style={{ backgroundColor: '#FFFFFF', padding: 20, flexDirection: 'row', alignItems: 'center', elevation: 5 }}>
                            <TouchableOpacity onPress={() => {
                                // navigation.navigate('HomePage');
                                navigation.goBack();
                            }}>
                                <Icon name={'chevron-left'} size={20} color={'#000000'} />
                            </TouchableOpacity>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#505050', marginLeft: 20 }}>Notifications</Text>
                            {unreadCount > 0 &&
                                <View style={{ width: 30, height: 30, borderRadius: 30, backgroundColor: '#F6F6F6', borderColor: '#E4E1E2', alignItems: 'center', marginLeft: 10, borderWidth: 1, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#5F5F5F' }}>{unreadCount}</Text>
                                </View>
                            }
                        </View>

                        <ScrollView style={{}}>
                            {Object.entries(groupedNotifications)?.map(([sectionTitle, sectionItems]) => (
                                <View key={sectionTitle}>
                                    <View style={{ marginVertical: 10, marginTop: 30, paddingHorizontal: 20 }}>
                                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#0000009C' }}>{sectionTitle}</Text>
                                    </View>

                                    {sectionItems?.map((item, index) => {
                                        const notificationId = item?._id;
                                        const fileUrl = item?.buttonLink;
                                        const isUnread = !item.buttonClicks.some(click => click.email === globalState?.userEmail);

                                        const words = item?.description?.split(' ') || [];
                                        const isLong = words.length > 20;
                                        const isExpanded = expandedItems[item._id];

                                        const displayText = isLong && !isExpanded
                                            ? words.slice(0, 20).join(' ') + '...'
                                            : item?.description;

                                        return (
                                            <View key={index}>
                                                <View style={{
                                                    flexDirection: 'row', padding: 20,
                                                    backgroundColor: item?.relatedTo === 'alert' ? '#F418182E' : ''
                                                }}>
                                                    <View style={{ backgroundColor: '#021265', borderColor: '#DCDCDC', borderWidth: 1, width: 50, height: 50, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Image source={require('../assets/Logo.png')} style={{ width: 45, height: 45 }} />
                                                        {isUnread &&
                                                            <View style={{ backgroundColor: '#11B414', width: 10, height: 10, borderRadius: 10, borderColor: '#FFFFFF', borderWidth: 1, position: 'absolute', right: 0, bottom: 3 }} />
                                                        }
                                                    </View>

                                                    <View style={{ paddingHorizontal: 10,flex:1 }}>
                                                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>
                                                                {item?.title}
                                                            </Text>

                                                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 11, color: '#000000AD' }}>
                                                                • {moment(item.date || item.createdAt).fromNow()}
                                                            </Text>
                                                        </View>
                                                        {/* <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000B8', marginTop: 5 }}>
                                                            {item?.description}
                                                        </Text> */}

                                                        <View style={{flex:1, justifyContent: 'space-between', alignItems: 'flex-end', flexDirection:'row' }}>
                                                            <View style={{flex:1}}>
                                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000B8', marginTop: 5 }}>
                                                                    {displayText}
                                                                </Text>

                                                                {isLong && (
                                                                    <TouchableOpacity
                                                                        onPress={() =>
                                                                            setExpandedItems(prev => ({
                                                                                ...prev,
                                                                                [item._id]: !prev[item._id],
                                                                            }))
                                                                        }
                                                                    >
                                                                        <Text style={{color: '#0424CB',fontSize: 12,marginTop: 3,fontFamily: 'WorkSans-SemiBold'}}>
                                                                            {isExpanded ? 'Show less' : 'Read more'}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                )}
                                                            </View>

                                                            {item?.buttonText &&
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        handleNotification(notificationId, item);
                                                                        FetchAllNotification();
                                                                    }}
                                                                    style={{ backgroundColor: '#0424CB', borderColor: '#0421B4', borderWidth: 1, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 10, width: 80,alignItems:'center' }}
                                                                >
                                                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 10, color: '#FFFFFF' }}>{item?.buttonText}</Text>
                                                                </TouchableOpacity>
                                                            }
                                                        </View>
                                                        
                                                    </View>

                                                    
                                                </View>
                                                <View style={{ borderTopColor: '#F0EFFB', borderTopWidth: 1 }} />
                                            </View>
                                        );
                                    })}
                                </View>
                            ))}

                        </ScrollView>
                    </>
                }
            </View>
        </SafeAreaView>
    )
}