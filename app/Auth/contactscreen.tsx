import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { ContactScreenNavigationProp } from './types'; 

// Define the types for the screen props
type ContactScreenProps = {
  route: {
    params: {
      userId: string;
    };
  };
};

const ContactScreen: React.FC<ContactScreenProps> = ({ route }) => {
  const { userId } = route.params;
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<ContactScreenNavigationProp>();

  const handleSave = async () => {
    if (contactNumber.trim() === '') {
      Alert.alert('Validation Error', 'Contact number cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const db = getFirestore();
      const userDoc = doc(db, 'users', userId); // Use the received userId
      await updateDoc(userDoc, {
        contactNumber: contactNumber.trim(),
      });
      Alert.alert('Success', 'Contact number updated successfully!');
      
      // Navigate to the Hobby screen and pass the userId
      navigation.navigate('Hobby', { userId });
    } catch (error) {
      console.error('Error updating contact number:', error);
      Alert.alert('Error', 'Failed to update contact number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/bgblur.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Please enter your Contact Number</Text>
        <TextInput
         placeholderTextColor={"grey"}
          style={styles.input}
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
          value={contactNumber}
          onChangeText={(text) => setContactNumber(text)}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent overlay
    borderRadius: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'black', // Customize your button color here
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#6C757D', // Customize disabled button color here
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ContactScreen;
