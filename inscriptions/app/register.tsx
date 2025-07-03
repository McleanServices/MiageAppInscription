import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';


import { Image } from 'expo-image'; // added import
import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSession } from '../Session/ctx';


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function Register() {
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { signIn } = useSession();
  const [appIsReady, setAppIsReady] = useState(false);

  // Add state for form fields and error
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
    
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 5));
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

  // Add register handler
  const handleRegister = async () => {
    setError(null);
    setLoading(true);

    // Check for missing fields
    if (!nom || !prenom || !email || !motDePasse || !confirmerMotDePasse) {
      setError('Veuillez remplir tous les champs.');
      setLoading(false);
      return;
    }
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer un email valide.');
      setLoading(false);
      return;
    }
    // Simple client-side validation for password confirmation
    if (motDePasse !== confirmerMotDePasse) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      // 1. Get an idempotency key
      const keyResponse = await fetch('https://sunnysidecode.com/miageconnect/api/generate-idempotency-key');
      if (!keyResponse.ok) {
        setError("Erreur lors de la génération de la clé d'idempotence.");
        setLoading(false);
        return;
      }
      const { idempotencyKey } = await keyResponse.json();

      // 2. Use the key in signup request
      const response = await fetch('https://sunnysidecode.com/miageconnect/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          mot_de_passe: motDePasse,
          role: "utilisateur",
          type: "Candidate"
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Erreur inconnue');
        setLoading(false);
        return;
      }
      // Registration successful, optionally auto-login or redirect
      router.replace('/login');
    } catch (err) {
      setError('Impossible de se connecter au serveur. Veuillez réessayer plus tard.');
      setLoading(false);
    }
    setLoading(false);
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.centeredView}>
          {/* Four images above the card */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
            <Image
              source={require('../assets/images/miage-logo.png')}
              style={{ width: 80, height: 80, marginHorizontal: 4 }}
              contentFit="contain"
            />
            <Image
              source={require('../assets/images/miage-logo.png')}
              style={{ width: 80, height: 80, marginHorizontal: 4 }}
              contentFit="contain"
            />
            <Image
              source={require('../assets/images/miage-logo.png')}
              style={{ width: 80, height: 80, marginHorizontal: 4 }}
              contentFit="contain"
            />
            <Image
              source={require('../assets/images/miage-logo.png')}
              style={{ width: 80, height: 80, marginHorizontal: 4 }}
              contentFit="contain"
            />
          </View>
          {/* Card */}
          <View style={styles.card}>
            {/* Title */}
            <Text style={styles.title}>
              CRÉATION COMPTE
            </Text>
            <View style={styles.titleUnderline} />
            {/* Error message (fixed height to prevent bounce) */}
            <View style={styles.errorBoxWrapper}>
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText} numberOfLines={2} ellipsizeMode="tail">
                    {error}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Nom and Prénom inputs side by side */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfInput, { marginRight: 5 }]}>
                <TextInput
                  placeholder="NOM"
                  style={styles.input}
                  placeholderTextColor="#555"
                  value={nom}
                  onChangeText={setNom}
                  autoCapitalize="words"
                />
                <Ionicons name="person-outline" size={24} color="#E15A2D" style={styles.inputIcon} />
              </View>
              <View style={[styles.inputContainer, styles.halfInput, { marginLeft: 5 }]}>
                <TextInput
                  placeholder="PRÉNOM"
                  style={styles.input}
                  placeholderTextColor="#555"
                  value={prenom}
                  onChangeText={setPrenom}
                  autoCapitalize="words"
                />
                <Ionicons name="person-outline" size={24} color="#E15A2D" style={styles.inputIcon} />
              </View>
            </View>

            {/* Email input */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="EMAIL"
                style={styles.input}
                placeholderTextColor="#555"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Ionicons name="mail-outline" size={24} color="#E15A2D" style={styles.inputIcon} />
            </View>

            {/* Mot de passe input */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="MOT DE PASSE"
                style={styles.input}
                placeholderTextColor="#555"
                secureTextEntry
                value={motDePasse}
                onChangeText={setMotDePasse}
              />
              <Ionicons name="lock-closed-outline" size={24} color="#E15A2D" style={styles.inputIcon} />
            </View>

            {/* Confirmer mot de passe input */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="CONFIRMER MOT DE PASSE"
                style={styles.input}
                placeholderTextColor="#555"
                secureTextEntry
                value={confirmerMotDePasse}
                onChangeText={setConfirmerMotDePasse}
              />
              <Ionicons name="lock-closed-outline" size={24} color="#E15A2D" style={styles.inputIcon} />
            </View>

            {/* Forgot password - right aligned */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            </View>

            {/* Login/Register button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Inscription...' : "S'INSCRIRE"}
              </Text>
              <Ionicons name="arrow-forward-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {/* Register link */}
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.registerLink}>
              pas un compte? <Text style={styles.registerLinkUnderline}>inscrire vous</Text>
              </Text>
            </TouchableOpacity>
          </View>
          {/* Shadow background just under the card */}
          <View style={styles.shadowBackground} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 600, // add a fixed minHeight to stabilize vertical position
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
    fontSize: 26, // reduced from 32 to 26
    fontWeight: "bold",
    marginBottom: 0,
    letterSpacing: 1,
    textAlign: "center"
  },
  titleUnderline: {
    width: 160,
    height: 4,
    backgroundColor: "#3CA1D8", // match login: lighter blue
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
  row: {
    flexDirection: "row",
    width: 320,
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfInput: {
    width: 155,
    // Ensure same height and padding as inputContainer
    height: 48,
    paddingHorizontal: 10,
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});