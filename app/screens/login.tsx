import { View, Button, Text, TextInput, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, ActivityIndicator, KeyboardAvoidingView } from "react-native";
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

//keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper.mjs'

//***APP CODE STARTS BELOW***
const Login = ({ navigation }) => {
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
   <View className="bg-indigo-300 flex-1 items-center justify-center gap-3"> 
      <Text className="text-3xl font-ubuntuMed">Welcome to BdayBuddy!</Text>
       <Image className="flex w-20 h-20"
          source={require('@/assets/images/bdaybuddy-logo.png')}
        />

       <Text style={styles.subtitle}>Account Login</Text>

{/* Email Input */}
<View style={styles.inputContainer}>
        <Fontisto name="email" size={20} color="#4A4A4A" style={styles.inputIcon} />
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
        <Fontisto name="locked" size={20} color="#4A4A4A" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="**********"
          placeholderTextColor="#4A4A4A"
          secureTextEntry={true}
        />
      </View>

       <TouchableOpacity style = {styles.loginButton} onPress={confirmLogin}>
         <Text style = {styles.buttontext}>Login</Text>
       </TouchableOpacity>

       <TouchableOpacity style = {styles.signupButton} onPress={handleSignUp}>
        <Text className="text-white font-ubuntuMed shadow px-1">No account? Sign up now!</Text>
       </TouchableOpacity>
       <View style={styles.line}></View>

       <TouchableOpacity style={styles.googleButton} 
       onPress={() => promptAsync()}>
       <Image className="flex w-7 h-7 mr-3"
          source={require('@/assets/images/google.png')}
        /> 
        <Text className="text-black font-ubuntuMed shadow">Continue with Google</Text>
       </TouchableOpacity>

    </View>
  );
};

export default Login;


const styles = StyleSheet.create({
  input: {
    fontFamily: 'Ubuntu-Regular',
    borderWidth: 1,
    borderColor: '#FFFFEE',
    backgroundColor: '#FFFFEE',
    borderRadius: 12,
    padding: 10,
    width: 240,
    flex: 1,
    fontSize: 14,
  },
  subtitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: '#777',
    width: '50%',
    marginBottom: 10,
    paddingTop: 10,
  },
  loginButton: {
    backgroundColor: '#F9DECA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    padding:10,
    shadowRadius: 4,
    shadowOffset: {width:0, height:0},
    shadowOpacity: 0.15,
  },
  signupButton: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#F9DECA',
    alignItems: 'center',
    width: 200,
    padding: 10,
  },
  buttontext: {
    fontFamily: 'Ubuntu-Medium',
    color: '#294865',
    fontSize: 20,
  },
  googleButton: {
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
   },
   inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFEE',
    backgroundColor: '#FFFFEE',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: 300,
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
});