import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from "react-native-video";
import { useDispatch, useSelector } from 'react-redux';
import { altairaPropertyPromo } from '../../redux/reducer/propertyReducer';
import { AppContext } from '../../Context/AppContext';
import { UploadEnquiry } from '../../Services/UserApi';
import HomeSkeleton from '../../components/HomeSkeleton';

const AltairaExperience = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
    const { globalState } = useContext(AppContext);
  const Properties = useSelector(state => state.property.altairaPromoData);
  const loading = useSelector(state => state.property.loading);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userData = useSelector(state => state.profile?.user);

  useEffect(() => {
    dispatch(altairaPropertyPromo())
  }, [])

// Send the enquiry first; show the thank-you modal only if it succeeded.
const interestButton = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);
  try {
    const payload = JSON.stringify({
      name: globalState?.userName || userData?.userName,
      email: globalState?.userEmail || userData?.email,
      phoneNumber: globalState?.userDetails?.phoneNumber || userData?.phoneNumber,
      message: "Interested",
    });
    const { data: res } = await UploadEnquiry(payload);
    if (res?.success) {
      setShowModal(true);
    } else {
      Alert.alert("Error", res?.message || "Please try again");
    }
  } catch (error) {
    console.log("FAILED RESPONSE ===>", error);
    Alert.alert("Error", error?.response?.data?.message || error?.message || "Please try again");
  } finally {
    setIsSubmitting(false);
  }
};

  const block1 = Properties?.block1
  const block2 = Properties?.block2
  const block3 = Properties?.block3
  const block4 = Properties?.block4
  const block5 = Properties?.block5
  const block6 = Properties?.block6
// console.log(block5,"=====55")

  if (loading || !Properties || Object.keys(Properties)?.length === 0) {
    return <HomeSkeleton />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroContainer}>
        {block1?.video ? (
          <Video
            source={{ uri: block1?.video }}
            style={styles.heroMedia}
            resizeMode="cover"
            repeat
            muted
            paused={false}
            ignoreSilentSwitch="obey"
          />
        ) : (
          <><Text>Enter Image from Backend</Text></>
          // <Image
          //   source={{ uri: block1.image || "https://images.unsplash.com/photo-1501785888041-af3ef285b470" }}
          //   style={styles.heroMedia}
          // />
        )}

        {/* Overlay content */}
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Icon name="chevron-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.heroTitle}>{block1?.subTitle}</Text>
          <Text style={styles.heroSubtitle}>{block1?.description}</Text>
        </View>
      </View>

   
      {block2 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {block2?.heading.toUpperCase()}
          </Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={block2?.PropertyHighlights}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }) => (
              <View style={styles.highlightImageBg}>
                {item?.fileType === "video" ? (
                  <Video
                    source={{ uri: item?.file }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                    repeat
                    muted
                    paused={false}
                  />
                ) : (
                  <ImageBackground
                    source={{ uri: item.file }}
                    style={StyleSheet.absoluteFill}
                    imageStyle={styles.highlightImageStyle}
                  />
                )}
                <View style={styles.imageShade} />
                <View style={styles.imageTextContainer}>
                  <Text style={styles.imageTitle}>
                    {item?.title}
                  </Text>
                  <Text style={styles.imageDesc}>
                    {item?.description}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      )}


      {!block3?.hide && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
            THE ALTAIRA EXPERIENCE
          </Text>

          <Text style={[styles.experienceTitle1, { textAlign: "center" }]}>
            {block3?.heading}
          </Text>

          <FlatList
            data={block3?.highlights}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View>
                <View style={styles.experienceRow}>
                  <View style={styles.iconWrapper}>
                    <Image source={{ uri: item?.icon }} style={styles.icon} />
                  </View>

                  <View style={styles.textWrapper}>
                    <Text style={styles.experienceTitle}>{item?.title}</Text>
                    <Text style={styles.experienceDesc}>{item?.description}</Text>
                  </View>
                </View>

                {index !== block3?.highlights.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            )}
          />
        </View>
      )}

      {!block4?.hide && (
        <View style={styles.section1}>
          <Text style={[styles.sectionTitle, { textAlign: "center" }]}>{block4?.heading.toUpperCase()}</Text>
          <Text style={[styles.experienceTitle1, { textAlign: "center" }]}>{block4?.subHeading}</Text>
          <Text style={{ fontSize: 12, color: "rgba(0, 0, 0, 1)", textAlign: "center", lineHeight: 20, fontFamily: "WorkSans-Regular" }}>Experience the private unveiling of Altaira - a curated livestream revealing the master vision, architecture, and philosophy behind the destination.</Text>
          <TouchableOpacity onPress={() => {
            navigation.navigate(block4?.screen, {liveStreamUrl: block4?.liveStreamUrl})
          }} style={styles.ctaButton}>
            <Text style={styles.ctaText}>{block4?.button} →</Text>
          </TouchableOpacity>
        </View>
      )}

      {!block5?.hide && (
        <View style={[styles.section1,{paddingTop:0}]}>
          <Text style={[styles.sectionTitle]}>{block5?.heading.toUpperCase()}</Text>
          <ImageBackground source={{ uri:block5?.logo}} style={{ height: 200, width: '100%', borderRadius: 10, alignItems: "center" }} imageStyle={styles.imageStyle}>
            <Text style={{top:40,color:"#fff",fontFamily:"WorkSans-Medium",fontSize:14}}>{block5?.subHeading}</Text>
            <TouchableOpacity onPress={()=> navigation.navigate("PdfViewer",{pdf:block5?.conceptPlan})} style={{ top: 130, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.2)", padding: 10, width: 100,borderRadius:5 }}>
              <Text style={styles.ctaText}>{block5?.button}</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )}

      {/* {!block6.hide && (
  <View style={[styles.section1, { marginBottom: 40 }]}>
    <Text style={[styles.sectionTitle,{textAlign:"center"}]}>{[block6.subHeading.toUpperCase()]}</Text>
    <Text style={styles.experienceTitle1}>{block6.title}</Text>

    <TouchableOpacity style={styles.ctaButton}>
      <Text style={styles.ctaText}>{block6.button}</Text>
    </TouchableOpacity>
  </View>
)} */}
    {!block6?.hide && (
      <View style={styles.section1}>
        <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
         {block6?.heading}
        </Text>

        <Text style={styles.contactDesc}>{block6?.subHeading} </Text>

        <TouchableOpacity
         disabled={isSubmitting}
         onPress={() => interestButton()}
          style={[
            styles.ctaButton,
            { backgroundColor: "rgba(99, 78, 54, 1)", marginBottom: 20 }
          ]}
        >
          <Text style={styles.ctaText}>{block6?.button} →</Text>
        </TouchableOpacity>
      </View>
      )}

     
<Modal
  visible={showModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      
      {/* Green Tick */}
      <View style={styles.tickCircle}>
        <Icon name="check" size={40} color="#fff" />
      </View>

      <Text style={styles.thankYouText}>Thank you!</Text>
      <Text style={styles.subText}>
        Thank you for your interest. We’ll get back to you soon.
      </Text>

      <TouchableOpacity
        style={styles.okButton}
        onPress={() => setShowModal(false)}
      >
        <Text style={styles.okText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </ScrollView>
    </SafeAreaView>
  );
};

export default AltairaExperience;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  /* ================= HERO (BLOCK 1) ================= */
  heroContainer: {
    height: 420,
    backgroundColor: "#000",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 32,
  },

  backBtn: {
    position: "absolute",
    top: -220,
    left: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#E5E7EB",
    maxWidth: "90%",
  },

  heroContainer: {
    height: 420,
    backgroundColor: "#000",
  },

  heroMedia: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 32,
  },

  backBtn: {
    position: "absolute",
    top: -220,
    left: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#E5E7EB",
  },
  /* ================= SECTION COMMON ================= */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  section1: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center"
  },

  sectionTitle: {
    fontSize: 16,
    letterSpacing: 1.8,
    color: "rgba(7, 38, 67, 0.65)",
    
    marginBottom: 8,
    fontFamily: "WorkSans-SemiBold"
  },

  sectionCenterTitle: {
    textAlign: "center",
  },
  /* ================= PROPERTY HIGHLIGHTS (BLOCK 2) ================= */
  highlightImageStyle: {
    borderRadius: 10,
  },

  // imageShade: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(0,0,0,0.35)", // soft fade
  //   borderRadius: 10,
  // },
  highlightImageBg: {
    width: 190,
    height: 135,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "#000",
    marginRight: 5,
  },
  highlightImageStyle: {
    borderRadius: 10,
  },

  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  imageTextContainer: {
    padding: 16,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    fontFamily: "Cormorant Garamond"
  },
  imageDesc: {
    fontSize: 9,
    lineHeight: 8,
    color: "#E5E7EB",
  },

  /* ================= EXPERIENCE (BLOCK 3) ================= */
  experienceTitle1: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 15,
    fontFamily: "Cormorant Garamond",
    textAlign: "center"
  },

  experienceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 18,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(231, 210, 173, 0.15)", // earthy luxury tone
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: "#111827",
  },
  textWrapper: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(99, 78, 54, 1)",
    marginBottom: 6,
  },
  experienceDesc: {
    fontSize: 11,
    lineHeight: 21,
    color: "#6B7280",
    fontWeight: 400
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 62,
  },
  /* ================= CTA / BUTTONS (BLOCK 4,5,6) ================= */
  ctaButton: {
    marginTop: 18,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: 170
  },
  ctaText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  /* ================= BLOCK 5 (CONCEPT / BRANDING) ================= */
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logoImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginBottom: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  logoSubText: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: "#6B7280",
  },
  imageStyle: {
    borderRadius: 10, // Apply the border radius to the image itself
  },

  /* ================= FINAL CTA SPACING ================= */
  bottomSpace: {
    height: 40,
  },
  contactDesc: {
    fontSize: 12,
    
    color: "rgba(0,0,0,1)",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "WorkSans-Regular",
    marginVertical: 6,
  },
  //Modal.....
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalContainer: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 25,
  alignItems: 'center',
},

tickCircle: {
  width: 70,
  height: 70,
  borderRadius: 35,
  backgroundColor: '#28a745',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 15,
},

thankYouText: {
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 8,
  color: '#000',
},

subText: {
  fontSize: 14,
  textAlign: 'center',
  color: '#555',
  marginBottom: 20,
},

okButton: {
  backgroundColor: '#28a745',
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 25,
},

okText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},


});

