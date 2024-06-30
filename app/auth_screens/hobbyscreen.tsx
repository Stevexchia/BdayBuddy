import { Text, View, SafeAreaView, TouchableOpacity, Alert, StyleSheet, FlatList, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react'

type HobbyProps = { hobby: string };

const Item = ({ hobby }: HobbyProps) => (
  <View>
    <Text>{hobby}</Text>
  </View>
);

const HobbyScreen = ({ navigation }) => {
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
    { hobby: 'Film-making 🎬', selected: false },
    { hobby: 'Kayaking 🛶', selected: false },
    { hobby: 'Scrapbooking 🎨', selected: false },
    { hobby: 'Tennis 🎾', selected: false },
    { hobby: 'Badminton 🏸', selected: false },
    { hobby: 'Football ⚽️', selected: false },
    { hobby: 'Running 🏃', selected: false },
    { hobby: 'Swimming 🏊', selected: false },
    { hobby: 'Yoga 🧘', selected: false },
    { hobby: 'Gardening 🪴', selected: false },
    { hobby: 'Board Games 🎲', selected: false },
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

  return (
    <SafeAreaView className="flex-1 bg-indigo-300 items-center gap-4">
      <Text className="text-xl text-center font-ubuntuMed px-2">What are some of your favourite hobbies and interests?</Text>
      <Text className="text-lg font-ubuntuMed">Select the ones that suit you best!</Text>
      <FlatList
        numColumns={3}
        data={hobbies}
        renderItem={({ item, index }) => (
          <TouchableOpacity className="items-center p-2 rounded-xl m-1.5"
            style={{ backgroundColor: item.selected == true ? 'pink' : 'white' }}
            onPress={() => { onSelect(index) }}>
            <Text className="font-ubuntuReg text-base" >{item.hobby}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate("Home")}>
        <Text className="text-base font-ubuntuMed">Save</Text>
        <Ionicons name="checkmark-circle" size={28} color='#8DB1F4' />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HobbyScreen

const styles = StyleSheet.create({
  Button: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 45,
    columnGap: 2,
    padding: 8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
  },
})