import { FlatList, KeyboardAvoidingView, TextInput, View } from "react-native";
import { StyleSheet, SectionList } from "react-native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import MessageBubble from "../Components/MessageBubble";
import MessageSection from "../Components/MessageSection";
import { messageList } from "../Util/fakeMessageDb";
import groupBy from "lodash/groupBy";
import { format } from "date-fns";
import pt from "date-fns/locale/pt";

export default function Conversation() {
  const [message, setMessage] = useState("");
  const [listMessages, setListMessages] = useState([]);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    const hideTabBar = navigation.addListener("focus", (e) => {
      let parentNav = navigation.getParent();
      parentNav.setOptions({
        tabBarStyle: { display: "none" },
      });
    });
  }, []);

  useEffect(() => {
    const groupedList = Object.values(
      groupBy(messageList, function (n) {
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
    // console.log(groupedList);
  }, []);

  function renderMessage(item) {
    // console.log(messageList.length);

    const sent = () => {
      return item.username === item.from;
    };

    if (item.id === messageList.length) {
      return (
        <View>
          <MessageBubble
            message={item.message}
            sent={sent()}
            dateTime={format(new Date(item.created_at), "HH:mm")}
            status={item.status}
          />
          {/* <View style={{ height: 50 }} /> */}
        </View>
      );
    } else {
      return (
        <MessageBubble
          message={item.message}
          sent={sent()}
          dateTime={format(new Date(item.created_at), "HH:mm")}
          status={item.status}
        />
      );
    }
  }
  const sectionListRef = useRef(null);



  useEffect(() => {
    // const length = messageList.length
    if (sectionListRef.current &&  listMessages.length > 0) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: listMessages.length -1,
        itemIndex: listMessages[listMessages.length - 1].data.length - 1,
        animated: false,
      });
    }
  }, [listMessages]);

  return (
    <View style={styles.container}>
      {/* <SectionList
        sections={listMessages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => renderMessage(item)}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { title } }) => (
          <MessageSection date={title} />
        )}
      /> */}
      <SectionList
        ref={sectionListRef}
        sections={listMessages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => renderMessage(item)}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { title } }) => (
          <MessageSection date={title} />
        )}
        getItemLayout={(data, index) => ({
          length: 70,
          offset: 70 * index,
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
        <View style={styles.sendIcon}>
          <Feather name="send" size={30} color="black" />
        </View>
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
    backgroundColor: "#ffffff0",
    sizing: "border-box"
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
