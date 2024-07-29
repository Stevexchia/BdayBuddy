// ProfileNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMain from "./profilescreen";
import EditProfile from "./pseditprofile";
import EditHobby from "../Auth/hobbyscreen"

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
            <ProfileStack.Screen 
                name="EditHobby" 
                options={{ headerShown: false }}
                component={EditHobby} 
            />
        </ProfileStack.Navigator>
    );
}

export default ProfileStackNavigator;
