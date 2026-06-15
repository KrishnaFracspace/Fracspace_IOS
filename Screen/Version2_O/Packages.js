import { View, Text, TouchableOpacity, Image, Modal, ScrollView, StyleSheet, Alert, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconC from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { handleEnquiryPackage, HandlePackage } from '../Services/UserApi';
import { AppContext } from '../Context/AppContext';
import { useDispatch, useSelector } from 'react-redux';
import { getPackages } from '../redux/reducer/homeReducer';
const { width, height } = Dimensions.get('window');
export default function Packages() {
  const [PackagesData, setPackagesData] = useState([]);
  const { globalState, setGlobalState } = useContext(AppContext);
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [modalVisibleRS, setModalVisibleRS] = useState(false);
  const [PackagId, setPackagId] = useState('');
 const dispatch = useDispatch();
  const packages = useSelector(state => state.home.Get_Packages);
  //console.log(packages,"=======pac")
  useEffect(()=>{
dispatch(getPackages())
  },[])
  const handlePackageData = async () => {
    try {
      let { data: res } = await HandlePackage();
      if (res?.success) {
        setPackagesData(res?.data);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);

      } else if (error?.request) {

      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };
  const HandlePackageEnquiry = async () => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,

    });
    try {
      let { data: res } = await handleEnquiryPackage(payload, PackagId);
      if (res?.success) {
        setLoader(false);
        setModalVisibleRS(false);
        Alert.alert('Thank you!', 'Your booking request is received! Our team will contact you within 1 business day to finalize the details');
        //console.log('Response: ', res);
        //navigation.navigate('HomePage');
      } else {
        console.log('Failed to handle like: ', res.message || res);
      }
    } catch (error) {
      // console.error(
      //   'Error in Liking Property: ',
      //   error.response?.data || error.message,
      // );
    }
  };
  useEffect(() => {
    handlePackageData();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:"#FEFFF2"}}>
      {/* <LinearGradient colors={['#FEFFF2 ', '#FCFDF6','#FAFAFA']} style={{ flex: 1 }}> */}
      <LinearGradient colors={['#FEFFF2', '#FCFDF6', '#FAFAFA']} style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 15,
          width: '100%',
          paddingHorizontal: 15,
        }}>
          <TouchableOpacity style={{ flex: 1 }}
            onPress={() => {
             // navigation.navigate('HomePage');
             navigation.goBack()
          
            }}>
            <IconC name="chevron-back-outline" size={25} color={'#000000'} />
          </TouchableOpacity>
          <Text style={{
            fontSize: 18,
            fontFamily: 'WorkSans-SemiBold',
            color: '#000000',
          }}>
            Premium Stays & Perks
          </Text>
          <View style={{ flex: 1 }}>

          </View>

        </View>
        <ScrollView>
          <Text style={{
            fontSize: 12,
            fontFamily: 'WorkSans-Italic',
            color: '#000000',
            opacity: 0.9,

            paddingHorizontal: 20, paddingVertical: 15,
          }}>
            Discover curated packages combining stays, wellness, dining, and exclusive perks for our co-owners
          </Text>
          {PackagesData.map((item, index) => (<View key={index} style={{ paddingHorizontal: 15, paddingVertical: 15, }}>
            <TouchableOpacity onPress={() => {
              setModalVisibleRS(true);
              setPackagId(item?._id);
            }} style={{ width: '100%', flex: 1, borderColor: PackagId == item?._id ? '#0D1F36' : '#E1E2E4', borderWidth: 1, backgroundColor: '#FFFFFF', padding: 10, borderRadius: 20, marginBottom: 5 }}>
              <Image
                resizeMode='contain'
                source={{ uri: item?.imageUrl }}
                style={{ width: '100%', height: height * 0.2 }}
              />
              <Text style={{
                fontSize: 14,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                paddingHorizontal: 10

              }}>
                {item?.title}
              </Text>
              <Text style={{
                fontSize: 12,
                fontFamily: 'WorkSans-Regular',
                color: '#000000',
                paddingVertical: 10,
                paddingHorizontal: 10

              }}>
                {item?.description}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 5, }}>
                {item?.inclusions.map((item, index) => (
                  <Text key={index} style={{
                    fontSize: 12,
                    //fontFamily: 'WorkSans-Italic',
                    fontWeight: 400,
                    color: '#000000',
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                    flexShrink: 1,
                    flexWrap: 'wrap',
                  }}>
                  {item}  |
                  </Text>
                ))}
              </View>
  <View style={{ borderBottomColor: '#959595', borderBottomWidth: 1, marginHorizontal: 10 }}></View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#000000',
                  paddingHorizontal: 10,
                  width:'80%',
                //  borderWidth:1

                }}>
                  {item?.location}
                </Text>
                <Text style={{
                  fontSize: 14,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#000000',
                  paddingHorizontal: 10

                }}>
                  ₹{item?.amount}
                </Text>
              </View>
            </TouchableOpacity>
          </View>))}
        </ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleRS}
          onRequestClose={() => {
            setModalVisibleRS(false);
          }
          }
        >
          <Pressable style={styles.centeredView} onPress={() =>   setModalVisibleRS(false)}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>


                <Text style={styles.modalTitle}>Almost There!</Text>
                <Text style={styles.modalSubtitle}>
                  Book instantly or talk to our team for custom dates and details
                </Text>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>


                  <TouchableOpacity
                    style={styles.okayButton}
                    onPress={() => {
                      setLoader(true);
                      HandlePackageEnquiry();
                    }}
                  >
                    {loader ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.okayButtonText}>Book Now</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Pressable>
        </Modal>
      </LinearGradient>

    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
   // backgroundColor: 'rgba(0, 0, 0, 0.01)', // Semi-transparent backdrop
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: '#C30202',
    marginTop: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#000000',
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  okayButton: {
    marginTop: 20,
    backgroundColor: '#0D1F36',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    // width: '100%',
    alignItems: 'center'
  },
  okayButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});