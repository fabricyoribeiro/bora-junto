import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { FontAwesome } from "@expo/vector-icons";
import Contact from "../Components/Contact";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function Chat() {

  const navigation = useNavigation()

  useLayoutEffect(() => {
    const showTabBar = navigation.addListener('focus', e => {
      let parentNav = navigation.getParent();
      parentNav.setOptions({
        tabBarStyle: {backgroundColor: "#f00",
        borderTopWidth: 0,
        borderTopLeftRadius: 61,
        display: 'flex'},
      });
    });
  }, []);
  const fakeData = [
    {
      username: "joao",
      name: "Joao Lucas",
      imageUrl: "",
      lastMessage: "bora bora",
      online: true,
    },
    {
      username: "fabricyors",
      name: "Fabricyo Ribeiro",
      imageUrl: "",
      lastMessage: "bora bora",
      online: false,
    },
    {
      username: "wender",
      name: "Wender Clayton",
      imageUrl: "",
      lastMessage: "bora bora",
      online: true,
    },
  ];
  return (
    <View>
      <Header title="Chat" />
      <View style={styles.container}>
        <View style={styles.search}>
          <TextInput placeholder="Search" />
          <FontAwesome name="search" size={16} />
        </View>

        <FlatList
          data={fakeData}
          keyExtractor={(item) => item.username}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Contact name={item.name} lastMessage={item.lastMessage} online={item.online}  />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    paddingTop: 100,
    flexDirection: "column",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  search: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eaeaea",
  },
});
