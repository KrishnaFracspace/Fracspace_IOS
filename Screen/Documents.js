import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from './Context/AppContext';
import Icon from 'react-native-vector-icons/Feather';
import IconArr from 'react-native-vector-icons/AntDesign';
const {width, height} = Dimensions.get('window');
import {useNavigation} from '@react-navigation/native';
import Back from './Back';
import Pdficon from 'react-native-vector-icons/FontAwesome5';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Documents() {
  const navigation = useNavigation();
  const {globalState, setGlobalState} = useContext(AppContext);
  const [Docs, setDocs] = useState(globalState?.userDetails?.documents);
  const [PanDoc, setPanDoc] = useState('');
  const [AadharDoc, setAadharDoc] = useState('');
  const [ChequeDoc, setChequeDoc] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [SelectPic, setSelectPic] = useState(0);
  const first = () => {
    for (let index = 0; index < Docs.length; index++) {
      if (Docs[index].includes('pan')) {
        setPanDoc(Docs[index]);
      } else if (Docs[index].includes('aadhar')) {
        setAadharDoc(Docs[index]);
      } else {
        setChequeDoc(Docs[index]);
      }
    }
  };

  useEffect(() => {
    first();
    //handleProperties();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{backgroundColor: '#f5f7fe', flex: 1, width: '100%'}}>
        <Back title={'Documentation'} />
        {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
          paddingVertical: 15,
          paddingHorizontal: 20,
          // borderBottomColor:'#043862',
          //borderBottomWidth:1,
          backgroundColor: 'white',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile');
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#043862',
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
              width: 30,
              borderRadius: 30,
              marginRight: 10,
            }}>
            <Icon name="arrow-left" size={22} color="white" />
          </View>
          <Text style={{color: '#043862', fontSize: 16, fontWeight: '500'}}>
            Back
          </Text>
        </TouchableOpacity>
       
      </View> */}
        {globalState?.userDetails?.phoneNumber.startsWith('+91') &&
        globalState?.userDetails?.phoneNumber.length == 13 ? (
          <>
            <View style={{padding: 20}}>
              <TouchableOpacity
                //   key={index}
                style={{
                  width: '100%',
                  borderRadius: 20,
                  borderColor: '#DADADA',
                  borderWidth: 1,
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  marginBottom: 20,
                }}
                onPress={() => {
                  // setModalVisible(!modalVisible);
                  // setSelectPic(1);

                  //  const name = item?.name;
                  navigation.navigate('DisplayDoc', {
                    Link: AadharDoc,
                    screen: 'Doc',
                  });
                }}>
                <Pdficon name="file-pdf" size={100} color="#D2042D" />

                <View style={{paddingLeft: 10, width: '55%'}}>
                  <Text
                    style={{
                      color: '#1E2135',
                      fontSize: 16,
                      fontFamily: 'OpenSans-Bold',
                      paddingVertical: 2,
                    }}>
                    Aadhar Card
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                //   key={index}
                style={{
                  width: '100%',
                  borderRadius: 20,
                  borderColor: '#DADADA',
                  borderWidth: 1,
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  marginBottom: 20,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setSelectPic(1);
                }}>
                <Image
                  style={{
                    width: width * 0.3,
                    height: 100,
                    borderRadius: 15,
                  }}
                  source={
                    PanDoc != ''
                      ? {uri: PanDoc}
                      : require('./assets/Rectangle63692.png')
                  }
                />

                <View style={{paddingLeft: 10, width: '55%'}}>
                  <Text
                    style={{
                      color: '#1E2135',
                      fontSize: 16,
                      fontFamily: 'OpenSans-Bold',
                      paddingVertical: 2,
                    }}>
                    Pan Card
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                //   key={index}
                style={{
                  width: '100%',
                  borderRadius: 20,
                  borderColor: '#DADADA',
                  borderWidth: 1,
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  marginBottom: 20,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setSelectPic(2);
                }}>
                <Image
                  style={{
                    width: width * 0.3,
                    height: 100,
                    borderRadius: 15,
                  }}
                  source={
                    ChequeDoc != ''
                      ? {uri: ChequeDoc}
                      : require('./assets/Rectangle63691.png')
                  }
                />

                <View style={{paddingLeft: 10, width: '55%'}}>
                  <Text
                    style={{
                      color: '#1E2135',
                      fontSize: 16,
                      fontFamily: 'OpenSans-Bold',
                      paddingVertical: 2,
                    }}>
                    Cancelled Cheque
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <TouchableOpacity
                style={styles.centeredView}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (SelectPic - 1 == 0) {
                        setSelectPic(2);
                      } else {
                        setSelectPic(SelectPic - 1);
                      }
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                      }}
                      source={require('./assets/LeftArrow.png')}
                    />
                  </TouchableOpacity>
                  {SelectPic == 1 && (
                    <Image
                      style={{
                        width: '90%',
                        height: 200,
                        borderRadius: 10,
                        marginHorizontal: 5,
                      }}
                      source={
                        PanDoc != ''
                          ? {uri: PanDoc}
                          : require('./assets/Rectangle63692.png')
                      }
                    />
                  )}

                  {SelectPic == 2 && (
                    <Image
                      style={{
                        width: '90%',
                        height: 200,
                        borderRadius: 10,
                        marginHorizontal: 5,
                      }}
                      source={
                        ChequeDoc != ''
                          ? {uri: ChequeDoc}
                          : require('./assets/Rectangle63691.png')
                      }
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      if (SelectPic + 1 > 2) {
                        setSelectPic(1);
                      } else {
                        setSelectPic(SelectPic + 1);
                      }
                    }}>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                      }}
                      source={require('./assets/RigthArrow.png')}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        ) : (
          <View style={{padding: 20}}>
            <TouchableOpacity
              //   key={index}
              style={{
                width: '100%',
                borderRadius: 20,
                borderColor: '#DADADA',
                borderWidth: 1,
                padding: 5,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: 'white',
                marginBottom: 20,
              }}
              onPress={() => {
                navigation.navigate('DisplayDoc', {
                  Link: AadharDoc,
                  screen: 'Doc',
                });
              }}>
              <Pdficon name="file-pdf" size={100} color="#D2042D" />

              <View style={{paddingLeft: 10, width: '55%'}}>
                <Text
                  style={{
                    color: '#1E2135',
                    fontSize: 16,
                    fontFamily: 'OpenSans-Bold',
                    paddingVertical: 2,
                  }}>
                  Government Issued Photo ID
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    backgroundColor: '#000000',
    opacity: 0.8,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
