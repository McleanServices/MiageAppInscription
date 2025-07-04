import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useSession } from '../Session/ctx';


export function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack>
      <Stack.Protected guard={!session}>
        <Stack.Screen
          name="login"
          options={{ headerShown: false, headerBackVisible: false }}
        />
        <Stack.Screen name="register" options={{ headerShown: false, headerBackVisible: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen
          name="(app)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="file"
          options={{ 
            headerBackTitle: 'Accueil',
            headerBackVisible: true,
            // Force back button to always be visible on web
            ...(Platform.OS === 'web' && {
              headerLeft: undefined, // This will be handled in the file layout
            })
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}