import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CheckBox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword

} from "firebase/auth";
import { auth } from './../Services/FireBaseConfig.js'


export default function Login({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginVisible, setLoginVisible] = useState(true);

  const createUser = (userData) => {
    fetch(`http://192.168.1.108:3030/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
        .then(res => {
            if (res.ok) {
                console.log('Solicitação lançada')
                onLogin() 
                // navigation.navigate('Home')
            }


        })
}
  const handleSignup = () => {

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("USER CRIADO",user)
            createUser({
              id: user.uid,
              name: nickName,
              username: email,
              phone: phone,
              email: email,
              //TO DO: alterar o input para pegar a data com popup
              birth_date: new Date(),
              user_category_id: 1,
              //foi necessario criar um lacation para poder adicionar o user
              location_id: 3
              
            })
            console.log("USER CADASTRADO COM SUCESSO")

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });
}
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        onLogin()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
      });

    
  };

  return (
    <View style={styles.bg}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Seja bem vindo!</Text>
        <Text style={styles.subtitle}>Faça seu login</Text>
      </View>

      {loginVisible ? (
        <>
          <View style={styles.container}>
            <View>
              <Text style={styles.label}>Usuário | Email</Text>
              <TextInput style={styles.textInput}
              value={email}
              autoCapitalize="none"
              autoComplete="email"
              onChangeText={setEmail} 
              />
            </View>
            <View style={styles.passwordContainer}>
              <Text style={styles.label}>Senha</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  style={{ height: 50, flex: 1 }}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword} 
                />
                
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <CheckBox />
              <Text style={styles.label}>Manter conectado</Text>
            </View>
            <View
              style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
            >
              <Text style={styles.label}>Primeira vez?</Text>
              <TouchableOpacity onPress={() => setLoginVisible(false)}>
                <Text style={styles.label}>Cadastre-se aqui</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.botao}
              activeOpacity={0.5}
              onPress={handleLogin}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Montserrat-Italic",
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={{gap:30}}>
            <View>
              <Text style={styles.label}>Nome</Text>
              <TextInput style={styles.textInput} 
              value={nickName}
              onChangeText={setNickName} />
            </View>
            <View>
              <Text style={styles.label}>Telefone</Text>
              <TextInput style={styles.textInput}
              value={phone}
              onChangeText={setPhone} />
            </View>
            <View>
              <Text style={styles.label}>Usuário | Email</Text>
              
              <TextInput autoCapitalize="none" autoComplete="email" style={styles.textInput}
              value={email}
              onChangeText={setEmail} />
            </View>
            <View style={styles.passwordContainer}>
              <Text style={styles.label}>Senha</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  style={{ height: 50, flex: 1 }}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.label}>Data de nascimento</Text>
              <TextInput style={styles.textInput}
              value={birthDate}
              onChangeText={setBirthDate} />
            </View>
            <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
              <Text style={styles.label}>Já possui uma conta?</Text>
              <TouchableOpacity onPress={() => setLoginVisible(!loginVisible)}>
                <Text style={styles.label}>Entre aqui</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.botao}
              activeOpacity={0.5}
              onPress={handleSignup}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Montserrat-Italic",
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                Juntar-se
              </Text>
            </TouchableOpacity>
            </ScrollView>
          </View>
          
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "red",
    height: "100%",
  },
  container: {
    backgroundColor: "white",
    height: "70%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopStartRadius: 61,
    paddingTop: 40,
    paddingHorizontal: 30,
    flexDirection: "column",
    gap: 30,
  },
  titleView: {
    position: "absolute",
    top: 100,
    left: 20,
  },
  title: {
    fontFamily: "Montserrat-BoldItalic",
    color: "white",
    fontSize: 20,
  },
  subtitle: {
    fontFamily: "Montserrat-Italic",
    color: "white",
    fontSize: 15,
  },
  label: {
    fontFamily: "Montserrat-Italic",
    color: "gray",
    fontSize: 12,
  },
  textInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    height: 40,
  },
  botao: {
    backgroundColor: "red",
    height: 50,
    borderRadius: 76,
    justifyContent: "center",
    marginTop: 20,
  },
  passwordContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    height: 60,
  },
});
