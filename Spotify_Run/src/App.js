import React from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";

// import { MaterialIcons } from '@expo/vector-icons';
// import { Feather } from '@expo/vector-icons';
// import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from "@react-navigation/native";
import Login from "./Login";


const Tab = createMaterialBottomTabNavigator();

function Main() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    shadowOpacity: 4,
                    shadowRadius: 4,
                    elevation: 4,
                    shadowOffset: {
                        width: 0,
                        height: -4
                    },
                    borderTopWidth: 0
                }
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account" color={color} size={26} />),
                    // tabBarIcon: ({ focused }) => focused ? (
                    //     tabBarIcon:'format-list-bul
                    // ) :
                    //     (
                    //         <MaterialIcons name="home-filled" size={24} color="black" />
                    //     )
                }}


            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: "Profile",
                    headerShown: false,
                    tabBarLabelStyle: { color: "red" },
                    tabBarIcon: 'format-list-bulleted',
                }} />


        </Tab.Navigator>
    )
}
const Stack = createNativeStackNavigator();
function App_Run() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="Main_Screen"
                    component={Main}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}


export default App_Run;