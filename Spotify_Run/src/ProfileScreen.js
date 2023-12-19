import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'


const ProfileScreen = () => {
    const [data, setData] = useState(null);
    const [listSongs, setListSong] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const navigation = useNavigation();
    const fetchData = async () => {
        const value = await AsyncStorage.getItem('token');
        console.log(value)
        if (value !== null) {
            try {
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: {
                        Authorization: `Bearer ${value}`,
                    },
                });
                const data_receive = await response.json();
                setData(data_receive);
                setIsLoading(false);
            } catch (err) {
                console.log(err.message);
                if (err.response && err.response.status === 401) {
                    console.log('Token may be expired or invalid. Please re-authenticate.');
                }
                setIsLoading(false);
            }
        }
    };
    useEffect(() => { fetchData(); }, [])
    console.log(data);

    const allList = async () => {
        const value = await AsyncStorage.getItem('token');
        console.log(value);
        if (value !== null) {
            try {
                const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        Authorization: `Bearer ${value}`,
                    },
                })
                const recent_songs = response.data.items;
                setListSong(recent_songs);
                setIsLoading(false);
            } catch (err) {
                console.log(err.message);
                if (err.response && err.response.status === 401) {
                    console.log('Token may be expired or invalid. Please re-authenticate.');
                }
                setIsLoading(false);
            }
        }
    }
    useEffect(() => {
        allList();
    }, [])
    console.log(listSongs);


    return (<LinearGradient colors={["#040306", "#131624"]}
        style={{ flex: 1 }}
    >
        <ScrollView style={{ marginTop: 30 }}>
        <View >
                    <TouchableOpacity
                        style={{ marginHorizontal: 10 }}
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-circle-sharp" size={30} color="#F0E68C" />
                    </TouchableOpacity>
                </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
               
                <View >
                    {data && data.images && data.images.length > 0 && (
                        <Image
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 100,
                                marginTop: 10,
                                resizeMode: "cover",
                            }}
                            source={{ uri: data.images[0].url }}
                        />)}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '85%' }}>
                    <View >
                        <Text style={{ color: "#8181a3", fontSize: 16, fontWeight: 'bold' }}>{data?.display_name}</Text>
                        <Text style={{ color: "#8181a3", fontSize: 12, fontWeight: 'bold' }}>{data?.email}</Text>
                    </View>


                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Entypo name="log-out" size={24} color="white" />
                    </TouchableOpacity>

                </View>


            </View>
            <View>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>~PlayLists~</Text>
                <View style={{ padding: 15 }}>
                    {listSongs && listSongs.map((listsong, index) => (
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginVertical: 11 }}
                            onPress={() => navigation.navigate('playList', { item: listsong })}
                        >
                            <Image source={{
                                uri: listsong?.images[0]?.url
                            }}
                                style={{ width: 100, height: 100, borderRadius: 4 }} />
                            <View>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{listsong?.name}</Text>
                                <Text style={{ color: 'white', fontWeight: '500' }}>{Math.floor(Math.random() * 1000)} Followers</Text>
                            </View>
                        </TouchableOpacity>


                    ))}

                </View>

            </View>
        </ScrollView>
    </LinearGradient>

    )
}
export default ProfileScreen;