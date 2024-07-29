import "react-native";
import React from 'react';
import { Colors } from '../../components/style';
const { tertiary } = Colors;

// Import screens
import Home from "./homescreen";
import Gift from "./giftscreen";
import ProfileStackNavigator from './ProfileNavigator';
import Notification from "./notificationscreen";

// Import navigation components
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const AppNavigator = ({ userId }) => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    height: 50,
                    paddingBottom: 0,
                    paddingTop: 10,
                    backgroundColor: '#fff',
                },
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Gift':
                            iconName = focused ? 'gift' : 'gift-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person-circle' : 'person-circle-outline';
                            break;
                        case 'Notification':
                            iconName = focused ? 'notifications' : 'notifications-outline';
                            break;
                    }

                    return <Ionicons name={iconName} size={28} color='#8DB1F4' />;
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} initialParams={{ userId }} />
            <Tab.Screen name="Gift" component={Gift} initialParams={{ userId }} />
            <Tab.Screen name="Profile" component={ProfileStackNavigator} initialParams={{ userId }} />
            <Tab.Screen name="Notification" component={Notification} initialParams={{ userId }} />
        </Tab.Navigator>
    );
}

export default AppNavigator;
