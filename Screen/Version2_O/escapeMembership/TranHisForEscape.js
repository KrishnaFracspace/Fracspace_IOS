import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const TranHisForEscape = (props) => {
    const [transactionHis, setTransactionHis] = useState(props?.route?.params?.data);
    const navigation = useNavigation();

    const formatIndianAmount = (amount) => {
        if (amount == null) return '0';
        return Number(amount).toLocaleString('en-IN');
    };

    const formatDateTime = isoDate => {
        if (!isoDate) return '';
        const date = new Date(isoDate);

        const pad = n => (n < 10 ? '0' + n : n);

        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = pad(date.getMinutes());
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedTime = pad(hours) + ':' + minutes + ampm;

        return `${day}/${month}/${year} | ${formattedTime}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FAF6F0"
            />
            <ImageBackground 
                source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/BGHome.png' }} 
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.backContainer}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                                <Ionicons name="chevron-back" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000',marginLeft:25}}>Transactions</Text>
                        <View style={{ width: 60 }} />
                    </View>

                    {/* Transaction Cards */}
                    {transactionHis?.map((item, index) => {
                        const dateStr = formatDateTime(item?.createdAt || item?.paymentProof?.paidAt);
                        const fullPaidDate = formatDateTime(item?.fullAmountPaidDate || item?.paymentProof?.paidAt);
                        
                        let badgeBg = '#DB00040D';
                        let badgeBorder = '#DB0004';
                        let badgeTextColor = '#DB0004';
                        let badgeText = item?.status || '';

                        if (item?.status === 'active') {
                            badgeBg = '#15803D0D';
                            badgeBorder = '#15803D';
                            badgeTextColor = '#15803D';
                            badgeText = 'Active';
                        } else if (item?.status === 'inProgress' || item?.status === 'inProcessing') {
                            badgeBg = '#FEF3C780';
                            badgeBorder = '#D97706';
                            badgeTextColor = '#D97706';
                            badgeText = 'In-Progress';
                        } else if (item?.status === 'rejected') {
                            badgeBg = '#DB00040D';
                            badgeBorder = '#DB0004';
                            badgeTextColor = '#DB0004';
                            badgeText = 'Rejected';
                        }

                        const bookingAmt = item?.paymentProof?.bookingAmount || item?.investmentPlan?.bookingAmount || 0;
                        const totalAmt = item?.principalAmount || item?.investmentPlan?.minimumInvestment || 0;
                        const balanceAmt = item?.principalAmount;

                        const planName = item?.investmentPlan?.name 
                            ? `${item?.investmentPlan?.name}` 
                            : 'Escape Membership';

                        return (
                            <View key={index} style={styles.cardContainer}>
                                <View style={styles.card}>
                                    {/* Card Header Row */}
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>{planName}</Text>
                                        <View style={[styles.badge, { backgroundColor: badgeBg, borderColor: badgeBorder }]}>
                                            <Text style={[styles.badgeText, { color: badgeTextColor }]}>{badgeText}</Text>
                                        </View>
                                    </View>

                                    {/* Timeline */}
                                    <View style={styles.timelineRow}>
                                        <View style={styles.timelineIndicatorColumn}>
                                            {/* Point 1 Icon */}
                                            <View style={[
                                                styles.timelineDot,
                                                { backgroundColor: item?.status != 'inProgress' && item?.status != 'active' ? '#EF4444' : '#15803D' }
                                            ]}>
                                                <Ionicons name={item?.status != 'inProgress' && item?.status != 'active' ? 'close' : 'checkmark'} size={12} color="#FFF" />
                                            </View>

                                            {/* Connector Line */}
                                            <View style={styles.timelineLine} />

                                            {/* Point 2 Icon */}
                                            <View style={[
                                                styles.timelineDotOuter,
                                                { 
                                                    borderColor: item?.status === 'active' ? '#15803D' : '#000',
                                                    backgroundColor: item?.status === 'active' ? '#15803D' : '#FFF'
                                                }
                                            ]}>
                                                {item?.status === 'active' ? (
                                                    <Ionicons name="checkmark" size={10} color="#FFF" />
                                                ) : null}
                                            </View>
                                        </View>

                                        {/* Content details */}
                                        <View style={{ flex: 1 }}>
                                            {/* Point 1 content */}
                                            <View style={styles.timelineContentRow}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.timelineTitle}>
                                                        {item?.status != 'inProgress' && item?.status != 'active' ? 'Booking Amount Failed' : 'Booking Amount Paid'}
                                                    </Text>
                                                    <Text style={styles.timelineSubtitle}>
                                                        ID: {item?.paymentProof?.txnId || 'N/A'}
                                                    </Text>
                                                    {item?.status == 'inProgress' || item?.status == 'active' ? (
                                                        <Text style={styles.timelineDate}>
                                                            Paid on {dateStr}
                                                        </Text>
                                                    ) : (
                                                      <Text style={styles.failedTimelineDate}>
                                                            Failed on {dateStr}
                                                      </Text>
                                                    )}
                                                </View>
                                                <Text style={styles.timelinePrice}>
                                                    ₹{formatIndianAmount(bookingAmt)}
                                                </Text>
                                            </View>

                                            {/* Vertical Space */}
                                            <View style={{ height: 25 }} />

                                            {/* Point 2 content */}
                                            <View style={styles.timelineContentRow}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.timelineTitle}>Balance Amount</Text>
                                                    <Text style={styles.timelineSubtitle}>
                                                        {item?.status === 'active' ? `Paid on ${fullPaidDate}` : 'Status: Payment Due'}
                                                    </Text>
                                                </View>
                                                {/* {item?.status === 'active' && ( */}
                                                    {/* <Text style={styles.timelinePrice}>
                                                        ₹{formatIndianAmount(balanceAmt)}
                                                    </Text> */}
                                                {/* )} */}
                                            </View>
                                        </View>
                                    </View>

                                    {/* Action button inside card */}
                                    {/* <TouchableOpacity
                                        onPress={() => {
                                            if (item?.status === 'active' || item?.status === 'inProgress') {
                                                navigation.navigate('PaymentSuccessEscape', { paymentData: item });
                                            } else {
                                                navigation.navigate('PaymentFailedEscape', { paymentData: item });
                                            }
                                        }}
                                        style={styles.detailsBtn}
                                    >
                                        <Text style={styles.detailsText}>VIEW DETAILS</Text>
                                    </TouchableOpacity> */}
                                </View>

                                {/* Bottom message if payment is inProgress */}
                                {/* {(item?.status === 'inProgress' || item?.status === 'inProcessing') && (
                                    <View style={styles.warningContainer}>
                                        <Text style={styles.warningTitle}>Remaining Amount Due</Text>
                                        <Text style={styles.warningText}>
                                            Pay the remaining <Text style={styles.warningAmountBold}>₹{formatIndianAmount(balanceAmt)}</Text> to unlock your membership benefits.
                                        </Text>
                                    </View>
                                )} */}
                            </View>
                        );
                    })}
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default TranHisForEscape;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF6F0',
    },
    header: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
    },
    backContainer: {
        alignItems: 'flex-start',
    },
    backBtn: {
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyLabel: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#AC935C',
        marginTop: 2,
    },
    headerTitle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginRight: 20,
    },
    cardContainer: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    card: {
        backgroundColor: '#F7F7F7',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontFamily: 'WorkSans-Medium',
        fontSize: 14,
        color: '#000',
        textTransform: 'uppercase',
        flexShrink: 1,
    },
    badge: {
        borderWidth: 0.5,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    badgeText: {
        fontFamily: 'WorkSans-Medium',
        fontSize: 10,
    },
    timelineRow: {
        flexDirection: 'row',
    },
    timelineIndicatorColumn: {
        alignItems: 'center',
        marginRight: 15,
    },
    timelineDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineDotOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#D1D5DB',
        marginVertical: 4,
        minHeight: 45,
    },
    timelineContentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    timelineTitle: {
        fontFamily: 'WorkSans-Medium',
        fontSize: 14,
        color: '#000',
    },
    timelineSubtitle: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 12,
        color: '#00000080',
        marginTop: 4,
    },
    timelineDate: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 10,
        color: '#188C16',
        fontStyle: 'italic',
        marginTop: 4,
    },
    failedTimelineDate: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 10,
        color: '#EF4444',
        fontStyle: 'italic',
        marginTop: 4,
    },
    timelinePrice: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginLeft: 10,
    },
    detailsBtn: {
        alignSelf: 'flex-end',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#AC935C33',
        backgroundColor: '#FAF8F4',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsText: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 12,
        fontWeight: '700',
        color: '#775A19',
    },
    warningContainer: {
        paddingHorizontal: 10,
        marginTop: 15,
        marginBottom: 5,
    },
    warningTitle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 13,
        fontWeight: '700',
        color: '#EF4444',
    },
    warningText: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 12,
        color: '#4B5563',
        marginTop: 4,
        lineHeight: 18,
    },
    warningAmountBold: {
        fontFamily: 'WorkSans-SemiBold',
        color: '#000',
        fontWeight: '600',
    },
});