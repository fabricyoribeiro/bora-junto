import { useEffect, useState, useRef } from "react";
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Modal, ViewComponent } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { api } from "../Lib/axios";
import Header from "../Components/Header"
import { Checkbox } from "react-native-paper";
import MapView, { Marker } from 'react-native-maps';
import ButtonAction from "./ButtonAction";



import {
    requestForegroundPermissionsAsync,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy

} from 'expo-location'
import EventDetails from "../Components/EventDetails";



export default function Map({ navigation, onLogout, close, onSubmit}) {

    const [position, setPosition] = useState(null)
    const mapRef = useRef(null)
    const [search, setSearch] = useState()
    const [autoComplete, setAutoComplete] = useState([])
    const [region, setRegion] = useState(null)
    const [localAddress, setLocalAddress] = useState(null);
    const [submitPending, setSubmitPending] = useState(false); 

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
            const response = await api.get(`https://api.locationiq.com/v1/autocomplete?key=pk.b841bb433e74583e013fbc6a0c2fbb6c&q=${val}&limit=5&dedupe=1&accept-language=pt-br`);
            setAutoComplete(response.data);
            console.log(response.data);

        } catch (error) {
            console.log(error);
        }
    }
    function formatLocationAddress(location) {
        const { road, neighbourhood, town, state, postcode } = location.address;
        return `${road ? road + ', ': ''}${neighbourhood ? neighbourhood + ', ' : ''}${town ? town + ' - ' : ''}${state ? state : ''}`;
    }
    async function AddressFetch(val) {
        try {
            const response = await api.get(`https://us1.locationiq.com/v1/reverse?key=pk.b841bb433e74583e013fbc6a0c2fbb6c&lat=${val.latitude}&lon=${val.longitude}&format=json&accept-language=pt-br`);
            setLocalAddress(formatLocationAddress(response.data));
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

    useEffect(() => {
        if (localAddress) {
            onSubmit({
                address: localAddress,
                latitude: region.latitude,
                longitude: region.longitude
            });
            close();
        }
    }, [localAddress]);
    return (



        <View style={styles.container}>
            <View style={{ backgroundColor: 'black', position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, opacity: 0.6 }} />
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
                                        placeholder="Buscar"
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
                                    onPress={close}
                                >
                                    <FontAwesome name='close' size={20} color={'black'} />
                                </TouchableOpacity>
                            </View>
                            {
                                autoComplete.length > 0 && search &&
                                <ScrollView style={styles.suggestions} >
                                    {
                                        autoComplete.map((suggestion, index) => (
                                            <TouchableOpacity key={index} style={{ borderBottomWidth: 0.5, paddingVertical: 5 }} onPress={() => {
                                                mapRef.current?.animateCamera({
                                                    pitch: 70,
                                                    center: { longitude: Number(suggestion.lon), latitude: Number(suggestion.lat) }
                                                })
                                            }}>
                                                <Text style={{ color: 'black', zIndex: 2 }}>{formatLocationAddress(suggestion)}</Text>
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
                        zoomControlEnabled={false}
                        initialRegion={{
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        }}
                        onRegionChangeComplete={(region) => setRegion(region)}
                        onTouchStart={() => {
                            setAutoComplete([]);
                        }}
                    >
                    </MapView>
                    <View style={{ position: 'absolute', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Image width={48} height={48} resizeMode="contain" source={require('../../assets/markers/New event.png')} />
                    </View>
                    <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row', margin: 10, elevation: 50 }}>
                        <ButtonAction text={"Selecionar localização"} action={() => {
                            AddressFetch(region)

                            }} />
                    </View>
                </View >
            }
        </View >

    );
};

const styles = StyleSheet.create({
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
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        paddingHorizontal: 15,
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
        marginHorizontal: 15,
    },
    map: {
        position: 'absolute',
        top: 0,
        bottom: -30,
        left: 0,
        right: 0,
        width: '100%',
    },
    inputView: {
        display: "flex",
        flexDirection: "column",
        gap: 40,
        padding: 5,
        zIndex: 1,
        marginTop: 30
    },
    EventDetailView: {
        position: "absolute",
        width: '100%',
        bottom: 250,
        left: 0,
        right: 0,
        padding: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        zIndex: 1,
        elevation: 50,
    },
    inputsearch: {
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingHorizontal: 17,
        paddingVertical: 10,
        flex: 1,
        justifyContent: 'center',
        elevation: 50,
        height: 50,
        alignSelf: 'center'
    },
    sendIcon: {
        alignSelf: 'center',
        position: 'absolute',
        right: 20,
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
        minHeight: 170,
        maxHeight: 300,
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
        elevation: 50,
    },
    checkBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        zIndex: 2,
    },
});

