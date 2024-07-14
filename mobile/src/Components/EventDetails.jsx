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

import { Dropdown } from "react-native-element-dropdown";
import Checkbox from "expo-checkbox";
import { RadioButton } from "react-native-paper";
import { now } from "lodash";
import { format } from "date-fns";
import pt from "date-fns/locale/pt";

export default function EventDetails({
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
    const [category, setCategory] = useState(null)


    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDescription(event.description);
            setLocal(event.location);
            setDate(new Date(event.event_date))
            if (event.eventCategory) {
                setCategory(event.eventCategory.title)
            } else {
                setCategory('Não definido')
            }
            const d = new Date(event.event_date);
            const hours = d.getUTCHours();
            const minutes = d.getUTCMinutes();
            const formattedTime = `${String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "0")}`;
            setTime(formattedTime);
        }
    }, [event]);





    return (
        <View style={styles.block}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle} lineBreakMode="tail">{description}</Text>
            {
                category !== 'Não definido' &&
                <Text style={styles.subtitle}>{category}</Text>
            }

            <View style={{ flexDirection: 'row', gap: 30 }}>
                {
                    date &&
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        <FontAwesome6 name="calendar" size={18} color={'gray'}/>
                        <Text style={styles.label}>{format(new Date(date), "P", { locale: pt })}</Text>
                    </View>
                }
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <FontAwesome6 name="clock" size={18} color={'gray'}/>
                    <Text style={styles.label}>{time}</Text>
                </View>
            </View>

            <View style={{ flexDirection: "row", gap: 20 }}>
                <ButtonAction text={"Participar"}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        backgroundColor: "white",
        width: "100%",
        padding: 20,
        borderRadius: 24,
        gap: 15,
        zIndex: 99,
        elevation: 30,



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
    label: {
        fontFamily: "Montserrat-Italic",
        color: "gray",
        fontSize: 14
    },



});
