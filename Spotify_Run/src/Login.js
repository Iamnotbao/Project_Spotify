import React, { useEffect, useState } from "react";
import axios from "axios";
import { Linking } from 'react-native';

import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { authorize } from "react-native-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const Login = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  // Configuration for Spotify OAuth
  const config = {
    clientId: '62a47492eec04acd9c378e883d88eca2',
    response_type: 'code',
    redirectUrl: 'spotifyapp://callback',
    scopes: [
      'user-read-email',
      'user-library-read',
      'user-read-recently-played',
      'user-top-read',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public' // or 'playlist-modify-private'
    ],
    serviceConfiguration: {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    },
  };

  // Function to initiate the authentication process
  const authenticate = async () => {
    try {
      const result = await authorize(config);
      console.log(result.accessToken);
      console.log('Authentication result:', result);
      try {
        if (result) {
          await AsyncStorage.setItem('token', result.accessToken);
          console.log("Storage successfully");
          navigation.navigate('Main_Screen');
        }
      } catch (err) {
        console.error('Error Storage:', err);
      }

    } catch (error) {
      console.error('Authentication error:', error);
    }
  };


  // useEffect(()=>{
  //   authenticate();
  // },[]);

  // Linking.addEventListener('url', (event) => {
  //     const { url } = event;
  //     const queryParams = new URLSearchParams(url.split('?')[1]);
  //     const code = queryParams.get('code');
  //     const state = queryParams.get('state');
  //     console.log(code);
  //     // Verify the state and handle the code
  //   });
  return (
    <LinearGradient
      colors={["#040306", "#131624"]}
      style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <MaterialIcons  style={{marginLeft:160}} name="library-music" size={80} color="yellow" />
        <Text style={{ color: "white", fontSize: 40, fontWeight: "bold", textAlign: "center", marginTop: 40, marginVertical: 10 }}>Enjoying lively Baki songs</Text>
      </SafeAreaView>
      <View style={{ height: 80 }} />
      <TouchableOpacity
        onPress={authenticate}
        style={{
          backgroundColor: "yellow", padding: 10, marginLeft: "auto", marginRight: "auto", width: 300, borderRadius: 25,
          alignItems: "center", justifyContent: "center", marginVertical: 10
        }}>
        <Text style={{ color: "black", fontWeight: "bold" }}>Sign in with Baki</Text>
      </TouchableOpacity>


      <TouchableOpacity style={{
        backgroundColor: "black", padding: 10, marginLeft: "auto", marginRight: "auto",
        width: 300, borderRadius: 25, alignItems: "center", justifyContent: "center", flexDirection: "row", marginVertical: 10, borderColor: "#C0C0C0", borderWidth: 0.8
      }}>
        <Text style={{ color: "white", fontWeight: "500" }}>Continue with phone number</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{
        backgroundColor: "black", padding: 10, marginLeft: "auto", marginRight: "auto",
        width: 300, borderRadius: 25, alignItems: "center", justifyContent: "center", flexDirection: "row", marginVertical: 10, borderColor: "#C0C0C0", borderWidth: 0.8
      }}>
        <Text style={{ color: "white", fontWeight: "500" }}>Sign In with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{
        backgroundColor: "black", padding: 10, marginLeft: "auto", marginRight: "auto",
        width: 300, borderRadius: 25, alignItems: "center", justifyContent: "center", flexDirection: "row", marginVertical: 10, borderColor: "#C0C0C0", borderWidth: 0.8
      }}>
        <Text style={{ color: "white", fontWeight: "500" }}>Sign In with Facebook</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
export default Login;