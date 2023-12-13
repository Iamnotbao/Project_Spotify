import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';




const HomeScreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const message_User = message();
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <LinearGradient
      colors={["#040306", "#131624"]}
      style={{ flex: 1 }}>

      <View>
        <View style={{ flexDirection: "row", alignItems: "center" , justifyContent:"space-between"}}>
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
          <MaterialCommunityIcons  style={{marginLeft:220, marginTop:20}} name="lightning-bolt-outline" size={24} color="white" />
        </View>
       <View style={{marginHorizontal:12, marginVertical:5, flexDirection:'row',alignItems:'center',gap:10}}> 
        <TouchableOpacity
        style={{
          backgroundColor:"yellow"
          ,fontWeight:'bold',borderRadius:30,padding:10,

        }}  
        >
          <Text style={{color:'black'}}>Music</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={{
          backgroundColor:"yellow"
          ,fontWeight:'bold',borderRadius:30,padding:10,

        }}  
        >
          <Text style={{color:'black'}}>Podcards & Shows</Text>
        </TouchableOpacity>
       </View>
        
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;
