import { Text,  View } from "react-native";
import { StyleSheet } from "react-native";



export default function MessageSection({date}) {


    return (
        <View style={styles.dateTime}>
            <Text style={{ textAlign: 'center', fontSize: 12 }}>{date}</Text>
        </View>

    )

}

const styles = StyleSheet.create({
    dateTime: {
        backgroundColor: '#EAEAEA',
        borderRadius: 100,
        alignSelf: 'center',
        paddingHorizontal: 13,
        paddingVertical: 5,
        marginVertical: 10,

    }
})