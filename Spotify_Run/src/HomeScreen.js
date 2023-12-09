import React, { useEffect, useState } from "react";
import { View, Text,ScrollView  } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const HomeScreen = () => {
 const [data,setData] = useState([]);
 const[isLoading,setIsLoading]= useState(true);
 
  const fetchData =async ()=>{
    const value= await AsyncStorage.getItem("token");
    console.log(value);
    try{
  const response =  await axios.get('https://api.spotify.com/v1/me',{
        headers:{
            
            Authorization: `Bearer ${value}`

        }
         
    })
    const data_receive = await response.json();
    isLoading(False);
    setData(data_receive);
    return(data_receive);

    } catch (err) {
        console.log(err.message);
        if (err.response && err.response.status === 401) {
          // Handle 401 Unauthorized error
          console.log('Token may be expired or invalid. Please re-authenticate.');
        }
    }
}



  useEffect(()=>{
    fetchData();
  },[])
  console.log(data)




    return (
        <LinearGradient
            colors={["#040306", "#131624"]}
            style={{ flex: 1 }}>
                <ScrollView style={{marginTop:50}}>
                    <Text style={{color:"white"}}>Test ok</Text>


                </ScrollView>




        </LinearGradient>

    )
}
export default HomeScreen;