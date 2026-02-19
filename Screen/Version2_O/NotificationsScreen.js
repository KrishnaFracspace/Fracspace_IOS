import React, { useContext, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  PermissionsAndroid,
  Platform,
  Alert,
  Dimensions,
  StyleSheet,
  FlatList,
} from 'react-native';
import moment from 'moment';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from '../Context/AppContext';
import { fetchAllNotifications } from '../redux/reducer/homeReducer';
import { MonitorNotification } from '../Services/UserApi';

const HEADER_HEIGHT = 60;

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { globalState } = useContext(AppContext);
  const { width, height } = Dimensions.get('window');
  const notifications = useSelector(state => state.home.notifications);
  const loading = useSelector(state => state.home.loading);
  const OwnedData = globalState?.userDetails?.ownedProperties || [];

  useEffect(() => {
    dispatch(fetchAllNotifications({ email: globalState?.userEmail }));
  }, []);


  const filteredNotifications = useMemo(() => {
    if (!notifications?.length) return [];

    const hasI = OwnedData.some(
      n => n?.propertyDetails?.name === 'FRACSPACE ABODE-I');
    const hasII = OwnedData.some(
      n => n?.propertyDetails?.name === 'FRACSPACE ABODE-II');
    if (!hasI || !hasII) {
      return notifications.filter(
        n =>
          n?.relatedTo !== 'FRACSPACE ABODE-I' &&
          n?.relatedTo !== 'FRACSPACE ABODE-II'
      );
    }
    return notifications;
  }, [notifications, OwnedData]);

  const unreadCount = filteredNotifications.filter(
    item =>
      !item.buttonClicks.some(
        click => click.email === globalState?.userEmail
      )
  ).length;


  const groupedData = useMemo(() => {
    const groups = {};
    filteredNotifications.forEach(item => {
      const date = moment(item.date || item.createdAt);
      let title = date.isSame(moment(), 'day')
        ? 'Today'
        : date.isSame(moment().subtract(1, 'day'), 'day')
        ? 'Yesterday'
        : date.format('MMMM D, YYYY');
      if (!groups[title]) groups[title] = [];
      groups[title].push(item);
    });

    return Object.entries(groups).map(([sectionTitle, data]) => ({
      sectionTitle,
      data,
    }));
  }, [filteredNotifications]);

 
  const handleNotification = async notificationId => {
    try {
      await MonitorNotification(
        JSON.stringify({
          notificationId,
          email: globalState?.userEmail,
          type: 'click',
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const downloadFile = async (url, name = 'file.pdf') => {
    try {
      if (Platform.OS === 'android' && Platform.Version < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }
      const path =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${name}`
          : `${RNFS.DocumentDirectoryPath}/${name}`;

      await RNFS.downloadFile({ fromUrl: url, toFile: path }).promise;
      Alert.alert('Downloaded', path);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={22} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Notifications</Text>

      {unreadCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      ) : (
        <View style={{ width: 30 }} />
      )}
    </View>
  );

const Skeleton = () => (
  <FlatList
    data={[1, 2, 3, 4, 5]}
    keyExtractor={i => i.toString()}
    contentContainerStyle={{
      paddingTop: HEADER_HEIGHT + 10,
      paddingBottom: 30,
    }}
    renderItem={() => (
      <View style={styles.skeletonCard}>
        <View style={styles.skeletonIcon} />
        <View style={styles.skeletonText}>
          <View style={styles.skeletonLineLarge} />
          <View style={styles.skeletonLineSmall} />
        </View>
      </View>
    )}
  />
);

  const renderSection = ({ item }) => (
    <View>
      <Text style={styles.sectionTitle}>{item.sectionTitle}</Text>

      {item.data.map(n => {
        const isUnread = !n.buttonClicks.some(
          c => c.email === globalState?.userEmail
        );

        return (
          <View key={n._id}>
            <View style={styles.card}>
              <View style={styles.iconWrap}>
                <Image
                  source={require('../assets/Logo.png')}
                  style={styles.icon}
                />
                {isUnread && <View style={styles.dot} />}
              </View>

              <View style={styles.textWrap}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.desc}>{n.description}</Text>
              </View>

              <View style={styles.right}>
                <Text style={styles.time}>
                  • {moment(n.date || n.createdAt).fromNow()}
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    handleNotification(n._id);
                    if (n.relatedTo === 'newsletter') downloadFile(n.buttonLink);
                    else if (n.sourceLink) Linking.openURL(n.sourceLink);
                  }}
                >
                  <Text style={styles.buttonText}>{n.buttonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />
          </View>
        );
      })}
    </View>
  );

  const EmptyState = () => (
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
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* <Header /> */}

      {loading ? (
        <Skeleton />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState />
      ) : (
        <>
        <Header/>
        <FlatList
          data={groupedData}
          keyExtractor={item => item.sectionTitle}
          renderItem={renderSection}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={5}
          windowSize={7}
        />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    elevation: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  listContainer: { paddingBottom: 30 },
  sectionTitle: {
    marginTop: 30,
    marginBottom: 10,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#0000009C',
    fontFamily: 'WorkSans-SemiBold',
  },
  card: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#021265',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { width: 45, height: 45 },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#11B414',
    borderRadius: 5,
    position: 'absolute',
    right: 0,
    bottom: 2,
  },
  textWrap: { flex: 1, paddingHorizontal: 10 },
  title: { fontSize: 15, fontFamily: 'WorkSans-SemiBold' },
  desc: { fontSize: 12, color: '#000000B8', marginTop: 5 },
  right: { alignItems: 'flex-end', justifyContent: 'space-between' },
  time: { fontSize: 11, color: '#000000AD' },
  button: {
    marginTop: 10,
    backgroundColor: '#0424CB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: { fontSize: 10, color: '#FFF' },
  divider: { height: 1, backgroundColor: '#F0EFFB' },
  skeletonCard: {
    flexDirection: 'row',
    padding: 20,
  },
  skeletonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EAEAEA',
  },
  skeletonText: { flex: 1, paddingHorizontal: 10 },
  skeletonLineLarge: {
    height: 14,
    width: '70%',
    backgroundColor: '#EAEAEA',
    borderRadius: 6,
  },
  skeletonLineSmall: {
    height: 10,
    width: '90%',
    backgroundColor: '#EAEAEA',
    borderRadius: 6,
    marginTop: 8,
  },
  empty: {
    alignItems: 'center',
    marginTop: -1,
  },
  emptyImg: { width: 220, height: 180 },
  emptyTitle: { fontSize: 20, marginTop: 10 },
  emptyDesc: { fontSize: 13, color: '#00000099' },
});
