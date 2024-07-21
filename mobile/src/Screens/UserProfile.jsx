// import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, Image, StatusBar, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../Components/Header"
import { api } from '../Lib/axios'
import { getUserUID } from "../Services/AuthService";
import { format } from "date-fns";
import pt from "date-fns/locale/pt";
import Loading from "../Components/Loading.jsx";

export default function UserProfile({ navigation, onLogout }) {

    const [name, setName] = useState(null)
    const [username, setUsername] = useState(null)
    const [categoryId, setCategoryId] = useState(null)
    const [profilePic, setProfilePic] = useState(null)
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)
    const [description, setDescription] = useState('')
    const [birthdate, setBirthdate] = useState(null)
    const userId = getUserUID();
    const [loading, setLoading] = useState(false)
    async function fechtData(id) {
        try {
            setLoading(true)
            const response = await api.get(`/user/${id}`)
            const data = response.data
            setUsername(data.username)
            setDescription(data.description)
            setProfilePic(data.profile_pic_url)
            setEmail(data.email)
            setPhone(data.phone)
            setName(data.name)
            setBirthdate(data.birth_date)
            setLoading(false)
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
            <Loading visible={loading}/>
            <Header title={`Perfil`} onLogout={onLogout} />

            <View style={styles.container}>
                
                <View style={{ flexDirection: 'row', width: '100%', gap: 15, alignItems: 'center' }}>
                    <View style={styles.profilePic}>
                        { profilePic && 
                            <Image source={{uri:profilePic}} width={70} height={70}/>
                        }
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.subtitle}>@{username}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10}}>
                <Text style={styles.subtitle}>Perfil</Text>
                <Feather name="edit" size={20} color="black"/>
                </View>
                <View style={styles.block} >
                    <View style={styles.info}>
                        <Text>Nome</Text>
                        <Text>{name}</Text>
                    </View>
                    <View style={styles.divisor}/>
                    <View style={styles.info}>
                        <Text>Usuário</Text>
                        <Text>{username}</Text>
                    </View>
                    <View style={styles.divisor}/>
                    <View style={styles.info}>
                        <Text>Categoria</Text>
                        <Text>Corredor</Text>
                    </View>
                    <View style={styles.divisor}/>
                    <View style={styles.info}>
                        <Text>Data de nascimento</Text>
                        <Text>{format(new Date(birthdate), "P", { locale: pt })}</Text>
                    </View>
                </View >
                <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10}}>
                <Text style={styles.subtitle}>Sobre mim</Text>
                <Feather name="edit" size={20} color="black" />
                </View>
                <View style={styles.block} >
                <Text style= {{maxHeight:100}}lineBreakMode="tail">{description ? description : 'Escreva algo...'}</Text>
                </View >
                <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10}}>
                <Text style={styles.subtitle}>Contato</Text>
                <Feather name="edit" size={20} color="black" />
                </View>
                <View style={styles.block} >
                <View style={styles.info}>
                        <Text>Telefone</Text>
                        <Text>{phone}</Text>
                    </View>
                    <View style={styles.divisor}/>
                    <View style={styles.info}>
                        <Text>Email</Text>
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
    sectiontitle:{
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
        alignItems:'center',
        justifyContent:'center'
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    divisor:{
        width:'150%',
        backgroundColor:'white',
        height:2,
        alignSelf:'center'
    }

},

)

