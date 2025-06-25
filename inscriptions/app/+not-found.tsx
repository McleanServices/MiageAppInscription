import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useSession } from '../Session/ctx';

export default function NotFoundScreen() {
  const { session } = useSession();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        {session ? (
          <Link href="/home" style={styles.button}>
            Go back to home screen!
          </Link>
        ) : (
          <Link href="/login" style={styles.button}>
            Go back to login screen!
          </Link>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
