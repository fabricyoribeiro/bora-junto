import { FontAwesome } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import * as RootNavigation from '../../RootNavigation'

export default function Contact({ user }) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => { RootNavigation.navigate("UserProfile", { user: user }) }}>
        <Image source={{ uri: user.profile_pic_url }} style={styles.image} />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => { RootNavigation.navigate("Conversation", { username: user.name, email: user.email, receiverId: user.id },) }}>
        <View style={{ width: '100%' }}>
          <Text style={styles.title}>
            {user.name} {user.online ? (<FontAwesome name="circle" color="#5f6" />) : (<></>)}
          </Text>
          <Text style={styles.subtitle}>{user.lastMessage || ''}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
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
