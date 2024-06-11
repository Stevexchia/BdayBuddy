import styled from 'styled-components';
import { View } from 'react-native';
import { Text, TextInput, SafeAreaView, TouchableOpacity, Image, StyleSheet } from "react-native";
import Constants from 'expo-constants';

const StatusBarHeight = Constants.statusBarHeight;

//colors
export const Colors = {
    primary: "#FFFFFF",
    secondary: "#E5E7EB",
    tertiary: "#1F2937",
    darklight: "#9CA3AF",
    brand: "#6D28D9",
    green: "10B981",
    red: "#EF4444",
};

const { primary, secondary, tertiary, darklight, brand, green, red } = Colors;

export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight + 30}px;
    background-color: ${primary};
`;

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`;

export const StyledTextInput = styled.TextInput`
background-color: '#FFFEEE';
padding: 15px;
padding-left: 55px;
padding-right: 55px;
border-radius: 5px;
font-size: 16px;
height: 60px;
margin-vertical: 3px;
margin-bottom: 10px;
color: black;
`;