import { Dimensions, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState }  from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/Feather';
import Icc from 'react-native-vector-icons/Entypo';
import Ic from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';

export default function PackageDescription(){

    const {width, height} = Dimensions.get('window');
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [selectedDates, setSelectedDates] = useState({});
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [guestModal, setGuestModal] = useState(false);
    const [numOfAdult, setNumOfAdult] = useState(1);
    const [numOfChildren, setNumOfChildren] = useState(0);
    const [visible2, setVisible2] = useState(false);

    const toggleAddOn = (addOn) => {
        setSelectedAddOns(prev =>
            prev.includes(addOn)
                ? prev.filter(item => item !== addOn)
                : [...prev, addOn]
        );
    };

    const handleDayPress = (day) => {
        const date = day.dateString;

        if (!checkInDate || (checkInDate && checkOutDate)) {
            // Set new check-in date and reset check-out
            setCheckInDate(date);
            setCheckOutDate(null);
            setSelectedDates({ [date]: { startingDay: true, color: "#f5a623", textColor: "#fff" } });
        } else if (!checkOutDate && moment(date).isAfter(checkInDate)) {
            // Set check-out date
            setCheckOutDate(date);
            highlightRange(checkInDate, date);
        }
    };

    // Highlight selected range
    const highlightRange = (start, end) => {
        let range = {};
        let currentDate = moment(start);

        while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
            const dateStr = currentDate.format("YYYY-MM-DD");
            range[dateStr] = {
                color: dateStr === start ? "#f5a623" : dateStr === end ? "#f5a623" : "#ffe4b2",
                textColor: "#fff",
                startingDay: dateStr === start,
                endingDay: dateStr === end,
            };
            currentDate.add(1, "day");
        }
        setSelectedDates(range);
        setShowCalendar(!showCalendar);
    };

    return(
        <SafeAreaView style={{flex:1}}>
            <ScrollView style={{backgroundColor:'#fafafa'}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                    <Icon name={'chevron-back'} size={20} color={'#000'}/>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Premium Stays & Perks</Text>
                    <View style={{width:20}}/>
                </View>

                <View style={{padding:20}}>
                    <Image resizeMode='cover' source={{uri:'https://d1nj26fz89n9xw.cloudfront.net/fracspace_properties_images/VIDA/AV_1.jpg'}} style={{width:width*0.9, height:180}}/>
                    <View style={{marginTop:10}}>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>Serenity stay package</Text>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',marginTop:5}}>
                            Relax and rejuvenate with a complimentary Tiamoz spa session during your luxurious Dreamscape stay, and let every moment refresh your body and mind.
                        </Text>
                    </View>
                    <View style={{marginTop:15}}>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>Highlights</Text>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:12}}>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>🛏 Stay    |</Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',marginLeft:15}}>🧘 Wellness    |</Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',marginLeft:15}}>🍽 Food</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:15}}>
                        <TouchableOpacity onPress={() => {
                            setShowCalendar(true);
                        }} style={{flex:1}}>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#000'}}>Date</Text>
                            <View style={{borderColor:'#00000080',borderRadius:20,paddingHorizontal:12,paddingVertical:10,flexDirection:'row',alignItems:'center',borderWidth:0.5,marginTop:10}}>
                                <Icon name={'calendar-outline'} size={18} color={'#000'}/>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#0D1E36',marginLeft:10}}>
                                    {checkInDate ? moment(checkInDate).format("DD") : "Choose Date"} - {''}
                                    {checkOutDate && moment(checkOutDate).format("DD MMM ")}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,marginLeft:15}} onPress={() => setGuestModal(true)}>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#000'}}>Guest</Text>
                            <View style={{borderColor:'#00000080',borderRadius:20,paddingHorizontal:12,paddingVertical:10,flexDirection:'row',alignItems:'center',borderWidth:0.5,marginTop:10}}>
                                <Icon name={'calendar-outline'} size={18} color={'#000'}/>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#0d1e36',marginLeft:10}}>
                                    {numOfAdult == 0 ? '' : `${numOfAdult} Adult`}
                                    {numOfChildren == 0 ? '' : ` . ${numOfChildren} Children `}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{backgroundColor:'#0F1130',padding:14,borderRadius:26,alignItems:'center',marginTop:18}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#FFF'}}>Check Availabilty </Text>
                            <Ico name={'search'} size={15} color={'#FFF'}/>
                        </View>
                    </View>
                    <View style={{borderColor:'#00000080',borderWidth:0.5,marginVertical:20}}/>
                    <View>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>What’s Included</Text>

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',paddingTop:12}}>
                            ◦ <Text style={{fontFamily:'WorkSans-Medium'}}>Stay</Text> - 1 Night at Dreamscape luxury stay {'\n'}
                            ◦ <Text style={{fontFamily:'WorkSans-Medium'}}>Wellness</Text> - 60-min spa session at Tiamoz {'\n'}
                            ◦ <Text style={{fontFamily:'WorkSans-Medium'}}>Food</Text> - Complimentary breakfast & drinks
                        </Text>
                    </View>

                    <View style={{marginTop:15}}>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>Add-Ons</Text>
                        <TouchableOpacity onPress={() => toggleAddOn('pickup')} style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                            {selectedAddOns.includes('pickup') ?
                                <Icon name={'checkbox'} size={20} color={'#52A348'}/>
                                :
                                <Icon name={'square-outline'} size={20} color={'#52A348'}/>
                            }
                            <Text style={{fontFamily:'WorkSans-Italic',fontSize:12,color:'#000',marginLeft:15}}>Airport Pickup - ₹700</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleAddOn('drop')} style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                            {selectedAddOns.includes('drop') ?
                                <Icon name={'checkbox'} size={20} color={'#52A348'}/>
                                :
                                <Icon name={'square-outline'} size={20} color={'#52A348'}/>
                            }
                            <Text style={{fontFamily:'WorkSans-Italic',fontSize:12,color:'#000',marginLeft:15}}>Airport Drop - ₹700</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleAddOn('pickupDrop')} style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                            {selectedAddOns.includes('pickupDrop') ?
                                <Icon name={'checkbox'} size={20} color={'#52A348'}/>
                                :
                                <Icon name={'square-outline'} size={20} color={'#52A348'}/>
                            }
                            <Text style={{fontFamily:'WorkSans-Italic',fontSize:12,color:'#000',marginLeft:15}}>Airport Pickup & Drop - ₹1,200</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop:15}}>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>Map View</Text>
                        <Image  
                            resizeMode='cover' borderRadius={20}
                            source={{uri:'https://d1nj26fz89n9xw.cloudfront.net/fracspace_properties_images/VIDA/locationImage.jpeg'}}
                            style={{width:width*0.9, height:150, borderRadius:20, marginTop:15}}
                        />
                    </View> 
                </View>
                <View style={{backgroundColor:'#f4f4f4',padding:20,alignItems:'center',flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:15,color:'#000',textAlign:'center'}}>
                            ₹9200/N {'\n'}
                            <Text style={{color:'#00000080'}}>+ taxes & fees</Text>
                        </Text>
                    </View>
                    <View style={{backgroundColor:'#0F1130',borderRadius:6,padding:10,alignItems:'center',flex:1}}>
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#fff'}}>Book Now</Text>
                    </View>
                </View>

                <Modal visible={showCalendar} transparent animationType='fade'>
                  <View style={{flex:1,backgroundColor:'#000000B3'}}>
                    <TouchableOpacity onPress={() => {
                        setShowCalendar(false);
                    }} style={{flex:1}}/>
                    <View style={{position:'absolute',bottom:0,right:0,left:0, backgroundColor: '#FFFFFF', paddingHorizontal: 30, paddingTop: 10,paddingBottom:40, borderWidth: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, alignItems: 'center' }}>
                            <View style={{ flex: 1 }}></View>
                            <Text style={{ flex: 1, fontFamily: 'Montserrat-SemiBold', fontSize: 17, color: '#000000' }}>Select Date</Text>
                            <TouchableOpacity style={{ paddingVertical: 5, flex: 1, alignItems: 'flex-end' }} onPress={() => {
                                setShowCalendar(!showCalendar);
                            }}>
                                <Icc name={'cross'} size={20} color={'#000000'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{}}>
                            <Calendar
                                onDayPress={handleDayPress}
                                markingType="period"
                                markedDates={selectedDates}
                                minDate={moment().format("YYYY-MM-DD")}
                            />
                        </View>
                    </View>
                  </View>
                </Modal>

                <Modal transparent animationType='fade' visible={guestModal} modalStyle={{ width: '100%' ,}}>
                    <View style={{flex:1, backgroundColor:'#000000B3'}}>
                    <TouchableOpacity onPress={() => {
                        setGuestModal(false);
                    }} style={{flex:1}}/>
                        <ScrollView style={{position:'absolute', left:0,right:0,bottom:0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, }}>
                            <View>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#000000' }}>Select Numbers of Guests</Text>
                            </View>
                            <View style={{ paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 16, color: '#000000' }}>Adults</Text>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#262626CC' }}>Age 18 or above</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: 100, justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={() => {
                                        if (numOfAdult> 0)
                                            setNumOfAdult(numOfAdult- 1);
                                    }} style={{ borderWidth: 0.6, borderColor: '#62626233', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                        <Ic name={'minus'} size={15} color={'#0D2038'} />
                                    </TouchableOpacity>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000' }}>{numOfAdult}</Text>
                                    <TouchableOpacity onPress={() => {
                                        if (numOfAdult< 20)
                                            setNumOfAdult(numOfAdult+ 1);
                                    }} style={{ borderWidth: 0.6, borderColor: '#62626233', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#AC935C' }}>
                                        <Ic name={'plus'} size={15} color={'#FFF'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 16, color: '#000000' }}>Children</Text>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#262626CC' }}>Age 0-17 years old</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: 100, justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={() => {
                                        if (numOfChildren> 0)
                                            setNumOfChildren(numOfChildren- 1);
                                    }} style={{ borderWidth: 0.6, borderColor: '#62626233', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                        <Ic name={'minus'} size={15} color={'#0D2038'} />
                                    </TouchableOpacity>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000' }}>{numOfChildren}</Text>
                                    <TouchableOpacity onPress={() => {
                                        if (numOfChildren< 20)
                                            setNumOfChildren(numOfChildren+ 1);
                                    }} style={{ borderWidth: 0.6, borderColor: '#62626233', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#AC935C' }}>
                                        <Ic name={'plus'} size={15} color={'#FFF'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                setGuestModal(!guestModal);
                            }} style={{marginBottom:20, backgroundColor: '#AC935C', borderRadius: 30, padding: 10, alignItems: 'center', marginHorizontal: 60, marginVertical: 20 }}>
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Apply</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    )
}