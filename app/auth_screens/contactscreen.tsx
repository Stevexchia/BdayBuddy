import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet, ImageBackground } from "react-native";
import * as Contacts from 'expo-contacts';
import { Ionicons } from "@expo/vector-icons";


const ContactScreen = () => {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers]
        });
        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []); // Empty dependency array to run only once

  const renderContactItem = ({ item }: { item: Contacts.Contact }) => (
    <View style={styles.contactItem}>
      <Text style={styles.name}>{item.name}</Text>
      {item.phoneNumbers && item.phoneNumbers.length > 0 && (
        <Text>{item.phoneNumbers[0].number}</Text>
      )}
    </View>
  );

  const keyExtractor = (item: Contacts.Contact) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0
      ? item.phoneNumbers[0].id
      : `${item.id}-${item.name}`;
    return item.id || phoneNumber || `${item.name}-${Math.random()}`;
  };

  return (
    <View className="flex-1">
      <ImageBackground source={require('@/assets/images/background.png')} style={styles.image}>
        <Text style={styles.title}>BDAYBUDDY</Text>
        <View className="flex-row gap-2">
          <Ionicons name="people-outline" size={30} color="black" />
          <Text className="text-xl font-ubuntuMed">Friends</Text>
        </View>
        <FlatList
          style={styles.container}
          data={contacts}
          keyExtractor={keyExtractor}
          renderItem={renderContactItem}
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
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    width: 360,
  },
  contactItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  name: {
    fontWeight: 'bold',
  },
});

export default ContactScreen;