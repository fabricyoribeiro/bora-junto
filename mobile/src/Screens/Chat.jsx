import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { FontAwesome } from "@expo/vector-icons";
import Contact from "../Components/Contact";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function Chat({onLogout}) {

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
      id: 'Ikj7ObogpXhvhkbBGK0rAV2m5gB3',
      username: "joao@gmail.com",
      email: "joao@gmail.com",
      name: "Joao Lucas",
      imageUrl: "",
      lastMessage: "bora bora",
      online: true,
    },
    {
      id: 'lLQDixrQV9QuXy9SYPZ3brRA1er2',
      username: "fabricyo@gmail.com",
      email: "fabricyo@gmail.com",
      name: "Fabricyo Ribeiro",
      imageUrl: "",
      lastMessage: "bora bora",
      online: false,
    },
    {
      id: 'jnklWhaarAgR4f0jpCUtExV7BR32',
      username: "wender@gmail.com",
      email: "wender@gmail.com",
      name: "Wender Clayton",
      imageUrl: "",
      lastMessage: "bora bora",
      online: true,
    },
  ];
  return (
    <View>
      <Header title="Chat" onLogout={onLogout}/>
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
            <Contact name={item.name} lastMessage={item.lastMessage} online={item.online}  email={item.email} id={item.id}/>
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
