import { FontAwesome } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as RootNavigation from '../../RootNavigation'

export default function Contact({ name, imageUrl, lastMessage, online }) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => {RootNavigation.navigate("Conversation", {username: name},) }}>
      <Image style={styles.image} />
      <View>
        <Text style={styles.title}>
          {name} {online ? (<FontAwesome name="circle" color="#5f6" />) : (<></>)}
        </Text>
        <Text style={styles.subtitle}>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#eaeaea",
  },
  title: {
    fontFamily: "Montserrat-BoldItalic",
    color: "black",
    fontSize: 18,
  },
  subtitle: {
    fontFamily: "Montserrat-Italic",
    color: "black",
    fontSize: 14,
  },
});
