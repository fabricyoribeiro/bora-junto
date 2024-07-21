import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Screens/Login";
import Home from "../Screens/Home";
import Feed from "../Screens/Feed";
import { useState } from "react";
import React from "react";
import Agenda from "../Screens/Agenda";
import Chat from "../Screens/Chat";
import Conversation from "../Screens/Conversation";
import UserProfile from "../Screens/UserProfile";

const Stack = createNativeStackNavigator();

function StackRoutes() {
  const [user, setUser] = useState();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
      >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Agenda" component={Agenda} />
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="UserProfile" component={UserProfile}/>
    </Stack.Navigator>
  );
}

export default StackRoutes;
