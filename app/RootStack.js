import "react-native";
import React from 'react';

import {Colors} from '../components/style';
const { primary, tertiary } = Colors;

//screens
import Start from "./screens/startscreen";
import Login from "./screens/login";
import Signup from "./screens/signup";

//React Navigation Stack
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const stack = createNativeStackNavigator();

function RootStack() {
    return(
            <stack.Navigator
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
                <stack.Screen name="Start" component={Start} />
                <stack.Screen name="Login" component={Login} />
                <stack.Screen name="Signup" component={Signup} />
            </stack.Navigator>
    );
}

export default RootStack;