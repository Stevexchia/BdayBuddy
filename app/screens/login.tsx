import { View, Button, Text, TextInput, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { useAnimatedKeyboard } from 'react-native-reanimated';
import { signInWithEmailAndPassword } from 'firebase/auth';

//formik
import { Formik } from 'formik';

//icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

import { Colors } from '../../components/style'
const { brand, darklight, primary } = Colors;

//keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper'

//***APP CODE STARTS BELOW***

export default function LoginScreen({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication, navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  
  async function confirmLogin() {
    try {
      console.log("Logging in...");
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log("Login successful!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error logging in:", error.message);
      // Handle error - display error message to user
    }

  function handleSignUp() {
    console.log("Sign Up");
    // SignUpScreen();
    navigation.navigate("Signup")
  }
  function googleLogin() {
    console.log("Login with Google");
    //google login authentication
  }
  return (
   <SafeAreaView className="bg-indigo-300 flex-1 items-center justify-center gap-3"> 
      <Text className="text-3xl font-bold">Welcome to BdayBuddy!</Text>
       <Image className="flex w-20 h-20"
          source={require('@/assets/images/bdaybuddy-logo.png')}
        />

       <Text style={styles.subtitle}>Account Login</Text>

       <TextInput style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="bdaybuddy@gmail.com"
          autoCapitalize="none"
          />

       <TextInput style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="**********"
          secureTextEntry={true}
          />

       <TouchableOpacity className="bg-orange-200 rounded-xl px-20 py-2" 
       onPress={confirmLogin}>
         <Text className="text-xl font-bold">Login</Text>
       </TouchableOpacity>

       <TouchableOpacity className="border-2 border-orange-200 rounded-xl shadow p-2 px-4" onPress={handleSignUp}>
        <Text className="text-white font-bold shadow">No account? Sign up now!</Text>
       </TouchableOpacity>
       <View style={styles.line}></View>

       <TouchableOpacity style={styles.googleButton} onPress={googleLogin}>
       <Image className="flex w-7 h-7 mr-3"
          source={require('@/assets/images/google.png')}
        /> 
        <Text className="text-black font-bold shadow">Continue with Google</Text>
       </TouchableOpacity>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#FFFFEE',
    borderRadius: 12,
    padding: 10,
    width: 240,
  },
  subtitle: {
    fontSize: 30,
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
})