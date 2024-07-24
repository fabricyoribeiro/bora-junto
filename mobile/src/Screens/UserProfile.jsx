// import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef, useContext } from "react";
import { Text, View, StyleSheet, Image, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Modal } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../Components/Header"
import { api } from '../Lib/axios'
import { getUserUID } from "../Services/AuthService";
import { format } from "date-fns";
import pt from "date-fns/locale/pt";
import Loading from "../Components/Loading.jsx";
import ViewProfilePic from "../Components/ViewProfilePic.jsx";
import { FontAwesome } from "@expo/vector-icons";
import { UserContext } from "../Context/userContext.js";
export default function UserProfile({ route, navigation, onLogout }) {

    const { user } = route.params;
    const loggedUserId = getUserUID()
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };  
    
    // const [loading, setLoading] = useState(false)
    // function fechtData(id) {
    //     setLoading(true)
    //     if (user != null) {
    //         // const { user } = useContext(UserContext)
    //         console.log(user.id)
    //         setLoading(false)
    //     }
    // }
    // useEffect(() => {
    //     fechtData()
    // }, []);
    
    return (
        <View style={styles.bg}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            {/* <Loading visible={loading} /> */}
            <Header title={`Perfil`} onLogout={onLogout} />

            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    statusBarTranslucent
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                >
                    <ViewProfilePic profilePic={user.profile_pic_url} close={() => toggleModal()} />
                </Modal>
                <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center', alignSelf: 'center', marginVertical: 30 }}>
                    <TouchableWithoutFeedback onPress={() => toggleModal()}>
                        <Image source={{ uri: user.profile_pic_url }} width={70} height={70} style={styles.image} />
                    </TouchableWithoutFeedback>
                    <View style={{ flexDirection: 'column' }}>

                        <Text style={styles.title}>{user.name}</Text>
                        <Text style={styles.subtitle}>@{user.username}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <Text style={styles.subtitle}>Perfil</Text>
                    {
                        user.id === loggedUserId &&
                        <Feather name="edit" size={20} color="black" />
                    }
                </View>
                <View style={styles.block} >
                    <View style={styles.info}>
                        <View style={styles.label}>
                            <Feather name='user' size={20} color={'black'} />
                            <Text>Nome</Text>
                        </View>
                        <Text>{user.name}</Text>
                    </View>
                    <View style={styles.divisor} />
                    <View style={styles.info}>
                        <View style={styles.label}>
                            <MaterialIcons name='alternate-email' size={20} color={'black'} />
                            <Text>Usuário</Text>
                        </View>
                        <Text>@{user.username}</Text>
                    </View>
                    <View style={styles.divisor} />
                    <View style={styles.info}>
                        <View style={styles.label}>
                            <Ionicons name='people-outline' size={20} color={'black'} />
                            <Text>Categoria</Text>
                        </View>
                        <Text>{user.category ? user.category : 'Não definida'}</Text>
                    </View>
                    <View style={styles.divisor} />
                    <View style={styles.info}>
                        <View style={styles.label}>
                            <Feather name='calendar' size={20} color={'black'} />
                            <Text>Data de nascimento</Text>
                        </View>
                        <Text>{format(new Date(user.birth_date), "P", { locale: pt })}</Text>
                    </View>
                </View >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <Text style={styles.subtitle}>Sobre mim</Text>
                    {
                        user.id === loggedUserId &&
                        <Feather name="edit" size={20} color="black" />
                    }
                </View>
                <View style={styles.block} >
                    <Text style={{ maxHeight: 100 }} lineBreakMode="tail">{user.description ? user.description : 'Nada por enquanto...'}</Text>
                </View >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <Text style={styles.subtitle}>Contato</Text>
                    {
                        user.id === loggedUserId &&
                        <Feather name="edit" size={20} color="black" />
                    }
                </View>
                <View style={styles.block} >
                    <View style={styles.info}>
                        <View style={styles.label}>
                            <Feather name='phone' size={20} color={'black'} />
                            <Text>Telefone</Text>
                        </View>
                        <Text>{user.phone}</Text>
                    </View>
                    <View style={styles.divisor} />
                    <View style={styles.info}>
                        <View style={styles.label}>
                            <Feather name='mail' size={20} color={'black'} />
                            <Text>Email</Text>
                        </View>
                        <Text>{user.email}</Text>
                    </View>
                </View >


            </View>
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
    sectiontitle: {
        fontFamily: 'Montserrat-BoldItalic',
        color: 'black',
        fontSize: 18,
    },
    subtitle: {
        fontFamily: 'Montserrat-Italic',
        color: 'black',
        fontSize: 15,
    },
    container: {
        height: '100%',
        flexDirection: 'column',
        marginTop: 100,
        marginHorizontal: 15,
        gap: 15
    },

    block: {
        backgroundColor: '#EAEAEA',
        width: '100%',
        padding: 20,
        borderRadius: 24,
        gap: 15
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
    profilePic: {
        width: 70,
        height: 70,
        backgroundColor: '#EAEAEA',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    divisor: {
        width: '150%',
        backgroundColor: 'white',
        height: 2,
        alignSelf: 'center'
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: "#eaeaea",
    },
    label: {
        flexDirection: "row",
        gap: 10
    }
},

)

