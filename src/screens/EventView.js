import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';

import colors from '../constants/colors';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextInput } from '../components/Form';
import { ListItem, ListSeparator } from '../components/List';

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
    target: 'FormDemo',
  },
  {
    title: 'Button',
    subtitle: 'An example of using the Button.js components.',
    target: 'ButtonDemo',
  },
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
        data={viewState === 'allEvents' ? allEvents : myEvents}
        keyExtractor={item => item.title}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => navigation.push(item.target)}
          />
        )}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={ListSeparator}
        ListFooterComponent={ListSeparator}
      />
    </View>
  );
};
