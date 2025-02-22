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

const SignUpScreen = ({ navigation }) => {
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
  const [hobbyScreenCompleted, setHobbyScreenCompleted] = useState(false);
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
        hobbyScreenCompleted: hobbyScreenCompleted, // Add this field
      });

      console.log("Sign Up successful!");
      setPersistence(FIREBASE_AUTH, browserLocalPersistence)
      navigation.navigate("Contact", { userId: user.uid });
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
           placeholderTextColor="#4A4A4A"
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
           placeholderTextColor="#4A4A4A"
           autoCapitalize="none"
           >
          </TextInput>
       </View>

       <View>
        <Text className="justify-start p-1">Date of Birth</Text>

        {showPicker && (
          <DateTimePicker mode="date" 
          display="spinner" 
          value={date} 
          onChange={onChange} 
          style={styles.datePicker}
          maximumDate={maxDate}
          />
        )}

        {showPicker && Platform.OS === "ios" && (
          <View
            style={{ flexDirection: "row",
            justifyContent: "space-around"
            }}
          >
            <TouchableOpacity style={[
              styles.pickerButton,
              { backgroundColor: "#475569"},
            ]}
              onPress={toggleDatepicker}
            >
              <Text
              style={[
                styles.buttontext,
                { color: "#E5E7EB" }
              ]}
              >Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[
              styles.pickerButton,
            ]}
              onPress={confirmIOSDate}
            >
              <Text
              style={[
                styles.buttontext,
              ]}
              >Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

        {!showPicker && (
        <Pressable onPress={toggleDatepicker}>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDOB}
            placeholder="DD-MM-YYYY"
            placeholderTextColor="#4A4A4A"
            autoCapitalize="none"
            editable={false}
            onPressIn={toggleDatepicker}
          ></TextInput>
        </Pressable>
        )}
      </View>

       <View>
         <Text className="justify-start font-ubuntuReg p-1">Password</Text>
         <TextInput style={styles.input}
           value={password}
           onChangeText={(text) => setPassword(text)}
           placeholder="**********"
           placeholderTextColor="#4A4A4A"
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
           placeholderTextColor="#4A4A4A"
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

       <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or Login with</Text>
          <View style={styles.line} />
        </View>

       <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
       <Image className="flex w-7 h-7 mr-3"
          source={require('@/assets/images/google.png')}
        /> 
        <Text className="text-black font-ubuntuMed shadow">Sign in with Google</Text>
       </TouchableOpacity>
    </ImageBackground>
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
  lineContainer: {
    flexDirection: 'row',      // Places children in a row
    alignItems: 'center',      // Centers children vertically
    marginVertical: 20,        // Adjust as needed
  },
  orText: {
    marginHorizontal: 10,      // Spacing around the "or" text
    fontSize: 16,              // Adjust font size as needed
    color: 'white',             // Text color
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'Ubuntu-Regular',
    borderWidth: 1,
    borderColor: '#FFFFEE',
    backgroundColor: '#FFFFEE',
    borderRadius: 10,
    padding: 10,
    width: 240,
    marginBottom: 10,
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
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
    shadowRadius: 4,
    shadowOffset: {width:0, height:0},
    shadowOpacity: 0.15,
    marginBottom: 10,
  },
  loginButton: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'white',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFEE',
    backgroundColor: '#FFFFEE',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: 300,
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
})
