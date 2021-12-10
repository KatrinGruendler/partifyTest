import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';

import colors from '../constants/colors';
import { Button } from '../components/Button';
import { ListItem, ListSeparator } from '../components/List';
import { fetchAllEvents } from  '../api/getAllEvents';
import { fetchMyEvents } from  '../api/getMyEvents';
//import { TextInput } from '../components/Form';
//import { Text } from '../components/Text';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
});

const allEvents = [
  {
    title: 'Text',
    subtitle: 'An example of using the Text.js components.',
    target: 'TextDemo',
  },
  {
    title: 'Form',
    subtitle: 'An example of using the Form.js components.',
    target: 'TextDemo',
  },
  {
    title: 'Button',
    subtitle: 'An example of using the Button.js components.',
    target: 'TextDemo',
  },
];

const myEvents = [
   {
    event_id: 1,
    event_name: 'Test Event',
    event_tags: 'Without API.',
    target: 'TextDemo',
  },
  {
    event_id: 2,
    event_name: 'Test Event2',
    event_tags: 'A simple test for my events.',
    target: 'ButtonDemo',
  },
<<<<<<< HEAD
=======
];

const myEvents = [
   {
    title: 'Simple',
    subtitle: 'An example of using the a simple View.',
    target: 'SimpleDemo',
  },
  {
    title: 'Events',
    subtitle: 'A simple GET Request for all Events.',
    target: 'EventDemo',
  },
>>>>>>> 751062cd91648ae1d566ddbb57ad20ed8802ec3e
];

export const EventDemo = ({ navigation }) => {

  //state variable for view switch
  const [viewState, setViewState] = React.useState('allEvents');

  //state function for view switch
  const handleViewChange = () => {
    
    if(viewState === 'allEvents'){
      setViewState('myEvents');
    } else if(viewState === 'myEvents'){
      setViewState('allEvents');
    }
  }

<<<<<<< HEAD
  let allEventsAPI = fetchAllEvents();
  console.log(allEventsAPI);

  //let myEventsAPI = fetchMyEvents();
  //console.log(myEventsAPI);

=======
>>>>>>> 751062cd91648ae1d566ddbb57ad20ed8802ec3e
  return (
    <View style={styles.container}>
      {
        <Button onPress={() => {
          handleViewChange();
        }}>
        Switch View
        </Button>
      }

      <FlatList
        style={styles.container}
<<<<<<< HEAD
        //data={viewState === 'allEvents' ? allEvents : myEvents}
        data={viewState === 'allEvents' ? allEventsAPI : myEvents}
        keyExtractor={item => item.title}
        renderItem={({ item }) => (
          <ListItem
            key={item.event_id}
            title={item.event_name}
            subtitle={item.event_tags}
            onPress={() => navigation.push('TextDemo')}
          />
          /*<ListItem
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => navigation.push(item.target)}
          />*/
=======
        data={viewState === 'allEvents' ? allEvents : myEvents}
        keyExtractor={item => item.title}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => navigation.push(item.target)}
          />
>>>>>>> 751062cd91648ae1d566ddbb57ad20ed8802ec3e
        )}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={ListSeparator}
        ListFooterComponent={ListSeparator}
      />
    </View>
  );
};
