import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './components/HomeScreen';
import UploadImage from './components/UploadImage';
import { styled } from 'nativewind';

// Use styled components for customization
const Tab = createBottomTabNavigator();
const StyledIonicons = styled(Ionicons);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;

            // Styling the icons dynamically based on route and focus state
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
              return <StyledIonicons name={iconName} size={32} className="text-green-500" />;
            } else if (route.name === 'Upload Image') {
              iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
              return <StyledIonicons name={iconName} size={32} className="text-green-500" />;
            }
          },
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { paddingBottom: 5, paddingTop: 5 },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Upload Image" component={UploadImage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
