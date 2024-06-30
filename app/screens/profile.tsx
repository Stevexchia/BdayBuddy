import { View, Text, Button } from 'react-native'
import React from 'react'
import { signOut } from "firebase/auth"
import { FIREBASE_AUTH } from '@/FirebaseConfig'

const profile = () => {
  return (
    <View>
      <Text>profile</Text>
      <Text>Settings</Text>
      <Button title="Sign Out" onPress={async () => await signOut(FIREBASE_AUTH)} />
    </View>
  )
}

export default profile