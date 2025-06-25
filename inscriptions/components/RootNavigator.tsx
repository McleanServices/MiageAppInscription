import { Stack } from 'expo-router';
import { useSession } from '../Session/ctx';

export function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen
          name="(app)"
          options={{ headerShown: false }}
        />
      </Stack.Protected>
      <Stack.Screen name="not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}