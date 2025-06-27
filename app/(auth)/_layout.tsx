import { Stack } from 'expo-router';
import React from 'react';
import { Platform, StatusBar } from 'react-native';

export default function AuthLayout() {
  return (
    <>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: { 
            backgroundColor: 'white' 
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="welcome" 
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </>
  );
}