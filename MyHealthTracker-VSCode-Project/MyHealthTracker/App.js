import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { HealthProvider } from './src/contexts/HealthContext';
import DashboardScreen from './src/screens/DashboardScreen';
import WaterTrackerScreen from './src/screens/WaterTrackerScreen';
import StepTrackerScreen from './src/screens/StepTrackerScreen';
import SleepTrackerScreen from './src/screens/SleepTrackerScreen';
import MedicationScreen from './src/screens/MedicationScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Track') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Track" component={TrackStackNavigator} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function TrackStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TrackingHub" 
        component={TrackingHubScreen} 
        options={{ title: 'Track Activities' }}
      />
      <Stack.Screen 
        name="WaterTracker" 
        component={WaterTrackerScreen} 
        options={{ title: 'Water Tracker' }}
      />
      <Stack.Screen 
        name="StepTracker" 
        component={StepTrackerScreen} 
        options={{ title: 'Step Tracker' }}
      />
      <Stack.Screen 
        name="SleepTracker" 
        component={SleepTrackerScreen} 
        options={{ title: 'Sleep Tracker' }}
      />
      <Stack.Screen 
        name="Medications" 
        component={MedicationScreen} 
        options={{ title: 'Medications' }}
      />
    </Stack.Navigator>
  );
}

function TrackingHubScreen({ navigation }) {
  return (
    <DashboardScreen navigation={navigation} isTrackingHub={true} />
  );
}

export default function App() {
  return (
    <HealthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <TabNavigator />
      </NavigationContainer>
    </HealthProvider>
  );
}

