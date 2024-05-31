import { Text, Button, TextInput, View, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { useAnimatedKeyboard } from 'react-native-reanimated';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  
  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed:' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Check your emails!')
    } catch (error: any) {
      console.log(error);
      alert('Sign up failed:' + error.message);
    } finally {
      setLoading(false);
    }
  }

return (
  <SafeAreaView className="flex-1 items-center justify-center">
  <TextInput style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="bdaybuddy@gmail.com"
          autoCapitalize="none"
          />

       <TextInput style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="**********"
          secureTextEntry={true}
          />
  
  {loading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <>
      <Button title="Login" onPress={signIn} />
      <Button title="Create account" onPress={signUp} />
    </>
  )}
  </SafeAreaView>
);
};

export default Login;

const styles = StyleSheet.create({
container: {
  marginHorizontal: 20,
  flex: 1,
  justifyContent: 'center',
},
input: {
  borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#FFFFEE',
    borderRadius: 12,
    padding: 10,
    width: 240,
}
});