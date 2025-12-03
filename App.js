// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import BookingScreen from "./screens/BookingScreen";
import AdminScreen from "./screens/AdminScreen";
import UserTabs from "./UserTabs"; // <- Tab navigator that contains Home, Reservations, Profile

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* USER FLOW: single entry point to tabs */}
        <Stack.Screen name="UserTabs" component={UserTabs} />

        {/* Screens that should be outside the tabs (stack) */}
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
