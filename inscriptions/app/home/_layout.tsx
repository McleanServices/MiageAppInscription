import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
      headerShown: false,
      headerTitleAlign: 'center', // Center the header title
      }}
    />
  );
}
   