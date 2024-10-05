// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './components/HomeScreen';
import UploadImage from './components/UploadImage';

const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              return (
            <Ionicons name="home" size={32} color="green" />
            // <Ionicons name="home" size={32} color="green" />
              ) 
            } else if (route.name === 'Upload Image') {
              return (
            <Ionicons name="cloud-upload" size={32} color="green" />
              )
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: '#007bff',
          inactiveTintColor: 'gray',
          style: { paddingBottom: 5, paddingTop: 5 },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Upload Image" component={UploadImage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}