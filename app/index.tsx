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

//React Navigation Stack
import RootStack from './RootStack.js';
import HomeScreen from "./auth_screens/homescreen";
import { ActivityIndicator, View } from "react-native";

//initialising web browser
WebBrowser.maybeCompleteAuthSession();

export default function App() {
    const [userInfo, setUserInfo] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
      iosClientId:'209106502578-q5b8hf7bn2sm4glksgis5b13p97t9gsi.apps.googleusercontent.com',
      androidClientId: '209106502578-2hpqmn9a987e8bu33n14diuber8e1kj7.apps.googleusercontent.com',
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
            alert(error.message);
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
                console.log("User is not authenticated")
            }
        });

        return () => unsub();
    }, []);

    if (loading) return ( 
    <View style={{flex: 1, alignItems: 'center', justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
    </View>
    );
    return userInfo ? <HomeScreen /> : <RootStack />;
} 