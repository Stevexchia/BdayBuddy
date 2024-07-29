import * as React from 'react';
import { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
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

const App = () => {
    const app = initializeApp(firebaseConfig); 

    const [fontsLoaded] = useFonts({
        'Cherry': require('../assets/fonts/CherryBombOne-Regular.ttf'),
        'Ubuntu-Light': require('../assets/fonts/Ubuntu-Light.ttf'),
        'Ubuntu-Regular': require('../assets/fonts/Ubuntu-Regular.ttf'),
        'Ubuntu-Medium': require('../assets/fonts/Ubuntu-Medium.ttf'),
    });

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userJSON = await AsyncStorage.getItem("@user");
                const storedUser = userJSON ? JSON.parse(userJSON) : null;
                setUser(storedUser);
            } catch (error) {
                console.error("Error fetching user from AsyncStorage", error);
            }
        };

        checkUser();
    
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                AsyncStorage.setItem("@user", JSON.stringify(currentUser)).catch(error => {
                    console.error("Error saving user to AsyncStorage", error);
                });
            } else {
                AsyncStorage.removeItem("@user").catch(error => {
                    console.error("Error removing user from AsyncStorage", error);
                });
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
        <NavigationContainer>
            {user ? <AppNavigator userId={user.uid} /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default App;
