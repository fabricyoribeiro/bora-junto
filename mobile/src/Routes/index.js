import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Screens/Login.jsx";
import Home from "../Screens/Home.jsx";
import Feed from "../Screens/Feed.jsx";
import Agenda from "../Screens/Agenda.jsx";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  Entypo,
  FontAwesome5,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Chat from "../Screens/Chat.jsx";
import Conversation from "../Screens/Conversation.jsx";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function ChatStack({ onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" options={{ headerShown: false }}>
        {(props) => <Chat {...props} onLogout={onLogout} />}
      </Stack.Screen>

      <Stack.Screen
        name="Conversation"
        component={Conversation}
        options={({ route }) => ({
          headerTitle: () => (
            <View style={styles.profile}>
              <Image style={styles.image} />
              <Text style={styles.title}>
                {route.params?.username || "Username"}
              </Text>
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function HomeStack({ onLogout }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {(props) => <Home {...props} onLogout={onLogout} />}
      </Stack.Screen>

      <Stack.Screen name="Agenda" options={{ headerShown: false }}>
        {(props) => <Agenda {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AppTabs({ onLogout }) {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "121212",
        tabBarStyle: {
          backgroundColor: "#f00",
          borderTopWidth: 0,
          borderTopLeftRadius: 61,
        },
      }}
    >
      <Tab.Screen
        name="ChatStack"
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            if (focused) {
              return <Ionicons name="chatbubbles" size={20} color="white" />;
            } else {
              return (
                <Ionicons name="chatbubbles-outline" size={20} color="white" />
              );
            }
          },
        }}
      >
        {(props) => <ChatStack {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="HomeStack"
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            if (focused) {
              return <FontAwesome5 name="user-alt" size={20} color="white" />;
            } else {
              return <FontAwesome5 name="user" size={20} color="white" />;
            }
          },
        }}
      >
        {(props) => <HomeStack {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="Feed"
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            if (focused) {
              return <Entypo name="controller-play" size={35} color="white" />;
            } else {
              return (
                <SimpleLineIcons name="control-play" size={20} color="white" />
              );
            }
          },
        }}
      >
        {(props) => <Feed {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function Routes() {
  //coloquei true para nao precisar ficar fazendo login
  const [user, setUser] = useState(false);

  // Simula o login para fins de teste
  const handleLogin = () => {
    setUser(!user);
  };

  return (
    <>
      {user ? (
        <AppTabs onLogout={handleLogin} />
      ) : (
        <AuthStack onLogin={handleLogin} />
      )}
    </>
  );
}

export default Routes;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    height: 60,
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopStartRadius: 61,
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Montserrat-BoldItalic",
    color: "black",
    fontSize: 20,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eaeaea",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
