import { useEffect, useState, useRef } from "react";
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { api } from "../Lib/axios";
import Header from "../Components/Header"

import MapView, { Marker } from 'react-native-maps';



import {
    requestForegroundPermissionsAsync,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy

} from 'expo-location'
import ButtonAction from "../Components/ButtonAction";



export default function Map({ navigation, onLogout }) {

    const [position, setPosition] = useState(null)
    const mapRef = useRef(null)
    const [search, setSearch] = useState()
    const [autoComplete, setAutoComplete] = useState([])



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
                                        />
                                        <TouchableOpacity style={styles.sendIcon}>
                                            <FontAwesome name="search" size={20} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.iconButton}
                                        activeOpacity={0.5}
                                       
                                    >
                                        <FontAwesome name='filter' size={20} color={'black'} />
                                    </TouchableOpacity>
                                </View>
                                {
                                    autoComplete.length > 0 && search &&
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

                            onTouchStart={() => setAutoComplete([])}
                        >
                            <Marker
                                coordinate={{
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                }}
                            >

                            </Marker>
                        </MapView>
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
        paddingVertical: 10,
        borderRadius: 24,
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
},

)

