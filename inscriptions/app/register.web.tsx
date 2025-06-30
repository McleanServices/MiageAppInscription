import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from "react";
import ReCAPTCHA from 'react-google-recaptcha';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

const RECAPTCHA_SITE_KEY = '6LfkUXErAAAAAPWRveoLNLfEd9HW_Aob8g6KaU95'; // Replace with your actual site key

export default function RegisterWeb() {
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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = React.useRef<any>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
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
      SplashScreen.hide();
    }
  }, [appIsReady]);

  // Add register handler
  const handleRegister = async () => {
    setError(null);
    setLoading(true);

    // Simple client-side validation for password confirmation
    if (motDePasse !== confirmerMotDePasse) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    // Check for missing fields
    if (!nom || !prenom || !email || !motDePasse) {
      setError('Veuillez remplir tous les champs.');
      setLoading(false);
      return;
    }

    // Check for captcha
    if (!captchaToken) {
      setError('Veuillez compléter le CAPTCHA.');
      setLoading(false);
      return;
    }

    try {
      // 1. Get an idempotency key
      const keyResponse = await fetch('https://sunnysidecode.com/miageconnect/api/generate-idempotency-key');
      if (!keyResponse.ok) {
        setError('Erreur lors de la génération de la clé d\'idempotence.');
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
          type: "Candidate",
          captchaToken,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Erreur inconnue');
        setLoading(false);
        // Optionally reset captcha
        if (recaptchaRef.current) recaptchaRef.current.reset();
        setCaptchaToken(null);
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
      style={styles.outerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        {/* Left Section: Welcome and Login */}
        <View style={styles.leftSection}>
          <Text style={styles.welcomeTitle}>REJOIGNEZ-NOUS!</Text>
          <View style={styles.welcomeUnderline} />
          <Text style={styles.welcomeSubtitle}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/login')}>
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
        {/* Right Section: Register Card */}
        <View style={styles.rightSection}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>CRÉATION COMPTE</Text>
            <View style={styles.titleUnderline} />
            <View style={styles.errorBoxWrapper}>
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText} numberOfLines={2} ellipsizeMode="tail">{error}</Text>
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
                  selectionColor="#E15A2D"
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={[styles.inputContainer, styles.halfInput, { marginLeft: 5 }]}>
                <TextInput
                  placeholder="PRÉNOM"
                  style={styles.input}
                  placeholderTextColor="#555"
                  value={prenom}
                  onChangeText={setPrenom}
                  autoCapitalize="words"
                  selectionColor="#E15A2D"
                  underlineColorAndroid="transparent"
                />
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
                selectionColor="#E15A2D"
                underlineColorAndroid="transparent"
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
                selectionColor="#E15A2D"
                underlineColorAndroid="transparent"
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
                onSubmitEditing={handleRegister}
                selectionColor="#E15A2D"
                underlineColorAndroid="transparent"
              />
              <Ionicons name="lock-closed-outline" size={24} color="#E15A2D" style={styles.inputIcon} />
            </View>

            {/* ReCAPTCHA widget */}
            <View style={{ marginBottom: 18, width: 320, alignItems: 'center' }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(token: string | null) => setCaptchaToken(token)}
                theme="light"
              />
            </View>

            {/* Forgot password - right aligned */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            </View>

            {/* Register button */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
              <Text style={styles.registerButtonText}>
                {loading ? 'Inscription...' : "S'INSCRIRE"}
              </Text>
              <Ionicons name="arrow-forward-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
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
  loginButton: {
    backgroundColor: '#E15A2D',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
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
  formContainer: {
    alignItems: "center",
    width: "90%",
    maxWidth: 600,
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
    ...(Platform.OS === 'web' && {
      borderWidth: 0,
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
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E15A2D",
    borderRadius: 5,
    paddingVertical: 12,
    width: 320,
    justifyContent: "center",
    marginBottom: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    width: 320,
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfInput: {
    width: 155,
    height: 48,
    paddingHorizontal: 10,
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
    