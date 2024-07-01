import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import { signOut } from "firebase/auth"
import { FIREBASE_AUTH } from '@/FirebaseConfig'

const GiftScreen = () => {
  return (
    <View className="flex-auto">
      <ImageBackground source={require('@/assets/images/background.png')} style={styles.image}>
        <Text style={styles.title}>BDAYBUDDY</Text>
        <Text style={styles.title}>GIFTS</Text>
        </ImageBackground>
    </View>
  )
}

export default GiftScreen

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Cherry',
    color: '#294865',
    fontSize: 48,
    marginTop: 16,
  },
  image: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    alignItems: 'center',
  },
})