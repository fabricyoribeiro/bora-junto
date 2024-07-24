// import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef, useContext } from "react";
import { Text, View, StyleSheet, Image, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, Alert, KeyboardAvoidingView, Keyboard } from "react-native";
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
import DateTimePicker from "react-native-modal-datetime-picker";
import useToastConfig from "../Hooks/useToast.js";
import Toast from "react-native-toast-message";

export default function UserProfile({ route, navigation, onLogout }) {
    const { user } = route.params;
    const { setUser } = useContext(UserContext)
    const loggedUserId = getUserUID();
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(!modalVisible);

    // Estado único para armazenar todos os campos do usuário
    const [userData, setUserData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        //falta configurar category
        user_category: '',
        birth_date: user?.birth_date || '',
        //falta configurar description
        description: user?.description || '',
        phone: user?.phone || '',
        email: user?.email || '',
        profile_pic_url: user?.profile_pic_url || ''
    });

    const [editingField, setEditingField] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {showToast, toastConfig} = useToastConfig()

    const handleInputChange = (field, value) => {
        setUserData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            const { data } = await api.put(`/user/${loggedUserId}`, userData);
            setUser(data)
            showToast("As alterações foram salvas")
        } catch (error) {
            console.error("Failed to save user data", error);
            showToast("Não foi possível salvar as alterações", 'error')
        }
    };

    function SaveCancelButtons() {
        return (
            <>
                <View style={styles.divisor} />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => { setEditingField(null) }} style={styles.cancelButton}>
                        <Text style={styles.saveButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={{ color: '#fff' }}>Salvar</Text>
                    </TouchableOpacity>
                </View>

            </>
        )
    }

    if (!user) {
        setIsLoading(true)
    }

    useEffect(() => {
        if (user) {
            setIsLoading(false)
        }
    }, [user])

    return (
        <>
        {
        isLoading ? (<Loading visible={true} />) :
            (
                <KeyboardAvoidingView>
                    <ScrollView style={styles.bg}>
                        <StatusBar
                            barStyle="dark-content"
                            backgroundColor="transparent"
                            translucent
                        />
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
                                <ViewProfilePic profilePic={userData.profile_pic_url} close={() => toggleModal()} />
                            </Modal>
                            <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center', alignSelf: 'center', marginVertical: 30 }}>
                                <TouchableWithoutFeedback onPress={() => toggleModal()}>
                                    <Image source={{ uri: user.profile_pic_url }} width={70} height={70} style={styles.image} />
                                </TouchableWithoutFeedback>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={styles.title}>{userData.name}</Text>
                                    <Text style={styles.subtitle}>@{userData.username}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                <Text style={styles.subtitle}>Perfil</Text>
                                {user.id === loggedUserId && (
                                    <Feather name="edit" size={20} color="black" onPress={() => setEditingField('profile')} />
                                )}
                            </View>
                            <View style={styles.block}>
                                {editingField === 'profile' ? (
                                    <>
                                        <View style={styles.info}>
                                            <View style={styles.label}>
                                                <Feather name='user' size={20} color={'black'} />
                                                <Text>Nome</Text>
                                            </View>
                                            <TextInput value={userData.name} onChangeText={(value) => handleInputChange('name', value)} style={styles.input} />
                                        </View>
                                        <View style={styles.divisor} />
                                        <View style={styles.info}>
                                            <View style={styles.label}>
                                                <MaterialIcons name='alternate-email' size={20} color={'black'} />
                                                <Text>Usuário</Text>
                                            </View>
                                            <TextInput value={userData.username} onChangeText={(value) => handleInputChange('username', value)} style={styles.input} />
                                        </View>
                                        <View style={styles.divisor} />
                                        <View style={styles.info}>
                                            <View style={styles.label}>
                                                <Ionicons name='people-outline' size={20} color={'black'} />
                                                <Text>Categoria</Text>
                                            </View>
                                            <TextInput value={userData.user_category} onChangeText={(value) => handleInputChange('user_category', value)} style={styles.input} />
                                        </View>
                                        <View style={styles.divisor} />
                                        <View style={styles.info}>
                                            <View style={styles.label}>
                                                <Feather name='calendar' size={20} color={'black'} />
                                                <Text>Data de nascimento</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                                                <Text>{format(new Date(userData.birth_date), "P", { locale: pt })} </Text>
                                            </TouchableOpacity>
                                            <DateTimePicker
                                                isVisible={isDatePickerVisible}
                                                mode="date"
                                                onCancel={() => setDatePickerVisible(false)}
                                                value={userData.birth_date}
                                                onConfirm={(value) => { handleInputChange('birth_date', value), setDatePickerVisible(false) }}
                                            />
                                        </View>
                                        <SaveCancelButtons />
                                    </>
                                ) : (
                                    <>
                                        <View style={styles.info}>
                                            <View style={styles.label}>
                                                <Feather name='user' size={20} color={'black'} />
                                                <Text>Nome</Text>
                                            </View>
                                            <Text>{userData.name}</Text>
                                        </View>
                                        <View style={styles.divisor} />
                                        <View style={styles.info}>
                                            <View style={styles.label}>
                                                <MaterialIcons name='alternate-email' size={20} color={'black'} />
                                                <Text>Usuário</Text>
                                            </View>
                                            <Text>@{userData.username}</Text>
                                        </View>
                                        <View style={styles.divisor} />
                                        <View style={styles.info}>
                                            <View style={styles.label}>
                                                <Ionicons name='people-outline' size={20} color={'black'} />
                                                <Text>Categoria</Text>
                                            </View>
                                            <Text>{userData.user_category ? userData.user_category : 'Não definida'}</Text>
                                        </View>
                                        <View style={styles.divisor} />
                                        <View style={styles.info}>
                                            <View style={styles.label}>
                                                <Feather name='calendar' size={20} color={'black'} />
                                                <Text>Data de nascimento</Text>
                                            </View>
                                            <Text>{format(new Date(userData.birth_date), "P", { locale: pt })}</Text>
                                        </View>
                                    </>
                                )}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                <Text style={styles.subtitle}>Sobre mim</Text>
                                {user.id === loggedUserId && (
                                    <Feather name="edit" size={20} color="black" onPress={() => setEditingField('about')} />
                                )}
                            </View>
                            <View style={styles.block}>
                                {editingField === 'about' ? (
                                    <>
                                        <TextInput
                                            value={userData.description}
                                            onChangeText={(value) => handleInputChange('description', value)}
                                            style={styles.input}
                                            multiline
                                        />
                                        <SaveCancelButtons />

                                    </>
                                ) : (
                                    <Text style={{ maxHeight: 100 }} lineBreakMode="tail">
                                        {userData.description ? userData.description : 'Nada por enquanto...'}
                                    </Text>
                                )}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                <Text style={styles.subtitle}>Contato</Text>
                                {user.id === loggedUserId && (
                                    <Feather name="edit" size={20} color="black" onPress={() => setEditingField('contact')} />
                                )}
                            </View>

                            {
                                editingField === 'contact' ? (
                                    <View style={styles.block} >
                                        <View style={styles.info}>
                                            <View style={styles.label}>
                                                <Feather name='phone' size={20} color={'black'} />
                                                <Text>Telefone</Text>
                                            </View>
                                            <TextInput
                                                value={userData.phone}
                                                onChangeText={(value) => handleInputChange('phone', value)}
                                                style={styles.input}
                                                multiline
                                            />
                                        </View>
                                        <View style={styles.divisor} />
                                        <View style={styles.info}>
                                            <View style={styles.label}>
                                                <Feather name='mail' size={20} color={'black'} />
                                                <Text>Email</Text>
                                            </View>
                                            <TextInput
                                                value={userData.email}
                                                onChangeText={(value) => handleInputChange('email', value)}
                                                style={styles.input}
                                                multiline
                                            />
                                        </View>
                                        <SaveCancelButtons />
                                    </View >

                                ) : (
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
                                )
                            }
                        </View>
                    </ScrollView>
                    <Toast config={toastConfig} />
                </KeyboardAvoidingView>
            )
        }
        </>


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
    },
    saveButton: {
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#ff0000",
    },
    cancelButton: {
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "#8d8686",
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 15
    }
},

)

