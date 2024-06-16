import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TextInput
} from 'react-native';
import ButtonAction from '../Components/ButtonAction';
import { Entypo, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { api } from "../Lib/axios";


const { width } = Dimensions.get('window');

export default function EventForm({ event }) {

    const [userId, setUserId] = useState(1)
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [local, setLocal] = useState()
    const [time, setTime] = useState()

    useEffect(()=>{
        if (event) {
            setTitle(event.title)
            setDescription(event.description)
            setLocal(event.location)
            const d = new Date(event.event_date);
            const hours = d.getUTCHours();
            const minutes = d.getUTCMinutes();
            const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            setTime(formattedTime);

        } 

    },[event])


    async function deleteEvent(id) {
        try {
            const response = await api.delete(`/event/${id}`);
            const data = response.data
            console.log(data);
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
                        onChangeText={(val) => setTitle(val)}
                    />
                    <FontAwesome name='user' size={15} style={styles.inputIcon} />
                </View>
            </View>
            <View>
                <Text style={styles.label}>Descrição</Text>
                <View style={styles.inputBox}>
                    <TextInput style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: "gray",
                        width: '100%',
                        maxHeight: 180,
                        paddingRight: 20
                    }}
                        value={description}
                        onChangeText={(val) => setDescription(val)}
                        multiline textAlignVertical='top' />
                    <FontAwesome name='list' size={15} style={styles.inputIcon} />
                </View>
            </View>
            <View>
                <Text style={styles.label}>Local</Text>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.textInput}
                        value={local}
                        onChangeText={(val) => setDescription(val)}
                    />
                    <Entypo name='location-pin' size={20} style={styles.inputIcon} />
                </View>
            </View>
            <View>
                <Text style={styles.label}>Horário</Text>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.textInput}
                        value={time}
                        onChangeText={(val) => setTime(val)}
                    />
                    <FontAwesome6 name='clock' size={15} style={styles.inputIcon} />
                </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 20 }}>
                <ButtonAction icon={'trash'} action={deleteEvent} />
                <ButtonAction icon={'plus'} />
                <ButtonAction text={'Salvar'} />

            </View>


        </View>
    );
}

const styles = StyleSheet.create({

    block: {
        backgroundColor: '#EAEAEA',
        width: '100%',
        padding: 20,
        borderRadius: 24,
        flexDirection: 'col',
        gap: 15,
        marginBottom: 20
    },
    title: {
        fontFamily: 'Montserrat-BoldItalic',
        color: 'black',
        fontSize: 20,
    },
    subtitle: {
        fontFamily: 'Montserrat-Italic',
        color: 'black',
        fontSize: 15,
        textAlign: 'center'
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
        width: '100%',
        maxHeight: 180,
        paddingRight: 20
    },
    inputBox: {
        justifyContent: 'center'
    },
    inputIcon: {
        position: 'absolute',
        alignSelf: 'flex-end',

    }
});