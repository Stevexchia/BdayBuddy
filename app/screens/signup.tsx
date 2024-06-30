import { View, Button, Text, TextInput, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { useAnimatedKeyboard } from 'react-native-reanimated';
import { GoogleAuthProvider, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, signInWithCredential, User, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import DateTimePicker from "@react-native-community/datetimepicker"

//icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

import { Colors } from '../../components/style'
const { brand, darklight, primary } = Colors;

//keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper.mjs'

//***APP CODE STARTS BELOW***

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;
  const provider = new GoogleAuthProvider();
  const [userInfo, setUserInfo] = React.useState<User | undefined>(undefined);

  //initialising web browser
WebBrowser.maybeCompleteAuthSession();

  async function confirmSignUp() {
    setLoading(true);
    setError('');
    if (!name.trim()) {
      setError('Please enter your name.');
      setLoading(false);
      return;
    }
    if (password != confirmpassword) {
      setError('Passwords do not match.');
      console.log({error})
      setLoading(false);
      return;
    }

    try {
      console.log("Signing up...");
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;

      // Create a document reference with user's UID as document ID
      const userDocRef = doc(collection(db, "users"), user.uid);

      // Set user data to the document
      await setDoc(userDocRef, {
        name: name,
        email: email
      });

      console.log("Sign Up successful!");
      setPersistence(FIREBASE_AUTH, browserLocalPersistence)
      navigation.navigate("Hobby", { userId: user.uid });
    } catch (error) {
      console.error("Error Signing Up:", (error as Error).message);
      // Handle error - display error message to user
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin() {
    console.log("login");
    // LoginScreen();
    navigation.navigate("Login")
  }
 
//google authentication
const [request, response, promptAsync] = Google.useAuthRequest({
  iosClientId:'209106502578-q5b8hf7bn2sm4glksgis5b13p97t9gsi.apps.googleusercontent.com',
  androidClientId: '209106502578-2hpqmn9a987e8bu33n14diuber8e1kj7.apps.googleusercontent.com',
  webClientId: '209106502578-c0h0vshlvbm9nv0hpjrfbbkjmp0f1chj.apps.googleusercontent.com',
  redirectUri: makeRedirectUri({
    useProxy: true,
    native: 'BdayBuddy://redirect', 
  }),
});

React.useEffect(() => {
  if (response?.type == "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(FIREBASE_AUTH, credential);
  }
}, [response])

const checkLocalUser = async () => {
  try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user")
      const userData = userJSON ? JSON.parse(userJSON) : null;
      console.log("local storage:", userData);
      setUserInfo(userData);
  } catch(error) {
      alert((error as Error).message);
  } finally {
      setLoading(false);
  }
};

React.useEffect(() => {
  checkLocalUser();
  const unsub = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
    if (user) {
      console.log(JSON.stringify(user, null, 2));
      setUserInfo(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
    } else {
      console.log("User is not authenticated");
      setUserInfo(undefined);
    }
  });

  return () => unsub();
}, []);

if (loading) return ( 
<View style={{flex: 1, alignItems: 'center', justifyContent: "center" }}>
  <ActivityIndicator size={"large"} />
</View>
);
//end of google authentication
  
  return (
    <SafeAreaView className="bg-indigo-300 flex-1 items-center gap-3 justify-center"> 
       <Image className="flex w-20 h-20"
          source={require('@/assets/images/bdaybuddy-logo.png')}
        />
       <Text className="text-xl font-ubuntuMed">Account Sign Up</Text>
       <View>
         <Text className="justify-start font-ubuntuReg p-1">Name</Text>
         <TextInput style={styles.input}
           value={name}
           onChangeText={(text) => setName(text)}
           placeholder="Set Username"
           autoCapitalize="none"
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start font-ubuntuReg p-1">Email</Text>
         <TextInput style={styles.input}
           value={email}
           onChangeText={(text) => setEmail(text)}
           placeholder="bdaybuddy@gmail.com"
           autoCapitalize="none"
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start font-ubuntuReg p-1">Password</Text>
         <TextInput style={styles.input}
           value={password}
           onChangeText={(text) => setPassword(text)}
           placeholder="**********"
           autoCapitalize="none"
           secureTextEntry={true}
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start font-ubuntuReg p-1">Confirm Password</Text>
         <TextInput style={styles.input}
           value={confirmpassword}
           onChangeText={(text) => setConfirmPassword(text)}
           placeholder="**********"
           autoCapitalize="none"
           secureTextEntry={true}
           >
          </TextInput>
       </View>

      {/* Display error message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

       <TouchableOpacity style = {styles.signupButton} 
       onPress={confirmSignUp}>
         <Text style = {styles.buttontext}>Sign Up</Text>
       </TouchableOpacity>
       <TouchableOpacity style = {styles.loginButton} onPress={handleLogin}>
        <Text className="text-white font-ubuntuMed shadow"
        >Already have an account? Login</Text>
       </TouchableOpacity>

       <View style={styles.line}></View>

       <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
       <Image className="flex w-7 h-7 mr-3"
          source={require('@/assets/images/google.png')}
        /> 
        <Text className="text-black font-ubuntuMed shadow">Sign in with Google</Text>
       </TouchableOpacity>
    </SafeAreaView>
  );
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "E0E7FF",
    padding: 20,
  },
  
  input: {
    fontFamily: 'Ubuntu-Regular',
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#FFFFEE',
    borderRadius: 10,
    padding: 10,
    width: 240,
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: '#777',
    width: '50%',
    marginBottom: 10,
    paddingTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: '#F9DECA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 240,
    padding: 10,
    shadowRadius: 1,
    elevation: 1,
    shadowOpacity: 0.1,
  },
  loginButton: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#F9DECA',
    alignItems: 'center',
    width: 240,
    padding: 10,
  },
  buttontext: {
    fontFamily: 'Ubuntu-Medium',
    color: '#294865',
    fontSize: 20,
  },
  googleButton: {
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
})
