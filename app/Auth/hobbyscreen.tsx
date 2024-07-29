import { Text, View, TouchableOpacity, Alert, StyleSheet, FlatList, ImageBackground } from "react-native";
import React, { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_DB } from "../../FirebaseConfig";
import { doc, updateDoc } from 'firebase/firestore';
import { CommonActions } from '@react-navigation/native';

type HobbyProps = { hobby: string; selected: boolean };

const Item = ({ hobby, selected }: HobbyProps) => (
  <View>
    <Text>{hobby}</Text>
  </View>
);

type HobbyScreenProps = {
  navigation: any;
  route: { params: { userId: string } };
};

const HobbyScreen = ({ navigation, route }: HobbyScreenProps) => {
  console.log('Route Params:', route.params);
  const { userId } = route.params;
  if (!userId) {
    console.error('User ID is undefined!');
  }
  const [hobbies, setHobbies] = useState<HobbyProps[]>([
    { hobby: 'Dance 💃', selected: false },
    { hobby: 'Crochet 🧶', selected: false },
    { hobby: 'Gymming 🏋️', selected: false },
    { hobby: 'Reading 📖', selected: false },
    { hobby: 'Gaming 🎮', selected: false },
    { hobby: 'Photography 📷', selected: false },
    { hobby: 'Basketball 🏀', selected: false },
    { hobby: 'Skydiving 🪂', selected: false },
    { hobby: 'Fishing 🎣', selected: false },
    { hobby: 'Cooking 🧑‍🍳', selected: false },
    { hobby: 'Singing 🎤', selected: false },
    { hobby: 'Hiking 🥾', selected: false },
    { hobby: 'Guitar 🎸', selected: false },
    { hobby: 'Coding 🧑‍💻', selected: false },
    { hobby: 'Kayaking 🛶', selected: false },
    { hobby: 'Scrapbooking 🎨', selected: false },
    { hobby: 'Running 🏃', selected: false },
    { hobby: 'Tennis 🎾', selected: false },
    { hobby: 'Badminton 🏸', selected: false },
    { hobby: 'Football ⚽️', selected: false },
    { hobby: 'Swimming 🏊', selected: false },
    { hobby: 'Yoga 🧘', selected: false },
    { hobby: 'Gardening 🪴', selected: false },
    { hobby: 'Board Games 🎲', selected: false },
    { hobby: 'Film-making 🎬', selected: false },
    { hobby: 'Pottery 🏺', selected: false },
    { hobby: 'Cycling 🚲', selected: false },
  ]);

  const onSelect = (index: number) => {
    setHobbies(prevHobbies =>
      prevHobbies.map((hobby, i) => 
        i === index ? { ...hobby, selected: !hobby.selected } : hobby
      )
    );
  };

  const handleHobbiesSubmit = async () => {
    const selectedHobbies = hobbies.filter(hobby => hobby.selected).map(hobby => hobby.hobby);
    try {
      const userDocRef = doc(FIREBASE_DB, 'users', userId);
      await updateDoc(userDocRef, { hobbies: selectedHobbies, hobbiesCompleted: true });
  
      Alert.alert('Success', 'Hobbies saved successfully!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Reset the navigation stack and set a new initial route
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'AppNavigator', params: { userId } }]
              })
            );
          }
        }
      ]);
    } catch (error) {
      console.error('Error saving hobbies: ', error);
      Alert.alert('Error', 'There was an error saving your hobbies. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bgblur.png')} // Ensure this path is correct
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>What are some of your favourite hobbies and interests?</Text>
          <Text style={styles.subHeaderText}>Select the ones that suit you best!</Text>
          <FlatList
            style={styles.list}
            numColumns={3}
            data={hobbies}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                style={[styles.hobbyButton, { backgroundColor: item.selected ? 'pink' : 'white' }]}
                onPress={() => onSelect(index)}
              >
                <Text style={styles.hobbyText}>{item.hobby}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleHobbiesSubmit}>
            <Text style={styles.saveText}>Save</Text>
            <Ionicons name="checkmark-circle-outline" size={25} color='#040A1D' />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  list: {
    flexGrow: 0,
    width: '100%',
  },
  listContent: {
    marginBottom: 50,
  },
  hobbyButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    margin: 4,
  },
  hobbyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#F9DECA',
    flexDirection: 'row',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 12,
    shadowRadius: 4,
    marginBottom: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HobbyScreen;
