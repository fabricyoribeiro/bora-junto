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
import { navigate } from "../../RootNavigation";

export default function EventDetails({
    event,
    addNewForm,
    eventDate,
    fetchEvents,
    navigation
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [local, setLocal] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState(new Date());
    const [category, setCategory] = useState(null)
    const [isParticipantAlreadExists, setIsParticipantAlreadyExists] = useState(false)



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
            checkParticipantAlreaydExists()
        }
    }, [event]);

    async function checkParticipantAlreaydExists() {
        try {
            console.log('EVENT', event.id)
            const { data } = await api.post('/participant/exists', {
                event_id: event.id,
                user_id: getUserUID()
            })
            setIsParticipantAlreadyExists(data.participant_already_exists);
            console.log("existe", data.participant_already_exists)
        } catch (error) {
            console.log('Erro no check', error)
        }
    }

    async function joinTheEvent() {

        try {
            const { data } = await api.post('/participant/add', {
                event_id: event.id,
                user_id: getUserUID()
            })
            console.log("Participant do evento", data)

            navigate("Agenda")
        } catch (error) {
            console.log("Erro in the join event", error)
        }
    }


    return (
        <View style={styles.block}>

            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.userContainer}>
                    <Text style={styles.subtitle}>{event.user.name}</Text>
                    <View style={styles.userIcon} />
                </View>
            </View>

            <Text style={styles.subtitle} lineBreakMode="tail">{description}</Text>
            {
                category !== 'Não definido' &&
                <Text style={styles.subtitle}>{category}</Text>
            }



            <View style={{ flexDirection: 'row', gap: 30 }}>
                {
                    date &&
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        <FontAwesome6 name="calendar" size={18} color={'gray'} />
                        <Text style={styles.label}>{format(new Date(date), "P", { locale: pt })}</Text>
                    </View>
                }
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <FontAwesome6 name="clock" size={18} color={'gray'} />
                    <Text style={styles.label}>{time}</Text>
                </View>
            </View>

            <View style={{ flexDirection: "row", gap: 20 }}>
                {
                    isParticipantAlreadExists ? (
                        <View style={styles.participantAlreadyExists}>
                            <Text style={{ textAlign: 'center', color: "#123a12", fontWeight: '600' }}>Você já está inscrito nesse evento</Text>
                        </View>

                    ) : (
                        <ButtonAction text={"Participar"} action={joinTheEvent} />

                    )
                }

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
    }, participantAlreadyExists: {
        backgroundColor: "#d1e7ca",
        height: 50,
        borderRadius: 76,
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
        flex: 1,

    },
    userIcon: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: "#eaeaea",
    },
    userContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8 
    }


});
