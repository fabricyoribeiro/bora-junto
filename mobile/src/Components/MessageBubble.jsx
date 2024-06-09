import { Ionicons } from "@expo/vector-icons";
import { Text, View, StyleSheet } from "react-native";

export default function MessageBubble({ message, sent, dateTime, status }) {
  const getIconName = () => {
    switch (status) {
      case 0:
        return "checkmark-outline";
      case 1:
        return "checkmark-done";
      case 2:
        return "checkmark-done";
      default:
        return "checkmark-done";
    }
  };
  const iconName = getIconName(); // Chame a função para obter o nome do ícone

  return (
    <>
      {sent ? (
        <View style={styles.sentmessagebubble}>
          <Text style={styles.messageText} lineBreakMode="tail">
            {message}
          </Text>

          <View style={styles.dateTimeContainer}>
            <View />

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={styles.dateTime}>{dateTime}</Text>
              <Ionicons
                name={iconName}
                size={16}
                color={status === 2 ? "#16a9ce" : "#c9b2b2"}
              />
            </View>
          </View>


        </View>
      ) : (
        <View style={styles.receivedmessagebubble}>
          <Text style={styles.messageText} lineBreakMode="tail">
            {message}
          </Text>
         <View style={styles.dateTimeContainer}>
            <View />

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={styles.dateTime}>{dateTime}</Text>

            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sentmessagebubble: {
    maxWidth: "75%",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 10,
    borderTopEndRadius: 0,
    backgroundColor: "red",
    alignSelf: "flex-end",
    marginVertical: 10,
  },
  receivedmessagebubble: {
    maxWidth: "75%",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 10,
    borderTopStartRadius: 0,
    backgroundColor: "#af4040",
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  messageText: {
    color: "white",
    fontSize: 15,
  },
  dateTime: {
    color: "#c9b2b2",
    fontSize: 10,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
