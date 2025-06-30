import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
      headerTitle: 'Fiche de renseignement',
      headerTitleAlign: 'center',
      headerBackVisible: true, // Ensure the back button is visible
      headerShown: true, // Show the header
 
      }}
    >
    </Stack>
  );
}
   