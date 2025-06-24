import { Stack } from 'expo-router';
import { SessionProvider, useSession } from '../Session/ctx';
import { SplashScreenController } from '../Session/splash';

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigatorWrapper />
    </SessionProvider>
  );
}

// Wrapper to wait for session loading before rendering navigation
function RootNavigatorWrapper() {
  const { isLoading } = useSession();

  if (isLoading) {
    // Optionally, you could return a splash/loading component here
    return null;
  }

  return <RootNavigator />;
}

// Separate this into a new component so it can access the SessionProvider context later
function RootNavigator() {
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
    </Stack>
  );
}
