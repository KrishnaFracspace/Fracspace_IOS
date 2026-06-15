import { View, Text, ScrollView, Image, Dimensions,TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Blogs(props) {
const navigation = useNavigation();
    const { width, height } = Dimensions.get('window');

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: '#FFFFFA' }}>
                <View style={{ backgroundColor: '#021265', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={{ paddingTop: 8 }} onPress={() => {
                        navigation.goBack();
                    }}>
                        <Icon name={'left'} size={20} color={'#FFFFFF'} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#FFFFFF' }}>Postcards</Text>
                    <View style={{width:20}}></View>
                </View>
                {props?.route?.params?.Blogfor == 'SrilankaBlog' && <View style={{ padding: 20 }}>
                    <View style={{ flexDirection: 'row', alignContent: 'flex-end', justifyContent: 'space-between' }}>
                        <View>
                            <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/FsLogo.png' }} style={{ width: 70, height: 50 }} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 21, }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000' }}>May 07, 2025</Text>
                            <View style={{ borderColor: '#6262621A', borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, marginLeft: 10 }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#000000' }}>5 min read</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ borderTopColor: '#62626233', borderTopWidth: 1, marginVertical: 10 }}></View>
                    <View>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 17, color: '#000000', lineHeight: 25 }}>
                            Chasing the Island Breeze –<Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 18, color: '#000000' }}> Sri Lanka</Text>, Known as
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 18, color: '#000000' }}> The Pearl of the Indian Ocean or The Land of Gem-stones.</Text>
                        </Text>
                    </View>
                    <View style={{ marginVertical: 15 }}>
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/TitlePage.png' }} style={{ width: width * 0.9, height: 200 }} />
                    </View>
                    <View>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000000', lineHeight: 19 }}>
                            There’s something about island nations that pull you in — the wind carries a sense of ease, the people wear smiles that aren't
                            forced, and time… well, time moves slower, but somehow more meaningfully. That’s exactly what Sri Lanka offered me on a recent 4-night escape across Colombo,
                            Ahangama, Unawatuna, and Mirissa.
                        </Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000000', lineHeight: 19 }}>
                            But this wasn’t just a vacation — it was part<Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000', lineHeight: 21 }}> inspiration</Text>, part
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000', lineHeight: 21 }}> exploration</Text>, and part
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000', lineHeight: 21 }}>business.</Text>
                        </Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000000', marginVertical: 5, lineHeight: 19 }}>Let me walk you through it.</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000000' }}>1. </Text>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000000' }}>Colombo -
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#000000' }}> The Pulse of the Island:</Text>
                        </Text>
                    </View>
                    <View>
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Columbo.png' }} style={{ width: width * 0.9, height: 200 }} />
                    </View>
                    <View style={{ marginTop: 12 }}>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>
                            I kicked things off in<Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}> Colombo</Text>,
                            the energetic heart of Sri Lanka. The city is an evolving blend of colonial charm and modern ambition. I checked into the
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}> Hilton Colombo</Text>, a timeless property that delivers
                            everything a global traveler expects — from a lavish breakfast spread to city views that hint at what’s to come for this capital city.
                        </Text>
                    </View>
                    <View style={{ marginVertical: 15 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>Must-Do Experiences in Colombo:</Text>
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000', marginHorizontal: 5 }}>•</Text>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000', flex: 1, marginLeft: 5 }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>Dine at </Text>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#0348E8', textDecorationLine: 'underline' }}>Ministry of Crab</Text> – Arguably one of the best seafood restaurants in Asia.
                                I went for the Pepper Crab — fiery, flavourful, and unforgettable.
                            </Text>
                            <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/crab.png' }} style={{ width: 110, height: 80 }} />
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000', marginHorizontal: 5 }}>•</Text>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000', flex: 1, marginHorizontal: 5 }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#0348E8', textDecorationLine: 'underline' }}>Steakhouse Colombo </Text>
                                – A classic steak night with an island twist. Their attention to detail made it worthy of a second visit.
                            </Text>
                            <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/steak.png' }} style={{ width: 110, height: 80 }} />
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000', marginHorizontal: 5 }}>•</Text>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000', flex: 1, marginHorizontal: 5 }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>Casinos? Try</Text>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#0348E8', textDecorationLine: 'underline' }}> Bally’s & Bellagio</Text> – For casino lovers,
                                these two are the crown jewels of Colombo. High-energy tables, live performances, and international clientele make them a must-experience, even if you're just observing the action.
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000', marginHorizontal: 5 }}>•</Text>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000', flex: 1, marginHorizontal: 5 }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 20, color: '#000000', }}>Nightlife that goes beyond midnight – </Text>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 20, color: '#0348E8', textDecorationLine: 'underline' }}>Octopussy Colombo </Text> and
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#0348E8', textDecorationLine: 'underline' }}>R&B Colombo</Text> are the city’s top nightlife destinations.
                                The party doesn’t stop till early morning, with curated music, global crowds, and that signature Sri Lankan hospitality.
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000', marginHorizontal: 5 }}>•</Text>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000', flex: 1, marginHorizontal: 5 }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>Explore Colombo 1, 5 & 7 – </Text>
                                These are the areas to watch. Colombo 1 (Fort) is transforming into a financial and commercial powerhouse.
                                Colombo 5 and 7 are blooming with boutique hotels, fine dining, embassy hubs, and co-living concepts.
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginVertical: 20, marginTop: 30 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000000' }}>2. </Text>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000000' }}>Ahangama –
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#000000' }}>The Bohemian Hideaway: </Text>
                        </Text>
                    </View>
                    <View >
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Ahangama.png' }} style={{ width: width * 0.9, height: 200 }} />
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>
                            From city rush to coastal hush. <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>Ahangama </Text>
                            is everything you want in a beach town — surf breaks, art cafés, and sunset bars where conversations go deeper than your cocktail glass.
                            It’s becoming a magnet for <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>European, Australian, and Indian travelers </Text>
                            looking to disconnect but stay connected enough. Digital nomads and boutique entrepreneurs are slowly making this their base. The vibe?
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}> Bali-meets-Goa</Text>, but still untouched by mass tourism.
                        </Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000', marginVertical: 5 }}>Location: Uncle’s Hotel</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, lineHeight: 19, color: '#000000' }}>3. </Text>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, lineHeight: 19, color: '#000000' }}>Unawatuna –
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, lineHeight: 19, color: '#000000' }}> Where Turquoise Meets Tranquil :</Text>
                        </Text>
                    </View>

                    <View>
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Unawatuna.png' }} style={{ width: width * 0.9, height: 200 }} />
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>
                            Unawatuna is where your soul exhales. The beaches here are softer, quieter. I spent my day paddleboarding, exploring hidden coves,
                            and discovering roadside eateries that serve rice and curry with a smile and a secret family recipe.
                            This part of Sri Lanka is poised for <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>eco-resorts, retreats, and co-living escapes</Text>.
                            Fracspace sees it as a quiet giant in the making.
                        </Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000', marginVertical: 5 }}>Location: Kingfisher</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000000' }}>4. </Text>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000000' }}>Mirissa –
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#000000' }}>Postcard Living :</Text></Text>
                    </View>
                    <View>
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Mirissa.png' }} style={{ width: width * 0.9, height: 200 }} />
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>Mirissa</Text> feels like a movie.
                            Beachfront cafés light up at night with fairy lights and fire pits, while the mornings are about whale watching, beach yoga,
                            and moments of stillness. It’s perfect for short stays, long thoughts, and creative reset.
                        </Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000', marginVertical: 5 }}>Location: W 15</Text>
                    </View>

                    <View style={{ marginTop: 30 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, lineHeight: 19, color: '#000000' }}>Market Opportunity – Why Sri Lanka is on Our Radar</Text>
                    </View>
                    <View style={{ borderTopColor: '#62626233', borderTopWidth: 1, marginVertical: 10 }}></View>

                    <View>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>
                            Sri Lanka is <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>rebounding beautifully</Text>.
                            Tourism is on a clear upswing. There’s growing demand from Indian, Middle Eastern, and European travelers — not just for hotels, but for
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}> ownership opportunities</Text>.
                        </Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>
                            Real estate prices are still competitive. The market is ripe for fractional ownership — a model that gives lifestyle seekers a smarter way to invest in paradise.
                        </Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>Sri Lanka : Coming Soon</Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>
                            We’re proud to announce: <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>Fracspace is entering Sri Lanka</Text>.
                            We’ve identified prime co-ownership opportunities in <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 21, color: '#000000' }}>
                                Colombo, Ahangama, and Unawatuna</Text> — from urban sky villas to beachfront getaways.A curated portfolio is currently under planning.
                        </Text>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>Own your slice of Sri Lanka. Live it. Love it.</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>Final Thoughts</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>This trip wasn’t just a break. It was a blueprint.</Text>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>Sri Lanka isn’t just back. It’s blooming.</Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>As a traveler, I came back refreshed.</Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>As a founder, I came back with clarity.</Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>To our Fracspacians and global dreamers —</Text>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, lineHeight: 19, color: '#000000' }}>The island is calling. And Fracspace is answering.</Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000', paddingTop: 10 }}>—</Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>Unnath Reddy</Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, lineHeight: 19, color: '#000000' }}>CEO</Text>
                    </View>
                </View>}

                {props?.route?.params?.Blogfor == 'VaranasiBlog' && <View style={{ padding: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',   }}>
                        <View style={{}}>
                            <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/FsLogo.png' }} style={{ width: 70, height: 50 }} />
                        </View>
                        <View style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 10, color: '#000' }}>July 28, 2025</Text>
                            </View>
                            <View style={{ borderWidth: 0.5, borderColor: '#6262624D', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, marginLeft: 10 }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 10, color: '#000' }}>5 min read</Text>
                            </View>
                        </View>
                    </View>
                      <View style={{borderTopColor:'#62626240',borderTopWidth:1,marginVertical:10}}/>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000' }}>Varanasi:
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#000' }}> The Calling – Work meets Divine</Text>
                    </Text>
                    <View style={{ marginTop: 20, marginBottom: 10 }}>
                        <Image resizeMode='cover' source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Varanasi1.jpeg' }} style={{ width: width * 0.9, height: 210 }} />
                    </View>

                    <View>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>
                            Earlier this week, I found myself in<Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}> Varanasi </Text>
                            for what was meant to be a quick business trip — we were there to complete the registration formalities for one of our upcoming
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}> Boutique 8-Bedded Hotel – The Soulful Ghat by Fracspace, located on Shivala Ghat.</Text>
                        </Text>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>
                            But as anyone who’s ever visited Kashi will tell you, the city has a way of turning even the most practical plans into something deeply personal.
                            I was accompanied by <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>three of my colleagues</Text>,
                            and what we thought would be a quick work trip ended up becoming something much deeper. In a city like Varanasi, the line between
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}> work and inner work blurs fast.</Text>
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>
                                There’s something about this place. You walk through the gullies thinking you're just heading to your next location, but instead, you’re stepping into centuries of devotion, dust, incense, and stories that feel like they’ve been playing on loop forever.
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}> Varanasi doesn’t shout its legacy — it just breathes it.</Text>
                            </Text>
                        </View>
                        <View style={{ marginLeft: 5 }}>
                            <Image resizeMode='cover' source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Varanasi3.jpeg' }} style={{ width: 140, height: 180 }} />
                        </View>
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Varanasi2.jpg' }} style={{ width: width * 0.9, height: 210 }} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>
                            We woke up at 2:00 AM and made our way to the <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>Kashi Vishwanath Mandir </Text>
                            for the <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>Mangala Aarti. </Text>
                            That moment... no camera can do justice. Just the sound of bells, chants echoing through the temple, and hundreds of devotees standing in complete surrender.
                            It felt like the world paused for a bit, and we were right where we were meant to be.
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>
                                The day unfolded beautifully. We visited <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>Durga Mandir</Text>,
                                glowing in red — powerful, maternal, calming. Then we made our way to the <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>Kaal Bhairav Mandir</Text>,
                                and the mood instantly shifted — intense, protective, raw. The kind of place where silence says more than words. They say you can't stay in Kashi without his permission. I believe we were blessed to be welcomed.
                            </Text>
                        </View>
                        <View>
                            <Image resizeMode='cover' source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Varanasi4.jpg' }} style={{ width: 140, height: 220 }} />
                        </View>
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>
                            We were also fortunate to receive <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000' }}>special pujas and darshans</Text>,
                            including one at a <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000' }}>lingam-shaped temple at Assi Ghat</Text>,
                            tucked away from the main streets. It was quiet, untouched, and deeply grounding — one of those places where even the mind stops talking.
                        </Text>
                    </View>

                    <View>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>
                            In the evening, we headed to <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>Assi Ghat </Text>
                            for the <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>Ganga Aarti </Text>
                            — and there it was: the fire rituals, the synchronized prayers, the river glowing in orange light. It didn’t feel like a ceremony —
                            it felt like a collective offering from humanity to something higher.
                        </Text>
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Varanasi5.jpg' }} style={{ width: width * 0.9, height: 210 }} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>
                            We wanted to walk along the ghats or maybe take a boat ride, but the
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}> Ganga had risen unusually high</Text>,
                            swallowing parts of the steps. <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>Walking or sailing wasn’t possible</Text>,
                            but honestly, watching the submerged ghats under the moonlight had a beauty of its own. Like the river was quietly reminding us who’s in charge.
                        </Text>
                    </View>

                    <View>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>
                            Yes, we got the property registered, possession received. A team has been deployed to complete final touches and anticipate taking
                            the property live by the end of August. But more than that, we walked away with something harder to describe —
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000' }}> a sense of stillness</Text>,
                            a kind of quiet energy that only a place like Kashi can give. Some cities you visit and check off the list.
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}> Varanasi doesn’t let you do that. Varanasi stays.</Text>
                        </Text>
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>— {`\n`}
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 17, color: '#000', fontStyle: 'italic', lineHeight: 25, letterSpacing: 0.3 }}>Unnath Reddy </Text>
                            {`\n`}<Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000', lineHeight: 25, letterSpacing: 0.3 }}>CEO</Text> </Text>
                    </View>
                </View>}

                {props?.route?.params?.Blogfor == 'SouthIndia' && 
                    <View style={{padding:20}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between',   }}>
                            <View style={{}}>
                                <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/FsLogo.png' }} style={{ width: 70, height: 50 }} />
                            </View>
                            <View style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 10, color: '#000' }}>May 19, 2026</Text>
                                </View>
                                <View style={{ borderWidth: 0.5, borderColor: '#6262624D', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, marginLeft: 10 }}>
                                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 10, color: '#000' }}>5 min read</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.heading}>
                            <Text style={{fontFamily:'WorkSans-Medium'}}>FROM THE ROAD</Text> - A JOURNEY ACROSS SOUTH INDIA
                        </Text>
                        <Image
                            source={{
                                uri: 'https://duixj37yn5405.cloudfront.net/Postcard+Images/srisailam1.jpg',
                            }}
                            style={styles.blogImage}
                            resizeMode="cover"
                        />

                        {/* Heading */}
                        

                        {/* Sub Heading */}
                        <Text style={{color: '#000',fontFamily: 'WorkSans-SemiBold',fontSize:14,marginTop:10}}>
                            Temples, Time & The Real Meaning of Building
                        </Text>

                        {/* Description */}
                        <Text style={styles.description}>
                            Over the last few weeks, I had the opportunity to travel across South India through 
                            some of the country’s most sacred temple towns - from the powerful silence of <Text style={{fontFamily:'WorkSans-SemiBold'}}>Srisailam</Text>, 
                            to the fire of <Text style={{fontFamily:'WorkSans-SemiBold'}}>Arunachalam</Text>, the devotion of 
                            <Text style={{fontFamily:'WorkSans-SemiBold'}}> Rameshwaram</Text>, the cosmic energy of 
                            <Text style={{fontFamily:'WorkSans-SemiBold'}}> Chidambaram</Text>, 
                            the stillness of <Text style={{fontFamily:'WorkSans-SemiBold'}}>Guruvayur</Text>, and the countless ancient temples hidden between highways, forests, 
                            rivers and small towns.
                        </Text>

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',marginTop:10,lineHeight: 20}}>
                            What started as a <Text style={{fontFamily:'WorkSans-SemiBold'}}>spiritual yatra</Text> slowly became something much deeper.
                        </Text>

                        <Image
                            source={{
                                uri: 'https://duixj37yn5405.cloudfront.net/Postcard+Images/chidambaram.jpg',
                            }}
                            style={styles.blogImage}
                            resizeMode="cover"
                        />

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',marginTop:10,lineHeight: 20}}>
                            Somewhere between long road journeys, temple bells, barefoot walks, ancient stone corridors, 
                            and seeing structures that have stood strong for over <Text style={{fontFamily:'WorkSans-SemiBold'}}>1000 years…</Text> 
                            I began to realize something important:
                        </Text>

                        <Text style={styles.description}>
                            This journey became more than travel. It became a reminder that the
                            strongest foundations are built with patience, vision, and intent.
                            The same philosophy inspires the way we think about experiences,
                            hospitality, and investments.
                        </Text>

                        <View style={{backgroundColor:'#0212650D',padding:10,borderRadius:5,marginTop:10,borderLeftWidth:5,borderLeftColor:'#021265'}}>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20}}>
                                The people who built these temples were not just constructing buildings.
                                <Text style={{fontFamily:'WorkSans-SemiBold'}}> They were creating legacies.</Text>
                                They were building experiences, emotions, communities, destinations and stories designed to outlive generations.
                            </Text>
                        </View>

                        <View style={{flexDirection:'row',alignItems:'center',marginTop:15}}>
                            <View style={{flex:2}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20}}>
                                    And that thought stayed with me throughout the <Text style={{fontFamily:'WorkSans-SemiBold'}}>journey.</Text>
                                </Text>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>
                                    Every great temple town in India was built around more than just faith. It created 
                                    <Text style={{fontFamily:'WorkSans-SemiBold'}}> movement.</Text> It created 
                                    <Text style={{fontFamily:'WorkSans-SemiBold'}}> livelihoods.</Text> It created 
                                    <Text style={{fontFamily:'WorkSans-SemiBold'}}> hospitality, culture, food, trade, architecture and human connection </Text> 
                                    that continue to thrive centuries later.
                                </Text>
                            </View>
                            <View style={{flex:1}}>
                                <Image
                                    source={{
                                        uri: 'https://duixj37yn5405.cloudfront.net/Postcard+Images/Arunachalam.jpg',
                                    }}
                                    style={{width:width*0.25,height:160}}
                                    resizeMode="cover"
                                />
                            </View>
                        </View>

                        <Image source={{uri:'https://duixj37yn5405.cloudfront.net/Postcard+Images/Guruvayur1.png'}}
                            style={styles.blogImage}
                        />

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>
                            In many ways, this is exactly what we dream of building at <Text style={{fontFamily:'WorkSans-SemiBold'}}>Fracspace.</Text>
                        </Text>

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>
                            Not just <Text style={{fontFamily:'WorkSans-SemiBold'}}>properties.</Text>
                        </Text>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20}}>Not just <Text style={{fontFamily:'WorkSans-SemiBold'}}>hospitality spaces.</Text></Text>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20}}>But <Text style={{fontFamily:'WorkSans-SemiBold'}}>destinations</Text> people emotionally connect with.</Text>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20}}>Places where people <Text style={{fontFamily:'WorkSans-SemiBold'}}>gather.</Text></Text>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20}}>Places where <Text style={{fontFamily:'WorkSans-SemiBold'}}>memories</Text> are created.</Text>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20}}>Places where <Text style={{fontFamily:'WorkSans-SemiBold'}}>architecture</Text> meets emotion.</Text>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20}}>Places people <Text style={{fontFamily:'WorkSans-SemiBold'}}>return</Text> to year after year.</Text>

                        <View style={{backgroundColor:'#0212650D',padding:10,borderRadius:5,marginTop:10,borderLeftWidth:5,borderLeftColor:'#021265'}}>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20}}>
                                One of the biggest realizations during this journey was how deeply rooted Indians are to experiences 
                                that carry <Text style={{fontFamily:'WorkSans-SemiBold'}}>meaning.</Text> Even today, millions travel across the country not for luxury, but for <Text style={{fontFamily:'WorkSans-SemiBold'}}>peace, 
                                connection</Text> and something they can feel beyond material value.
                            </Text>
                        </View>

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>
                            That is a <Text style={{fontFamily:'WorkSans-SemiBold'}}>powerful reminder</Text> for all of us in real estate and hospitality
                        </Text>

                        <Image 
                            source={{uri: 'https://duixj37yn5405.cloudfront.net/Postcard+Images/Overall+Villa.jpeg'}}
                            style={styles.blogImage}
                        />

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>
                            At <Text style={{fontFamily:'WorkSans-SemiBold'}}>Fracspace</Text>, 
                            whether it is a holiday home, a <Text style={{fontFamily:'WorkSans-SemiBold'}}>Dreamscape </Text> 
                            property, <Text style={{fontFamily:'WorkSans-SemiBold'}}>Altaira</Text>, a retreat, 
                            or even a small stay tucked away in nature - our vision has always been to create spaces 
                            that people feel attached to emotionally, not just financially.
                        </Text>

                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>And perhaps the biggest lesson this journey left me with is this:</Text>

                        <View style={{flexDirection:'row',}}>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#000',marginTop:2}}>• </Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginLeft:5}}>
                                The <Text style={{fontFamily:'WorkSans-SemiBold'}}>greatest structures</Text> in history were never built for short-term trends.
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',}}>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#000',marginTop:2}}>• </Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginLeft:5}}>
                                They were built to <Text style={{fontFamily:'WorkSans-SemiBold'}}>last.</Text>
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',}}>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#000',marginTop:2}}>• </Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginLeft:5}}>
                                Many of these temples took decades - sometimes centuries - to complete. Yet they were created with 
                                <Text style={{fontFamily:'WorkSans-SemiBold'}}> extraordinary patience, detailing, craftsmanship and long-term thinking.
                                The greatest structures in history were never built for short-term trends.</Text>
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',}}>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#000',marginTop:2}}>• </Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginLeft:5}}>
                               In today’s fast-moving world, we often expect everything <Text style={{fontFamily:'WorkSans-SemiBold'}}>instantly. </Text> 
                               But true <Text style={{fontFamily:'WorkSans-SemiBold'}}>value</Text>, true experiences and true legacies take time to build.
                            </Text>
                        </View>

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>
                            This <Text style={{fontFamily:'WorkSans-SemiBold'}}>journey</Text> has strengthened our belief that the projects we create henceforth must carry that same philosophy - <Text style={{fontFamily:'WorkSans-SemiBold'}}>to build with meaning, to build with emotion</Text>, and most importantly:
                        </Text>

                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>
                            To build to last.
                        </Text>

                        <View style={{backgroundColor:'#0212650D',padding:10,borderRadius:5,marginTop:10,borderLeftWidth:5,borderLeftColor:'#021265'}}>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20}}>
                                Not just for today’s generation, but for <Text style={{fontFamily:'WorkSans-SemiBold'}}>generations that come after us.</Text>
                                {"\n"}As I return from this journey, I come back with:
                                {"\n"}• renewed clarity,
                                {"\n"}• deeper gratitude,
                                {"\n"}• stronger faith,
                                {"\n"}and even bigger <Text style={{fontFamily:'WorkSans-SemiBold'}}>conviction</Text> in what we are building together.
                            </Text>
                        </View>

                        <Image 
                            source={{uri: 'https://duixj37yn5405.cloudfront.net/Postcard+Images/WhatsApp+Image+2026-05-18+at+10.11.53+AM.jpeg'}}
                            style={styles.blogImage}
                        />

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>
                            To everyone who has been part of the <Text style={{fontFamily:'WorkSans-SemiBold'}}>Fracspace journey</Text> so far - <Text style={{fontFamily:'WorkSans-SemiBold'}}>thank you.</Text>
                        </Text>

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>
                            And to those who have <Text style={{fontFamily:'WorkSans-SemiBold'}}>travelled with us, invested with us, stayed with us, trusted us and believed in us</Text> - this journey only reinforces one thing:
                        </Text>

                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',lineHeight: 20,marginTop:10}}>
                            We are not just building spaces.
                            {"\n"}We are building <Text style={{fontFamily:'WorkSans-SemiBold'}}>legacies, experiences and destinations</Text> that we hope people will remember for decades to come.
                            {"\n"}—
                            {"\n"}Unnath Reddy
                            {"\n"}CEO
                        </Text>
                    </View>
                }
    </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5EF',
    paddingHorizontal: 20,
  },

  topRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  blogText: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'WorkSans-SemiBold',
  },

  readContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    fontSize: 12,
    color: '#7A7A7A',
    fontFamily: 'WorkSans-Regular',
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7A7A7A',
    marginHorizontal: 8,
  },

  readText: {
    fontSize: 12,
    color: '#7A7A7A',
    fontFamily: 'WorkSans-Regular',
  },

  blogImage: {
    width: '100%',
    height: 200,
    marginTop: 24,
  },

  heading: {
    marginTop: 15,
    fontSize: 13,
    color: '#111',
    lineHeight: 22,
    letterSpacing: 0.5,
    fontFamily: 'WorkSans-SemiBold',
    textTransform: 'uppercase',
  },

  subHeading: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: '#7B6331',fontFamily: 'WorkSans-SemiBold',
  },

  description: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 20,
    color: '#000',
    fontFamily: 'WorkSans-Regular',
  },
});