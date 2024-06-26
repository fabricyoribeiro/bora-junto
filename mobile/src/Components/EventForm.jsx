import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import ButtonAction from "../Components/ButtonAction";
import { Entypo, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { api } from "../Lib/axios";
import { getUserUID } from "../Services/AuthService";
import DateTimePicker from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { Dropdown } from "react-native-element-dropdown";
import Checkbox from "expo-checkbox";
import { RadioButton } from "react-native-paper";

export default function EventForm({
  event,
  addNewForm,
  eventDate,
  fetchEvents,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [local, setLocal] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState(new Date());
  const [categoryId, setCategoryId] = useState(1)
  const [privacyId, setPrivacyId] = useState(1)
  //controlar o modal de hora
  const [open, setOpen] = useState(false);
  // id do user logado
  const userId = getUserUID();

  //categorias dropdown
  const [isFocus, setIsFocus] = useState(false);
  const [categories, setCategories] = useState([]);

  async function fetchCategories(date) {
    try {
      const response = await api.get(`/event/category/list`);
      const data = response.data;
      setCategories(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleConfirm = (date) => {
    //o input de data pega 3 horas à frente, precisa ajustar
    const adjustmentDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    setDate(adjustmentDate);
    setOpen(false);
    setTime(String(format(new Date(date), "HH:mm")));
  };

  useEffect(() => {
    fetchCategories();
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setLocal(event.location);
      setPrivacyId(event.privacy_id)
      setCategoryId(event.category_id)
      const d = new Date(event.event_date);
      const hours = d.getUTCHours();
      const minutes = d.getUTCMinutes();
      const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
      setTime(formattedTime);
    }
  }, [event]);

  function cleanFields() {
    setTitle('')
    setDescription('')
    setLocal('')
    setTime('')
    setDate(new Date())
    fetchEvents(eventDate)
  }

  async function handleEvent() {
    //pega a data do evento e junta com a hora que vem do input
    const dateObj = new Date(eventDate);
    const datePart = dateObj.toISOString().split("T")[0];
    const newEventDate = `${datePart}T${time}:00.000Z`;
    console.log("Novo Event Date:", newEventDate);

    const newEvent = {
      user_id: userId,
      title: title,
      description: description,
      //esse 2 é o id de um location cadastrado
      location_id: 2,
      local: local,
      event_date: newEventDate,
      event_category: categoryId
    };
    //update nao funcionou
    if (event) {
      try {
        const response = await api.put(`/event/${event.id}`, newEvent);
        const data = response.data;
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await api.post(`/event/`, newEvent);
        const data = response.data;
        console.log(data);
        console.log("ll");
      } catch (error) {
        console.log(error);
      }
    }
    cleanFields();
  }

  async function deleteEvent() {
    try {
      const response = await api.delete(`/event/${event.id}`);
      const data = response.data;
      console.log("deletado: ", data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.block}>
      <View>
        <Text style={styles.label}>Atividade</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
          />
          <FontAwesome name="user" size={18} style={styles.inputIcon} />
        </View>
      </View>
      <View>
        <Text style={styles.label}>Descrição</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: "gray",
              width: "100%",
              maxHeight: 180,
              paddingRight: 20,
            }}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
          <FontAwesome name="list" size={18} style={styles.inputIcon} />
        </View>
      </View>

      <Text style={styles.label}>Categoria</Text>
      <Dropdown
        style={[styles.dropdown, isFocus]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={categories.map((item) => ({ label: item.title, value: item.id }))}
        search
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "" : "..."}
        searchPlaceholder="Buscar..."
        value={categoryId}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(categoryIdNew) => {
          setCategoryId(categoryIdNew.value);
        }}
      />
      <View>
        <Text style={styles.label}>Local</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.textInput}
            value={local}
            onChangeText={setLocal}
          />
          <Entypo name="location-pin" size={20} style={styles.inputIcon} />
        </View>
      </View>
      <View>
        <Text style={styles.label}>Horário</Text>
        <View>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={styles.inputBox}
          >
            <FontAwesome6 name="clock" size={18} style={styles.inputIcon} />
          </TouchableOpacity>
          <DateTimePicker
            isVisible={open}
            mode="time"
            date={date}
            onConfirm={handleConfirm}
          />
          <TextInput
            style={styles.textInput}
            value={time}
            editable={false}
            placeholder="Clique no ícone"
          />
        </View>
      </View>
      <View>
        <Text style={styles.label}>Privacidade</Text>
        <RadioButton.Group onValueChange={newValue => setPrivacyId(newValue)} value={privacyId}>
          <View style={styles.radioContainer}>
            <View style={styles.radioButton}>
              <RadioButton value={3}/>
              <Text>Público</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value={1} />
              <Text>Privado</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value={2} />
              <Text>Apenas amigos</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>
      <View style={{ flexDirection: "row", gap: 20 }}>
        <ButtonAction icon={"trash"} action={deleteEvent} />
        <ButtonAction icon={"plus"} action={addNewForm} />
        <ButtonAction text={"Salvar"} action={handleEvent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: "#EAEAEA",
    width: "100%",
    padding: 20,
    borderRadius: 24,
    flexDirection: "col",
    gap: 15,
    marginBottom: 20,
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
    minheight: 40,
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
  dropdown: {
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    borderRadius: 8,
    width: "100%",
    color: "black",
  },

  placeholderStyle: {
    fontSize: 14,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  dropdownContainer: {
    flex: 1,
    backgroundColor: "#533483",
    padding: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
});
