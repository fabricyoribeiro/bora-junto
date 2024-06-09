import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import Routes from "./src/Routes/index.js";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./RootNavigation.js";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  let [fontsLoaded] = useFonts({
    "Montserrat-BoldItalic": require("./assets/fonts/Montserrat-BoldItalic.ttf"),
    "Montserrat-Italic": require("./assets/fonts/Montserrat-Italic.ttf"),
  });
  if (fontsLoaded) {
    return (
      <NavigationContainer ref={navigationRef}>
        <Routes />
      </NavigationContainer>
    );
  }
}
