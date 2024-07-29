import { Text, View, Modal, TextInput, TouchableOpacity, FlatList, StyleSheet, ImageBackground, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Agenda } from 'react-native-calendars';
import React, { useEffect, useState } from "react";
import * as Contacts from 'expo-contacts';
import DatePicker from 'react-native-modern-datepicker';
import { FIREBASE_DB } from "../../FirebaseConfig"
import { collection, addDoc, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';


export default function HomeScreen({ route }) {
  const { userId } = route.params;
  if (!userId) {
    console.error('User ID is undefined!');
  }

  // Calendar
  const [items, setItems] = useState({});
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [event, setEvent] = useState('');

  useEffect(() => {
    if (userId) {
      fetchEvents(userId);
    }
  }, [userId]);

  const fetchEvents = async (userId) => {
    try {
      const userDocRef = doc(FIREBASE_DB, 'users', userId);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setItems(userData.items || {});
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  function addBirthday() {
    setOpen(!open);
  }

  function handleChange(propDate) {
    console.log("Date Changed:", propDate); // Debug log
    
    // Ensure the date format is 'YYYY-MM-DD'
    const formattedDate = propDate.replace(/\//g, '-');
    setDate(formattedDate);
  }

  function handleSelectedDate() {
    console.log("Selected Date:", date); // Debug log
    console.log("Event:", event); // Debug log
    if (!date || !event) {
      alert("Please select a date and enter an event name");
      return;
    }
  
    const newItems = { ...items };
    if (!newItems[date]) {
      newItems[date] = [];
    }
    newItems[date].push({ name: event, height: 50 });
  
    console.log("New Items:", newItems); // Debug log
    
    setItems(newItems);
    setOpen(false); // Close modal after adding event
    setEvent(''); // Clear event text
    setDate(''); // Clear date

    saveEventToFirestore(userId, newItems); // Save the new items to Firestore
  }

  const loadItemsForMonth = (month) => {
    console.log("Loading items for month:", month);
    setTimeout(() => {
      const loadedItems = {};
      const newItems = { ...items, ...loadedItems };
      console.log("Loaded Items for Month:", newItems); // Debug log
      setItems(newItems);
    }, 1000);
  };

  const renderEmptyData = () => {
    return (
      <View style={styles.emptyBox}>
        <Text>No events for this day</Text>
      </View>
    );
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={styles.eventBox}>
        <Text className="text-md font-ubuntuReg">{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Contacts
  const [contacts, setContacts] = useState([]);

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
  }, []);

  const handleContactPress = () => {
    console.log("Contact Selected");
  }

  const renderContactItem = ({ item }) => (
    <View>
      <TouchableOpacity style={styles.contactItem} onPress={handleContactPress}>
        <Text style={styles.name}>{item.name}</Text>
        {item.phoneNumbers && item.phoneNumbers.length > 0 && (
          <Text>{item.phoneNumbers[0].number}</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const keyExtractor = (item) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0
      ? item.phoneNumbers[0].id
      : `${item.id}-${item.name}`;
    return item.id || phoneNumber || `${item.name}-${Math.random()}`;
  };

  const saveEventToFirestore = async (userId, newItems) => {
    // Validate input
    if (!userId || !newItems) {
      Alert.alert('Error', 'User ID or items are missing.');
      return;
    }

    try {
      const userDocRef = doc(FIREBASE_DB, 'users', userId);
      const docSnapshot = await getDoc(userDocRef);

      if (!docSnapshot.exists()) {
        // Create the document if it does not exist
        await setDoc(userDocRef, { items: newItems });
      } else {
        // Update the document if it exists
        await updateDoc(userDocRef, { items: newItems });
      }

      Alert.alert('Success', 'Event saved successfully!');
    } catch (error) {
      console.error('Error saving event: ', error);
      Alert.alert('Error', 'There was an error saving your event. Please try again.');
    }
  };

  return (
    <View className="flex-auto">
      <ImageBackground source={require('@/assets/images/background.png')} style={styles.image}>
        <Text style={styles.title}>BDAYBUDDY</Text>
        <View className="flex-row gap-2 mb-2">
          <Ionicons name="today-outline" size={28} color='black' />
          <Text className="text-lg font-ubuntuMed">Upcoming Events</Text>
        </View>
        <Agenda
          key={JSON.stringify(items)} // Force re-render when items change
          items={items}
          loadItemsForMonth={loadItemsForMonth}
          renderEmptyData={renderEmptyData}
          renderEmptyDate={() => (
            <View style={styles.emptyBox}>
              <Text>No events for this day</Text>
            </View>
          )}
          renderItem={renderItem}
          rowHasChanged={(r1, r2) => r1.name !== r2.name}
          theme={{
            agendaDayTextColor: '#2d4150',
            agendaDayNumColor: '#2d4150',
            agendaTodayColor: '#86c8fa',
            agendaKnobColor: '#F9DECA',
            backgroundColor: '#f0f4f7',
            calendarBackground: '#ffffff',
            dayTextColor: '#2d4150',
            dotColor: '#86c8fa',
            monthTextColor: '#2d4150',
            selectedDayBackgroundColor: '#F9DECA',
            selectedDayTextColor: 'black',
            textDayFontFamily: 'Ubuntu-Regular',
            textMonthFontFamily: 'Ubuntu-Medium',
            textDayHeaderFontFamily: 'Ubuntu-Medium',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
          style={styles.calendar}
        />
        <View className="flex-row items-center space-x-11">
          <View className="flex-row gap-2">
            <Ionicons name="people-outline" size={28} color="black" />
            <Text className="text-lg font-ubuntuMed">Friends</Text>
          </View>
          <TouchableOpacity className="bg-white" style={styles.button} onPress={addBirthday}>
            <Ionicons name="heart-circle" size={28} color='#8DB1F4' />
            <Text className="text-base font-ubuntuReg">Add a new Occasion!</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={open}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.text}>Add a new Occasion!</Text>
                <View className="mb-6">
                  <Text className="justify-start font-ubuntuMed p-1">Event</Text>
                  <TextInput style={styles.input}
                    value={event}
                    onChangeText={(text) => setEvent(text)}
                    placeholder="Event Name"
                    autoCapitalize="none"
                  />
                </View>
                <Text className="justify-start font-ubuntuMed text-base">Select a Date</Text>
                <DatePicker
                  mode='calendar'
                  selected={date}
                  onDateChange={handleChange}
                />
                <View className="flex-row gap-3">
                  <TouchableOpacity className="bg-[#8DB1F4]" style={styles.button} onPress={handleSelectedDate}>
                    <Text className="text-base font-ubuntuMed text-white">Save</Text>
                    <Ionicons name="checkmark-circle" size={28} color='white' />
                  </TouchableOpacity>
                  <TouchableOpacity className='bg-white' style={styles.button} onPress={addBirthday}>
                    <Text className="text-base font-ubuntuMed">Cancel</Text>
                    <Ionicons name="close-circle" size={28} color='pink' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <FlatList className="flex-shrink"
          style={styles.contacts}
          data={contacts}
          keyExtractor={keyExtractor}
          renderItem={renderContactItem}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Cherry',
    color: '#294865',
    fontSize: 24,
    marginTop: 16,
  },
  image: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    // backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    columnGap: 2,
    padding: 8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
  },
  eventBox: {
    flex: 1,
    backgroundColor: '#F9DECA',
    borderRadius: 8,
    marginTop: 17,
    marginRight: 15,
    padding: 10,
  },
  emptyBox: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 17,
    marginRight: 15,
    marginLeft: 15,
    padding: 10,
  },
  calendar: {
    borderRadius: 8,
    width: 340,
    marginBottom: 20,
    height: 230,
  },
  contacts: {
    padding: 20,
    width: 365,
    height: 150,
  },
  contactItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 5,
    borderRadius: 10,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: 5,
  },
  input: {
    fontFamily: 'Ubuntu-Regular',
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    width: 250,
  },
});
