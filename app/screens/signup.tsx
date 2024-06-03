import { View, Button, Text, TextInput, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig'
import { useAnimatedKeyboard } from 'react-native-reanimated';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'

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
      navigation.navigate("Hobby");
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
 
  async function googleSignup() {
    try {
    console.log("Signup with Google");
    //google login authentication
  } catch(error) {
    console.error("Error logging in with Google", (error as Error).message);
    setError((error as Error).message);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView className="bg-indigo-300 flex-1 items-center gap-3 justify-center"> 
       <Image className="flex w-20 h-20"
          source={require('@/assets/images/bdaybuddy-logo.png')}
        />
       <Text className="text-lg font-bold">Account Sign Up</Text>
       <View>
         <Text className="justify-start p-1">Name</Text>
         <TextInput style={styles.input}
           value={name}
           onChangeText={(text) => setName(text)}
           placeholder="Set Username"
           autoCapitalize="none"
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start p-1">Email</Text>
         <TextInput style={styles.input}
           value={email}
           onChangeText={(text) => setEmail(text)}
           placeholder="bdaybuddy@gmail.com"
           autoCapitalize="none"
           >
          </TextInput>
       </View>

       <View>
         <Text className="justify-start p-1">Password</Text>
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
         <Text className="justify-start p-1">Confirm Password</Text>
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

       <TouchableOpacity className="bg-orange-200 rounded-xl px-20 py-2" 
       onPress={confirmSignUp}>
         <Text className="text-xl font-bold">Sign Up</Text>
       </TouchableOpacity>
       <TouchableOpacity className="border-2 border-orange-200 rounded-xl shadow p-2 px-4" onPress={handleLogin}>
        <Text className="text-white font-bold shadow">Already have an account? Login</Text>
       </TouchableOpacity>

       <View style={styles.line}></View>

       <TouchableOpacity style={styles.googleButton} onPress={googleSignup}>
       <Image className="flex w-7 h-7 mr-3"
          source={require('@/assets/images/google.png')}
        /> 
        <Text className="text-black font-bold shadow">Sign in with Google</Text>
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
