import { Text, View, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./login";

export default function StartScreen({ navigation }) {
  function handleLogin() {
    console.log("Login");
    navigation.navigate("Login")
  }

  function handleSignUp() {
    console.log("Sign Up");
    navigation.navigate("Signup")
    // SignUpScreen();
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-indigo-300"> 
       <Image className="flex"
          source={require('@/assets/images/bdaybuddy-logo.png')}
        />
       <Text className="text-4xl font-extrabold py-4 text-[#294865]">BDAYBUDDY</Text>
       <TouchableOpacity className="bg-orange-200 rounded-xl shadow px-12 py-2" onPress={handleLogin}>
         <Text className="text-xl font-bold text-[#294865]">Login</Text>
       </TouchableOpacity>
       <Text> </Text>
       <TouchableOpacity className="bg-orange-200 rounded-xl shadow px-9 py-2" onPress={handleSignUp}>
         <Text className="text-xl font-bold text-[#294865]">Sign Up</Text>
       </TouchableOpacity>
    </SafeAreaView>
  );
}



