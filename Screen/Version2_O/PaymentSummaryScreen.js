import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Property from '../Property';

const PaymentSummaryScreen = ({ route }) => {
    const navigation = useNavigation();
    const { success, message, property, txnId, bookingData } = route.params;
    const totalAmount = route?.params?.totalAmount;
const location = route?.params?.location;
 const taxAmount = route?.params?.taxAmount;
 const Number = route?.params?.Number;      
 const baseAmount = route?.params?.baseAmount;
  const bookingId = route?.params?.bookingId;      
 const time = route?.params?.time;
    const isSuccess = success;
   
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.header}>Payment Summary</Text>
                <View style={{ height: '90%', justifyContent: "space-between" }}>
                    <View style={styles.shadowWrapper}>
                        <LinearGradient colors={['rgba(199, 229, 253, 0.5)', '#FFF', '#FFF']} style={styles.gradientCard}>
                            {/* Status Card */}
                            <View style={styles.statusCard}>
                                <View
                                    style={[
                                        styles.iconCircle,
                                        { backgroundColor: isSuccess ? '#021265' : '#FF0004' },
                                    ]}>
                                    <Text style={styles.iconText}>
                                        {isSuccess ? '✓' : '✕'}
                                    </Text>
                                </View>

                                <Text style={styles.statusTitle}>
                                    {isSuccess ? 'Payment Successful' : 'Payment Failed'}
                                </Text>

                                <Text style={[styles.statusSubtitle,{color: isSuccess
                                                ? '#000'
                                                : '#F8181C',}]}>
                                    {isSuccess
                                        ? 'Congratulations - your frac is now confirmed'
                                        : 'The booking was unsuccessful.'}
                                </Text>
                                
                                {/* Property Card */}
                                <View style={styles.propertyCard}>
                                    <View>
                                        <Image
                                            source={{
                                                uri:property?.image?.Image1
                                            }}
                                            style={styles.propertyImage}
                                        />
                                        <Text style={{ fontSize: 11, fontFamily: "Work Sans", paddingTop: 5 }}>{time}</Text>
                                    </View>

                                    <View style={styles.propertyDetails}>
                                        <Text style={styles.propertyTitle}>
                                            {property?.name || '-'} 
                                        </Text>
                                        <Text style={styles.propertyText}>
                                            Location: {location || '-'}
                                        </Text>
                                        <Text style={styles.propertyText}>
                                            No. of Fracs: {Number}
                                        </Text>
                                        <Text style={styles.propertyText}>
                                            Booking ID: { bookingId } 
                                        </Text>

                                        <View
                                            style={[
                                                styles.badge,
                                                {
                                                    backgroundColor: isSuccess
                                                        ? 'rgba(200, 221, 186, 0.3)'
                                                        : 'rgba(253, 219, 219, 0.4)',
                                                },
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.badgeText,
                                                    {
                                                        color: isSuccess
                                                            ? 'rgba(105, 161, 67, 1)'
                                                            : '#F8181C',
                                                    },
                                                ]}>
                                                {isSuccess ? 'Frac Reserved' : 'Booking Failed'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Price Details */}
                            <View style={styles.priceCard}>
                                <Text style={styles.priceHeader}>Price details</Text>
                                <View style={styles.priceCard2}>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceLabel}>Booking Amount</Text>
                                        <Text style={styles.priceValue}>₹{baseAmount?.toLocaleString('en-IN')}</Text>
                                    </View>

                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceLabel}>No of Fracs</Text>
                                        <Text style={styles.priceValue}>{Number}</Text>
                                    </View>

                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceLabel}>Tax & GST Charges</Text>
                                        <Text style={styles.priceValue}>₹{property?.offer ? property?.gstAmount + property?.platformFeeAmount : taxAmount?.toLocaleString('en-IN')}</Text>
                                    </View>

                                    <View style={[styles.priceRow, styles.totalRow, { borderBottomWidth: 0 }]}>
                                        <Text style={[styles.totalLabel, {
                                            color: isSuccess
                                                ? '#000'
                                                : '#F8181C',
                                        },]}>Total Amount</Text>
                                        <Text
                                            style={[
                                                styles.totalValue,
                                                {color: isSuccess ? '#111' : 'rgba(235, 44, 25, 1)' },
                                            ]}>
                                            ₹{totalAmount?.toLocaleString('en-IN')}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.transactionText}>
                                    Transaction ID: {txnId}
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    <View>
                        {/* {isSuccess && (
                            <TouchableOpacity style={styles.secondaryButton} onPress={() => {
                                Alert.alert("It will be update soon")
                            }}>
                                <Text style={styles.secondaryButtonText}>
                                    Download Receipt
                                </Text>
                            </TouchableOpacity>
                        )} */}
<Text style={[styles.statusSubtitle, {
                                    color: isSuccess
                                        ? 'rgba(105, 161, 67, 1)'
                                        : '#F8181C',
                                },]}>{message} </Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace("BottomNavigations")}>
                            <Text style={styles.primaryButtonText}>
                                Back to Home
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PaymentSummaryScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        //backgroundColor: '#F8FAFC',
    },
    header: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: "Work Sans"
    },

    statusCard: {
        // backgroundColor: '#EAF1FB',
        borderRadius: 16,
        padding: 10,
        marginBottom: 20,
    },

    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },

    iconText: {
        color: '#FFF',
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: "Work Sans",
        fontWeight: 'bold'
    },

    statusTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: "Work Sans"
    },

    statusSubtitle: {
        textAlign: 'center',
        fontSize: 12,
        color: '#021265',
        marginVertical: 8,
        fontFamily: "Work Sans"
    },

    propertyCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 10,
        marginTop: 15,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0, 0, 0, 0.5)'
    },
    priceCard2: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0, 0, 0, 0.5)',
        // backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 10,
        marginTop: 15,
    },
    propertyImage: {
        width: 140,
        height: 100,
        borderRadius: 8,
    },

    propertyDetails: {
        flex: 1,
        marginLeft: 10,
    },

    propertyTitle: {
        fontWeight: '600',
        fontSize: 12,
        marginBottom: 4,
        fontFamily: "Work Sans",
    },

    propertyText: {
        fontSize: 12,
        //color: '#6B7280',
        paddingVertical: 2,
        fontFamily: "Work Sans"
    },

    badge: {
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },

    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        fontFamily: "Work Sans"
    },

    priceCard: {
        // backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 10,
        marginBottom: 6,
    },

    priceHeader: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        fontFamily: "Work Sans"
    },

    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
        borderBottomColor: '#E5E7EB',
        borderBottomWidth: 1,
        borderBottomStyle: 'dashed',
        paddingBottom: 4
    },

    priceLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: "Work Sans"
    },

    priceValue: {
        fontSize: 13,
        fontWeight: '500',
        fontFamily: "Work Sans"
    },

    totalRow: {
        marginTop: 10,
    },

    totalLabel: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: "Work Sans"
    },

    totalValue: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: "Work Sans"
    },

    transactionText: {
        marginTop: 12,
        fontSize: 12,
        fontWeight: 500,
        color: 'rgba(0, 0, 0, 1)',
        fontFamily: "Work Sans",

    },

    primaryButton: {
        backgroundColor: '#021265',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },

    primaryButtonText: {
        color: '#FFF',
        fontWeight: '600',
    },

    secondaryButton: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },

    secondaryButtonText: {
        fontWeight: '600',
        color: '#111',
        fontFamily: "Work Sans"
    },

    shadowWrapper: {
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 20,
    },

    gradientCard: {
        borderRadius: 10,
        padding: 15,
    },
});