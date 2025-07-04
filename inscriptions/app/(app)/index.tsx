import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins/';
import { useFonts } from '@expo-google-fonts/poppins/useFonts';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';

// Remove SVG imports
// import BusinessIcon from '../../../assets/icons/business.svg';
// import CheckmarkIcon from '../../../assets/icons/checkmark.svg';
// import DocumentIcon from '../../../assets/icons/document.svg';
// import SchoolIcon from '../../../assets/icons/school.svg';

const PRIMARY = "#2563EB";
const SECONDARY = "#3B82F6";
const CTA_ACTIVE = "#F59E0B";
const CTA_DISABLED = "#9CA3AF";
const URGENT = "#EF4444";
const SUCCESS = "#10B981";
const PASTEL_BG = "#F8FAFC";
const CARD_BG = "#FFFFFF";

const PRENOM = "Prénom";

const ETAPES = [
  {
    titre: "Étape 1 – Fiche de renseignement",
    date: "À déposer au plus tard le 20 juin 2025",
    desc: "Déclarez votre intérêt pour l'apprentissage ; organise les entretiens pédagogiques et avec les entreprises. Ce n'est pas l'inscription administrative à l'Université.",
    cta: {
      label: "Remplir la fiche de renseignement",
      url: "#",
    },
    urgent: true,
    icon: require('../../assets/icons/school.png'), // <-- Use image
  },
  {
    titre: "Étape 2 – Recherche de structure",
    desc: "Trouvez une entreprise ou service public prêt à vous accueillir en apprentissage pour la L3 MIAGE",
    cta: null,
    icon: require('../../assets/icons/school.png'),
  },
  {
    titre: "Étape 3 – Validation du sujet",
    desc: "Soumettez votre sujet proposé par l'organisation pour validation MIAGE",
    cta: {
      label: "3_DossierValidationSujet2025‑2026_LICENCE3",
      url: "#",
    },
    icon: require('../../assets/icons/school.png'),
  },
  {
    titre: "Étape 4 – Inscription administrative",
    desc: "Inscription sur → Université des Antilles puis dépôt :\n• dossier de candidature + notice individuelle entretien (Étape 1)\n• dossier de validation du sujet (Étape 3)",
    cta: null,
    link: "https://www.univ-antilles.fr/",
    icon: require('../../assets/icons/school.png'),
  },
];

const LIGHT_BG = "#fff";
const CIRCLE_BG = "#F3F4F6";
const CIRCLE_DONE = "#10B981";
const CIRCLE_ACTIVE = "#2563EB";
const CIRCLE_URGENT = "#EF4444";
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#64748b";

export default function Index() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });
  const [etapeRealisee, setEtapeRealisee] = useState(0);
  const router = useRouter();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Animation values for each step (hooks must be called at top level)
  const opacity0 = useSharedValue(0);
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);
  const translateY0 = useSharedValue(50);
  const translateY1 = useSharedValue(50);
  const translateY2 = useSharedValue(50);
  const translateY3 = useSharedValue(50);

  const animatedStyle0 = useAnimatedStyle(() => ({
    opacity: opacity0.value,
    transform: [{ translateY: translateY0.value }],
  }));
  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ translateY: translateY1.value }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ translateY: translateY2.value }],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: opacity3.value,
    transform: [{ translateY: translateY3.value }],
  }));

  const opacityValues = [opacity0, opacity1, opacity2, opacity3];
  const translateYValues = [translateY0, translateY1, translateY2, translateY3];
  const animatedStyles = [animatedStyle0, animatedStyle1, animatedStyle2, animatedStyle3];

  // Trigger animations on mount
  useEffect(() => {
    ETAPES.forEach((_, index) => {
      const delay = index * 350; // 350ms delay between each step
      opacityValues[index].value = withDelay(
        delay,
        withTiming(1, { duration: 1000 })
      );
      translateYValues[index].value = withDelay(
        delay,
        withTiming(0, { duration: 1000 })
      );
    });
    // Check biometric status
    const checkBiometrics = async () => {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      setBiometricEnabled(enabled === 'true');
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && isEnrolled);
      if (enabled !== 'true' && hasHardware && isEnrolled) {
        // Show native biometric prompt
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Voulez-vous activer la connexion biométrique pour la prochaine fois ?'
        });
        if (result.success) {
          await AsyncStorage.setItem('biometricEnabled', 'true');
          setBiometricEnabled(true);
        } else {
          await AsyncStorage.setItem('biometricEnabled', 'false');
          setBiometricEnabled(false);
        }
      }
    };
    checkBiometrics();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.duoContainer} contentContainerStyle={styles.duoContentContainer}>
      {/* Header with animation */}
      <Animated.View 
        style={styles.duoHeader}
        entering={FadeInDown.duration(800).delay(100)}
      >
        <Text style={styles.duoTitle}>Inscription MIAGE</Text>
        <Text style={styles.duoSubtitle}>Campagne 2025‑2028</Text>
      </Animated.View>
      
      {/* Steps Path */}
      <View style={styles.duoPathContainer}>
        {ETAPES.map((etape, idx) => (
          <Animated.View 
            key={idx} 
            style={[styles.duoStepRow, animatedStyles[idx]]}
          >
            {/* Connector line */}
            {idx > 0 && <View style={styles.duoConnector} />}
            {/* Step circle */}
            <View
              style={[
                styles.duoStepCircle,
                idx < etapeRealisee && styles.duoStepDone,
                idx === etapeRealisee && styles.duoStepActive,
                etape.urgent && idx === 0 && etapeRealisee < 1 && styles.duoStepUrgent,
              ]}
            >
              <Image
                source={etape.icon}
                style={styles.duoIconImage}
                resizeMode="contain"
              />
              {idx < etapeRealisee && (
                <View style={styles.duoCheck}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </View>
            {/* Step info */}
            <View style={styles.duoStepInfo}>
              <Text style={styles.duoStepTitle}>{etape.titre}</Text>
              {etape.date && (
                <Text style={styles.duoStepDate}>{etape.date}</Text>
              )}
              <Text style={styles.duoStepDesc}>{etape.desc}</Text>
              {/* CTA only for current step */}
              {etape.cta && idx === etapeRealisee && (
                <TouchableOpacity
                  style={styles.duoCtaBtn}
                  onPress={() => {
                    if (etape.cta.label === "Remplir la fiche de renseignement") {
                      router.push("/file");
                    } else {
                      if (Platform.OS === "web") window.open(etape.cta.url, "_blank");
                      else Linking.openURL(etape.cta.url);
                    }
                  }}
                >
                  <Text style={styles.duoCtaText}>{etape.cta.label}</Text>
                  <Ionicons name="arrow-forward" size={14} color="#fff" />
                </TouchableOpacity>
              )}
              {/* Add blue 'Télécharger' button for Validation du sujet (Étape 3) */}
              {etape.titre.includes('Validation du sujet') && (
                <TouchableOpacity
                  style={styles.duoCtaBtn}
                  onPress={() => {
                    const url = 'http://miage-antilles.fr/wp-content/uploads/2025/05/3-DossierValidationSujet2025-2026_LICENCE3.docx';
                    if (Platform.OS === "web") window.open(url, "_blank");
                    else Linking.openURL(url);
                  }}
                >
                  <Text style={styles.duoCtaText}>Télécharger</Text>
                  <Ionicons name="download" size={14} color="#fff" />
                </TouchableOpacity>
              )}
              {/* Link only for current step */}
              {etape.link && idx === etapeRealisee && (
                <TouchableOpacity
                  style={styles.duoLinkBtn}
                  onPress={() => Linking.openURL(etape.link)}
                >
                  <Ionicons name="link" size={14} color={PRIMARY} />
                  <Text style={styles.duoLinkText}>{etape.link}</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  duoContainer: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  duoContentContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
  duoHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  duoTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: width < 375 ? 22 : 26,
    color: TEXT_PRIMARY,
    marginBottom: 4,
    textAlign: 'center',
  },
  duoSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: width < 375 ? 14 : 16,
    color: TEXT_SECONDARY,
    textAlign: 'center',
  },
  duoPathContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  duoStepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
    minHeight: width < 375 ? 100 : 120,
    position: "relative",
    width: '100%',
  },
  duoConnector: {
    position: "absolute",
    left: width < 375 ? 24 : 28,
    top: -16,
    width: 3,
    height: 32,
    backgroundColor: "#e5e7eb",
    zIndex: 0,
    borderRadius: 2,
  },
  duoStepCircle: {
    width: width < 375 ? 48 : 56,
    height: width < 375 ? 48 : 56,
    borderRadius: width < 375 ? 24 : 28,
    backgroundColor: CIRCLE_BG,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginTop: 12,
    position: "relative",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  duoStepDone: {
    backgroundColor: CIRCLE_DONE,
    borderColor: CIRCLE_DONE,
  },
  duoStepActive: {
    backgroundColor: CIRCLE_ACTIVE,
    borderColor: "#fff",
    shadowColor: "#3B82F6",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  duoStepUrgent: {
    backgroundColor: CIRCLE_URGENT,
    borderColor: "#fff",
  },
  duoIconImage: {
    width: width < 375 ? 20 : 24,
    height: width < 375 ? 20 : 24,
  },
  duoCheck: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#22c55e",
    borderRadius: 8,
    padding: 2,
  },
  duoStepLabelContainer: {
    position: "absolute",
    bottom: width < 375 ? -24 : -28,
    left: "50%",
    transform: [{ translateX: -16 }],
  },
  duoStepLabel: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Poppins_700Bold",
    backgroundColor: "#64748b",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: 'center',
  },
  duoStepInfo: {
    flex: 1,
    marginTop: 12,
    marginBottom: 20,
    paddingRight: 8,
  },
  duoStepTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: width < 375 ? 14 : 15,
    color: TEXT_PRIMARY,
    marginBottom: 4,
    lineHeight: width < 375 ? 18 : 20,
  },
  duoStepDate: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: width < 375 ? 11 : 12,
    color: "#f87171",
    marginBottom: 4,
    lineHeight: 16,
  },
  duoStepDesc: {
    fontFamily: "Poppins_400Regular",
    fontSize: width < 375 ? 12 : 13,
    color: TEXT_SECONDARY,
    marginBottom: 8,
    lineHeight: width < 375 ? 16 : 18,
  },
  duoCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginTop: 4,
    gap: 6,
    maxWidth: '100%',
  },
  duoCtaText: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: width < 375 ? 12 : 13,
    flexShrink: 1,
  },
  duoLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
    flexWrap: 'wrap',
  },
  duoLinkText: {
    color: "#2563EB",
    fontFamily: "Poppins_600SemiBold",
    fontSize: width < 375 ? 11 : 12,
    textDecorationLine: "underline",
    flexShrink: 1,
  },
});