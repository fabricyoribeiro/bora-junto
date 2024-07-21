import { View, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
const { width } = Dimensions.get("window");



export default function ViewProfilePic({ profilePic, close }) {

    return (

        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.6} style={{ backgroundColor: 'black', position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, opacity: 0.6 }} onPress={close}/>
            <View>
            <TouchableOpacity
                style={styles.iconButton}
                activeOpacity={0.5}
                onPress={close}
            >
                <FontAwesome name='close' size={30} color={'black'} />
            </TouchableOpacity>
            <Image source={{ uri: profilePic }} style={styles.image} resizeMode="contain" />
            </View>
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
        flexDirection: 'column',
        height:'100%',
        width: '100%',
        paddingHorizontal: 15,
        alignItems:'center',
        justifyContent:'center'
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

        width: '100%',
    },
    iconButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        height: 50,
        width: 50,
        borderRadius: 76,
        justifyContent: "center",
        zIndex:1

    },
    image: {
        width: width*0.95,
        height: width*0.95,
        marginHorizontal:16,
        borderRadius: 16
    },
});

