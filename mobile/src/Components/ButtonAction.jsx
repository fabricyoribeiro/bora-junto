import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, Text } from "react-native"
import { StyleSheet } from "react-native"

export default function ButtonAction({ action, text, icon }) {


    return (
        <>
            {
                !icon ? (
                    <TouchableOpacity
                        style={styles.textButton}
                        activeOpacity={0.5}
                        onPress={action}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontFamily: "Montserrat-Italic",
                                fontSize: 15,
                                textAlign: "center",
                            }}
                        >
                            {text}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.iconButton}
                        activeOpacity={0.5}
                        onPress={action}
                    >
                        <FontAwesome name={icon} size={20} color={'white'}/>
                    </TouchableOpacity>
                )}
        </>

    )
}
const styles = StyleSheet.create({
    textButton: {
        backgroundColor: "red",
        height: 50,
        borderRadius: 76,
        justifyContent: "center",
        alignContent: 'center',
        alignSelf: 'center',
        flex:1
    },
    iconButton: {
        backgroundColor: "gray",
        height: 50,
        width: 50,
        borderRadius: 76,
        justifyContent: "center",
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',

    },
})