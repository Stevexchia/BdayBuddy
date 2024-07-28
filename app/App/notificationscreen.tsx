import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { FIREBASE_DB } from '@/FirebaseConfig';
import { getDoc, doc, setDoc } from 'firebase/firestore';
// import React, { useState, useEffect } from 'react-native';
import { getNotificationInbox } from 'native-notify';
// import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';

export default function NotificationScreen({ route }) {
  const { userId } = route.params;
  const [data, setData] = useState([]);

  useEffect(async () => {
    let notifications = await getNotificationInbox(22706, 'ZVD7i7LCQ7RGIwOxgMdQSA');
    console.log("notifications: ", notifications);
    setData(notifications);
}, []);

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
    <View className="flex-auto">
      <ImageBackground source={require('@/assets/images/background.png')} style={styles.image}>
        <Text style={styles.title}>NOTIFICATIONS</Text>
        {/* <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Post Something</Text>
        </TouchableOpacity> */}
        <FlatList 
        data={data}
        keyExtractor={item => item.notification_id}
        renderItem={({ item }) => 
          <View style={styles.notifItem}>
            <Text style={styles.notifTitle}>{item.title}</Text>
            <Text style={styles.notifBody}>{item.message}</Text>
            <Text style={styles.notifDate}>{item.date}</Text>
          </View>
        }
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Cherry',
    color: '#294865',
    fontSize: 48,
    marginTop: 16,
    marginBottom: 16,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
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
  notifItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    width: 365,
    marginBottom: 5,
    borderRadius: 10,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  notifTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  notifBody: {
    fontFamily: 'Ubuntu-Regular',
    color: '#808080' ,
    fontSize: 15,
    marginBottom: 8,
  },
  notifDate: {
    fontFamily: 'Ubuntu-Regular',
    color: '#808080' ,
    fontSize: 15,
    marginBottom: 5,
    alignSelf: 'flex-end',
  },
});

// export default NotificationScreen;
