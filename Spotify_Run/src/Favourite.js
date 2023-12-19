import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Image, Pressable } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import { Play } from "./SongContext";
import { BottomModal, ModalContent } from 'react-native-modals';
import TrackPlayer, { usePlaybackState, useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';


const Favourite_Songs = () => {
    const [searchInput, setSearchInput] = useState('');
    const navigation = useNavigation();
    const [modalDisplay, setModalDisplay] = useState(false);
    const [songs, setSongs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { presentSong, setPresentSong } = useContext(Play)
    const [presentSongIndex, setPresentSongIndex] = useState();
    const [isPlaying, setIsPlaying] = useState(true);
    const circleSize = 12;
    const progress = useProgress();


    const getListSongs = async () => {
        const value = await AsyncStorage.getItem('token');
        console.log(value)
        if (value !== null) {
            try {
                const response = await axios.get('https://api.spotify.com/v1/me/tracks?offset=0&limit=50', {
                    headers: {
                        Authorization: `Bearer ${value}`,
                    },
                    params: {
                        limit: 50,
                    },
                })
                const list = await response.data.items;
                // console.log(list)
                setSongs(list);


            }
            catch (err) {
                console.log(err.message);
                if (err.response && err.response.status === 401) {
                    console.log('Token may be expired or invalid. Please re-authenticate.');
                }
                setIsLoading(false);
            }
        }
    }


    useEffect(() => {
        getListSongs();
    }, [])




    const playSongs = async () => {
        setPresentSong(songs[0])
        setPresentSongIndex(0)
    }
    useEffect(() => {
        console.log(presentSong)
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
    
const searchHandle =()=>{
    const filteredTracks = songs.filter((item) =>
    item.track.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  setSongs(filteredTracks);
}



    const Songs_Item = ({ item, index, onPress, isPlaying }) => {

        
        const onPress_Operation = async () => {
            setPresentSongIndex(index)
            setPresentSong(item);
            onPress(item);
            
        }

        return (
            <TouchableOpacity onPress={onPress_Operation} style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
            >
                <Image
                    style={{ height: 60, width: 60, marginRight: 10 }} source={{ uri: item?.track.album.images[1].url }} />
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={isPlaying ? { fontWeight: 'bold', fontSize: 12, color: '#3FFF00' } : { fontWeight: 'bold', fontSize: 12, color: 'white' }}
                    >{item?.track?.name}</Text>
                    <Text style={{ marginTop: 4, color: "#989898" }}>{item?.track.artists[0].name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginHorizontal: 10 }}>
                    <FontAwesome name="heart" size={24} color="#1D8954" />
                    <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />

                </View>
            </TouchableOpacity>
        )
    }

    const changePresentSong = (index) =>{
        const length = songs.length -1;
        if(presentSongIndex == 0 && index==-1){
            setPresentSongIndex(length)
            setPresentSong(songs[presentSongIndex])

        } else
        if(presentSongIndex == length && index==1){
            setPresentSongIndex(0)
            setPresentSong(songs[presentSongIndex])
        }else{
            setPresentSongIndex(presentSongIndex + index)
            setPresentSong(songs[presentSongIndex])
        }
    }
    return (
        <>
            <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, marginTop: 30 }}>
                    <TouchableOpacity
                        style={{ marginHorizontal: 10 }}
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-circle-sharp" size={30} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        marginHorizontal: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 9,
                    }}>
                        <TouchableOpacity style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            backgroundColor: "#42275a",
                            padding: 2,
                            flex: 1,
                            borderRadius: 3,
                            height: 50
                        }}>
                            <Ionicons name="search-outline" size={30} color="black" />
                            <TextInput style={{ fontWeight: "bold" }}
                                onChangeText={(text) => setSearchInput(text)}
                                value={searchInput}
                                placeholder="Typed your songs"
                                placeholderTextColor={'white'}
                            ></TextInput>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={searchHandle}
                            style={{
                                marginHorizontal: 10,
                                backgroundColor: "#42275a",
                                padding: 10,
                                borderRadius: 3,
                                height: 50,
                                alignContent: 'center'
                            }}

                        >
                            <Text style={{ color: "white" }}>Search</Text>

                        </TouchableOpacity>
                    </TouchableOpacity>

                    <View style={{ height: 50 }} />
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>Liked Songs</Text>
                        <Text style={{ color: "white", fontSize: 13, marginTop: 5 }}>500 Songs</Text>
                    </View>
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
                                    onPress={playSongs}

                                >
                                    <AntDesign name="playcircleo" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                        </TouchableOpacity>
                    </TouchableOpacity>
                    <FlatList
                        data={songs}
                        renderItem={({ item, index }) => (
                            <Songs_Item 
                                item={item}
                                index={index}
                                onPress={play}
                                isPlaying={item === presentSong} />
                        )} />
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
                                {/* <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    padding: 10,
                                }}>
                                  
                                </View> */}
                                <Text>Progress</Text>
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
                                <TouchableOpacity onPress={()=>changePresentSong(-1)} ><Feather name="skip-back" size={35} color="white" /></TouchableOpacity>
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
export default Favourite_Songs

