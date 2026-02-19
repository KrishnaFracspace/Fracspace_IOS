import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { altairaIcon, altairaImgIcon, modalImg } from '../../assets';
import { panoramic, rise, wellness } from '../assets';
import { useDispatch, useSelector } from 'react-redux';
import { altairaPropertyPromo } from '../../redux/reducer/propertyReducer';

const { width } = Dimensions.get('window');

const EdgeFab = ({ scrollY }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [hidden, setHidden] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const Properties = useSelector(state => state.property.altairaPromoData);
  const loading = useSelector(state => state.property.loading);
  const [showModal, setShowModal] = useState(false);
  const userData = useSelector(state => state.profile?.user);

  useEffect(() => {
    dispatch(altairaPropertyPromo())
  }, [])
  //console.log(Properties?.stage2?.bannerImage, "====prop=====")
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      if (value > 20 && !hidden) hideFab();
      else if (value < 10 && hidden) showFab();
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
      {/* FAB */}
      <View style={styles.container}>
        {hidden && (
          <TouchableOpacity style={styles.edgeTab} onPress={showFab}>
            <Icon name="chevron-left" size={26} color="#fff" />
          </TouchableOpacity>
        )}

        <Animated.View style={[styles.fab, { transform: [{ translateX }] }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setModalVisible(true)}
            style={styles.fabButton}
          >
            <Image
              source={{ uri: Properties?.stage1?.logo }}
              style={styles.fabLogo}
            //resizeMode='contain'
            />
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
            <TouchableWithoutFeedback>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('AltairaExperience');
                }}
              >
                {Properties?.stage2?.bannerImage ? (
                  <Image
                    source={{ uri: Properties.stage2.bannerImage }}
                    style={styles.modalBanner}
                    resizeMode="cover"
                  />
                ) : null}
              </TouchableOpacity>


              {/* <View style={styles.centerCard}>
                
            
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={18} color="#fff" />
                </TouchableOpacity>

           
                <Image
                  source={modalImg}
                  style={styles.cardImage}
                />

                <View style={styles.heroText}>
                  <Text style={styles.heroTitle}>Above Elsewhere</Text>
                  <Text style={styles.heroDesc}>
                    A rare hilltop sanctuary where lifestyle, land,
                    and long-term value rise together.
                  </Text>
                </View>

<View style={{backgroundColor:"rgba(234, 221, 196, 0.1)"}}> 
   
                <View style={styles.iconRow}>
                  <View style={styles.iconItem}>
                    <Image source={rise} style={styles.iconImg} />
                    <Text style={styles.iconText}>Appreciation</Text>
                    <Text style={styles.iconSub}>Long-term lifestyle value</Text>
                  </View>

                  <View style={styles.iconItem}>
                    <Image source={panoramic} style={styles.iconImg} />
                    <Text style={styles.iconText}>Panoramic</Text>
                    <Text style={styles.iconSub}>270° Valleys & Clouds</Text>
                  </View>

                  <View style={styles.iconItem}>
                    <Image source={wellness} style={styles.iconImg} />
                    <Text style={styles.iconText}>Wellness</Text>
                    <Text style={styles.iconSub}>World-class spa & dining</Text>
                  </View>
                </View>

              
                <Text style={styles.title}>ALTARIA – ABOVE THE CLOUDS</Text>
                <Text style={styles.desc}>
                 Altaira is a 26-acre integrated hill destination that blends luxury hospitality, private ownership, and conscious investment into one seamless experience. 
                </Text>

            
                <TouchableOpacity
                  style={styles.cta}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('AltairaExperience');
                  }}
                >
                  <Text style={styles.ctaText}>View Details →</Text>
                </TouchableOpacity>
</View>
             

              </View>  */}

            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default EdgeFab;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 1,
    bottom: 150,
    alignItems: 'flex-end',
  },

  fab: {
    position: "absolute",
    right: 7,
    top: "45%",
  },

  fabButton: {
    height: 72,
    width: 72,
    borderRadius: 36,
    backgroundColor: "#000", // 👈 logo visible
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "grey",
    // iOS shadow
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    // Android shadow
    elevation: 10,
  },
  fabLogo: {
    width: 65,
    height: 65,
    resizeMode: "contain",
  },
  edgeTab: {
    position: 'absolute',
    right: -1,
    width: 30,
    height: 75,
    backgroundColor: 'rgba(34, 30, 31, 1)',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

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

  cardImage: {
    width: '100%',
    height: 260,
  },

  heroText: {
    position: 'absolute',
    top: 130,
    padding: 16,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },

  heroDesc: {
    fontSize: 11,
    color: '#fff',
    marginTop: 4,
  },

  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -30,
    paddingHorizontal: 9,
  },

  iconItem: {
    backgroundColor: '#fff',
    padding: 9,
    borderRadius: 12,
    alignItems: 'center',
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  iconImg: {
    width: 28,
    height: 28,
    marginBottom: 4,
  },
  iconText: {
    fontSize: 11,
    fontWeight: '600',
  },

  iconSub: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    paddingHorizontal: 15,
    color: 'rgba(7, 38, 67, 0.65)',
    // marginTop: -30,
  },

  desc: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 1)',
    paddingHorizontal: 16,
    marginVertical: 8,
  },

  cta: {
    backgroundColor: '#C6A66A',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    margin: 16,
  },

  ctaText: {
    color: '#fff',
    fontWeight: '600',
  },

  backBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalBanner: {
    width: width * 0.9,
    height: 500,
    borderRadius: 20,
  },
});
