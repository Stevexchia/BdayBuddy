import { View, Button, Text, TextInput, SafeAreaView, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ImageBackground } from "react-native";
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { useAnimatedKeyboard } from 'react-native-reanimated';
import { signInWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, User } from 'firebase/auth';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

//formik
import { Formik } from 'formik';

//icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

import { Colors } from '../../components/style'
const { brand, darklight, primary } = Colors;

//***APP CODE STARTS BELOW***
const Login = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const [userInfo, setUserInfo] = React.useState<User | undefined>(undefined);

  //initialising web browser
WebBrowser.maybeCompleteAuthSession();

async function confirmLogin() {
  setLoading(true);
  try {
    console.log("Logging in...");
    const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const uid = userCredential.user.uid;

    // Save user data in AsyncStorage
    await AsyncStorage.setItem("@user", JSON.stringify(userCredential.user));

    console.log("Login successful!");
    navigation.navigate("Home", { userId: uid });
  } catch (error) {
    console.error("Error logging in:", (error as Error).message);
    // Handle error - display error message to user
  } finally {
    setLoading(false);
  }
}

  function handleSignUp() {
    console.log("Sign Up");
    // SignUpScreen();
    navigation.navigate("Signup")
  }
  
  //google authentication
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '209106502578-c0h0vshlvbm9nv0hpjrfbbkjmp0f1chj.apps.googleusercontent.com',
    iosClientId:'209106502578-q5b8hf7bn2sm4glksgis5b13p97t9gsi.apps.googleusercontent.com',
    androidClientId: '209106502578-2hpqmn9a987e8bu33n14diuber8e1kj7.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({
      useProxy: true,
      native: 'BdayBuddy://redirect', 
    }),
  });

  React.useEffect(() => {
    if (response?.type == "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(FIREBASE_AUTH, credential);
    }
}, [response])

const checkLocalUser = async () => {
    try {
        setLoading(true);
        const userJSON = await AsyncStorage.getItem("@user")
        const userData = userJSON ? JSON.parse(userJSON) : null;
        console.log("local storage:", userData);
        setUserInfo(userData);
    } catch(error) {
        alert((error as Error).message);
    } finally {
        setLoading(false);
    }
};

React.useEffect(() => {
    checkLocalUser();
    const unsub = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 2));
        setUserInfo(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
      } else {
        console.log("User is not authenticated");
        setUserInfo(undefined);
      }
    });

    return () => unsub();
}, []);

if (loading) return ( 
<View style={{flex: 1, alignItems: 'center', justifyContent: "center" }}>
    <ActivityIndicator size={"large"} />
</View>
);
  //end of google authentication

  return (
    <ImageBackground
    source={require("@/assets/images/bgblur.png")}
    style={styles.background}
  >
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to BdayBuddy!</Text>
      <Image
        style={styles.logo}
        source={require("@/assets/images/bdaybuddy-logo.png")}
      />
      <Text style={styles.subtitle}>Account Login</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Fontisto
          name="email"
          size={20}
          color="#4A4A4A"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          placeholderTextColor="#4A4A4A"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Fontisto
          name="locked"
          size={20}
          color="#4A4A4A"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="**********"
          placeholderTextColor="#4A4A4A"
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={confirmLogin}>
        <Text style={styles.buttontext}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>No account? Sign up now!</Text>
      </TouchableOpacity>

      <View style={styles.lineContainer}>
  <View style={styles.line} />
  <Text style={styles.orText}>Or Login with</Text>
  <View style={styles.line} />
</View>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Image
          style={styles.googleIcon}
          source={require("@/assets/images/google.png")}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
);
};

export default Login;


const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#FFFFEE",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: 300,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  loginButton: {
    backgroundColor: "#F9DECA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    padding: 10,
    marginVertical: 10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
  },
  signupButton: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "white",
    alignItems: "center",
    width: 200,
    padding: 10,
  },
  signupButtonText: {
    color: "white",
  },
  lineContainer: {
    flexDirection: 'row',      // Places children in a row
    alignItems: 'center',      // Centers children vertically
    marginVertical: 20,        // Adjust as needed
  },
  line: {
    flex: 1,                   // Makes the line take up remaining space
    height: 1,                 // Line thickness
    backgroundColor: 'white',   // Line color
  },
  orText: {
    marginHorizontal: 10,      // Spacing around the "or" text
    fontSize: 16,              // Adjust font size as needed
    color: 'white',             // Text color
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#000",
  },
  buttontext: {
    fontFamily: "Ubuntu-Medium",
    color: "#294865",
    fontSize: 20,
    textAlign: "center",
  },
});