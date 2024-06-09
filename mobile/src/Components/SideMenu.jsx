import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome6} from "@expo/vector-icons";
import * as RootNavigation from "../../RootNavigation";

export default function SideMenu({ closeMenu }) {


  return (
    <>
      <TouchableOpacity style={styles.background} onPress={closeMenu}></TouchableOpacity>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => RootNavigation.navigate("Home")}
        >
          <FontAwesome name="home" size={17} />
          <Text style={styles.subtitle}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => RootNavigation.navigate("Agenda", {screen: 'Agenda'})}
        >
          <FontAwesome6 name="calendar-days" size={17} />
          <Text style={styles.subtitle}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => RootNavigation.navigate("Feed")}
          style={styles.menuItem}
        >
          <FontAwesome name="play" size={17} />
          <Text style={styles.subtitle}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="trophy" size={17} />
          <Text style={styles.subtitle}>Metas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="users" size={17} />
          <Text style={styles.subtitle}>Amigos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="user-plus" size={17} />
          <Text style={styles.subtitle}>Solicitações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="gear" size={17} />
          <Text style={styles.subtitle}>Configurações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        >
          <View style={{ transform: [{ rotate: "180deg" }] }}>
            <FontAwesome6 name="right-from-bracket" size={15} color="red" />
          </View>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "70%",
    position: "absolute",
    left: 0,
    bottom: 0,
    top: 0,
    zIndex: 1,
    backgroundColor: "#eaeaea",
    paddingTop: 120,
    paddingLeft: 20,
    gap: 15,
    flexDirection: "column",
  },
  background: {
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: 0,
    top: 0,
    zIndex: 1,
    backgroundColor: "black",
    opacity: 0.5,
  },
  title: {
    fontFamily: "Montserrat-BoldItalic",
    color: "black",
    fontSize: 20,
  },
  subtitle: {
    fontFamily: "Montserrat-Italic",
    color: "black",
    fontSize: 15,
  },
  logoutText: {
    fontFamily: "Montserrat-Italic",
    color: "red",
    fontSize: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
