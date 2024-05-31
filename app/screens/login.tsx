import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { useAnimatedKeyboard } from 'react-native-reanimated';

//formik
import { Formik } from 'formik';

//icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

import { Colors } from '../../components/style'
const { brand, darklight, primary } = Colors;

//keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper'

export default function LoginScreen({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) {
  function confirmLogin() {
    console.log("confirm login");
    // LoginScreen();
  }
  function handleSignUp() {
    console.log("sign up");
    // SignUpScreen();
  }
  function googleLogin() {
    console.log("google login");
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
          onChange={setEmail}
          placeholder="bdaybuddy@gmail.com"
          autoCapitalize="none"
          />
       <TextInput style={styles.input}
          value={password}
          onChange={setPassword}
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
       <TouchableOpacity className="border-2 shadow p-2 px-4" onPress={googleLogin}>
        <Fontisto name="google" color={primary} size={25} />
        <Text className="text-white font-bold shadow ">Sign in with Google</Text>
       </TouchableOpacity>
    </SafeAreaView>
  );
}

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
})