import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { List } from '../screens/List';
import { TextDemo, ButtonDemo, FormDemo, SimpleDemo } from '../screens/Demos';
import { EventDemo } from '../screens/EventView';

const MainStack = createStackNavigator();

export const Main = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="List" component={List} />
    <MainStack.Screen
      name="TextDemo"
      component={TextDemo}
      options={{ headerTitle: 'Text Demo' }}
    />
    <MainStack.Screen
      name="FormDemo"
      component={FormDemo}
      options={{ headerTitle: 'Form Demo' }}
    />
    <MainStack.Screen
      name="ButtonDemo"
      component={ButtonDemo}
      options={{ headerTitle: 'Button Demo' }}
    />
    <MainStack.Screen
      name="SimpleDemo"
      component={SimpleDemo}
      options={{ headerTitle: 'Simple Demo' }}
    />
    <MainStack.Screen
      name="EventDemo"
      component={EventDemo}
      options={{ headerTitle: 'Events' }}
    />
  </MainStack.Navigator>
);
