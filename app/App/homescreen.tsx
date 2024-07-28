import { Text, View, Modal, TextInput, TouchableOpacity, FlatList, StyleSheet, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Agenda } from 'react-native-calendars';
import React, { useEffect, useState } from "react";
import * as Contacts from 'expo-contacts';
import DatePicker from 'react-native-modern-datepicker';

export default function HomeScreen() {
  // Calendar
  const [items, setItems] = useState({});
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [event, setEvent] = useState('');

  // const today = new Date().toISOString().split('T')[0];

  // const [selectedDate, setSelectedDate] = useState(today);

  function addBirthday() {
    setOpen(!open);
  }

  function handleChange(propDate) {
    setDate(propDate);
  }

  function handleSelectedDate() {
    setOpen(!open);
  }

  const loadItemsForMonth = (month) => {
    // Simulated data loading
    setTimeout(() => {
      const newItems = {
        '2024-07-02': [],
        '2024-07-01': [
          { name: "Amanda's Birthday", height: 50 },
        ],
        '2024-07-03': [
          { name: "Keith's Birthday", height: 50 },
          { name: 'Graduation', height: 50 },
        ],
      };
      setItems(newItems);
    }, 1000); // Simulating async data fetch delay
  };

  const renderEmptyData = () => {
    return (
      <View style={styles.emptyBox}>

        <Text >No events for this day</Text>
      </View>
    );
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={styles.eventBox}

      >
        <Text className="text-md font-ubuntuReg">{item.name}</Text>
      </TouchableOpacity>
    )
  }

  // Contacts
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

  function handleContactPress() {
    console.log("Contact Selected")
  }

  const renderContactItem = ({ item }: { item: Contacts.Contact }) => (
    <View>
      <TouchableOpacity style={styles.contactItem} onPress={handleContactPress} >
      <Text style={styles.name}>{item.name}</Text>
      {item.phoneNumbers && item.phoneNumbers.length > 0 && (
        <Text>{item.phoneNumbers[0].number}</Text>
      )}
    </TouchableOpacity>
    </View>
    
  );

  const keyExtractor = (item: Contacts.Contact) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0
      ? item.phoneNumbers[0].id
      : `${item.id}-${item.name}`;
    return item.id || phoneNumber || `${item.name}-${Math.random()}`;
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
          items={items}
          loadItemsForMonth={loadItemsForMonth}
          // selected={selectedDate} // Set initial selected date
          // onDayPress={(day) => setSelectedDate(day.dateString)}
          renderEmptyData={renderEmptyData}
          // showOnlySelectedDayItems={true}
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


          <TouchableOpacity style={styles.button} onPress={addBirthday}>
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
                  >
                  </TextInput>
                </View>
                <Text className="justify-start font-ubuntuMed text-base">Select a Date</Text>
                <DatePicker
                  mode='calendar'
                  selected={date}
                  onDateChanged={handleChange}
                  >
                </DatePicker>
                <TouchableOpacity style={styles.button} onPress={handleSelectedDate}>
                  <Text className="text-base font-ubuntuMed">Save</Text>
                  <Ionicons name="checkmark-circle" size={28} color='#8DB1F4' />
                </TouchableOpacity>
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
    fontSize: 48,
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
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    columnGap: 2,
    padding: 8,
    shadowRadius: 4,
    shadowOffset: {width:0, height:0},
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
})