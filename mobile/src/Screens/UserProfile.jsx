// import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
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
export default function UserProfile({ route, navigation, onLogout }) {
    const { user } = route.params;
    const [name, setName] = useState(null)
    const [username, setUsername] = useState(null)
    const [category, setCategory] = useState(null)
    const [profilePic, setProfilePic] = useState(null)
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)
    const [description, setDescription] = useState('')
    const [birthdate, setBirthdate] = useState(null)
    const userId = getUserUID();
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    async function fechtData(id) {
        try {
            setLoading(true)
            if (user != null) {
                setUsername(user.username)
                setDescription(user.description)
                setProfilePic(user.profile_pic_url)
                setEmail(user.email)
                setPhone(user.phone)
                setName(user.name)
                setBirthdate(user.birth_date)
                // setCategory(user.user_category.description)
                setLoading(false)
            } else {
                const response = await api.get(`/user/${id}`)
                const data = response.data
                setUsername(data.username)
                setDescription(data.description)
                setProfilePic(data.profile_pic_url)
                setEmail(data.email)
                setPhone(data.phone)
                setName(data.name)
                setBirthdate(data.birth_date)
                // setCategory(data.user_category.description)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        // setUserId(userId)
        console.log('IDDDD', userId)

        fechtData(userId)

    }, []);


    return (
        <View style={styles.bg}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            <Loading visible={loading} />
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
                    <ViewProfilePic profilePic={profilePic} close={() => toggleModal()} />
                </Modal>
                <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center', alignSelf: 'center', marginVertical: 30 }}>
                    <TouchableWithoutFeedback onPress={() => toggleModal()}>
                        <Image source={{ uri: profilePic }} width={70} height={70} style={styles.image} />
                    </TouchableWithoutFeedback>
                    <View style={{ flexDirection: 'column' }}>

                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.subtitle}>@{username}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <Text style={styles.subtitle}>Perfil</Text>
                    {
                        !user &&
                        <Feather name="edit" size={20} color="black" />
                    }
                </View>
                <View style={styles.block} >
                    <View style={styles.info}>
                        <View style={styles.label}>
                            <Feather name='user' size={20} color={'black'} />
                            <Text>Nome</Text>
                        </View>
                        <Text>{name}</Text>
                    </View>
                    <View style={styles.divisor} />
                    <View style={styles.info}>
                        <View style={styles.label}>
                            <MaterialIcons name='alternate-email' size={20} color={'black'} />
                            <Text>Usuário</Text>
                        </View>
                        <Text>@{username}</Text>
                    </View>
                    <View style={styles.divisor} />
                    <View style={styles.info}>
                        <View style={styles.label}>
                            <Ionicons name='people-outline' size={20} color={'black'} />
                            <Text>Categoria</Text>
                        </View>
                        <Text>{category ? category : 'Não definida'}</Text>
                    </View>
                    <View style={styles.divisor} />
                    <View style={styles.info}>
                        <View style={styles.label}>
                            <Feather name='calendar' size={20} color={'black'} />
                            <Text>Data de nascimento</Text>
                        </View>
                        <Text>{format(new Date(birthdate), "P", { locale: pt })}</Text>
                    </View>
                </View >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <Text style={styles.subtitle}>Sobre mim</Text>
                    {
                        !user &&
                        <Feather name="edit" size={20} color="black" />
                    }
                </View>
                <View style={styles.block} >
                    <Text style={{ maxHeight: 100 }} lineBreakMode="tail">{description ? description : 'Nada por enquanto...'}</Text>
                </View >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <Text style={styles.subtitle}>Contato</Text>
                    {
                        !user &&
                        <Feather name="edit" size={20} color="black" />
                    }
                </View>
                <View style={styles.block} >
                    <View style={styles.info}>
                    <View style={styles.label}>
                    <Feather name='phone' size={20} color={'black'} />
                        <Text>Telefone</Text>
                        </View>
                        <Text>{phone}</Text>
                    </View>
                    <View style={styles.divisor} />
                    <View style={styles.info}>
                    <View style={styles.label}>
                    <Feather name='mail' size={20} color={'black'} />
                        <Text>Email</Text>
                        </View>
                        <Text>{email}</Text>
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
    label:{
        flexDirection: "row",
        gap: 10
    }
},

)

