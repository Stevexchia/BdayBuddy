import { Text, TextInput, SafeAreaView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';

export default function LoginScreen({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) {
  function confirmLogin() {
    console.log("confirm login");
    // LoginScreen();
  }
  function handleSignUp() {
    console.log("sign up");
    // SignUpScreen();
  }
  return (
    <SafeAreaView className="bg-indigo-300 flex-1 items-center justify-center gap-3"> 
      <Text className="text-3xl font-bold">Welcome to BdayBuddy!</Text>
       <Image className="flex w-20 h-20"
          source={require('@/assets/images/bdaybuddy-logo.png')}
        />
       <Text className="text-2xl font-bold">Account Login</Text>
       <TextInput style={styles.input}
          value={email}
          onChange={setEmail}
          placeholder="email"
          autoCapitalize="none"
          />
       <TextInput style={styles.input}
          value={password}
          onChange={setPassword}
          placeholder="password"
          secureTextEntry={true}
          />
       <TouchableOpacity className="bg-orange-200 rounded-xl px-20 py-2" 
       onPress={confirmLogin}>
         <Text className="text-xl font-bold">Login</Text>
       </TouchableOpacity>
       <TouchableOpacity className="border-2 border-orange-200 rounded-xl shadow p-2 px-4" onPress={handleSignUp}>
        <Text className="text-white font-bold shadow">No account? Sign up now!</Text>
       </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#FFFFEE',
    borderRadius: 12,
    padding: 10,
    width: 240,
  }
})