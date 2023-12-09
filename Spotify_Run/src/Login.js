import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { authorize } from "react-native-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Login = () => {

    const config = {
        clientId: "62a47492eec04acd9c378e883d88eca2",
        clientSecret: "7c18f624d4134f14861f4059cb697055",
        redirectUrl: "http://localhost:8081/callback",
        scopes: [
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public"
        ],
        serviceConfiguration: {
            authorizationEndpoint: 'https://accounts.spotify.com/authorize',
            tokenEndpoint: 'https://accounts.spotify.com/api/token',
        },
    };
    const authenticate = async () => {
        try {
            const authState = await authorize(config);
            console.log(authState);
        } catch (error) {
            console.log('Failed to authenticate', error);
        }
    };






    return (
        <LinearGradient
            colors={["#040306", "#131624"]}
            style={{ flex: 1 }}>
            <SafeAreaView>
                <View style={{ height: 80 }} />
                <FontAwesome style={{ textAlign: "center" }} name="spotify" size={80} color="white" />
                <Text style={{ color: "white", fontSize: 40, fontWeight: "bold", textAlign: "center", marginTop: 40, marginVertical: 10 }}>Millions of Songs Free on Spotify</Text>
            </SafeAreaView>
            <View style={{ height: 80 }} />
            <TouchableOpacity
                onPress={authenticate} 
                style={{
                    backgroundColor: "#1DB964", padding: 10, marginLeft: "auto", marginRight: "auto", width: 300, borderRadius: 25,
                    alignItems: "center", justifyContent: "center", marginVertical: 10
                }}>
                <Text style={{ color: "black", fontWeight: "bold" }}>Sign In with Spotify</Text>
            </TouchableOpacity>


            <TouchableOpacity style={{
                backgroundColor: "#0000FF", padding: 10, marginLeft: "auto", marginRight: "auto",
                width: 300, borderRadius: 25, alignItems: "center", justifyContent: "center", flexDirection: "row", marginVertical: 10, borderColor: "#C0C0C0", borderWidth: 0.8
            }}>
                <Text style={{ color: "white", fontWeight: "500" }}>Continue with phone number</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                backgroundColor: "#0000FF", padding: 10, marginLeft: "auto", marginRight: "auto",
                width: 300, borderRadius: 25, alignItems: "center", justifyContent: "center", flexDirection: "row", marginVertical: 10, borderColor: "#C0C0C0", borderWidth: 0.8
            }}>
                <Text style={{ color: "white", fontWeight: "500" }}>Sign In with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                backgroundColor: "#0000FF", padding: 10, marginLeft: "auto", marginRight: "auto",
                width: 300, borderRadius: 25, alignItems: "center", justifyContent: "center", flexDirection: "row", marginVertical: 10, borderColor: "#C0C0C0", borderWidth: 0.8
            }}>
                <Text style={{ color: "white", fontWeight: "500" }}>Sign In with Facebook</Text>
            </TouchableOpacity>
        </LinearGradient>
    )
}
export default Login;