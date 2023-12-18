import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, Touchable, TouchableOpacity, ScrollView, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo'
const Song_Details = () => {
    const [songData, setSongData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
    console.log(route.params);
    const uri = route?.params?.item?.track?.album?.uri;
    const id = uri.split(":")[2];
    console.log(id)
    console.log(uri);

    const fetchSong = async () => {
        const value = await AsyncStorage.getItem('token')
        console.log(value)
        if (value !== null) {
            try {
                const response = await axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`, {
                    headers: {
                        Authorization: `Bearer ${value}`,
                    },
                })
                const songsInfo = await response.data.items;
                console.log(songsInfo);
                setSongData(songsInfo);

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
        fetchSong();
    }, [])
    console.log(songData)





    return (
        <LinearGradient
            colors={["#040306", "#131624"]}
            style={{ flex: 1 }}>
            <ScrollView style={{ marginTop: 30 }}>
                <View style={{ flexDirection: 'row', padding: 12 }}>
                    <View >
                        <TouchableOpacity
                            style={{ marginHorizontal: 10 }}
                            onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back-circle-sharp" size={30} color="#F0E68C" />
                        </TouchableOpacity>
                    </View>


                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image style={{ width: 300, height: 300 }} source={{ uri: route?.params?.item?.track?.album?.images[0].url }} />
                    </View>
                </View>
                
                <Text style={{
                    color: "yellow",
                    fontSize: 24,
                    fontWeight: "bold",
                    marginTop: 15,
                    marginHorizontal: 10
                }}>{route?.params?.item?.track?.name}</Text>
                <View style={{marginHorizontal:10,flexDirection:'row',alignItems:'center',flexWrap:"wrap",marginTop:10,gap:5}}>
                    {route?.params?.item?.track?.artists?.map((item,index) => (
                        <Text style={{color:"#F0E68C",fontSize:12,fontWeight:"600"}}>{item.name}</Text>
                    ))}
                    </View>
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
                                <MaterialCommunityIcons name="cross-bolnisi" size={24} color="yellow" />
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
                    <View style={{marginTop:5, marginHorizontal:13}}>
                        {songData?.map((songData,index)=>(
                        <TouchableOpacity style={{marginVertical:11,flexDirection:'row',justifyContent:'space-between'}}>
                                <View>
                                    <Text style={{color:'#F0E68C',fontSize:14,fontWeight:"600"}}>{songData.name}</Text>
                                    <View style={{flexDirection:'row',alignItems:'center',marginTop:6,gap:5}}>
                                        {songData?.artists?.map((artist,index) =>(
                                            <Text style={{color:"white",fontSize:14,fontWeight:"400"}}>{artist?.name}</Text>
                                        ))}
                                    </View>
                                </View>
                                <Entypo name="dots-three-vertical" size={24} color="yellow" />
                        </TouchableOpacity>
                    ))}</View>
            </ScrollView>
        </LinearGradient>
    )
}
export default Song_Details;