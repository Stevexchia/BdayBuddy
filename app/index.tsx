import * as React from 'react';
import { useState, useEffect } from 'react';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import registerNNPushToken from 'native-notify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Import navigation stacks
import AppNavigator from './App/AppNavigator';
import AuthNavigator from './Auth/AuthNavigator';

const firebaseConfig = {
    apiKey: "AIzaSyDVdtDVRZvgiUtN5nQtAZE2SgiJb6JxVkM",
    authDomain: "bdaybuddy-auth.firebaseapp.com",
    projectId: "bdaybuddy-auth",
    storageBucket: "bdaybuddy-auth.appspot.com",
    messagingSenderId: "383844094953",
    appId: "1:383844094953:web:c12022243213871cea7178",
    measurementId: "G-MPZE21K5ZX"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
if (typeof window !== 'undefined') {
    getAnalytics(app);
}

export default function App() { 
    registerNNPushToken(22706, 'ZVD7i7LCQ7RGIwOxgMdQSA');
  
    const [fontsLoaded] = useFonts({
        'Cherry': require('../assets/fonts/CherryBombOne-Regular.ttf'),
        'Ubuntu-Light': require('../assets/fonts/Ubuntu-Light.ttf'),
        'Ubuntu-Regular': require('../assets/fonts/Ubuntu-Regular.ttf'),
        'Ubuntu-Medium': require('../assets/fonts/Ubuntu-Medium.ttf'),
    });

    const [user, setUser] = useState<User | null>(null);
    const [hobbyScreenCompleted, setHobbyScreenCompleted] = useState<boolean | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userJSON = await AsyncStorage.getItem("@user");
                const storedUser = userJSON ? JSON.parse(userJSON) : null;
                setUser(storedUser);
                
                if (storedUser) {
                    const db = getFirestore();
                    const userDoc = doc(db, "users", storedUser.uid);
                    const userSnapshot = await getDoc(userDoc);
                    
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.data();
                        setHobbyScreenCompleted(userData.hobbyscreencompleted ?? false);
                    }
                }
            } catch (error) {
                console.error("Error fetching user from AsyncStorage or Firestore", error);
            }
        };

        checkUser();
    
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setHobbyScreenCompleted(null); // Reset on auth state change
            
            if (currentUser) {
                AsyncStorage.setItem("@user", JSON.stringify(currentUser)).catch(error => {
                    console.error("Error saving user to AsyncStorage", error);
                });
                
                // Fetch additional user data from Firestore
                const db = getFirestore();
                const userDoc = doc(db, "users", currentUser.uid);
                const userSnapshot = await getDoc(userDoc);
                
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setHobbyScreenCompleted(userData.hobbyscreencompleted ?? false);
                }
            } else {
                AsyncStorage.removeItem("@user").catch(error => {
                    console.error("Error removing user from AsyncStorage", error);
                });
                setHobbyScreenCompleted(null); // Reset if user logs out
            }
        });
    
        return unsubscribe;
    }, []);

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <>
            <StatusBar hidden={true} />
            {user && hobbyScreenCompleted ? <AppNavigator userId={user.uid} /> : <AuthNavigator />}
        </>
    );
}
