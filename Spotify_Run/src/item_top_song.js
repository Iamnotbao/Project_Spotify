import React from "react";
import {View,Text,Image,TouchableOpacity, StyleSheet} from 'react-native';


const Item = ({ item }) => {
    return (
      <TouchableOpacity style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: "#282828",
        borderRadius: 4,
        elevation: 3,
      }}>
        {data && data.images && data.images.length > 0 && (
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
  export default Item;

  const styles = StyleSheet.create({});