import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { FontAwesome6, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Post from "../Components/Post";

export default function Feed({ navigation, onLogout }) {
  const [position, setPosition] = useState(null);
  const [cidade, setCidade] = useState("Serra%20Talhada");
  const [clima, setClima] = useState();
  const [progress, setProgress] = useState(8);

  async function requestLocationPermission() {
    const { granted } = requestForegroundPermissionsAsync();
    if (granted) {
      const currentPossition = await getCurrentPositionAsync();
      setPosition = currentPossition;
      console.log(position);
    }
  }

  const getclima = () => {
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=e625166897db49c6bd0232242241205&q=Serra%20Talhada&aqi=no`
    )
      .then((res) => res.json())
      .then((dados) => {
        console.log(dados);
        setClima(dados);
      });
  };
  useEffect(() => {
    requestLocationPermission();
    getclima();
  }, []);

  return (
    <View style={styles.bg}>
      <Header title={'Feed'} onLogout={onLogout}/>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView
            style={styles.stories}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.story}>
              <View style={styles.storyImage}></View>
              <Text>usuario</Text>
            </View>
            <View style={styles.story}>
              <View style={styles.storyImage}></View>
              <Text>usuario</Text>
            </View>
            <View style={styles.story}>
              <View style={styles.storyImage}></View>
              <Text>usuario</Text>
            </View>
            <View style={styles.story}>
              <View style={styles.storyImage}></View>
              <Text>usuario</Text>
            </View>
            <View style={styles.story}>
              <View style={styles.storyImage}></View>
              <Text>usuario</Text>
            </View>
            <View style={styles.story}>
              <View style={styles.storyImage}></View>
              <Text>usuario</Text>
            </View>
            <View style={styles.story}>
              <View style={styles.storyImage}></View>
              <Text>usuario</Text>
            </View>
            <View style={{width: 20}} />
          </ScrollView>

        <Post />
        <Post />
        <Post />
        <Post />

        </ScrollView>
      </View>

      {/* <Footer navigation={navigation} /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  bg: {
    backgroundColor: "white",
    height: "100%",
  },
  container: {
    flexDirection: "column",
    marginTop: 100,
    gap: 15,
  },
  stories: {
    paddingLeft: 15,
    borderRadius: 24,
    flexDirection: "row",
    gap: 10,
  },
  storyImage: {
    backgroundColor: "#eaeaea",
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  story: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
});
