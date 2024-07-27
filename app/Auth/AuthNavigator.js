import "react-native";
import React from 'react';
import { Colors } from '../../components/style';
const { tertiary } = Colors;

// Import screens
import Start from "./startscreen";
import Onboard from "./onboarding"
import Login from "./login";
import Signup from "./signup";
import Hobby from "./hobbyscreen"

// Import navigation components
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'transparent'
                },
                headerTintColor: tertiary,
                headerTransparent: true,
                headerTitle: '',
                headerLeftContainerStyle: {
                    paddingLeft: 20
                }
            }}
            initialRouteName="Start"
        >
            <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
            <Stack.Screen name="Onboard" component={Onboard} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="Hobby" component={Hobby} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default AuthNavigator;
