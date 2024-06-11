import "react-native";
import * as React from 'react';

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

//React Navigation Stack
import RootStack from './RootStack.js';
import { ActivityIndicator, View } from "react-native";

export default function App() {
    // return <RootStack />;
    return <HobbyScreen />;
} 