import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Pro from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Contact from './Contact';

export default function Footer(props) {
 
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const [activeTab, setActiveTab] = useState(props?.activeFooterTab || 'home');
  return (
    <>
    {/* <Contact/>  */}
    <View style={styles.footerStyle}>
      {activeTab == 'home' ? (
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() => {
           
            setActiveTab(props?.activeFooterTab || 'home');
          }}>
          <Icon name="home" size={22} color="#021265" />
          <Text style={{color: '#021265', fontSize: 12, fontFamily:'Poppins-Medium'}}>
            Home
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
        style={{alignItems: 'center'}}
          onPress={() => {
            // setModalVisible(false);
            setActiveTab('home');
            //navigation.();
            navigation.navigate('HomePage');
          }}>
          <Icon name="home" size={22} color='#484C52' />
          <Text style={{color: '#484C52', fontSize: 12, fontFamily:'Poppins-Medium'}}>
            Home
          </Text>
        </TouchableOpacity>
      )}

      {activeTab == 'like' ? (
        //   <View>
        //     <Icon name="heart" size={36} color="#021265" />
        //   </View>
        <TouchableOpacity
        style={{alignItems: 'center'}}
          onPress={() => {
            // setModalVisible(!modalVisible);
            setActiveTab(props?.activeFooterTab || 'home');
          }}>
          {/* <Icon name="person" size={36} color="#021265" /> */}
          <Icon name="heart" size={22} color="#021265" />
          <Text style={{color: '#021265', fontSize: 12, fontFamily:'Poppins-Medium'}}>
            Saved
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
        style={{alignItems: 'center'}}
          onPress={() => {
            // setModalVisible(false);
            setActiveTab('like');
            navigation.push('Like');

            //navigation.push(Screens.Search);
          }}>
          <Icon name="heart" size={22} color='#484C52' />
          <Text style={{color: '#484C52', fontSize: 12, fontFamily:'Poppins-Medium'}}>
            Saved
          </Text>
        </TouchableOpacity>
      )}

      {activeTab == 'owned' ? (
        <TouchableOpacity
        style={{alignItems: 'center'}}
          onPress={() => {
            // setModalVisible(!modalVisible);
            setActiveTab(props?.activeFooterTab || 'home');
          }}>
          <Pro name="profile" size={22} color="#021265" />
          <Text style={{color: '#021265', fontSize: 12, fontFamily:'Poppins-Medium'}}>
          Portfolio
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
        style={{alignItems: 'center'}}
          onPress={() => {
            //setModalVisible(false);
            setActiveTab('owned');
            navigation.push('Owned');
          }}>
          <Pro name="profile" size={22} color='#484C52' />
          <Text style={{color: '#484C52', fontSize: 12, fontFamily:'Poppins-Medium'}}>
          Portfolio
          </Text>
        </TouchableOpacity>
      )}

      {activeTab == 'User' ? (
        <TouchableOpacity
        style={{alignItems: 'center'}}
          onPress={() => {
            // setModalVisible(!modalVisible);
            setActiveTab(props?.activeFooterTab || 'home');
          }}>
          <Icon name="person" size={22} color="#021265" />
          <Text style={{color: '#021265', fontSize: 12, fontFamily:'Poppins-Medium'}}>
            Profile
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
        style={{alignItems: 'center'}}
          onPress={() => {
            // setModalVisible(!modalVisible),
            setActiveTab('User');
            navigation.push('Profile');
          }}>
          <Icon name="person" size={22} color="#484C52" />
          <Text style={{color: '#484C52', fontSize: 12, fontFamily:'Poppins-Medium'}}>
            Profile
          </Text>
        </TouchableOpacity>
      )}
    </View>
    </>
  );
}
const styles = StyleSheet.create({
  footerStyle: {
    borderTopColor: '#DADADA',
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    // height: 60,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    flex: 1,
    paddingVertical: 12,
    //marginTop:50,
    // backgroundColor: '#F5F5F5',
    backgroundColor: '#fff',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#EBE9EB',
    borderBottomWidth: 4,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
