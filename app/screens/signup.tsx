import { View, Button, Text, TextInput, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { useAnimatedKeyboard } from 'react-native-reanimated';
import { createUserWithEmailAndPassword } from 'firebase/auth';

//icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

import { Colors } from '../../components/style'
const { brand, darklight, primary } = Colors;

//keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper'

//***APP CODE STARTS BELOW***

export default function SignUpScreen({ name, setName, email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication, navigation }) {
  function handleLogin() {
    console.log("login");
    // LoginScreen();
    navigation.navigate("Login")
  }
  function confirmSignUp() {
    console.log("confirm sign up");
    // SignUpScreen();
    navigation.navigate("Home")
  }
  function googleSignup() {
    console.log("Signup with Google");
    //google login authentication
  }
  return (
    <SafeAreaView className="bg-indigo-300 flex-1 items-center gap-3 justify-center"> 
       <Image className="flex w-20 h-20"
          source={require('@/assets/images/bdaybuddy-logo.png')}
        />
       <Text className="text-lg font-bold">Account Sign Up</Text>
       <View>
         <Text className="justify-start p-1">Name</Text>
         <TextInput style={styles.input}
           value={name}
           onChange={setName}
           placeholder="name"
           autoCapitalize="none"
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start p-1">Email</Text>
         <TextInput style={styles.input}
           value={email}
           onChangeText={setEmail}
           placeholder="Email"
           autoCapitalize="none"
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start p-1">Password</Text>
         <TextInput style={styles.input}
           value={password}
           onChange={setPassword}
           placeholder="Password"
           autoCapitalize="none"
           secureTextEntry={true}
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start p-1">Confirm Password</Text>
         <TextInput style={styles.input}
           value={password}
           onChange={setPassword}
           placeholder="Retype Password"
           autoCapitalize="none"
           secureTextEntry={true}
           >
          </TextInput>
       </View>

       <TouchableOpacity className="bg-orange-200 rounded-xl px-20 py-2" 
       onPress={confirmSignUp}>
         <Text className="text-xl font-bold">Sign Up</Text>
       </TouchableOpacity>
       <TouchableOpacity className="border-2 border-orange-200 rounded-xl shadow p-2 px-4" onPress={handleLogin}>
        <Text className="text-white font-bold shadow">Already have an account? Login</Text>
       </TouchableOpacity>

       <View style={styles.line}></View>

       <TouchableOpacity style={styles.googleButton} onPress={googleSignup}>
       <Image className="flex w-7 h-7 mr-3"
          source={require('@/assets/images/google.png')}
        /> 
        <Text className="text-black font-bold shadow">Sign in with Google</Text>
       </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifycontent: 'center',
    alignitems: 'center',
    backgroundColor: "E0E7FF",
    padding: 20,
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#FFFFEE',
    borderRadius: 10,
    padding: 10,
    width: 240,
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

// const MyTextInput = ({label, ...props}) => {
//   return (<View>
//     <StyledInputLabel>{label}</StyledInputLabel>
//     <StyledTextInput>{...props}</StyledTextInput>
//   </View>)
// }