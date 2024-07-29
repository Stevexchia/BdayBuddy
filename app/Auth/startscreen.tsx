import { Text, View, SafeAreaView, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ImageBackground } from "react-native";
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function StartScreen({ navigation }: { navigation: any }) {
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
    <ImageBackground
    source={require('@/assets/images/bg.png')}
    style={styles.background}
  >
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <>
        <View style={styles.mainContent}>
          <Image
            source={require('@/assets/images/bdaybuddy-logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>BDAYBUDDY</Text>
          <Text style={styles.subtitle}>Spot-on Gifts, Everytime</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleOnboard}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </>
    )}
  </ImageBackground>
);
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',    // Make sure the background covers the entire screen
    height: '100%',   // Make sure the background covers the entire screen
  },
  mainContent: {
    alignItems: 'center',
    flex: 1, // Take up available space
    justifyContent: 'center', // Center content within this section
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 50, // Add padding to position button higher if needed
  },
  logo: {
    width: 250,   // Set a specific width for the logo
    height: 250,  // Set a specific height for the logo
    resizeMode: 'contain', // Ensures the image fits within the specified size
    marginBottom: 20, // Space between the logo and the text below
  },
  title: {
    fontFamily: 'Cherry',
    color: '#294865',
    fontSize: 48,
    marginBottom: 14,
  },
  subtitle: { 
    fontFamily: 'Ubuntu-Regular',
    color: '#294865',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
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
  buttonText: {
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