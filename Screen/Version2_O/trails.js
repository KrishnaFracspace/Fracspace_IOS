import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { altairaIcon } from '../assets';

const EdgeFab = ({ scrollY }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [hidden, setHidden] = useState(false);
  const navigation = useNavigation();
  const [modalVisible,setModalVisible] = useState(false)

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      if (value > 20 && !hidden) {
        hideFab();
      } else if (value < 10 && hidden) {
        showFab();
      }
    });

    return () => scrollY.removeListener(listener);
  }, [hidden]);

  const hideFab = () => {
    setHidden(true);
    Animated.timing(translateX, {
      toValue: 80,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const showFab = () => {
    setHidden(false);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
     <View style={styles.container}>
      {hidden && (
        <TouchableOpacity
          style={styles.edgeTab}
          onPress={showFab}
          activeOpacity={0.8}>
          <Icon name="chevron-left" size={26} color="#fff" />
        </TouchableOpacity>
      )}
      <Animated.View
        style={[
          styles.fab,
          { transform: [{ translateX }] },
        ]}>  
        <TouchableOpacity activeOpacity={0.8} onPress={() => setModalVisible(true)}>
          <Image source={altairaIcon}/>
        </TouchableOpacity>
      </Animated.View> 
    </View>

<Modal
  animationType="fade"
  transparent
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}>
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalText}>Hello</Text>
       <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.navigate('')}>
        <Text style={styles.closeText}>View Concept Plan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => setModalVisible(false)}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
  </TouchableWithoutFeedback>
</Modal>
    </> 
  );
};

export default EdgeFab;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    position: 'absolute',
    right: 0,
    bottom: 100,
    alignItems: 'flex-end',
  },

  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    marginRight: 3,
  },

  edgeTab: {
    position: 'absolute',
    right: 0,
    width: 28,
    height: 54,
    backgroundColor: '#000',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalBox: {
  width: '80%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  alignItems: 'center',
  elevation: 10,
},

modalText: {
  fontSize: 18,
  marginBottom: 20,
  color: '#000',
},

closeBtn: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: '#021265',
  borderRadius: 8,
},

closeText: {
  color: '#fff',
  fontWeight: '600',
},

});

