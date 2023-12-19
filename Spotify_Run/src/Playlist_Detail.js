import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo'
import TrackPlayer, { usePlaybackState, useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { BottomModal, ModalContent } from 'react-native-modals';
import { Play } from "./SongContext";

import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const PlayList_Detail = () => {
    const [playlist, setPlayList] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [isPlaying,setIsPlaying]=useState(true);
    const route = useRoute();
    console.log(route.params);
    const [presentSongIndex, setPresentSongIndex] = useState();
    const uri = route?.params?.item?.uri;
    const id = uri.split(':')[2];
    console.log(id);
    console.log(uri)
    const navigation = useNavigation();


    const [modalDisplay, setModalDisplay] = useState(false);
    const { presentSong, setPresentSong } = useContext(Play)
    const [songs, setSongs] = useState(null)
    const progress = useProgress();

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
    useEffect(() => {
        getPlayList();
       
    }, [])
   
    




    useEffect(() => {
        play(presentSong);
    }, [presentSong]
    ) 


    TrackPlayer.setupPlayer().then(async () => {
        console.log('Player is ready');
    });

    const play = async (nextTrack) => {
        console.log(nextTrack);
        const preview_url = nextTrack?.track?.preview_url;
        const trackId = nextTrack?.track?.id;
        const trackTitle = nextTrack?.track?.name;
        const trackArtist = nextTrack?.track?.artists[0]?.name;

        try {

            await TrackPlayer.reset();
            await TrackPlayer.add({
                id: trackId,
                url: preview_url,
                title: trackTitle,
                artist: trackArtist,
            });
            TrackPlayer.play();
        } catch (error) {
            console.log('There was an error playing the track:', error);
        }
        const playbackState = await TrackPlayer.getState();
        setIsPlaying(false);
        console.log('Playback state:', playbackState);

    };
    const Pause_Handle = async () => {
        const position = await progress.position;
        const duration = await progress.duration;

        if (isPlaying) {
            await TrackPlayer.pause();
            setIsPlaying(false);
        } else {
            if (position >= duration) {
                await TrackPlayer.seekTo(0); // Start from the beginning if the song has finished
            }
            await TrackPlayer.play();
            setIsPlaying(true);
        }
    };

   console.log(presentSongIndex);


    const changePresentSong = async (index) =>{
        const length = playlist?.tracks?.items.length-1;
        if(presentSongIndex == 0 && index==-1){
            setPresentSongIndex(length)
            setPresentSong(playlist?.tracks?.items[presentSongIndex])

        } else
        if(presentSongIndex == length && index==1){
            setPresentSongIndex(0)
            setPresentSong(playlist?.tracks?.items[presentSongIndex])
        }else{
            setPresentSongIndex(presentSongIndex + index)
            setPresentSong(playlist?.tracks?.items[presentSongIndex])
           
        }
    }

    return (
        <>
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
                        <Image style={{ width: 300, height: 300 , borderRadius:4 }} source={{ uri: route?.params?.item?.images[0].url }} />
                    </View>
                </View>


                <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', flexWrap: "wrap", marginTop: 10, gap: 5 }}>
                    <Text style={{ color: "#F0E68C", fontSize: 30, fontWeight: "600" }}>{route?.params?.item?.name}</Text>
                </View>

                <View style={{ marginTop: 5, marginHorizontal: 13 }}>
                    {playlist?.tracks?.items.map((item, index) => (
                        <>
                            <TouchableOpacity onPress={() => {setPresentSong(item); setPresentSongIndex(index);}} style={{ marginVertical: 11, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                                    <Image source={{ uri: item?.track?.album?.images[0].url }} style={{ width: 60, height: 60, borderRadius: 3 }} />
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: "600" }}>{item?.track?.name}</Text>
                                </View>
                                <Entypo name="dots-three-vertical" size={24} color="yellow" />
                            </TouchableOpacity>

                        </>
                    ))}

                </View>
            </ScrollView>
        </LinearGradient>
        
        
        {presentSong && (
            <TouchableOpacity
                onPress={() => setModalDisplay(!modalDisplay)}
                style={{
                    backgroundColor: "#5072A7",
                    width: "90%",
                    padding: 10,
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: 15,
                    position: "absolute",
                    borderRadius: 6,
                    left: 20,
                    bottom: 10,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}>
                <View style={{ flexDirection: "row", alignItems: 'center', gap: 10, }}>
                    <Image style={{ width: 40, height: 40 }} source={{ uri: presentSong?.track.album?.images[0].url }} />
                    <Text numberOfLines={1} style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>{presentSong?.track?.name} . {presentSong?.track?.artists[0].name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <AntDesign name="heart" size={24} color="yellow" />
                    <TouchableOpacity onPress={Pause_Handle}>
                        <AntDesign name="pausecircle" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )}
        <BottomModal
            visible={modalDisplay}
            onHardwareBackPress={() => setModalDisplay(false)}
            swipeDirection={["up", "down"]}
            swipeThreshold={200}
        >
            <ModalContent style={{ height: '100%', width: '100%', backgroundColor: '#5072A7' }}>
                <View style={{ height: '100%', width: '100%', marginTop: 10 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <AntDesign onPress={() => setModalDisplay(!modalDisplay)} name="circledowno" size={24} color="yellow" />
                        <Text style={{ fontSize: 17, fontWeight: "bold", color: "yellow" }}>{presentSong?.track?.name}</Text>
                        <Entypo name="dots-three-vertical" size={24} color="yellow" />
                    </TouchableOpacity>
                    <View style={{ height: 50 }} />
                    <View style={{ padding: 10 }}>
                        <Image style={{ height: 330, width: '100%' }}
                            source={{ uri: presentSong?.track?.album?.images[0].url }} />
                        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ fontSize: 23, fontWeight: 'bold', color: 'white' }}>{presentSong?.track?.name}</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F7CE68', marginTop: 3 }}>{presentSong?.track?.artists[0].name}</Text>
                            </View>
                            <AntDesign name="heart" size={24} color="yellow" />
                        </View>
                        <View>

                            <View>
                                <Slider
                                    style={{
                                        width: "350",
                                        height: "40",
                                        marginTop: "25",
                                        flexDirection: 'row'
                                    }}
                                    value={progress.position}
                                    minimumValue={0}
                                    maximumValue={progress.duration}
                                    thumbTintColor="blue"
                                    minimumTrackTintColor="#FFF"
                                    maximumTrackTintColor="red"
                                    onSlidingComplete={() => { setIsPlaying(false) }}
                                />
                                <View style={{
                                    width: 340,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                    <Text style={{ color: '#FFF' }}>
                                        00:{
                                            Math.round(progress.position)
                                        }
                                    </Text>
                                    <Text style={{ color: '#FFF' }}>
                                        00:{Math.round(progress.duration)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'space-between',
                            marginTop: 20
                        }}>
                            <TouchableOpacity><MaterialCommunityIcons name="cross-bolnisi" size={35} color="yellow" /></TouchableOpacity>
                            <TouchableOpacity onPress={()=>changePresentSong(-1)}><Feather name="skip-back" size={35} color="white" /></TouchableOpacity>
                            <TouchableOpacity onPress={ Pause_Handle }><FontAwesome name="pause-circle-o" size={45} color="white" /></TouchableOpacity>
                            <TouchableOpacity onPress={()=>changePresentSong(1)}><Feather name="skip-forward" size={35} color="white" /></TouchableOpacity>
                            <TouchableOpacity><Ionicons name="repeat-outline" size={35} color="yellow" /></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ModalContent>
        </BottomModal >
        </>
    )
}
export default PlayList_Detail;