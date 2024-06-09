
import { View, StyleSheet, TouchableOpacity , Alert} from "react-native";
import { FontAwesome, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import * as Notifications from 'expo-notifications';



export default function Footer({ navigation }) {

    const handleCallNotifications = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        if (!status) {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            if (!newStatus) {
                Alert.alert('Suas notificações estão desabilitadas');
                return;
            }
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Temos notificações!',
                body: 'Puta que pariu Jão é foda',
            },
            trigger: {
                seconds: 5,
            },
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleCallNotifications}> 
            {/* Ainda vai ser adicionado uma página para esse botão */}
                <SimpleLineIcons name="chart" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('Home')}>
                <SimpleLineIcons name="user" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('Feed')}>
                <SimpleLineIcons name="control-play" size={20} color="white" />
            </TouchableOpacity>
        </View>
    )

}
const styles = StyleSheet.create({

    container: {
        backgroundColor: 'red',
        height: 60,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderTopStartRadius: 61,
        paddingHorizontal: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

