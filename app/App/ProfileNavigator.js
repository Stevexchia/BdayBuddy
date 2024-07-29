// ProfileNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMain from "./profilescreen";
import EditProfile from "./pseditprofile";

const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigator = ({ route }) => {
    // Extract userId from the route params
    const { userId } = route.params;

    return (
        <ProfileStack.Navigator initialRouteName="Profile">
            <ProfileStack.Screen 
                name="ProfileMain" 
                component={ProfileMain}
                options={{ headerShown: false }}
                initialParams={{ userId }} // Pass userId to Profile screen
            />
            <ProfileStack.Screen 
                name="EditProfile" 
                options={{ headerShown: false }}
                component={EditProfile} 
            />
        </ProfileStack.Navigator>
    );
}

export default ProfileStackNavigator;
