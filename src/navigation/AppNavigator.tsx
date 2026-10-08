import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { Colors } from '../constants/theme';
import { RootStackParamList, MainTabParamList } from './types';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ItineraryDetailScreen from '../screens/ItineraryDetailScreen';
import UploadItineraryScreen from '../screens/UploadItineraryScreen';
import TermsScreen from '../screens/TermsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.textLight,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') icon = 'compass';
          else if (route.name === 'Bookings') icon = 'calendar';
          else if (route.name === 'Profile') icon = 'person';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Explore' }} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} options={{ title: 'My Bookings' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.textLight,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="ItineraryDetail"
              component={ItineraryDetailScreen}
              options={{ title: 'Itinerary' }}
            />
            <Stack.Screen
              name="UploadItinerary"
              component={UploadItineraryScreen}
              options={{ title: 'Upload Itinerary' }}
            />
            <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Bookings' }} />
            <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms & Policies' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
            <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms & Policies' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
