import { Text, View, SafeAreaView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Onboarding from "../Auth/onboarding"

export default function StartScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [viewedOnboarding, setViewedOnboarding] = useState(null);
  const Loading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem('@viewedOnboarding');

      if (value !== null) {
        setViewedOnboarding(true);
      }
    } catch (err) {
      console.log('Error @checkOnboarding', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (viewedOnboarding) {
        navigation.navigate("Login"); // Use replace to prevent going back to the splash screen
      } else if (viewedOnboarding === false) {
        navigation.navigate("Onboard");
      }
    }
  }, [loading, viewedOnboarding, navigation]);

  function handleOnboard() {
    console.log("Onboard");
    navigation.navigate("Onboard")
  }

  return (
    <View className="flex-1 items-center bg-indigo-300">
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.innerContainer}>
      <Image className="mb-2"
        source={require('@/assets/images/bdaybuddy-banner.png')}
      />
      <Text style = {styles.title}>BDAYBUDDY</Text>

      <TouchableOpacity style = {styles.button} onPress={handleOnboard}>
        <Text style = {styles.buttontext}>Get Started</Text>
      </TouchableOpacity>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    alignItems: 'center',     // Center horizontally within the inner container
  },
  title: {
    fontFamily: 'Cherry',
    color: '#294865',
    fontSize: 48,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#F9DECA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    padding: 10,
    marginBottom: 16,
    shadowRadius: 4,
    shadowOffset: {width:0, height:0},
    shadowOpacity: 0.15,
  },
  buttontext: {
    fontFamily: 'Ubuntu-Medium',
    color: '#294865',
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})