import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins/';
import { useFonts } from '@expo-google-fonts/poppins/useFonts';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image // <-- Add Image import
} from "react-native";

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
    icon: require('../../../assets/icons/school.png'), // <-- Use image
  },
  {
    titre: "Étape 2 – Recherche de structure",
    desc: "Trouvez une entreprise ou service public prêt à vous accueillir en apprentissage pour la L3 MIAGE",
    cta: null,
    icon: require('../../../assets/icons/school.png'),
  },
  {
    titre: "Étape 3 – Validation du sujet",
    desc: "Soumettez votre sujet proposé par l'organisation pour validation MIAGE",
    cta: {
      label: "3_DossierValidationSujet2025‑2026_LICENCE3",
      url: "#",
    },
    icon: require('../../../assets/icons/school.png'),
  },
  {
    titre: "Étape 4 – Inscription administrative",
    desc: "Inscription sur → Université des Antilles puis dépôt :\n• dossier de candidature + notice individuelle entretien (Étape 1)\n• dossier de validation du sujet (Étape 3)",
    cta: null,
    link: "https://www.univ-antilles.fr/",
    icon: require('../../../assets/icons/school.png'),
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

  if (!fontsLoaded) return null;

  return (
    <View style={styles.duoContainer}>
      {/* Header */}
      <View style={styles.duoHeader}>
        <Text style={styles.duoTitle}>Inscription MIAGE</Text>
        <Text style={styles.duoSubtitle}>Campagne 2025‑2026</Text>
      </View>
      {/* Steps Path */}
      <View style={styles.duoPathContainer}>
        {ETAPES.map((etape, idx) => (
          <View key={idx} style={styles.duoStepRow}>
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
                style={{ width: 28, height: 28 }}
                resizeMode="contain"
              />
              {idx < etapeRealisee && (
                <View style={styles.duoCheck}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
              {idx === etapeRealisee && (
                <Text style={styles.duoStepLabel}>START</Text>
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
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              )}
              {/* Link only for current step */}
              {etape.link && idx === etapeRealisee && (
                <TouchableOpacity
                  style={styles.duoLinkBtn}
                  onPress={() => Linking.openURL(etape.link)}
                >
                  <Ionicons name="link" size={16} color={PRIMARY} />
                  <Text style={styles.duoLinkText}>{etape.link}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  duoContainer: {
    flex: 1,
    backgroundColor: LIGHT_BG,
    alignItems: "center",
    minHeight: 600,
    paddingVertical: 32,
  },
  duoHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  duoTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  duoSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: TEXT_SECONDARY,
  },
  duoPathContainer: {
    width: 420,
    alignItems: "center",
  },
  duoStepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
    minHeight: 120,
    position: "relative",
  },
  duoConnector: {
    position: "absolute",
    left: 32,
    top: -16,
    width: 4,
    height: 32,
    backgroundColor: "#e5e7eb",
    zIndex: 0,
    borderRadius: 2,
  },
  duoStepCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CIRCLE_BG,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 24,
    marginTop: 16,
    position: "relative",
    borderWidth: 3,
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
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  duoStepUrgent: {
    backgroundColor: CIRCLE_URGENT,
    borderColor: "#fff",
  },
  duoCheck: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#22c55e",
    borderRadius: 10,
    padding: 2,
  },
  duoStepLabel: {
    position: "absolute",
    bottom: -18,
    left: "50%",
    transform: [{ translateX: -20 }],
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins_700Bold",
    backgroundColor: "#64748b",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: "hidden",
  },
  duoStepInfo: {
    flex: 1,
    marginTop: 16,
    marginBottom: 24,
  },
  duoStepTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  duoStepDate: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#f87171",
    marginBottom: 2,
  },
  duoStepDesc: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginBottom: 6,
    lineHeight: 18,
  },
  duoCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginTop: 4,
    gap: 6,
  },
  duoCtaText: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
  },
  duoLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  duoLinkText: {
    color: "#2563EB",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    textDecorationLine: "underline",
  },
});