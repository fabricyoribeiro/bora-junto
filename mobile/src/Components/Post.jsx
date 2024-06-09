import { FontAwesome } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View, Dimensions } from "react-native";

export default function Post() {
  const { width } = Dimensions.get("window");
  return (
    <View style={styles.post}>
      <View style={styles.user}>
        <Image style={styles.userIcon} />
        <Text style={styles.userId}>usuario</Text>
      </View>
      <View style={[styles.content, { height: width - 20 }]}></View>
      <View style={styles.buttons}>
        <FontAwesome name="heart-o" size={30} color="#aeaeae" />
        <FontAwesome name="comments-o" size={30} color="#aeaeae" />
        <FontAwesome name="share" size={30} color="#aeaeae" />
      </View>
      <Text style={styles.description}>
        <Text style={{ fontWeight: "bold" }}>usuario </Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ad
        tenetur veritatis fugit{" "}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    margin: 15,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  userId: {
  },
  userIcon: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: 10,
    backgroundColor: "#eaeaea",
  },
  content: {
    backgroundColor: "#eaeaea",
    borderRadius: 20,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 15,
  },
  description: {},
});
