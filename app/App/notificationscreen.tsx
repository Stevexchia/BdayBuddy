import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { FIREBASE_DB } from '@/FirebaseConfig';
import { getDoc, doc, setDoc } from 'firebase/firestore';

const NotificationScreen = ({ route }) => {
  const { userId } = route.params;
  const [userName, setUserName] = useState('Username');

  const saveSubID = async (userId, subID) => {
    try {
      const userRef = doc(FIREBASE_DB, 'users', userId);
      await setDoc(userRef, { subID: subID }, { merge: true });
      console.log('SubID saved successfully');
    } catch (error) {
      console.error('Error saving SubID:', error);
    }
  };

  const getSubID = async (userId) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().subID;
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching SubID:', error);
      return null;
    }
  };

  const handleSend = async () => {
    let subID = await getSubID(userId);

    if (!subID) {
      console.log('SubID not found, generating and registering...');
      subID = uuidv4(); // Generate a new unique subID
      await saveSubID(userId, subID);
    }

    console.log('Sending notification to SubID:', subID);
    sendIndieNotification(subID);
  };

  const sendIndieNotification = (subID) => {
    axios.post(`https://app.nativenotify.com/api/indie/notification`, {
      subID: subID,
      appId: 22706,
      appToken: 'ZVD7i7LCQ7RGIwOxgMdQSA',
      title: 'hello',
      message: 'test',
    })
    .then(response => {
      console.log('Notification sent:', response.data);
    })
    .catch(error => {
      console.error('Error sending notification:', error.response?.data || error.message);
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('@/assets/images/background.png')} style={styles.image}>
        <Text style={styles.title}>BDAYBUDDY</Text>
        <Text style={styles.subtitle}>NOTIFS</Text>
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Post Something</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Cherry',
    color: '#294865',
    fontSize: 48,
    marginTop: 16,
  },
  subtitle: {
    fontFamily: 'Cherry',
    color: '#294865',
    fontSize: 24,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#294865',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default NotificationScreen;
