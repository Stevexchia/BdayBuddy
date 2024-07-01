import { Text, View, SafeAreaView, TouchableOpacity, Alert, StyleSheet, FlatList } from "react-native";
import React, { useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_DB } from "../../FirebaseConfig"
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";

type HobbyProps = { hobby: string };

const Item = ({ hobby }: HobbyProps) => (
  <View>
    <Text>{hobby}</Text>
  </View>
);

type HobbyScreenProps = {
  navigation: any;
  route: { params: { userId: string } };
};

const HobbyScreen = ({ navigation, route }) => {
  const { userId } = route.params; //
  const [hobbies, setHobbies] = useState([
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

  const onSelect = (ind: number) => {
    const updatedHobbies = hobbies.map((hobby, index) => {
      if (index == ind) {
        return { ...hobby, selected: !hobby.selected };
      }
      return hobby;
    });
    setHobbies(updatedHobbies);
  };

  const saveHobbiesToFirestore = async () => {
    const selectedHobbies = hobbies.filter(hobby => hobby.selected).map(hobby => hobby.hobby);
    try {
      const userDocRef = doc(FIREBASE_DB, 'users', userId);
      await updateDoc(userDocRef, { hobbies: selectedHobbies });

      Alert.alert('Success', 'Hobbies saved successfully!');
      navigation.navigate('Home');  // Navigate to Home screen after saving
    } catch (error) {
      console.error('Error saving hobbies: ', error);
      Alert.alert('Error', 'There was an error saving your hobbies. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-300 items-center gap-4">
      <Text className="text-xl text-center font-bold">What are some of your favourite hobbies and interests?</Text>
      <Text className="text-lg font-bold">Select the ones that suit you best!</Text>
      <FlatList
        style={{ flexDirection: "row" }}
        numColumns={3}
        data={hobbies}
        renderItem={({ item, index }) => (
          <TouchableOpacity className="items-center p-2 rounded-xl m-1.5"
            style={{ backgroundColor: item.selected == true ? 'pink' : 'white' }}
            onPress={() => { onSelect(index) }}>
            <Text className="font-semibold text-base" >{item.hobby}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.Button} onPress={saveHobbiesToFirestore}>
                  <Text className="text-base font-ubuntuMed">Save</Text>
                  <Ionicons name="checkmark-circle-outline" size={25} color='#040A1D' />
                </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Button: {
    backgroundColor: '#F9DECA',
    flexDirection: 'row',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    columnGap: 2,
    padding: 8,
    shadowRadius: 4,
    marginBottom: 45,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
  },
})

export default HobbyScreen
