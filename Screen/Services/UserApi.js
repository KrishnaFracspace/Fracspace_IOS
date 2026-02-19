import axios from 'axios';
export const Registration = async payload => {
  return await axios.post('https://apitest.fracspace.com/api/users/userRegisterationWithoutPassword', payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};
export const Login = async payload => {
    return await axios.post('https://apitest.fracspace.com/api/users/login', payload,{
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'
      },
    });
};

export const forgotPassword = async payload => {
  return await axios.put('https://apitest.fracspace.com/api/users/forgotpassword', payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const EnquireDetails = async payload => {
  return await axios.post('https://apitest.fracspace.com/api/users/enquiry', payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const ProfileDetails = async (payload,token) => {
  return await axios.post('https://apitest.fracspace.com/api/users/profile', payload,{
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const PropertyDetails = async () => {
  return await axios.get('https://apitest.fracspace.com/api/users/getPropertyDetails',{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const LikeData = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/interestedProperties',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const Like = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/addLike',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const DisLike = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/removeLike',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const SiteVisit = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/site-visit',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const ProfilePic = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/uploadProfilePic',payload,{
    headers: {
      'content-type': 'multipart/form-data',
      'x-api-key': 'Fracspace@2024'
      
    },
  });
};

export const ProfileVerification = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/verification',payload,{
    headers: {
      'content-type': 'multipart/form-data',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const Verification = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/verification1',payload,{
    headers: {
      'content-type': 'multipart/form-data',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const UserChat = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/saveChatHistory',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const ChatHistory = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/getSavedChatHistory',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const PropertyBook = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/reviewData',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const SiteVisitHistory = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/getSiteVisitDetails',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const DeleteAccount = async (payload) => {
  console.log(payload);
  return await axios.post('https://apitest.fracspace.com/api/users/deleteUserByEmail',payload,{
    headers: {
    'x-api-key': 'Fracspace@2024', 
    'Content-Type': 'application/json', 
    'apiKey': 'Fracspace@2024'
    },
  });
};

export const SendOTP = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/sendOTP',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const VerifyOTP = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/verifyOTP',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
      
    },
  });
};

export const NewUpdate = async () => {
  return await axios.get('https://apitest.fracspace.com/api/users/getNewUpdates',{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};

export const LoginWithPhone = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/loginWithPhoneNumber',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
      
    },
  });
};

export const LoginWithEmail = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/sendLoginOTPToUserEmail',
    payload,
    {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'
      },
    },
  );
};



export const LoginOTPVerification = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/loginOTPverificationWithPhoneNumber',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
      
    },
  });

};

export const LoginOTPVerificationEamil = async payload => {
  return await axios.post('https://apitest.fracspace.com/api/users/verifyLoginOTPSentToUserEmail',payload,
    {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const RentalData = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/getRentalDataBasedOnPropertyId',payload,{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
      
    },
  });
};

export const PaymentUPI = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/sendPaymentLinkToUser',
    payload,
    {
      headers: {
        'x-api-key': 'Fracspace@2024',
        'Content-Type': 'application/json',
        apiKey: 'Fracspace@202',
      },
    },
  );
};

export const SendConfirmationOTP = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/sendConfirmationOTPToFractionalOwner',
    payload,
    {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const SendConfirmationOTPEmail = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/sendConfirmationOTPToFractionalOwnerEmail',
    payload,
    {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'
      },
    },
  );
};



export const VerifyOtpAndStoreMessage = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/verifyOtpAndStoreMessageInExcustomerRecord',
    payload,
    {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'
      },
    },
  );
};
export const VerifyOtpAndStoreMessageEmail = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/verifyConfirmationOTPSentToFractionalOwnerEmail',
    payload,
    {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'
      },
    },
  );
};


export const GetBookingDetails = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/getFractionBookingDetails',
    payload,
    {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const VerificationScreenshorts = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/uploadPaymentReceipt',
    payload,
    {
      headers: {
        'content-type': 'multipart/form-data',
        'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const GetBookingAmountDate = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/autofillBookingAmountData',
    payload,
    {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'
      },
    },
  );
};
export const StayBooking = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/bookYourFreeStays',
    payload,
    {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'
      },
    },
  );
}; 


export const GetAllCustomer = async () => {
  return await axios.get('https://apitest.fracspace.com/api/users/getAllUserDetails',{
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'Fracspace@2024'
    },
  });
};


/////version2.0

export const PopularDestination = async () => {
  return await axios.get(
    'https://apitest.fracspace.com/api/v1/travel/allListedHotelDetails',
    {
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'Fracspace@2024'

      },
    },
  );
};


export const CallRecord = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/trackPhoneCallRecordsViaApplication',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
       'x-api-key': 'Fracspace@2024'
      },
    },
  );
};
export const CallRecordBuyAndRent = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/expo/bscallEventTracking',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
       'x-api-key': 'Fracspace@2024'
      },
    },
  );
};
export const InteriorForm = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/v1/interiorConstruction/submitInterior',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
       'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const SearchFSHotelContent = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/v1/travel/getHotelContentHotelId',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const PaymentPayU = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/v1/payments/initiatePayment',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};


export const PayUPaymentVerify = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/v1/payments/verifyPayment',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};


export const HotelBookingFSStore  = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/v1/travel/storeViaHotelBookingData',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const HotelCancleBooking  = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/v1/travel/cancleBooking',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};


export const GetAllCancellationsByEmail = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/v1/travel/getAllCancellationsByEmail',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const GetAllBookingByEmail = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/v1/travel/getViaHotelBookingData',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const GetBookingFSHotel = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/v1/travel/enquiryForHotelBooking_app',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};
export const CoOwnerBookingverification = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/bookFraction',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};
export const GetBookingCancleedCoOwned = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/cancelFractionBooking',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};
export const ExpoVisitor = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/expo/postVisitorDetails',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const ExpoExhibitor = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/expo/uploadExhibitorDetails',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const ReviewData = async (payload) => {
  return await axios.post('https://apitest.fracspace.com/api/users/videoUploader',payload,{
    headers: {
      'content-type': 'multipart/form-data',
      'x-api-key': 'Fracspace@2024'
      
    },
  });
};
export const GetReviewData = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/getUploadedVideos',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};

export const DreamscapeHotels = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/v1/travel/elasticHotelSearch',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};
export const UserFeedback = async payload => {
  return await axios.post(
    'https://apitest.fracspace.com/api/users/submitFeedbackForm',
    payload,
    {
      headers: {
       //'content-type': 'multipart/form-data',
       'content-type': 'application/json',
         'x-api-key': 'Fracspace@2024'
      },
    },
  );
};
export const UpComingHotels = async () => {
  return await axios.get (
      'https://apitest.fracspace.com/api/v1/interiorConstruction/getUpcomingProjects',
      {
          headers:{
              'Content-Type' : 'application/json',
              'x-api-key' : 'Fracspace@2024',
          },
      },
  );
};

export const GetAllNotification = async payload => {
  return await axios.post(
      'https://apitest.fracspace.com/api/v1/notifications/showAllNotificationsEnhanced',
      payload,
      {
          headers: {
              'Content-Type' : 'application/json',
              'x-api-key' : 'Fracspace@2024'
          },
      },
  );
};

export const MonitorNotification = async payload => {
    return await axios.post(
        'https://apitest.fracspace.com/api/v1/notifications/monitorNotifications',
        payload,
        {
            headers:{
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const TransferProperty = async payload => {
  return await axios.post(
      'https://apitest.fracspace.com/api/users/transferPropertyInvestment',
      payload,
      {
          headers:{
              'Content-Type' : 'application/json',
              'x-api-key' : 'Fracspace@2024'
          },
      },
  );
};

export const TransferPropertyOTP = async payload => {
  return await axios.post(
      'https://apitest.fracspace.com/api/users/sendOtpForTransferProcessVerification',
      payload,
      {
          headers:{
              'Content-Type' : 'application/json',
              'x-api-key' : 'Fracspace@2024'
          },
      },
  );
};
export const TransferPropertyOTPVerify = async payload => {
  return await axios.post(
      'https://apitest.fracspace.com/api/users/verifyConfirmationOTPForTransferProcess',
      payload,
      {
          headers:{
              'Content-Type' : 'application/json',
              'x-api-key' : 'Fracspace@2024'
          },
      },
  );
};

export const GetWalletInfo = async payload => {
    return await axios.post (
        'https://apitest.fracspace.com/api/users/getWalletInfoByEmail',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};
 

export const UploadBankData = async payload => {
    return await axios.post (
        'https://apitest.fracspace.com/api/users/uploadBankDeatailsToWallet',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};


export const SendOtpForVerification = async payload => {
    return await axios.post (
        'https://apitest.fracspace.com/api/users/sendOtpForTransferProcessVerification',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};


export const VerifyOtp = async payload => {
    return await axios.post(
        'https://apitest.fracspace.com/api/users/verifyConfirmationOTPForTransferProcess',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};


export const RequestForWithdrawal = async payload => {
    return await axios.post(
        'https://apitest.fracspace.com/api/users/requestForBalanceWithdrawal',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};


export const GetWalletTransaction = async payload => {
    return await axios.post(
        'https://apitest.fracspace.com/api/users/getWalletTransactions',
        payload,
        {
            headers : {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};


///////////new login api

export const GetRegistration = async payload => {
    return await axios.post(
        'https://apitest.fracspace.com/api/users/userRegisterationWithoutPassword',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const GetLogin = async payload => {
    return await axios.post(
        'https://apitest.fracspace.com/api/users/loginWithPhoneNumber',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const GetOtpForLoginWithNumber = async payload => {
    return await axios.post(
        'https://apitest.fracspace.com/api/users/loginOTPverificationWithPhoneNumber',
        payload,
        {
            headers : {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const OtpLoginWithEmail = async payload => {
    return await axios.post(
        'https://apitest.fracspace.com/api/users/sendLoginOTPToUserEmail',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const verifyOtpLogin = async payload => {
    return await axios.post(
        'https://apitest.fracspace.com/api/users/verifyLoginOTPSentToUserEmail',
        payload,
        {
            headers : {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};
//package
export const HandlePackage = async () => {
  return await axios.get (
      'https://apitest.fracspace.com/api/users/getAllPackages',
      {
          headers:{
              'Content-Type' : 'application/json',
              'x-api-key' : 'Fracspace@2024',
          },
      },
  );
};

export const handleEnquiryPackage = async (payload,PackagId )=> {
    return await axios.post(
        `https://apitest.fracspace.com/api/users/packages/${PackagId}/bookingEnquiry`,
        payload,
        {
            headers : {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );

};


export const GetLabelsProp = async () => {
    return await axios.get(
        'https://apitest.fracspace.com/api/users/getPropertyDetails',
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const UploadEnquiry = async (payload) => {
    return await axios.post(
        //'https://apitest.fracspace.com/api/users/altaira/enquireform',
        'https://apitest.fracspace.com/api/users/altairaEnquiryForm',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const GetCarousel = async () => {
    return await axios.get(
        'https://apitest.fracspace.com/api/altaira/promo/ui/getCarouselUi',
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};


