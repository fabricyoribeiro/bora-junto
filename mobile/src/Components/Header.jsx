import { Text, View, StyleSheet, TouchableOpacity, Animated} from "react-native";
import SideMenu from "./SideMenu";
import {useState } from "react";



export default function Header({ navigation, title, onLogout }) {
    const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = () =>{
        setShowMenu(!showMenu)
    }

    return (
        <>
        {
            showMenu && 
            
                <SideMenu showMenu={showMenu} closeMenu={() => {setShowMenu(false)}} onLogout={onLogout} />

        }
            <View style={styles.header}>
                <TouchableOpacity style={styles.menutoggle} onPress={()=>toggleMenu()}>
                    <View style={{ width: 35, backgroundColor: 'red', height: 5, borderRadius: 7 }} />
                    <View style={{ width: 25, backgroundColor: 'red', height: 5, borderRadius: 7 }} />
                    <View style={{ width: 15, backgroundColor: 'red', height: 5, borderRadius: 7 }} />
                </TouchableOpacity>
                <Text style={styles.title}>{showMenu ? 'Menu' : title}</Text>
            </View>
        </>

    )

}
const styles = StyleSheet.create({
    title: {
        fontFamily: 'Montserrat-BoldItalic',
        color: 'black',
        fontSize: 20,
    },
    header: {
        position: 'absolute',
        paddingStart: 20,
        paddingTop: 50,
        flexDirection: 'row',
        top: 0,
        height: 90,
        width: '100%',
        alignItems: 'center',
        gap: 10,
        // zIndex: 1

    },
    menutoggle: {
        flexDirection: 'col',
        gap: 3
    }
})

