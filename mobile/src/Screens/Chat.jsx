import React, { useContext, useEffect, useLayoutEffect, useState, useRef } from "react";
import { FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { FontAwesome } from "@expo/vector-icons";
import Contact from "../Components/Contact";
import { useNavigation } from "@react-navigation/native";
import { api } from "../Lib/axios";
import { getUserUID } from "../Services/AuthService";
import { UserContext } from "../Context/userContext";
import _ from 'lodash';

export default function Chat({ onLogout }) {
  const [contacts, setContacts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceTimeout = useRef(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    const showTabBar = navigation.addListener('focus', e => {
      let parentNav = navigation.getParent();
      parentNav.setOptions({
        tabBarStyle: {
          backgroundColor: "#f00",
          borderTopWidth: 0,
          borderTopLeftRadius: 61,
          display: 'flex'
        },
      });
    });
  }, []);

  useEffect(() => {
    if (suggestions.length === 0) {
      console.log("================================")
      getContacts();
    }
  }, [suggestions]);

  const getContacts = async () => {
    try {
      const user_id = getUserUID();
      const { data } = await api.get(`/user/contact/list/${user_id}`);
      setContacts(data);
      console.log("DATA", data);
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const searchContacts = async (query) => {
    try {
      const { data } = await api.get(`/user/list/filter`, { params: { query } });
      setSuggestions(data);
      console.log("SUGGESTIONS", data);
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleInputChange = (text) => {
    setQuery(text);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (text) {
        setLoadingSuggestions(true);
        searchContacts(text);
      } else {
        setSuggestions([]);
      }
    }, 300); // Ajuste o tempo do debounce conforme necessário
  };

  const { user } = useContext(UserContext);

  const teste = () => {
    console.log("TESTE CONTEXT", user);
  };

  return (
    <SafeAreaView>
      <Header title="Chat" onLogout={onLogout} />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search"
            value={query}
            onChangeText={handleInputChange}
            style={styles.searchInput}
          />
          <FontAwesome name="search" size={16} />
        </View>
        {loadingSuggestions && <Text>Loading...</Text>}
        {/* <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
          />
        </View> */}
        {/* <TouchableOpacity onPress={teste} style={{ backgroundColor: "red", height: 80 }}>
          <Text>Teste</Text>
        </TouchableOpacity> */}

        {
          (query.trim() !== "" && suggestions.length === 0) ? (
            
            <Text>Sem resultados</Text>
          ) : (
            <FlatList
              data={suggestions.length > 0 ? suggestions : contacts}
              keyExtractor={(item) => item.username}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Contact name={item.name} online={item.online} email={item.email} id={item.id} />
              )}
            />
          )
        }

         
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: 60,
    flexDirection: "column",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    zIndex: -1
  },
  searchContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eaeaea",
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80, // Ajuste conforme necessário
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  suggestionsList: {
    maxHeight: 150,
  },
});

