import { Text, TextInput, View, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform } from "react-native";

export default function SignUpScreen({ name, setName, email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) {
  function handleLogin() {
    console.log("login");
    // LoginScreen();
  }
  function confirmSignUp() {
    console.log("confirm sign up");
    // SignUpScreen();
  }
  return (
    <SafeAreaView className="bg-indigo-300 flex-1 items-center gap-3"> 
       <Image className="flex w-20 h-20"
          source={require('@/assets/images/bdaybuddy-logo.png')}
        />
       <Text className="text-lg font-bold">Account Sign Up</Text>
       <View>
         <Text className="justify-start p-1">Name</Text>
         <TextInput style={styles.input}
           value={name}
           onChange={setName}
           placeholder="name"
           autoCapitalize="none"
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start p-1">Email</Text>
         <TextInput style={styles.input}
           value={email}
           onChange={setEmail}
           placeholder="email"
           autoCapitalize="none"
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start p-1">Password</Text>
         <TextInput style={styles.input}
           value={password}
           onChange={setPassword}
           placeholder="password"
           autoCapitalize="none"
           secureTextEntry={true}
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start p-1">Confirm Password</Text>
         <TextInput style={styles.input}
           value={password}
           onChange={setPassword}
           placeholder="password"
           autoCapitalize="none"
           secureTextEntry={true}
           >
          </TextInput>
       </View>

       <View className="mb-2">
         <Text className="justify-start p-1">Birthday</Text>
         <TextInput style={styles.input}
           value={email}
           onChange={setEmail}
           placeholder="email"
           autoCapitalize="none"
           >
          </TextInput>
       </View>

       <TouchableOpacity className="bg-orange-200 rounded-xl px-20 py-2" 
       onPress={confirmSignUp}>
         <Text className="text-xl font-bold">Sign Up</Text>
       </TouchableOpacity>
       <TouchableOpacity className="border-2 border-orange-200 rounded-xl shadow p-2 px-4" onPress={handleLogin}>
        <Text className="text-white font-bold shadow">Have an account? Login now!</Text>
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

// const MyTextInput = ({label, ...props}) => {
//   return (<View>
//     <StyledInputLabel>{label}</StyledInputLabel>
//     <StyledTextInput>{...props}</StyledTextInput>
//   </View>)
// }