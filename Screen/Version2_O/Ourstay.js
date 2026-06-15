import React, { useContext, useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import StaggeredList from "@mindinventory/react-native-stagger-view";
import Icon from 'react-native-vector-icons/AntDesign';
import Ico from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { SearchListedHotels } from "./DreamscapeApi";
import { DreamscapeHotels } from "../Services/UserApi";
import { AppContext } from "../Context/AppContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import Property from '../Property';
import { useDispatch, useSelector } from "react-redux";
import { upComingProjectApi } from "../redux/reducer/propertyReducer";
import Back from "../Back";

export default function Ourstay (props){
     const { globalState, setGlobalState } = useContext(AppContext);
    const [SearchLocation,setSearchLocation]=useState(props?.route?.params?.location);
    const navigation = useNavigation();
    const [locationDetails, setLocationDetails] = useState([]);
    const handleListedHotels = async () => {
        let payload = JSON.stringify(
            {
                location:"",
                city: SearchLocation,
                minPrice: null,
                maxPrice: null
            }
        );
        try {
            let {data : res} = await DreamscapeHotels(payload);
            setLocationDetails(res?.hotels);
        } catch (error) {
            console.log("Error in Listed Hotels: ",error);
        }
    };

    useEffect(() => {  
        handleListedHotels();
    },[]);

  return (
    <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
        <StaggeredList
            data={locationDetails}
            numColumns={2} 
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<>
            <Back title={SearchLocation}/>
            <View style={{padding:20}}>
                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000000'}}>Properties in {SearchLocation}</Text>
            </View>
            </> }
            renderItem={({ item }) => {
                // console.log("Render: ",item);
            const randomHeight = Math.floor(Math.random() * 100) + 200; // Random height between 180-280

            return (
                <TouchableOpacity onPress={() => {
                    setGlobalState(prevState => ({
                        ...prevState,
                        HotelUserDetails:{},
                    }));
                    navigation.navigate("SelectRoom", { detail: item })
                }} style={styles.card}>
                    <Image source={{uri: item?.images[0]}} style={[styles.image, { height: randomHeight }]} />

                    <LinearGradient colors={['#0000006B','#9999996B']} style={{paddingHorizontal:10,paddingVertical:7,borderWidth:1,borderColor:'#FFFFFF',position:'absolute',top:15,left:15,borderRadius:20}}>
                        <Text style={{fontFamily:'Montserrat-Bold',fontSize:9,color:'#FFFFFF'}}>{`Rooms from ₹ ${item?.roomsAndCorrespondingPrice[0]?.price} /-`}</Text>
                    </LinearGradient>
                    
                    <View style={{backgroundColor:'#1010104D',padding:7,position:'absolute',bottom:0,width:'100%',paddingHorizontal:10}}>
                        <Text style={styles.title}>{item?.name}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                            <Ico name={'location-pin'} size={10} color={'#FFFFFF'}/>
                            <Text style={styles.location}>{item?.location?.place}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                );
            }}
        />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      borderRadius: 25,
      overflow: "hidden",
      margin: 10,
      elevation: 3, 
    },
    image: {
      width: "100%", 
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    price: {
      backgroundColor: "rgba(0,0,0,0.7)",
      color: "#fff",
      padding: 5,
      borderRadius: 5,
      alignSelf: "flex-start",
      fontSize: 12,
      position:'absolute',
      top:15,
      left:15
    },
    title: {
      fontSize: 14,
      fontFamily:'Montserrat-SemiBold',
      color:'#FFFFFF'
    },
    location: {
      fontFamily:'Montserrat-Regular',
      fontSize: 11,
      color: "#FFFFFF",
    },
  });