import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddMedicationScreen from '../screens/AddMedicationScreen';
import ActionModalScreen from '../screens/ActionModalScreen';
import { useLanguage } from '../context/LanguageContext';
import { getLocalStorage } from '../services/Storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { t } = useLanguage();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t("home"),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: t("history"),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t("profile"),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [initialRouteName, setInitialRouteName] = useState(null);

  //Check auth when open app
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getLocalStorage('userDetail');
      setInitialRouteName(user ? 'MainTabs' : 'Onboarding');
    };

    checkAuth();
  }, []);

  if (!initialRouteName) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
        <Stack.Screen
          name="ActionModal"
          component={ActionModalScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
