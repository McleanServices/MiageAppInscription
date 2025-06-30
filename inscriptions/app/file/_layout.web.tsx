/*
  Web Back Button Solution Explanation:
  -------------------------------------
  In Expo Router (React Navigation), when you navigate directly to a nested route like /file on the web (via refresh or direct URL),
  the navigation stack is empty and there is no previous screen to go back to. This causes the default back button to disappear or do nothing.

  To ensure a consistent user experience, we always show a custom back button in the header on web. When clicked, it always navigates to the home page ('/'),
  regardless of browser or navigation history. This guarantees the back button works after a hard refresh, direct navigation, or normal navigation.

  Implementation:
  - We use a custom headerLeft in Stack.screenOptions for web.
  - The button uses router.replace('/') to always go to the home page.
  - This avoids navigation stack issues and ensures the back button is always functional on web.
*/
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform, Text } from 'react-native';

export default function Layout() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.replace('/'); // Always go to home
  }, [router]);

  return (
    <Stack
      screenOptions={{
        headerTitle: 'Fiche de renseignement',
        headerTitleAlign: 'center',
        headerBackVisible: true,
        ...(Platform.OS === 'web' && {
          headerLeft: () => (
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={handleBack}
            >
              <Ionicons name="arrow-back" size={24} color="#2563EB" />
              <Text style={{ color: '#2563EB', marginLeft: 16 }}>Accueil</Text>
            </button>
          ),
        }),
      }}
    >
    </Stack>
  );
}
   