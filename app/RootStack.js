import "react-native";
import React from 'react';

import { Colors } from '../components/style';
const { primary, tertiary } = Colors;

//screens
import Start from "./screens/startscreen";
import Login from "./screens/login";
import Signup from "./screens/signup";
import Home from "./auth_screens/homescreen"
import Hobby from "./auth_screens/hobbyscreen"
import Gift from "./auth_screens/giftscreen"
import Profile from "./auth_screens/profilescreen"
import Notification from "./auth_screens/notificationscreen"

//Screen Names
const homeName = 'Home';
const profileName = 'Profile';
const giftName = 'Gift';
const notifName = 'Notification';

//React Navigation Stack
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./auth_screens/homescreen";

const stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function RootStack() {
    return (
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
            <stack.Screen name="Home" component={TabNavigator} />
            <stack.Screen name="Hobby" component={Hobby} />
        </stack.Navigator>

    );
}

const TabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    height: 50,
                    paddingBottom: 0,
                    paddingTop: 10,
                },
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === giftName) {
                        iconName = focused ? 'gift' : 'gift-outline';
                    } else if (rn === profileName) {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    } else if (rn === notifName) {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    }
                    return <Ionicons name={iconName} size={28} color={'#8DB1F4'} />;
                },
            })}
        >
            <Tab.Screen name={homeName} component={Home} />
            <Tab.Screen name={giftName} component={Gift} />
            <Tab.Screen name={profileName} component={Profile} />
            <Tab.Screen name={notifName} component={Notification} />

        </Tab.Navigator>
    );
};

export default RootStack;