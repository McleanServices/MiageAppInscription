import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Pressable, // <-- add this import
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from '@expo-google-fonts/poppins/useFonts';
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins/';
import { useRouter, Link } from "expo-router";

const PRIMARY = "#1686B0"; // main blue from login
const SECONDARY = "#3CA1D8"; // lighter blue from login title underline
const CTA_ACTIVE = "#E15A2D"; // orange from login
const CTA_DISABLED = "#B0BEC5";
const URGENT = "#E53935";
const PASTEL_BG = "#fff"; // set background to white

const PRENOM = "Prénom"; // TODO: Dynamically fetch user's first name

const ETAPES = [
  {
    titre: "Étape 1 – Fiche de renseignement",
    date: "À déposer au plus tard le 20 juin 2025",
    desc: "Déclarez votre intérêt pour l’apprentissage ; organise les entretiens pédagogiques et avec les entreprises. Ce n’est pas l’inscription administrative à l’Université.",
    cta: {
      label: "Remplir la fiche de renseignement",
      url: "#", // TODO: Replace with actual URL or navigation
    },
    urgent: true,
  },
  {
    titre: "Étape 2 – Recherche de structure",
    desc: "Trouvez une entreprise ou service public prêt à vous accueillir en apprentissage pour la L3 MIAGE",
    cta: null,
  },
  {
    titre: "Étape 3 – Validation du sujet",
    desc: "Soumettez votre sujet proposé par l’organisation pour validation MIAGE",
    cta: {
      label: "3_DossierValidationSujet2025‑2026_LICENCE3",
      url: "#", // TODO: Replace with actual URL
    },
  },
  {
    titre: "Étape 4 – Inscription administrative",
    desc: "Inscription sur → Université des Antilles puis dépôt :\n• dossier de candidature + notice individuelle entretien (Étape 1)\n• dossier de validation du sujet (Étape 3)",
    cta: null,
    link: "https://www.univ-antilles.fr/", // TODO: Replace with actual link if needed
  },
];

export default function Index() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [etapeRealisee, setEtapeRealisee] = useState(0); // 0-based index of last completed step
  const router = useRouter();

  const urgentDue = ETAPES[0].urgent && etapeRealisee < 1;

  if (!fontsLoaded) return null;

  const percent = Math.round((etapeRealisee + 1) / ETAPES.length * 100);

  return (
    <View style={{ flex: 1, backgroundColor: PASTEL_BG }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120, backgroundColor: PASTEL_BG }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.bienvenue}>
            Bienvenue, {PRENOM}
          </Text>
          <Text style={styles.campagne}>
            Campagne d’inscription 2025‑2026 – L3 Informatique parcours MIAGE en apprentissage
          </Text>
        </View>

        {/* Progression */}
        <View style={styles.progressionContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
          </View>
          <Text style={styles.progressionText}>
            Vous êtes à {percent}% (Étape {etapeRealisee + 1} sur 4)
          </Text>
        </View>

        {/* Étapes */}
        <View style={styles.etapesSection}>
          {ETAPES.map((etape, idx) => (
            <View key={idx} style={styles.etapeCard}>
              <View style={styles.etapeHeaderRow}>
                <Text style={styles.etapeTitre}>{etape.titre}</Text>
                {etape.urgent && etapeRealisee < 1 && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText}>Urgent</Text>
                  </View>
                )}
              </View>
              {etape.date && (
                <Text style={styles.etapeDate}>{etape.date}</Text>
              )}
              <Text style={styles.etapeDesc}>{etape.desc}</Text>
              {etape.cta && (
                etape.cta.label === "Remplir la fiche de renseignement" ? (
                  <TouchableOpacity
                    style={styles.etapeCtaBtn}
                    onPress={() => router.push("/file")}
                  >
                    <Text style={styles.etapeCtaText}>{etape.cta.label}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.etapeCtaBtn}
                    onPress={() => {
                      // TODO: Replace with actual download/fill action
                      if (Platform.OS === "web") window.open(etape.cta.url, "_blank");
                      else Linking.openURL(etape.cta.url);
                    }}
                  >
                    <Text style={styles.etapeCtaText}>{etape.cta.label}</Text>
                  </TouchableOpacity>
                )
              )}
              {etape.link && (
                <Text
                  style={styles.etapeLink}
                  onPress={() => Linking.openURL(etape.link)}
                >
                  {etape.link}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      {/* Main CTA removed */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 36,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  bienvenue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: PRIMARY,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  campagne: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  progressionContainer: {
    alignItems: "center",
    marginVertical: 18,
    paddingHorizontal: 20,
  },
  progressBarBg: {
    width: "100%",
    height: 10,
    backgroundColor: "#D0F0E7",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: SECONDARY, // lighter blue
    borderRadius: 8,
  },
  progressionText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: PRIMARY,
    marginTop: 2,
  },
  etapesSection: {
    paddingHorizontal: 16,
    gap: 18,
  },
  etapeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 0,
    shadowColor: PRIMARY, // blue shadow
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  etapeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  etapeTitre: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: PRIMARY,
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: URGENT,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    alignSelf: "flex-start",
  },
  urgentBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  etapeDate: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: URGENT,
    marginBottom: 4,
  },
  etapeDesc: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#333",
    marginBottom: 10,
    marginTop: 2,
  },
  etapeCtaBtn: {
    backgroundColor: CTA_ACTIVE, // orange
    borderRadius: 8,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 2,
    marginBottom: 2,
  },
  etapeCtaText: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    textAlign: "center",
  },
  etapeLink: {
    color: PRIMARY,
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
    marginTop: 6,
    textDecorationLine: "underline",
  },
});