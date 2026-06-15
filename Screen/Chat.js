import {View, Text, Image, TouchableOpacity, Dimensions,Alert,ScrollView} from 'react-native';
import {useContext, useState,useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppContext } from './Context/AppContext';
import { ChatHistory, UserChat } from './Services/UserApi';
import Back from './Back';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Chat() {
    const [Quest, setQuest] = useState([]);
    const [displayCount, setDisplayCount] = useState(3);
    const {globalState, setGlobalState} = useContext(AppContext);
    const scrollViewRef =useRef(null);
  const ChatArray = [
    {
      question: 'What is fractional ownership?',
      answer: "It's a form of shared ownership where multiple parties purchase shares of an entity under which the property is registered.",
    },
    {
      question: 'How does it differ from timeshare?',
      answer: 'Fractional ownership is actual part ownership, whereas timeshare is more like a rental agreement.',
    },
    {
      question: 'Can I sell my fractional ownership share?',
      answer: 'Yes, since the fractional value is of lower ticket sizes,you can sell your fraction anytime at the current market value with Fracspace, Note: we take a maximum tenure of 90 days to sell your fraction.',
    },
    {
      question: 'What are the benefits in Fracspace?',
      answer: 'We are tech enabled, transparent and offer a minimum guarantee on rental yields, with no lock in commitments.',
    },
    {
      question: 'What is the Minimum and Maximum Amount?',
      answer: 'Our Domestic Holiday Home Fracs are Fixed at INR 10,00,000 per frac and International Fracs are priced at INR 25,00,000 per frac',
    },
    {
      question: 'Can I buy an Entire Property through Fracspace?',
      answer: 'Yes, Only with our Partnered Developers',
    },
    {
      question: 'Does Fracspace manage the properties?',
      answer: 'Fracspace takes ownership to maintain and manage the properties, we charge a nominal service fee of 15% on the gross total of its earnings before its paid out to its fractional owners.',
    },
    {
      question: 'Do I as a Fractional Owner get to stay at the property?',
      answer: 'Yes, every fractional owner is entitled to stay at their invested property for 7 days, subject to pre-booking and availability. In addition to this you may receive promos to complimentary stays at other Fracspace Properties',
    },
    {
      question: 'How and when are yields paid out?',
      answer: 'Currently all pay outs are processed after every quarter. We aim to issue quicker pay outs in the near future.',
    },
    {
      question: 'Is there a limit to Frac Ownerships?',
      answer: 'No, you can buy as many as available.',
    },
    {
      question: 'How is my Investment Secured?',
      answer: 'These are asset backed investments, you are secured by the asset.',
    },
    {
      question: 'How is fractional ownership better than traditional real-estate?',
      answer: "Real estate fractional ownership is often considered better than traditional real estate ownership for several reasons: 1) Shared costs: Fractional ownership allows multiple people to share the costs of a property, making it more affordable for each individual owner. 2)Access to luxury properties: Fractional ownership can provide access to properties that may be out of reach for a single individual to purchase outright. 3)Flexibility: Fractional ownership allows owners to use the property for a set period of time each year. 4)Diversification of Investment: Fractional ownership can be a great way to diversify one's investment portfolio, as it allows for investment in a tangible asset like real estate 5)Reduced maintenance and management responsibilities : As part of a shared ownership, the responsibilities of maintaining and managing the property are shared among the owners, reducing the burden on any one individual.",
    },
    {
      question: 'How can I invest fractionally in International Portfolios?',
      answer: 'Fracspace holds subsidary entities / branch offices for every asset purchased and managed in the respective regions, the subsidary holds ownership of the asset.',
    },
    {
      question: 'Some Countries offer leasehold ownership.Explain this?',
      answer: ' Some countries offer long leaseholds ranging from 25 years upto 99 years. Fracspace holds leasehold ownerships for 5+7 years, or may extend depending on the demand, An advantage here, your lease amount is returned with nominal deductions, until this ownership is owned.',
    },
    {
      question: 'Are you double taxed in the country of origin and country of Investment?',
      answer: 'Fracspace handles and manages all the earnings generated from the invested property and abides to local laws and taxes, before being transferred to our source account for re-initiating local payouts to frac owners.International taxes and legalities will be handled by Fracspace',
    },
    {
      question: 'What are the taxes on earnings in Bali?',
      answer: ' Taxes on Rental Yields are at 20% of the Assets Earning.',
    },
    {
      question: 'What documents are required to buy a Frac?',
      answer: ' Simply Upload a copy of your PAN, Aadhar and a Photo on the Fracspace App or send us an email with the above attachments.',
    },
    {
      question: 'What Documents will Fracspace provide its Frac Owners?',
      answer: 'You will receive a Shareholder Agreement and a copy of the Sale Deed once complete.',
    },
   
  ];
 
  const handlechatstore = async (item) => {
    // console.log('lololo',item);

    let payload = JSON.stringify({
      question: item?.question,
      answer: item?.answer,
      email:globalState?.userEmail,
      
    });
  
    try {
      let {data: res} = await UserChat(payload);
      //console.log(res);

      if (res?.success) {
        setQuest([...Quest,item]);
      
      }
    } catch (error) {
      if (error.response) {
       // console.log(error);
        Alert.alert('Response error:', `${error?.response?.data?.message}`);
      } else if (error.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
       // Alert.alert('Request error:', `${JSON.stringify(error)}`);
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };
  const handlechat = async () => {
    let payload = JSON.stringify({
      email:globalState?.userEmail,
    });
    try {
      let {data: res} = await ChatHistory(payload);
      if (res?.success) {
        setQuest(res?.chatHistory);
      
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Response error:', `${error?.response?.data?.message}`);
      } else if (error.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
       // Alert.alert('Request error:', `${JSON.stringify(error)}`);
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  useEffect(() => {
   handlechat();
   }, []);

   const scrollToEnd=()=>{
   if(scrollViewRef.current){
    scrollViewRef.current.scrollToEnd({animated:true});
   }
   }

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:"#021265" }}>
    <View style={{flex:1}}>
       <Back title={'Chat'} />
    <ScrollView ref={scrollViewRef}
      style={{ width: '100%', backgroundColor: 'white', padding: 10,}}>
        
      <View
        style={{
          justifyContent: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={require('./assets/Logo.png')}
          style={{width: 20, height: 20, marginTop: 40, marginRight: 5}}
        />
        <View
          style={{
            backgroundColor: '#f5f7fe',
            borderRadius: 20,
            padding: 20,
            justifyContent: 'flex-start',
          }}>
          <Text style={{color: 'black', fontSize: 14, fontFamily:'Poppins-Medium',}}>
            Hii there,I am Fracspace bot.
          </Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center',marginBottom:20}}>
        <View
          style={{
            flex: 3,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginTop: 10,
          }}>
          <Image
            source={require('./assets/Logo.png')}
            style={{width: 20, height: 20, marginTop: 50, marginRight: 5}}
          />
          <View
            style={{
              backgroundColor: '#f5f7fe',
              borderRadius: 20,
              padding: 20,
              justifyContent: 'flex-start',
            }}>
            <Text style={{color: 'black', fontSize: 14, fontFamily:'Poppins-Medium',}}>
              Please let us know how you would like to continue.
            </Text>
            {ChatArray.slice(0, displayCount).map((item, index) => (
            <TouchableOpacity
            key={index}
            onPress={() => {
              handlechatstore(item);
              scrollToEnd();
              }}

              style={{
                backgroundColor: '#FFFFFF',
                padding: 10,
               // paddingHorizontal: 8,
                borderRadius: 10,
                marginVertical: 10,

                justifyContent:'flex-start',
              // alignItems: 'flex-start',
              }}>
              <Text style={{color: '#043862', fontSize: 14, fontFamily:'Poppins-Medium',textAlign:'center'}}>
                {item?.question}
              </Text>
            </TouchableOpacity>))}
            <TouchableOpacity style={{alignItems:'center',marginVertical:0,flexDirection:'row',justifyContent:'center'}}onPress={() => {
              setDisplayCount(displayCount+3);
              }}>

                <Text style={{color: '#043862',fontSize:14,fontFamily:'OpenSans-Bold',paddingBottom:5}}>More </Text>
                <Icon
                name={'angle-down' }
                size={20}
                color={'#043862'}
              /> 
              </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 1}}></View>
      </View>

      {Quest.map((item, index) => (
        <View   key={index}>
      <View
      
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginHorizontal: 10,
          marginVertical:10
        }}>
       <View style={{flex: 1}}></View>
        <View
          style={{
            backgroundColor: '#043862',
            borderRadius: 20,
            padding: 20,
            justifyContent: 'flex-start',
            flex:3
          }}>
          <Text style={{color: '#FFFFFF', fontSize: 12, fontFamily:'Poppins-Medium',}}>
          {item?.question}
          </Text>
        </View>
      </View>
      <View
        style={{
        
          flexDirection: 'row',
          alignItems: 'center',
        }}>
           <View style={{flex: 3, justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginTop: 10,}}>
        <Image
          source={require('./assets/Logo.png')}
          style={{width: 20, height: 20, marginTop: 40, marginRight: 5}}
        />
        <View
          style={{
            backgroundColor: '#f5f7fe',
            borderRadius: 20,
            padding: 20,
            justifyContent: 'flex-start',
          }}>
          <Text style={{color: 'black', fontSize: 12, fontFamily:'Poppins-Medium',}}>
            {item?.answer}
          </Text>
        </View>
        </View>
        <View style={{flex: 1}}></View>
        
      </View>
      </View>))}
    </ScrollView>
    </View>
    </SafeAreaView>
  );
}
