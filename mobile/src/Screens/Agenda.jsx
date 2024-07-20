import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Modal,
  StatusBar,
} from "react-native";
import Swiper from "react-native-swiper";
import EventForm from "../Components/EventForm";
import Header from "../Components/Header";
import Loading from "../Components/Loading.jsx";
import ButtonAction from "../Components/ButtonAction.jsx";
import PlaceEvent from "../Components/PlaceEvent.jsx";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

import moment from "moment";
import { format } from "date-fns";
import pt from "date-fns/locale/pt";
import { api } from "../Lib/axios";
import { getUserUID } from "../Services/AuthService";
import useToastConfig from "../Hooks/useToast";
const { width } = Dimensions.get("window");


export default function Agenda({ onLogout }) {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [events, setEvents] = useState([]);
  const [newEventForms, setNewEventForms] = useState([{ id: 1 }]);
  const [loading, setLoading] = useState(false);

  // user que ta logado
  const userId = getUserUID();

  const { toastConfig, showToast } = useToastConfig();

  const addNewEventForm = () => {
    setNewEventForms([...newEventForms, { id: newEventForms.length + 1 }]);
  };

  const deleteNewEventForm = (id) => {
    setNewEventForms(
      newEventForms.filter((newEventForm) => newEventForm.id !== id)
    );
  };

  const weeks = useMemo(() => {
    const start = moment().add(week, "weeks").startOf("week");

    return [-1, 0, 1].map((adj) => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, "week").add(index, "day");

        return {
          weekday: format(new Date(date), "EEE", { locale: pt }).toUpperCase(),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    fetchEvents(formattedDate);
  }, []);

  // esse fetch pega por dia e usuario
  async function fetchEvents(date) {
    setLoading(true);
    try {
      console.log("fetch", date);
      console.log(moment(date).format("YYYY-MM-DD"));
      const response = await api.get(`/event/date/${date}`, {
        params: {
          user_id: userId,
        },
      });
      const data = response.data;
      setEvents(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function deleteEvent(id) {
    try {
      const response = await api.delete(`/event/${id}`);
      const data = response.data;
      console.log(data);
      fetchEvents();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent 
      />
      <Header title="Agenda" onLogout={onLogout} />
      <View style={styles.container}>
        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={(ind) => {
              if (ind === 1) {
                return;
              }
              const newIndex = ind - 1;
              const newWeek = week + newIndex;
              setWeek(newWeek);
              setValue(moment(value).add(newIndex, "week").toDate());
              setTimeout(() => {
                swiper.current.scrollTo(1, false);
              }, 100);
            }}
          >
            {weeks.map((dates, index) => (
              <View style={styles.itemRow} key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => {
                        setValue(item.date);
                        console.log("data botao", item.date);
                        fetchEvents(item.date);
                      }}
                    >
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: "#111",
                            borderColor: "#111",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && { color: "#fff" },
                          ]}
                        >
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.itemDate,
                            isActive && { color: "#fff" },
                          ]}
                        >
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        <Text style={styles.subtitle}>
          {format(new Date(value), "PPP", { locale: pt })}
        </Text>
        <ScrollView
          style={{ flex: 1, flexDirection: "column", marginBottom: 100 }}
        >
          <Loading visible={loading} />
          {Array.isArray(events) &&
            events.map((event, index) => (
              <EventForm
                key={event.id}
                event={event}
                addNewForm={addNewEventForm}
                fetchEvents={fetchEvents}
                eventDate={value}
                delete={() => deleteEvent(event.id)}
                showToast={showToast}
              />
            ))}
          {Array.isArray(newEventForms) &&
            newEventForms.map((e, index) => (
              <EventForm
                key={e.id}
                addNewForm={addNewEventForm}
                eventDate={value}
                fetchEvents={fetchEvents}
                showToast={showToast}
              />
            ))}
        </ScrollView>
      </View>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flexDirection: "column",
    marginVertical: 100,
    marginHorizontal: 15,
    gap: 15,
  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 12,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 16,
  },
  /** Item */
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#e3e3e3",
    flexDirection: "column",
    alignItems: "center",
  },
  itemRow: {
    width: width,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: "500",
    color: "#737373",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 0,
    backgroundColor: "transparent",
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#007aff",
    borderColor: "#007aff",
  },

  block: {
    backgroundColor: "#EAEAEA",
    width: "100%",
    padding: 20,
    borderRadius: 24,
    flexDirection: "col",
    gap: 15,
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
    textAlign: "center",
  },
  label: {
    fontFamily: "Montserrat-Italic",
    color: "gray",
    fontSize: 12,
  },
  textInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    minHeight: 100,
    width: "100%",
    maxHeight: 180,
    paddingRight: 20,
  },
  inputBox: {
    justifyContent: "center",
  },
  inputIcon: {
    position: "absolute",
    alignSelf: "flex-end",
  },
});
