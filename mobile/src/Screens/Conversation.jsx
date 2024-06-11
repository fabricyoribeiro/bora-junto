import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, SectionList } from "react-native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import MessageBubble from "../Components/MessageBubble";
import MessageSection from "../Components/MessageSection";
import { messageList } from "../Utils/fakeMessageDb";
import groupBy from "lodash/groupBy";
import { format } from "date-fns";
import pt from "date-fns/locale/pt";
import { api } from "../Lib/axios";

export default function Conversation() {
  const [message, setMessage] = useState("");
  const [dbMessages, setDbMessages] = useState([]);
  const [listMessages, setListMessages] = useState([]);

  //id do usuario para teste
  const [userId, setUserId] = useState(1);
  //id do usuario de destino
  const [receiverId, setReceiverId] = useState(2);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    const hideTabBar = navigation.addListener("focus", (e) => {
      let parentNav = navigation.getParent();
      parentNav.setOptions({
        tabBarStyle: { display: "none" },
      });
    });
  }, []);

  async function fetchMessages() {
    try {
      const response = await api.get(`/message/list/${userId}`, {
        params: {
          receiver_id: receiverId,
        },
      });
      setDbMessages(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage() {
    try {
      //mensagem teste
      const response = await api.post(`/message/${userId}`, {
        sender_id: userId,
        receiver_id: receiverId,
        content: message,
      });
      setMessage("");
      fetchMessages();
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() =>  {
    fetchMessages();

  }, []);

  useEffect(() => {

    const groupedList = Object.values(
      groupBy(dbMessages, function (n) {
        return n.created_at.substring(0, 10);
      })
    );
    var data = [];
    groupedList.map((d) => {
      let section = {
        title: format(new Date(d[0].created_at), "PPP", { locale: pt }),
        data: [...d],
      };
      data.push(section);
    });
    setListMessages(data);

  }, [dbMessages]);

  function renderMessage(item) {
    const sent = () => {
      return item.sender_id === userId;
    };

    return (
      <View>
        <MessageBubble
          message={item.content}
          sent={sent()}
          dateTime={format(new Date(item.created_at), "HH:mm")}
          status={item.status}
        />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <SectionList
        sections={listMessages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => renderMessage(item)}
        showsVerticalScrollIndicator={false}
        renderSectionFooter={({ section: { title } }) => (
          <MessageSection date={title} />
        )}
        inverted={true}
        getItemLayout={
          (data, index) => ({
            length: 70,
            offset: 100 * index,
            index,
          }) // Ajuste o tamanho conforme necessário
        }
      />

      <KeyboardAvoidingView style={styles.inputView}>
        <View style={styles.inputMessage}>
          <TextInput
            scrollEnabled={true}
            multiline
            placeholder="Message"
            style={{ maxHeight: 50 }}
            value={message}
            onChangeText={setMessage}
          />
        </View>
        <TouchableOpacity style={styles.sendIcon} onPress={sendMessage}>
          <Feather name="send" size={30} color="black" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    paddingBottom: 15,
    paddingHorizontal: 10,
    gap: 10,
  },
  inputView: {
    position: "fixed",

    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    gap: 15,
    padding: 5,
    backgroundColor: "#fff",
    sizing: "border-box",
  },
  inputMessage: {
    backgroundColor: "#EAEAEA",
    borderRadius: 30,
    paddingHorizontal: 17,
    paddingVertical: 10,
    flex: 1,
  },
  sendIcon: {
    display: "flex",
    justifyContent: "center",
    width: "10%",
  },
});
