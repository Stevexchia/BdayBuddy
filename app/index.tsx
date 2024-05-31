import { Text, View, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, Button } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  function handleLogin() {
    console.log("login");
  }

  function handleSignUp () {
    console.log("sign up");
  }

  return (
    <SafeAreaView className="bg-indigo-300"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    > 
       <Image
          source={require('@/assets/images/bdaybuddy-logo.png')}
          style={styles.stepContainer}
        />
       <Text className="text-4xl font-bold py-3">BDAYBUDDY</Text>
       <TouchableOpacity className="bg-orange-200 rounded-full px-12 py-2" onPress={handleLogin}>
         <Text className="text-xl font-bold">Login</Text>
       </TouchableOpacity>
       <Text> </Text>
       <TouchableOpacity className="bg-orange-200 rounded-full px-9 py-2" onPress={handleSignUp}>
         <Text className="text-xl font-bold">Sign Up</Text>
       </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

