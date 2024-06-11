import { Text, View, SafeAreaView, TouchableOpacity, Alert, StyleSheet, FlatList, Button } from "react-native";
import React, { useState } from 'react'

type HobbyProps = {hobby: string};

const Item = ({hobby}: HobbyProps) => (
  <View>
    <Text>{hobby}</Text>
  </View> 
);

const HobbyScreen = () => {
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
        return { ...hobby, selected:!hobby.selected };
      } 
      return hobby;
    });
    setHobbies(updatedHobbies);
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-300 items-center gap-4">
       <Text className="text-xl text-center font-bold">What are some of your favourite hobbies and interests?</Text>
       <Text className="text-lg font-bold">Select the ones that suit you best!</Text>
      <FlatList 
        style={{flexDirection: "row"}}
        numColumns={3}
        data={hobbies}
        renderItem={({ item, index }) => (
            <TouchableOpacity className="items-center p-2 rounded-xl m-1.5"
              style={{ backgroundColor: item.selected == true ? 'pink' : 'white'}}
              onPress={() => { onSelect(index) }}>
              <Text className="font-semibold text-base" >{item.hobby}</Text>
            </TouchableOpacity>
          )}
        keyExtractor = {(item, index) => index.toString()}
      />
      <TouchableOpacity className="bg-orange-200 py-2 px-4 rounded-xl border-2 border-orange-300 my-24"
      onPress={() => navigation.navigate("Home")}>
        <Text className="font-semibold text-base">Save!</Text>
      </TouchableOpacity>
      {/* navigation.navigate("Home") */}
    </SafeAreaView>
  );
};

export default HobbyScreen