import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, Image} from "react-native";
import { FontAwesome6, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import MapView, { Marker } from 'react-native-maps';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as RootNavigation from '../../RootNavigation'


import {
    requestForegroundPermissionsAsync,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy

} from 'expo-location'



export default function Home({ navigation, onLogout }) {

    const [clima, setClima] = useState(null)
    const [progress, setProgress] = useState(8);
    const [position, setPosition] = useState(null)
    const mapRef = useRef(null)




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

    const getClima = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=e625166897db49c6bd0232242241205&q=${latitude},${longitude}&aqi=no`);
            const data = await response.json();
            setClima(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
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
                    getClima(coords.latitude, coords.longitude);
                    
                    watchPositionAsync({
                        accuracy: LocationAccuracy.Highest,
                        distanceInterval: 1,
                        timeInterval: 1000

                    }, (response) => {
                        setPosition(response)
                        mapRef.current?.animateCamera({
                            pitch: 70,
                            center: response.coords
                        })

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
            <Header title={'Eaí João!'} onLogout={onLogout}/>

            <View style={styles.container}>
                <TouchableOpacity style={styles.block} activeOpacity={0.5} onPress={() => { RootNavigation.navigate("Agenda") }}>
                    <AnimatedCircularProgress
                        size={120}
                        fill={progress}
                        width={2}
                        tintColor="#f00"
                        rotation={0}
                        backgroundColor="#fff"
                    >
                        {() => (
                            <View style={styles.progress}>
                                <Text
                                    style={{ fontFamily: "Montserrat-BoldItalic", fontSize: 35 }}
                                >
                                    {progress}
                                </Text>
                                <Text style={styles.subtitle}>dias de {"\n"} foco</Text>
                            </View>
                        )}
                    </AnimatedCircularProgress>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.subtitle}>Hoje é dia de</Text>
                        <Text style={styles.title}>Corrida</Text>
                    </View>
                    <Ionicons name="calendar" size={20} color="black" style={{ bottom: 20, right: 20, position: 'absolute' }} />
                </TouchableOpacity >
                {
                    clima && position ? (
                        <>

                            <View style={styles.blockhalf}>
                                <FontAwesome6 name="temperature-half" size={20} color="black" />
                                <Text>{clima.current.temp_c} °C</Text>
                                <FontAwesome6 name="droplet" size={20} color="black" />
                                <Text>{clima.current.humidity} %</Text>
                                <Image
                                    style={{
                                        marginVertical: -10,
                                        alignSelf: 'center',
                                        height: 30,
                                        width: 30,
                                        tintColor: 'black'
                                    }}
                                    source={{
                                        uri: `https://${clima.current.condition.icon.replace('64x64', '128x128')}`,
                                    }}
                                />
                                <Text>Nublado</Text>
                            </View>


                        </>
                    ) : null
                }
                {
                    position &&
                    <TouchableOpacity style={styles.mapblock} activeOpacity={0.9} onPress={()=>navigation.navigate('Map') }>
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
                        >
                            <Marker
                                coordinate={{
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                }}
                            >

                            </Marker>
                        </MapView>
                    </TouchableOpacity>

                }
            </View>

            {/* <Footer navigation={navigation} /> */}
        </View>


    )

}
const styles = StyleSheet.create({
    bg: {
        backgroundColor: 'white',
        height: '100%'
    },
    titleView: {
        position: 'absolute',
        top: 100,
        left: 20,

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
        height: '50%',
        width: '100%',
        borderRadius: 24,
        gap: 15,
        overflow: 'hidden',
    },
    blockhalf: {
        backgroundColor: '#EAEAEA',
        padding: 20,
        borderRadius: 24,
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'space-around'

    },
    progress: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    climaIcon: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    map: {
        position: 'absolute',
        top: 0,
        bottom: -30,
        lef: 0,
        right: 0,
        width: '100%',
        
    }
},

)

