// app/index.tsx
import { useSession } from '../Session/ctx'; // or useAuth()
import { SplashScreen } from 'expo-router';
import { Redirect, Slot } from 'expo-router';

export default function Index() {
  const { isLoading, session } = useSession();

  if (isLoading) {
    SplashScreen.preventAutoHideAsync();
    return null;
  }

  SplashScreen.hideAsync();
  
  // If authenticated → go into (app), else → go to /login
  return session ? <Redirect href="/home" /> : <Redirect href="/login" />;
}
