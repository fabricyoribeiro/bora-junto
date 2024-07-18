import { useEffect, useState, useRef } from "react";
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Modal, ViewComponent } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { api } from "../Lib/axios";
import Header from "../Components/Header"
import { Checkbox } from "react-native-paper";
import MapView, { Marker } from 'react-native-maps';
import MarkerIcons from '../Components/MarkerIcons'



import {
    requestForegroundPermissionsAsync,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy

} from 'expo-location'
import EventDetails from "../Components/EventDetails";



export default function Map({ navigation, onLogout }) {

    const [position, setPosition] = useState(null)
    const mapRef = useRef(null)
    const [search, setSearch] = useState()
    const [autoComplete, setAutoComplete] = useState([])
    const [categories, setCategories] = useState([]);
    const [filterVisible, setFilterVisible] = useState(false)
    const [eventDetailsVisible, setEventDetailsVisible] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [events, setEvents] = useState([])

    function toggleFilter() {
        setFilterVisible(!filterVisible)
    }

    async function fetchCategories() {
        try {
            const response = await api.get(`/event/category/list`);
            const data = response.data;
            setCategories(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    async function fetchEvents() {
        try {
            const response = await api.get(`/event/list`);
            const data = response.data;
            setEvents(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }


    const mapStyle = [
        {
            "featureType": "poi.business",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ]

    async function AutoCompleteFetch(val) {
        try {
            const response = await api.get(`https://api.locationiq.com/v1/autocomplete?key=pk.b841bb433e74583e013fbc6a0c2fbb6c&q=${val}&limit=5&dedupe=1&`);
            setAutoComplete(response.data);
            console.log(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    async function requestLocationPermission() {
        const { granted } = await requestForegroundPermissionsAsync()
        if (granted) {
            const currentPossition = await getCurrentPositionAsync()
            setPosition(currentPossition)
            return true
        }
        return false



    }

    function showEventDetails(event) {
        setSelectedEvent(event)
        setEventDetailsVisible(true)
    }
    useEffect(() => {
        const fetchData = async () => {
            const permissionGranted = await requestLocationPermission();
            if (permissionGranted) {
                const { coords } = await getCurrentPositionAsync();
                if (coords) {
                    watchPositionAsync({
                        accuracy: LocationAccuracy.Highest,
                        distanceInterval: 1,
                        timeInterval: 1000

                    }, (response) => {
                        setPosition(response)

                    }
                    )
                }
            }

        };
        fetchData();
        fetchCategories();
        fetchEvents();
        console.log(position)
    }, []);


    return (
        <View style={styles.bg}>
            <Header title={'Mapa'} onLogout={onLogout} />

            <View style={styles.container}>

                {
                    position &&

                    <View style={styles.mapblock}>
                        <View style={{ flexDirection: 'column' }}>

                            <KeyboardAvoidingView style={styles.inputView}>
                                <View style={{ flex: 1, flexDirection: 'row', gap: 15, elevation: 50 }}>
                                    <View style={styles.inputsearch}>
                                        <TextInput
                                            scrollEnabled={true}
                                            multiline
                                            placeholder="Search for a location"
                                            style={{ maxHeight: 50 }}
                                            onChangeText={(val) => { AutoCompleteFetch(val); setSearch(val) }}
                                            onPress={() => { setFilterVisible(false); setEventDetailsVisible(false) }}
                                        />
                                        <TouchableOpacity style={styles.sendIcon}>
                                            <FontAwesome name="search" size={20} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.iconButton}
                                        activeOpacity={0.5}
                                        onPress={() => toggleFilter()}
                                    >
                                        <FontAwesome name='filter' size={20} color={'black'} />
                                    </TouchableOpacity>
                                </View>
                                {
                                    autoComplete.length > 0 && search && !filterVisible &&
                                    <ScrollView style={styles.suggestions}>
                                        {
                                            autoComplete.map((suggestion, index) => (
                                                <TouchableOpacity key={index} style={{ borderBottomWidth: 0.5, paddingVertical: 5 }} onPress={() => {
                                                    mapRef.current?.animateCamera({
                                                        pitch: 70,
                                                        center: { longitude: Number(suggestion.lon), latitude: Number(suggestion.lat) }
                                                    })

                                                }}>
                                                    <Text style={{ color: 'black', zIndex: 2 }}>{suggestion.address.name ? suggestion.address.name + ', ' : null}
                                                        {suggestion.address.suburb ? suggestion.address.suburb + ', ' : null}
                                                        {suggestion.address.city ? suggestion.address.city + ', ' : null}
                                                        {suggestion.address.state ? suggestion.address.state : null}</Text>
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </ScrollView>
                                }
                                {
                                    categories.length > 0 && filterVisible &&
                                    <ScrollView style={styles.suggestions}>
                                        {
                                            categories.map((category, index) => (

                                                <View key={index} style={{ borderBottomWidth: 0.5, width: '100%', justifyContent: 'center' }}>

                                                    <Checkbox.Item
                                                        label={category.title}
                                                        key={index}
                                                        color="red"
                                                        labelStyle={styles.subtitle && { fontSize: 13 }}
                                                        style={{ color: 'black', paddingVertical: 0, paddingHorizontal: 0, height: 30 }}
                                                        status={category.checked ? 'checked' : 'unchecked'}
                                                        onPress={() => {
                                                            setCategories(categories.map((cat, idx) => {
                                                                if (idx === index) cat.checked = !cat.checked;
                                                                return cat;
                                                            }));
                                                        }}
                                                    >
                                                    </Checkbox.Item>

                                                </View>
                                            ))
                                        }
                                    </ScrollView>
                                }

                            </KeyboardAvoidingView>
                        </View>
                        <MapView
                            ref={mapRef}
                            style={styles.map}
                            customMapStyle={mapStyle}

                            initialRegion={{
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005
                            }}



                            onTouchStart={() => {
                                setAutoComplete([])
                                setFilterVisible(false)
                                setEventDetailsVisible(false)
                            }}
                        >
                            <Marker //user marker
                                coordinate={{
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                }}
                                tracksViewChanges={false}
                                image={require('../../assets/markers/User.png')}
                            />
                            {
                                events.length > 0 &&
                                events.map((event, index) => (
                                    <Marker //event marker
                                        coordinate={{
                                            latitude: event.location.latitude,
                                            longitude: event.location.longitude,
                                        }}
                                        key={index}
                                        tracksViewChanges={false}
                                        image={require('../../assets/markers/Não definido.png')}
                                        onPress={() => showEventDetails(event)}
                                    />
                                ))
                            }

                        </MapView>
                        {
                            eventDetailsVisible &&
                            <View style={styles.EventDetailView}>

                                <EventDetails event={selectedEvent}></EventDetails>

                            </View>


                        }
                    </View>

                }
            </View>
        </View>


    )

}
const styles = StyleSheet.create({
    bg: {
        backgroundColor: 'white',
        height: '100%'
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
    },
    container: {
        height: '100%',
        flexDirection: 'column',
        marginVertical: 100,
        marginHorizontal: 15,
        gap: 15
    },

    block: {
        backgroundColor: '#EAEAEA',
        width: '100%',
        padding: 20,
        borderRadius: 24,
        flexDirection: 'row',
        gap: 15,

    },
    mapblock: {
        backgroundColor: '#EAEAEA',
        height: '85%',
        width: '100%',
        borderRadius: 24,
        gap: 15,
        overflow: 'hidden',
    },
    map: {
        position: 'absolute',
        top: 0,
        bottom: -30,
        lef: 0,
        right: 0,
        width: '100%',

    },
    inputView: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 10,
        display: "flex",
        flexDirection: "column",
        gap: 15,
        padding: 5,
        sizing: "border-box",
        zIndex: 1,


    },
    EventDetailView: {
        position: "absolute",
        width: '100%',
        bottom: 250,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        zIndex: 1,
        elevation: 50


    },
    inputsearch: {
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingHorizontal: 17,
        paddingVertical: 10,
        flex: 1,
        justifyContent: 'center',
        elevation: 50




    },
    sendIcon: {
        alignSelf: 'center',
        position: 'absolute',
        right: 20
    },
    suggestions: {
        backgroundColor: '#fff',
        width: '100%',
        zIndex: 1,
        flex: 1,
        elevation: 50,
        paddingHorizontal: 17,
        paddingVertical: 5,
        borderRadius: 24,
        maxHeight: 300
    },
    iconButton: {
        backgroundColor: "white",
        height: 50,
        width: 50,
        borderRadius: 76,
        justifyContent: "center",
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        elevation: 50

    },
    checkBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        zIndex: 2
    },
},

)

