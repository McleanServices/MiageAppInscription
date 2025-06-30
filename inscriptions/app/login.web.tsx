import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { useSession } from '../Session/ctx';


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

type LoginCardProps = {
  styles: any;
  email: string;
  setEmail: (val: string) => void;
  motDePasse: string;
  setMotDePasse: (val: string) => void;
  error: string | null;
  loading: boolean;
  handleLogin: () => void;
  router: any;
};

function LoginCard({ styles, email, setEmail, motDePasse, setMotDePasse, error, loading, handleLogin, router }: LoginCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>SE CONNECTER</Text>
      <View style={styles.titleUnderline} />
      <View style={styles.errorBoxWrapper}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText} numberOfLines={2} ellipsizeMode="tail">{error}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          selectionColor="transparent"
          underlineColorAndroid="transparent"
        />
        <Ionicons name="person-outline" size={24} color="#E15A2D" style={styles.inputIcon} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mot de passe"
          style={styles.input}
          placeholderTextColor="#555"
          secureTextEntry
          value={motDePasse}
          onChangeText={setMotDePasse}
          returnKeyType="go"
          onSubmitEditing={handleLogin}
          blurOnSubmit={false}
          selectionColor="transparent"
          underlineColorAndroid="transparent"
        />
        <Ionicons name="lock-closed-outline" size={24} color="#E15A2D" style={styles.inputIcon} />
      </View>
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginButtonText}>{loading ? 'Connexion...' : 'CONNEXION'}</Text>
      </TouchableOpacity>
      <Text style={styles.registerLink}>
        pas un compte?{' '}
        <Text style={styles.registerLinkUnderline} onPress={() => router.replace('/register')}>
          créer un compte
        </Text>
      </Text>
    </View>
  );
}

export default function Index() {
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { signIn } = useSession();
  const [appIsReady, setAppIsReady] = useState(false);

  // Add state for form fields and error
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width <= 1040;

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
    
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [appIsReady]);

  // Add login handler
  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    
    const result = await signIn(email, motDePasse);
    
    if (result.success) {
      router.replace('/');
    } else {
      setError(result.error || 'Erreur inconnue');
    }
    
    setLoading(false);
  };

  if (!appIsReady) {
    return null;
  }

  if (isMobile) {
    // MOBILE/TABLET LAYOUT (like login.tsx)
    return (
      <KeyboardAvoidingView
        style={mobileStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <View style={mobileStyles.centeredView}>
          {/* Logo Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
            <Image source={require('../assets/images/miage-logo.png')} style={{ width: 80, height: 80, marginHorizontal: 4 }} contentFit="contain" />
            <Image source={require('../assets/images/miage-logo.png')} style={{ width: 80, height: 80, marginHorizontal: 4 }} contentFit="contain" />
            <Image source={require('../assets/images/miage-logo.png')} style={{ width: 80, height: 80, marginHorizontal: 4 }} contentFit="contain" />
            <Image source={require('../assets/images/miage-logo.png')} style={{ width: 80, height: 80, marginHorizontal: 4 }} contentFit="contain" />
          </View>
          <LoginCard
            styles={mobileStyles}
            email={email}
            setEmail={setEmail}
            motDePasse={motDePasse}
            setMotDePasse={setMotDePasse}
            error={error}
            loading={loading}
            handleLogin={handleLogin}
            router={router}
          />
          <View style={mobileStyles.shadowBackground} />
        </View>
      </KeyboardAvoidingView>
    );
  }

  // DESKTOP/TABLET LAYOUT (current two-column)
  return (
    <KeyboardAvoidingView 
      style={styles.outerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        {/* Left Section: Welcome and Register */}
        <View style={styles.leftSection}>
          <Text style={styles.welcomeTitle}>BIENVENUE!</Text>
          <View style={styles.welcomeUnderline} />
          <Text style={styles.welcomeSubtitle}>Vous n&apos;êtes pas encore un compte ?</Text>
          <TouchableOpacity style={styles.registerButton} onPress={() => router.replace('/register')}>
            <Text style={styles.registerButtonText}>Creer un compte </Text>
          </TouchableOpacity>
        </View>
        {/* Right Section: Login Card */}
        <View style={styles.rightSection}>
          <LoginCard
            styles={styles}
            email={email}
            setEmail={setEmail}
            motDePasse={motDePasse}
            setMotDePasse={setMotDePasse}
            error={error}
            loading={loading}
            handleLogin={handleLogin}
            router={router}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A2342',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    width: '95%',
    maxWidth: 1100,
    minHeight: 650,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 48,
    minWidth: 350,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  welcomeUnderline: {
    width: 80,
    height: 5,
    backgroundColor: '#3CA1D8',
    marginBottom: 24,
    borderRadius: 2,
  },
  welcomeSubtitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 24,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#E15A2D',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 350,
    padding: 48,
  },
  card: {
    backgroundColor: "#1686B0",
    borderRadius: 60,
    width: "90%",
    maxWidth: 600,
    alignItems: "center",
    paddingVertical: 20, // reduced from 36 to 20
    marginTop: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 0,
    letterSpacing: 1,
    textAlign: "center"
  },
  titleUnderline: {
    width: 160,
    height: 4,
    backgroundColor: "#3CA1D8", // changed to a lighter blue
    opacity: 0.4, // more dim
    marginTop: 6,
    marginBottom: 28,
    borderRadius: 2,
    alignSelf: "center"
  },
  errorBoxWrapper: {
    height: 48, // increased fixed height for error area
    width: '100%',
    justifyContent: 'center',
    marginBottom: 0,
    overflow: 'hidden',
  },
  errorBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    minHeight: 28,
    justifyContent: 'center',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center'
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: 320,
    height: 48,
  },
  input: {
    flex: 1,
    color: "#333",
    fontSize: 16,
    ...(Platform.OS === 'web' && {
      outline: 'none',
      border: 'none',
      boxShadow: 'none',
    }),
  },
  inputIcon: {
    marginLeft: 8,
  },
  forgotPasswordContainer: {
    width: 320,
    alignItems: "flex-end",
    marginBottom: 18,
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.85,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E15A2D",
    borderRadius: 5,
    paddingVertical: 12,
    width: 320,
    justifyContent: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerLink: {
    color: "#fff",
    fontSize: 15,
    marginTop: 10,
    opacity: 0.85,
    textAlign: "center",
  },
  registerLinkUnderline: {
    textDecorationLine: "underline",
    color: "#fff",
  },
  shadowBackground: {
    width: "90%",
    maxWidth: 600,
    height: 150,
    backgroundColor: "#0A2342",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignSelf: "center",
    marginTop: -60,
    zIndex: 0,
  },
});

// MOBILE STYLES (from login.tsx)
const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 600,
  },
  card: {
    backgroundColor: "#1686B0",
    borderRadius: 60,
    width: "90%",
    maxWidth: 600,
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 0,
    letterSpacing: 1,
    textAlign: "center"
  },
  titleUnderline: {
    width: 160,
    height: 4,
    backgroundColor: "#3CA1D8",
    opacity: 0.4,
    marginTop: 6,
    marginBottom: 28,
    borderRadius: 2,
    alignSelf: "center"
  },
  errorBoxWrapper: {
    height: 48,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 0,
    overflow: 'hidden',
  },
  errorBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    minHeight: 28,
    justifyContent: 'center',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center'
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: 320,
    height: 48,
  },
  input: {
    flex: 1,
    color: "#333",
    fontSize: 16,
  },
  inputIcon: {
    marginLeft: 8,
  },
  forgotPasswordContainer: {
    width: 320,
    alignItems: "flex-end",
    marginBottom: 18,
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.85,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E15A2D",
    borderRadius: 5,
    paddingVertical: 12,
    width: 320,
    justifyContent: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerLink: {
    color: "#fff",
    fontSize: 15,
    marginTop: 10,
    opacity: 0.85,
    textAlign: "center",
  },
  registerLinkUnderline: {
    textDecorationLine: "underline",
    color: "#fff",
  },
  shadowBackground: {
    width: "90%",
    maxWidth: 600,
    height: 150,
    backgroundColor: "#0A2342",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignSelf: "center",
    marginTop: -60,
    zIndex: 0,
  },
});