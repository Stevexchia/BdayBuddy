import { Text, View, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform } from "react-native";


export default function HomeScreen() {
  function handleLogin() {
    console.log("login");
    // LoginScreen();
  }

  function handleSignUp() {
    console.log("sign up");
    // SignUpScreen();
  }

  return (
    <SafeAreaView className="bg-indigo-300"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    > 
       <Image className="flex"
          source={require('@/assets/images/bdaybuddy-logo.png')}
        />
       <Text className="text-4xl font-extrabold py-4">I am Logged In!!!</Text>
       <TouchableOpacity className="bg-orange-200 rounded-xl shadow px-12 py-2" onPress={handleLogin}>
         <Text className="text-xl font-bold">Login</Text>
       </TouchableOpacity>
       <Text> </Text>
       <TouchableOpacity className="bg-orange-200 rounded-xl shadow px-9 py-2" onPress={handleSignUp}>
         <Text className="text-xl font-bold">Sign Up</Text>
       </TouchableOpacity>
    </SafeAreaView>
  );
}



