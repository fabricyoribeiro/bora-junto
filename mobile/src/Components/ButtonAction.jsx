import { TouchableOpacity, Text } from "react-native"
import { StyleSheet } from "react-native"

export default function ButtonAction({action, text}) {


    return (
        <>

        <TouchableOpacity
            style={styles.botao}
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
        </>

    )
}
const styles = StyleSheet.create({
    botao: {
        backgroundColor: "red",
        height: 50,
        width: '100%',
        borderRadius: 76,
        justifyContent: "center",
        alignContent:'center',
        alignSelf:'center',
        position: 'absolute',
        bottom: 10
    }
})