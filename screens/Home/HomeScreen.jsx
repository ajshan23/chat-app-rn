import React from 'react';
import { View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatTab from '../tabs/ChatTab';


const messageSe = require('../../assets/tabs/messageSe.png');
const callsSe = require('../../assets/tabs/callsSe.png');
const userSe = require('../../assets/tabs/userSe.png');
const settingsSe = require('../../assets/tabs/settingsSe.png');
const message = require('../../assets/tabs/message.png');
const calls = require('../../assets/tabs/calls.png');
const user = require('../../assets/tabs/user.png');
const settings = require('../../assets/tabs/settings.png');

// Create Tab Navigator
const Tab = createBottomTabNavigator();

const UpdatesScreen = () => (
  <View><Text>Updates Screen</Text></View>
);

const CommunitiesScreen = () => (
  <View><Text>Communities Screen</Text></View>
);

const CallsScreen = () => (
  <View><Text>Calls Screen</Text></View>
);

// Main HomeScreen Component
const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          if (route.name === 'Message') {
            icon = focused ? messageSe : message;
          } else if (route.name === 'Calls') {
            icon = focused ? callsSe : calls;
          } else if (route.name === 'Contacts') {
            icon = focused ? userSe : user;
          } else if (route.name === 'Settings') {
            icon = focused ? settingsSe : settings;
          }

          return (
            <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
              <Image source={icon} style={{ width: 28, height: 28 }} />
            </View>
          );
        },
        tabBarActiveTintColor: '#24786D', // Change this to your desired active text color
        tabBarInactiveTintColor: '#B0BEC5', // Change this to your desired inactive text color
        tabBarLabelStyle: { fontSize: 12 }, // Adjust font size if needed
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarStyle: {
          backgroundColor: '#fff', // Background color for the tab bar
          height: 70, // Set your desired height here
          paddingBottom: 10, // Optional: Add some padding if needed
        },
        headerShown: false,

      })}
    >
      <Tab.Screen name="Message" component={ChatTab} />
      <Tab.Screen name="Calls" component={UpdatesScreen} />
      <Tab.Screen name="Contacts" component={CommunitiesScreen} />
      <Tab.Screen name="Settings" component={CallsScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
