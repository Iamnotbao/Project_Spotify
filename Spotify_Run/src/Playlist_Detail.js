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

const PlayList_Detail = () => {
    const [playlist, setPlayList] = useState(null);
    const  [isLoading,setIsLoading]=useState(true)
    const route = useRoute();
    console.log(route.params);
    const uri = route?.params?.item?.uri;
    const id = uri.split(':')[2];
    console.log(id);
    console.log(uri)
    const navigation = useNavigation();

    const getPlayList = async () => {
        const value = await AsyncStorage.getItem('token')
        console.log(value)
        if (value !== null) {
            try {
                const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {

                    headers: {
                        Authorization: `Bearer ${value}`,
                    },
                })
                const list_receive = await response.data;
                setPlayList(list_receive);
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
useEffect(()=>{
    getPlayList();
},[])
console.log(playlist)

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
                    <Image style={{ width: 300, height: 300 }} source={{ uri: route?.params?.item?.images[0].url }} />
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
                    <Text style={{color:"#F0E68C",fontSize:12,fontWeight:"600"}}>{route?.params?.item?.name}</Text>
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
                    {playlist?.tracks?.items.map((item,index)=>(
                    <TouchableOpacity style={{marginVertical:11,flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={{flexDirection:'row',alignItems:'center',gap:7}}>
                            <Image source={{uri: item?.track?.album?.images[0].url}} style={{width:60, height:60,borderRadius:3}} />
                                <Text style={{color:'white',fontSize:16,fontWeight:"600"}}>{item?.track?.name}</Text>
                            </View>                         
                            <Entypo name="dots-three-vertical" size={24} color="yellow" />
                    </TouchableOpacity>
                ))}</View>
        </ScrollView>
    </LinearGradient>
    )
}
export default PlayList_Detail;