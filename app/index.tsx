import "react-native";
import * as React from 'react';
import { useFonts } from 'expo-font';
//google authentication setup
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

//screens
import StartScreen from "./screens/startscreen";
import LoginScreen from "./screens/login";
import SignUpScreen from "./screens/signup";

import HomeScreen from "./auth_screens/homescreen";
import HobbyScreen from "./auth_screens/hobbyscreen";
import ContactScreen from "./auth_screens/contactscreen";

//React Navigation Stack
import RootStack from './RootStack.js';
import { ActivityIndicator, View } from "react-native";

export default function App() {
    const [fontsLoaded] = useFonts({
        'Cherry': require('../assets/fonts/CherryBombOne-Regular.ttf'),
        'Ubuntu-Light': require('../assets/fonts/Ubuntu-Light.ttf'),
        'Ubuntu-Regular': require('../assets/fonts/Ubuntu-Regular.ttf'),
        'Ubuntu-Medium': require('../assets/fonts/Ubuntu-Medium.ttf'),
      }); 
    
      if (!fontsLoaded) {
        console.log("Fonts not loaded");
        return null;
      }
    
    return <RootStack />;
} 