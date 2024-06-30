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
  }

  return (
    <View className="flex-1 items-center bg-indigo-300">
      <Image className="mb-2"
        source={require('@/assets/images/bdaybuddy-banner.png')}
      />
      <Text style = {styles.title}>BDAYBUDDY</Text>
      <TouchableOpacity style = {styles.button} onPress={handleLogin}>
        <Text style = {styles.buttontext}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.button} onPress={handleSignUp}>
        <Text style = {styles.buttontext}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Cherry',
    color: '#294865',
    fontSize: 48,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#F9DECA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    padding: 10,
    marginBottom: 16,
    shadowRadius: 1,
    elevation: 1,
    shadowOpacity: 0.1,
  },
  buttontext: {
    fontFamily: 'Ubuntu-Medium',
    color: '#294865',
    fontSize: 20,
  }
})