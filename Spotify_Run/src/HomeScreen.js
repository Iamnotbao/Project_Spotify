import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, FlatList } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import axios from "axios";
import { useNavigation } from "@react-navigation/native";




const HomeScreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [familiar_song, setFamiliarSong] = useState(null);
  const [topAprtist, setTopArtist] = useState([]);

  const navigation = useNavigation();
  const fetchData = async () => {
    const value = await AsyncStorage.getItem('token');
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
  const message = () => {
    const presentTime = new Date().getHours();
    if (presentTime < 12) {
      return "Ohayo (~^ 3 ^~)";
    } else if (presentTime < 17) {
      return "Konichiwa (~T v T~)";
    } else {
      return "Konbanwa (~V . V~)"
    }
  }

  const recentlySongs = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=6', {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        })
        const recent_songs = response.data.items;
        setFamiliarSong(recent_songs);
        setIsLoading(false);
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

  // console.log(familiar_song);


  const Artists = async () => {
    const value = await AsyncStorage.getItem('token');
    const type = "artists"
    console.log(value)
    if (value !== null) {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        })
        const top_artists = response.data.items;
        setTopArtist(top_artists);
        setIsLoading(false);
        // console.log(top_artists)
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
  console.log(topAprtist)


  const message_User = message();
  useEffect(() => {
    fetchData();
    Artists();
    recentlySongs();

  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }



  // useEffect(()=>{
  //   Artists();
  // },[])

  // const Artists_Display = ({item})=>{
  //   return(
  // <View> </View>

  //   )

  // }

  const Item = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Infomation_Screen', { item: item })}
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 8,
          backgroundColor: "#282828",
          borderRadius: 4,
          elevation: 3,
        }}>
        {item && (
          <Image style={{
            height: 60, width: 60
          }}
            source={{ uri: item.track.album.images[0].url }} />)}
        <View style={{ flex: 1, marginHorizontal: 8, justifyContent: "center" }}>
          <Text
            numberOfLines={2}
            style={{ fontSize: 15, fontWeight: "bold", color: "white" }}
          >
            {item.track.name}
          </Text>
        </View>
      </TouchableOpacity>
    )

  }

  const Artists_Display = ({ item }) => {
    return (
      <TouchableOpacity 
      onPress={()=> navigation.navigate('Artist_information',{item:item})} style={{ margin: 10 }}>
        {item && (
          <Image
            style={{ width: 110, height: 110, borderRadius: 5 }}
            source={{ uri: item.images[0].url }}
          />)}
        {item && (
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: "white",
              marginTop: 10,
            }}
          >
            {item?.name}
          </Text>)}
      </TouchableOpacity>
    );
  }
  const List_of_recent_Songs = ({ item }) => {
    return (
      <TouchableOpacity style={{ justifyContent: 'space-between', margin: 10, }}
      onPress={()=> navigation.navigate('Infomation_Screen',{item:item})}>
        
        {item && (
          <Image
            style={{ height: 110, width: 110, borderRadius: 5 }}
            source={{ uri: item.track.album.images[0].url }} />
        )}{item && (
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: "white",
              marginTop: 10,
            }}>{item?.track?.name}</Text>
        )}
      </TouchableOpacity>
    )
  }




  return (
    <LinearGradient
      colors={["#040306", "#131624"]}
      style={{ flex: 1 }}>

      <ScrollView style={{ marginTop: 3 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {data && data.images && data.images.length > 0 && (
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 100,
                marginTop: 20,
                resizeMode: "cover",
              }}
              source={{ uri: data.images[0].url }}
            />
          )
          }
          <Text style={{ color: 'white', marginLeft: 5, fontSize: 16, fontWeight: 'bold', marginTop: 20, }}>{message_User}</Text>
          <MaterialCommunityIcons style={{ marginLeft: 220, marginTop: 20 }} name="lightning-bolt-outline" size={24} color="white" />
        </View>
        <View style={{ marginHorizontal: 12, marginVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "yellow"
              , fontWeight: 'bold', borderRadius: 30, padding: 10,

            }}
          >
            <Text style={{ color: 'black' }}>Music</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "yellow"
              , fontWeight: 'bold', borderRadius: 30, padding: 10,

            }}
          >
            <Text style={{ color: 'black' }}>Podcards & Shows</Text>
          </TouchableOpacity>
        </View>


        <View style={{ height: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Favourite_Screen')}
              style={{
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                flex: 1,
                marginHorizontal: 10,
                marginVertical: 8,
                backgroundColor: "#202020",
                borderRadius: 4,
                elevation: 3,
              }}>
              <LinearGradient colors={["#33006F", "#FFFFFF"]}>
                <TouchableOpacity style={{ height: 60, width: 60, justifyContent: "center", alignItems: "center" }}>
                  <AntDesign name="heart" size={24} color="black" />
                </TouchableOpacity>
              </LinearGradient>
              <Text style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>
                Liked Songs
              </Text>
            </TouchableOpacity>
            <View style={{
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: "#282828",
              borderRadius: 4,
              elevation: 3,
            }}>
              <Image
                style={{ height: 55, width: 55 }}
                source={{ uri: "https://i.pravatar.cc/180" }} />
              <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>80's HipHop</Text>
            </View>
          </View>
          <View>
          </View>
        </View>
        <View style={{ marginTop: 60 }}>
          <FlatList
            data={familiar_song}
            renderItem={Item}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}

          />
        </View>
        <View>
          <Text style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginHorizontal: 10,
            marginTop: 10,
          }}>Your Favourite Artists</Text>
          <FlatList
            data={topAprtist}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Artists_Display item={item} key={index} />)}
          />
        </View>
        <View style={{ marginTop: 1 }}>
          <Text style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginHorizontal: 10,
            marginBottom: 10,
          }}>Previous Track</Text>
          <FlatList
            data={familiar_song}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <List_of_recent_Songs item={item} key={index} />)}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;
