// app/(tabs)/_layout.web.tsx
import React from 'react';
import { Slot, usePathname } from 'expo-router'; // Import usePathname
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function WebNavLayout() {
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push('/home')}
          style={[
            styles.navButton,
            pathname === '/home' && styles.activeNavButton,
          ]}
        >
          <Text
            style={[
              styles.link,
              pathname === '/home' && styles.activeLink,
            ]}
          >
            Home
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/profile')}
          style={[
            styles.navButton,
            pathname === '/profile' && styles.activeNavButton,
          ]}
        >
          <Text
            style={[
              styles.link,
              pathname === '/profile' && styles.activeLink,
            ]}
          >
            Profile
          </Text>
        </Pressable>
        {/* Add more nav items as needed */}
      </View>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navButton: {
    borderRadius: 6,
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeNavButton: {
    backgroundColor: '#1976d2', // Blue background for active
  },
  link: {
    color: '#333',
    fontSize: 16,
  },
  activeLink: {
    color: '#fff', // White text on blue background
    fontWeight: 'bold',
  },
});
