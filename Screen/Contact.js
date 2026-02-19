import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import IconChat from 'react-native-vector-icons/Ionicons';

export default function Contact() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
      }}>
      <View style={{}}>
        <TouchableOpacity
          style={{
            paddingBottom: 10,
            alignItems: 'flex-end',
            padding: 0,
            margin: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.navigate('Chat');
          }}>
          <View
            style={{
              backgroundColor: '#B9C4CA',
              padding: 18,
              position: 'absolute',
            }}></View>
          <IconChat
            name="chatbubble-ellipses-sharp"
            size={60}
            color="#021265"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
