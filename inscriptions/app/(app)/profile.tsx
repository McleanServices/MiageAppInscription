import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#2563EB";
const SECONDARY = "#3B82F6";
const CTA = "#E15A2D";
const CARD_BG = "#fff";
const PASTEL_BG = "#F8FAFC";
const CIRCLE_DONE = "#10B981";
const CIRCLE_ACTIVE = PRIMARY;
const CIRCLE_INACTIVE = "#e5e7eb";
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#64748b";

const USER = {
  name: "Jean Dupont",
  avatar: require("../../assets/images/miage-logo.png"),
};

const ETAPES = [
  { label: "Infos", icon: "person" },
  { label: "Docs", icon: "document-text" },
  { label: "Récap", icon: "list" },
  { label: "Statut", icon: "checkmark-done" },
  { label: "Validation", icon: "checkmark-circle" },
];

function getEtapeActuelle(statut: string) {
  switch (statut) {
    case "Dépôt":
      return 1;
    case "En analyse":
      return 3;
    case "Accepté":
    case "Refusé":
      return 4;
    case "Validé":
      return 5;
    default:
      return 0;
  }
}

export default function Profile() {
  const statut = "En analyse";
  const etapeActuelle = getEtapeActuelle(statut) - 1;
  const actions = [
    { icon: "upload-file" as const, titre: "Document déposé", date: "12/06/2024", color: PRIMARY },
    { icon: "check-circle" as const, titre: "Compte créé", date: "08/06/2024", color: CIRCLE_DONE },
  ];

  // Calculate progress
  const totalEtapes = 4;
  const currentEtape = 3; // Example: 3 out of 4 validated
  const percent = Math.round((currentEtape / totalEtapes) * 100);

  const [chatbotVisible, setChatbotVisible] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: PASTEL_BG }} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image source={USER.avatar} style={styles.avatar} />
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{USER.name}</Text>
            <Text style={styles.profileSubtitle}>Candidature MIAGE L3 – Année 2025–2026</Text>
          </View>
        </View>
      </View>

      {/* Global Progress Bar */}
      <View style={styles.globalProgressSection}>
        <View style={styles.progressBarLabelRow}>
          <Text style={styles.progressBarLabel}>{percent} % complété</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.progressBarStepText}>Étape {currentEtape} sur {totalEtapes} validée</Text>
      </View>

      {/* Checklist dynamique / widgets de statut */}
      <View style={styles.checklistSection}>
        <Text style={styles.checklistSectionTitle}>Checklist de votre dossier</Text>
        {/* Fiche de renseignement */}
        <View style={[styles.checklistCard, { borderLeftColor: PRIMARY, borderLeftWidth: 5 }]}> 
          <View style={styles.checklistLeft}>
            <Ionicons name="document-text-outline" size={32} color={PRIMARY} style={{ marginRight: 14 }} />
            <View>
              <Text style={styles.checklistTitle}>Fiche de renseignement</Text>
              <Text style={styles.checklistStatus}>Complétée</Text> {/* Or "À remplir" */}
            </View>
          </View>
          <TouchableOpacity style={styles.checklistBtn} activeOpacity={0.8}>
            <Ionicons name="chevron-forward-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Sujet d&apos;apprentissage */}
        <View style={[styles.checklistCard, { borderLeftColor: PRIMARY, borderLeftWidth: 5 }]}> 
          <View style={styles.checklistLeft}>
            <Ionicons name="business-outline" size={32} color={PRIMARY} style={{ marginRight: 14 }} />
            <View>
              <Text style={styles.checklistTitle}>Sujet d&apos;apprentissage</Text>
              <Text style={styles.checklistStatus}>En attente de validation</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.checklistBtn} activeOpacity={0.8}>
            <Ionicons name="chevron-forward-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Documents déposés */}
        <View style={[styles.checklistCard, { borderLeftColor: PRIMARY, borderLeftWidth: 5 }]}> 
          <View style={styles.checklistLeft}>
            <Ionicons name="attach" size={32} color={PRIMARY} style={{ marginRight: 14 }} />
            <View>
              <Text style={styles.checklistTitle}>Documents déposés</Text>
              <Text style={styles.checklistStatus}>3/7 pièces validées</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.checklistBtn} activeOpacity={0.8}>
            <Ionicons name="chevron-forward-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Statut Card */}
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="document-text-outline" size={28} color={PRIMARY} />
          <Text style={styles.cardTitle}>Statut du dossier</Text>
        </View>
        <Text style={[styles.statutValue, { color: PRIMARY }]}>{statut}</Text>
      </View>

      {/* Historique Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Historique des actions</Text>
        {actions.map((a, idx) => (
          <View key={idx} style={styles.historiqueItem}>
            <MaterialIcons name={a.icon} size={22} color={a.color} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.historiqueAction}>{a.titre}</Text>
              <Text style={styles.historiqueDate}>{a.date}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Floating Chatbot Button */}
      <TouchableOpacity
        style={styles.fabChatbot}
        activeOpacity={0.85}
        onPress={() => setChatbotVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Chatbot Modal Overlay */}
      {chatbotVisible && (
        <View style={styles.chatbotModalOverlay}>
          <View style={styles.chatbotModalCard}>
            <View style={styles.chatbotHeader}>
              <Ionicons name="chatbubbles-outline" size={22} color={PRIMARY} style={{ marginRight: 8 }} />
              <Text style={styles.chatbotTitle}>Aide intelligente / Chatbot</Text>
            </View>
            <View style={styles.chatbotFaqBlock}>
              <View style={styles.chatbotQuestionRow}>
                <Ionicons name="help-circle-outline" size={18} color={PRIMARY} style={{ marginRight: 6 }} />
                <Text style={styles.chatbotQuestion}>Quels documents dois-je fournir ?</Text>
              </View>
              <View style={styles.chatbotAnswerBlock}>
                <Text style={styles.chatbotAnswer}>
                  Vous devez fournir : CV, lettre de motivation, relevés de notes, diplôme(s), pièce d&apos;identité, photo d&apos;identité. D&apos;autres pièces peuvent être demandées selon votre profil.
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chatbotCloseBtn} onPress={() => setChatbotVisible(false)}>
              <Text style={styles.chatbotCloseBtnText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 12,
    backgroundColor: PASTEL_BG,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    backgroundColor: "#e0e0e0",
  },
  greeting: {
    fontSize: 15,
    color: TEXT_SECONDARY,
  },
  userName: {
    fontSize: 20,
    color: TEXT_PRIMARY,
    fontWeight: "bold",
  },
  profileSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginTop: 2,
    fontWeight: "500",
  },
  globalProgressSection: {
    marginBottom: 18,
    marginTop: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  progressBarLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressBarLabel: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    fontWeight: "bold",
  },
  progressBarBg: {
    height: 12,
    backgroundColor: CIRCLE_INACTIVE,
    borderRadius: 6,
    overflow: "hidden",
    width: '100%',
    maxWidth: 320,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: CIRCLE_DONE,
  },
  progressBarStepText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginTop: 2,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 18,
    shadowColor: PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 6,
  },
  statutValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 4,
    color: PRIMARY,
  },
  historiqueItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  historiqueAction: {
    fontSize: 15,
    color: TEXT_PRIMARY,
    fontWeight: "500",
  },
  historiqueDate: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  checklistSection: {
    flexDirection: "column",
    marginHorizontal: 20,
    marginBottom: 18,
    padding: 18,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    shadowColor: PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  checklistSectionTitle: {
    fontSize: 18,
    color: TEXT_PRIMARY,
    fontWeight: "bold",
    marginBottom: 18,
  },
  checklistCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 18,
    shadowColor: PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  checklistLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  checklistTitle: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontWeight: "bold",
  },
  checklistStatus: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  checklistBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 7,
    marginLeft: 12,
  },
  chatbotCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 18,
    shadowColor: PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  chatbotHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  chatbotTitle: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontWeight: "bold",
  },
  chatbotFaqBlock: {
    marginBottom: 12,
  },
  chatbotQuestionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  chatbotQuestion: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontWeight: "500",
  },
  chatbotAnswerBlock: {
    padding: 12,
    backgroundColor: CIRCLE_INACTIVE,
    borderRadius: 8,
  },
  chatbotAnswer: {
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  fabChatbot: {
    position: "absolute",
    bottom: 32,
    right: 24,
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 28,
    zIndex: 100,
    elevation: 10,
    shadowColor: PRIMARY,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  chatbotModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 200,
  },
  chatbotModalCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  chatbotCloseBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: PRIMARY,
  },
  chatbotCloseBtnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});