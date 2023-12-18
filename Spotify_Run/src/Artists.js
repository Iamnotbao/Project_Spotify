import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Touchable, TouchableOpacity } from 'react-native'
import LinearGradient from "react-native-linear-gradient";
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



const Artists = () => {
    const [artists, setArtists] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const route = useRoute();
    const navigation = useNavigation();
    console.log(route.params);
    const uri = route?.params?.item?.uri;
    const id = uri.split(':')[2]
    console.log(id)
    const list_song_artist = async () => {
        const value = await AsyncStorage.getItem('token')
        console.log(value);
        if (value !== null) {
            try {
                const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
                    headers: {
                        Authorization: `Bearer ${value}`,
                    },
                })
                const artist_response = await response.data.items;
                console.log(artist_response)
                setArtists(artist_response)

            } catch (err) {
                console.log(err.message)
                if (err.response && err.response.status === 401) {
                    console.log('Token maybe invalid . Please try to login again')
                }
                setIsLoading(false)
            };
        }





    }
    useEffect(() => {
        list_song_artist();
    }, [])
    console.log(artists);



    return (

        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <ScrollView style={{ marginTop: 10 }}>
                <View style={{ height: 10 }} />
                {artists && (
                    <View>
                        <View style={{ flexDirection: 'row', gap: 4 }}>
                            <View >
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}>
                                    <Ionicons name="arrow-back-circle-sharp" size={30} color="#F0E68C" />
                                </TouchableOpacity>
                            </View>
                            <Image style={{ width: 400, height: 300, borderRadius: 4 }}
                                source={{ uri: route?.params?.item?.images[0].url }} />
                        </View>
                        <View style={{ gap: 7, marginHorizontal: 12, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: "bold", fontSize: 30 }}>{route?.params?.item?.name}</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>(Top Billard:{route?.params?.item?.popularity})</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', marginHorizontal: 12 }}>Genres:
                                {route?.params?.item?.genres.map((genre, index) => (
                                    <Text style={{ color: 'yellow', fontWeight: "600", fontSize: 12 }}> {genre}, </Text>

                                ))}
                            </Text>
                        </View>

                    </View>
                )}
                <View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10 }}>
                        <TouchableOpacity style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: "#1DB954",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <FontAwesome5 name="arrow-alt-circle-down" size={24} color="white" />

                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, }}>
                                <MaterialCommunityIcons name="cross-bolnisi" size={24} color="#1D8954" />
                                <TouchableOpacity style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#1D8954',

                                }}
                                    

                                >
                                    <AntDesign name="playcircleo" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10, marginHorizontal: 12 }}><Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25, }}>Popularity</Text></View>
                <View style={{ marginTop: 10 }} />


                {artists && artists.map((item, index) => (
                    <View style={{ padding: 5, marginVertical: 5 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Image style={{ width: 50, height: 50, borderRadius: 6 }}
                                source={{ uri: item?.images[0]?.url }} />
                            <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                                <View>
                                    <Text numberOfLines={1} style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>{item?.name}</Text>
                                    <Text style={{ color: "grey" }}>release:{item?.release_date}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <AntDesign name="heart" size={24} color="yellow" />
                                    <Entypo name="dots-three-vertical" size={24} color="yellow" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}

            </ScrollView>

        </LinearGradient>

    )
}
export default Artists;