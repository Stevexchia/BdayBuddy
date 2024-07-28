import { View, Button, Text, TextInput, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, ActivityIndicator, ImageBackground, Pressable } from "react-native";
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

const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDOB] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [maxDate] = useState(new Date('2024-01-01'));
  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };
  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatepicker();
        setDOB(formatDate(currentDate));
      }
    } else {
      toggleDatepicker();
    }
  };

  const confirmIOSDate = () => {
    setDOB(formatDate(date));
    toggleDatepicker();
  }

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let monthx = month < 10 ? `0${month}` : month;
    let dayx = day < 10 ? `0${day}` : day;

    return `${dayx}-${monthx}-${year}`;
  };

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
    if (!dob.trim()) {
      setError('Please enter your date of birth.');
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
        email: email,
        dob: dob,
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
    <ImageBackground
    source={require("@/assets/images/bgblur.png")}
    style={styles.background}
  >
    <View style={styles.container}> 
      <Image 
        source={require('@/assets/images/bdaybuddy-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Account Sign Up</Text>
      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Set Username"
          placeholderTextColor="#4A4A4A"
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="bdaybuddy@gmail.com"
          placeholderTextColor="#4A4A4A"
        />
      </View>

      {/* Date of Birth Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        {/* Date Picker Logic */}
        <Pressable onPress={toggleDatepicker}>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDOB}
            placeholder="DD-MM-YYYY"
            placeholderTextColor="#4A4A4A"
            autoCapitalize="none"
            editable={false}
          />
        </Pressable>
        {/* Conditional Rendering for iOS Date Picker */}
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="**********"
          placeholderTextColor="#4A4A4A"
          secureTextEntry
        />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput 
          style={styles.input}
          value={confirmpassword}
          onChangeText={setConfirmPassword}
          placeholder="**********"
          placeholderTextColor="#4A4A4A"
          secureTextEntry
        />
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton} onPress={confirmSignUp}>
        <Text style={styles.buttontext}>Sign Up</Text>
      </TouchableOpacity>

      {/* Already have an account? Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>

      <View style={styles.lineContainer}>
  <View style={styles.line} />
  <Text style={styles.orText}>Or Login with</Text>
  <View style={styles.line} />
</View>

      {/* Google Sign-In Button */}
      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Image 
          source={require('@/assets/images/google.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
);
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Ubuntu-Medium',
    marginBottom: 20,
  },
  inputContainer: {
    width: '70%',
    marginBottom: 15,  // Adjust this value for more spacing between inputs
  },
  label: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    fontFamily: 'Ubuntu-Regular',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#FFFFEE',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  lineContainer: {
    flexDirection: 'row',      // Places children in a row
    alignItems: 'center',      // Centers children vertically
    marginVertical: 20,        // Adjust as needed
  },
  line: {
    flex: 1,                   // Makes the line take up remaining space
    height: 1,                 // Line thickness
    backgroundColor: 'white',   // Line color
  },
  orText: {
    marginHorizontal: 10,      // Spacing around the "or" text
    fontSize: 16,              // Adjust font size as needed
    color: 'white',             // Text color
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: '#F9DECA',
    borderColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    padding: 10,
    marginBottom: 20, // Added more space before login button
  },
  loginButton: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'white',
    alignItems: 'center',
    width: 240,
    padding: 10,
    marginBottom: 20, // Added more space after login button
  },
  loginText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Ubuntu-Large',
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
  googleIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    color: '#000',
  },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  pickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
})
