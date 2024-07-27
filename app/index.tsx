import * as React from 'react';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

// Import navigation stacks
import AppNavigator from './App/AppNavigator';
import AuthNavigator from './Auth/AuthNavigator';

const App = () => {
    const [fontsLoaded] = useFonts({
        'Cherry': require('../assets/fonts/CherryBombOne-Regular.ttf'),
        'Ubuntu-Light': require('../assets/fonts/Ubuntu-Light.ttf'),
        'Ubuntu-Regular': require('../assets/fonts/Ubuntu-Regular.ttf'),
        'Ubuntu-Medium': require('../assets/fonts/Ubuntu-Medium.ttf'),
    });

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log('User is logged in:', currentUser);
            } else {
                console.log('No user is logged in.');
            }
            setUser(currentUser);
        });
    
        return unsubscribe;
    }, []);

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    return (
        <NavigationContainer>
            {user ? <AppNavigator userId={user.uid} /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default App;
