import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../BdayBuddy App/FirebaseConfig'
import { useAnimatedKeyboard } from 'react-native-reanimated';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    
  return (
    <View style={styles.container}>
      <TextInput style={styles.input}></TextInput>
    </View>
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
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
  }
});