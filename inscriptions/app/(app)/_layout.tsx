import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
      tabBarActiveTintColor: 'blue',
      headerTitleAlign: 'center', // Center the header title
      }}
    >
      <Tabs.Screen
      name="home"
      options={{
        title: 'Home',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }}
      />
      <Tabs.Screen
      name="index"
      options={{
        title: 'index',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
      }}
      />
    </Tabs>
  );
}