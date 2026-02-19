import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
 
} from 'react-native';
import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Ico from 'react-native-vector-icons/Ionicons';
import Ic from 'react-native-vector-icons/AntDesign';
import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../Context/AppContext';
import {UserFeedback} from '../Services/UserApi';
const {width, height} = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedbackForm() {
  const {globalState, setGlobalState} = useContext(AppContext);
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [question3, setQuestion3] = useState([]);
  const [value, setValue] = useState(4);
  const [rating, setRating] = useState(4);
  const [question6, setQuestion6] = useState('');
  const [question7, setQuestion7] = useState('');
  const [question8, setQuestion8] = useState('');
  const [assistanceRating, setAssistanceRating] = useState(4);
  const [question10, setQuestion10] = useState('');
  const [question11, setQuestion11] = useState('');
  const [question12, setQuestion12] = useState('');
  const [question13, setQuestion13] = useState('');
  const [question14, setQuestion14] = useState('');
  const [question15, setQuestion15] = useState('');
  const navigation = useNavigation();

  const emojis = ['😔', '🙁', '🙂', '😊', '😍'];

  const withFracspace = [
    'Less than 3 months',
    '3-6 months',
    '6 months to 1 year',
    'Over 1 year',
  ];

  const property = ['Hyderabad', 'Munnar', 'Kabini', 'Varanasi', 'Goa'];

  const investmentProcess = [
    '5 - Extremely Smooth',
    '4 - Smooth',
    '3 - Neutral',
    '2 - A bit Difficult',
    '1 - Difficult',
  ];

  const documentationProcess = [
    '5 - Extremely Clear & Transparent',
    '4 - Clear',
    '3 - Neutral',
    '2 - A bit confusing',
    '1 - Confusing',
  ];

  const refundProcess = ['Yes', 'No', 'Not applicable yet'];

  const investmentInfoProcess = ['Yes, completely', 'Somewhat', 'No'];

  const responsive = [
    '5 - Extremely Responsive',
    '4 - Responsive',
    '3 - Neutral',
    '2 - Somewhat Unresponsive',
    '1 - Unresponsive',
  ];

  const recommendation = ['Definitely', 'Maybe', 'Not sure', 'No'];

  const investAgain = ['Definitely', 'Maybe', 'Not sure', 'No'];

  const toggleCheck = item => {
    setQuestion3(prevSelected =>
      prevSelected.includes(item)
        ? prevSelected.filter(selected => selected !== item)
        : [...prevSelected, item],
    );
  };
  const handleFeedback = async () => {
    let payload = JSON.stringify({
      name: globalState?.userName,
      email: globalState?.userEmail,
      associationDuration: question1, // Enum - One of:
      // 'Less than 3 months' | '3 to 6 months' | '6 months to 1 year' | 'Over 1 Year'

      assistedBy: question2,

      onboardingRating: rating, // (1-5)

      investmentSmoothness: question6, // Enum - One of:
      // 'Very smooth' | 'Somewhat smooth' | 'Neutral' | 'Difficult' | 'Very difficult'

      documentationClarity: question7, // Required - Integer (1 to 5), rating of transparency/documentation

      investedProperties: question3, // Array of Strings - Multiple values allowed from:
      // 'Goa', 'Hyderabad', 'Munnar', 'Kabini', 'Varanasi'

      propertySatisfaction: value, // (1-5)

      receivedBROI: question8, // Enum - One of:
      // 'Yes' | 'No' | 'Not applicable yet'

      postInvestmentSupport: assistanceRating,
      wellInformed: question10, // Enum - One of:
      // 'Yes' | 'No' | 'Somewhat'

      teamResponsiveness: question11, //(1-5)
      likesAboutFracspace: question12,
      improvementAreas: question13,
      recommendToOthers: question14, // Enum - Required - One of:
      // 'Definitely' | 'Maybe' | 'Not sure' | 'No'

      investAgain: question15, // Enum - Required - One of:
      // 'Yes' | 'No' | 'Maybe'

      additionalFeedback: '',
    });

    try {
      let {data: res} = await UserFeedback(payload);

      if (res?.success) {
        Alert.alert('Thank You for your feedback', 'Thank you for taking the time to provide your insightful feedback.');
          navigation.navigate('HomePage');

        // handleCallNow();
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //Alert.alert('Request error:', ${JSON.stringify(error?.request)});
        // Alert.alert('Request Error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', ${JSON.stringify(error?.request)});
      } else {
        Alert.alert('Error:', `${error}`);
      }
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView style={{backgroundColor: '#FAFAFF'}}>
      <View
        style={{
          paddingHorizontal: 20,
         // paddingBottom:20,
          paddingVertical:20,
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          elevation: 5,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('HomePage');
          }} style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name={'chevron-left'} size={25} color={'#000000'} />
          <Text
            style={{
              fontFamily: 'WorkSans-SemiBold',
              fontSize: 18,
              color: '#000000',
              marginLeft: 20,
            }}>
            Feedback Form
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('HomePage');
          }}>
          <Text
            style={{
              fontFamily: 'WorkSans-Medium',
              fontSize: 14,
              color: '#0424CB',
            }}>
            Exit
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{padding: 20}}>
        <View style={{}}>
          <Text
            style={{
              fontFamily: 'WorkSans-SemiBold',
              fontSize: 18,
              color: '#1A1A1A',
            }}>
            Tell us about your Experience!
          </Text>
        </View>
        <View
          style={{
            borderTopColor: '#F0EFFB',
            borderTopWidth: 1,
            marginVertical: 20,
          }}></View>

        <View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              1.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              How long have you been associated with Fracspace?
            </Text>
          </View>
          <View style={{marginTop: 15, gap: 8}}>
            {withFracspace.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setQuestion1(prev => (prev === item ? '' : item));
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {question1 === item ? (
                  <Ico name={'radio-button-on'} size={20} color={'#021265'} />
                ) : (
                  <Ico name={'radio-button-off'} size={20} color={'#292D32'} />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 15,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              2.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              Who from the Fracspace team assisted you during your investment
              process?  
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#00000033',
              flexDirection: 'row',
              flex: 1,
              borderRadius: 5,
              marginTop: 15,
            }}>
            <View
              style={{
                borderLeftColor: '#000000',
                borderLeftWidth: 1,
                marginHorizontal: 15,
                marginVertical: 10,
              }}></View>
            <TextInput
              placeholder="Your Comments.."
              placeholderTextColor={'#01010199'}
              value={question2}
              multiline
              onChangeText={text => setQuestion2(text)}
              style={{
                flex: 1,
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: '#000000',
                padding: 10,
              }}
            />
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              3.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              Which property/properties have you invested in? 
            </Text>
          </View>
          <View style={{marginTop: 15, gap: 8}}>
            {property.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // setQuestion3('Hyderabad');
                  toggleCheck(item);
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {question3.includes(item) ? (
                  <Ico name={'checkbox'} size={20} color={'#021265'} />
                ) : (
                  <Ico name={'checkbox-outline'} size={20} color={'#292D32'} />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 12,
                    color: question3 === item ? '#021265' : '#000000',
                    marginLeft: 10,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              4.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              How satisfied are you with the property you’ve invested in? 
            </Text>
          </View>
          <View style={{marginTop: 15}}>
            <Slider
              style={{width: '100%', height: 10}}
              minimumValue={0}
              maximumValue={4}
              step={1}
              value={value}
              onValueChange={val => setValue(val)}
              minimumTrackTintColor="#0424CB"
              maximumTrackTintColor="#0424CB66"
              thumbTintColor="#0424CB"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                paddingHorizontal: 10,
              }}>
              {emojis.map((emoji, index) => (
                <Text
                  key={index}
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 22,
                    color: '#FFFFFF',
                  }}>
                  {emoji}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              5.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              How would you rate your onboarding experience with Fracspace? 
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              marginLeft: 20,
              gap: 10,
            }}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ic
                  name="star"
                  size={30}
                  color={star <= rating ? '#F3BF0D' : '#D3D3D3'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              6.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              How smooth was the investment process for you? 
            </Text>
          </View>
          <View style={{marginTop: 15, gap: 8}}>
            {investmentProcess.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setQuestion6(prev => (prev === item ? '' : item));
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {question6 === item ? (
                  <Ico name={'radio-button-on'} size={20} color={'#021265'} />
                ) : (
                  <Ico name={'radio-button-off'} size={20} color={'#292D32'} />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 15,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              7.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              How clear and transparent was the documentation and communication
              during investment? 
            </Text>
          </View>
          <View style={{marginTop: 15, gap: 8}}>
            {documentationProcess.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setQuestion7(prev => (prev === item ? '' : item));
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {question7 === item ? (
                  <Ico name={'radio-button-on'} size={20} color={'#021265'} />
                ) : (
                  <Ico name={'radio-button-off'} size={20} color={'#292D32'} />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 15,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              8.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              Have you received your returns on time as promised? 
            </Text>
          </View>
          <View style={{marginTop: 15, gap: 8}}>
            {refundProcess.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setQuestion8(prev => (prev === item ? '' : item));
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {question8 === item ? (
                  <Ico name={'radio-button-on'} size={20} color={'#021265'} />
                ) : (
                  <Ico name={'radio-button-off'} size={20} color={'#292D32'} />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 15,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              9.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              Rate the quality of assistance you received after your
              investment. 
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              marginLeft: 20,
              gap: 10,
            }}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setAssistanceRating(star)}>
                <Ic
                  name="star"
                  size={30}
                  color={star <= assistanceRating ? '#F3BF0D' : '#D3D3D3'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              10.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              Are you well-informed about your investment (maintenance, income,
              occupancy updates)?
            </Text>
          </View>
          <View style={{marginTop: 15, gap: 8}}>
            {investmentInfoProcess.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setQuestion10(prev => (prev === item ? '' : item));
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {question10 === item ? (
                  <Ico name={'radio-button-on'} size={20} color={'#021265'} />
                ) : (
                  <Ico name={'radio-button-off'} size={20} color={'#292D32'} />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 15,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              11.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              How responsive is the Fracspace team to your queries? 
            </Text>
          </View>
          <View style={{marginTop: 15, gap: 8}}>
            {responsive.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setQuestion11(prev => (prev === item ? '' : item));
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {question11 === item ? (
                  <Ico name={'radio-button-on'} size={20} color={'#021265'} />
                ) : (
                  <Ico name={'radio-button-off'} size={20} color={'#292D32'} />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 15,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              12.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              What do you like the most about Fracspace? 
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#00000033',
              flexDirection: 'row',
              flex: 1,
              borderRadius: 5,
              marginTop: 15,
            }}>
            <View
              style={{
                borderLeftColor: '#000000',
                borderLeftWidth: 1,
                marginHorizontal: 15,
                marginVertical: 10,
              }}></View>
            <TextInput
              placeholder="Your Comments.."
              placeholderTextColor={'#01010199'}
              value={question12}
              multiline
              onChangeText={text => setQuestion12(text)}
              style={{
                flex: 1,
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: '#000000',
                padding: 10,
              }}
            />
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              13.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              What areas do you think we can improve?
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#00000033',
              flexDirection: 'row',
              flex: 1,
              borderRadius: 5,
              marginTop: 15,
            }}>
            <View
              style={{
                borderLeftColor: '#000000',
                borderLeftWidth: 1,
                marginHorizontal: 15,
                marginVertical: 10,
              }}></View>
            <TextInput
              placeholder="Your Comments.."
              placeholderTextColor={'#01010199'}
              value={question13}
              multiline
              onChangeText={text => setQuestion13(text)}
              style={{
                flex: 1,
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: '#000000',
                padding: 10,
              }}
            />
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              14.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              Would you recommend Fracspace to friends and family?
            </Text>
          </View>
          <View style={{marginTop: 15, gap: 8}}>
            {recommendation.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setQuestion14(prev => (prev === item ? '' : item));
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {question14 === item ? (
                  <Ico name={'radio-button-on'} size={20} color={'#021265'} />
                ) : (
                  <Ico name={'radio-button-off'} size={20} color={'#292D32'} />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 15,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              15.{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color: '#010101E5',
              }}>
              Would you consider investing with us again in the future? 
            </Text>
          </View>
          <View style={{marginTop: 15, gap: 8}}>
            {investAgain.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setQuestion15(prev => (prev === item ? '' : item));
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {question15 === item ? (
                  <Ico name={'radio-button-on'} size={20} color={'#021265'} />
                ) : (
                  <Ico name={'radio-button-off'} size={20} color={'#292D32'} />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 15,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            handleFeedback();
          }}
          style={{
            backgroundColor: '#021265',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Text
            style={{
              fontFamily: 'WorkSans-SemiBold',
              fontSize: 15,
              color: '#FFFFFF',
            }}>
            Submit Feedback
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
