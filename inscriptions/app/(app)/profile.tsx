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
import { useSession, useUserData } from "../../Session/ctx";

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
  const { signOut, token } = useSession();
  const { user, isLoading, refreshUserData } = useUserData();
  const [refreshing, setRefreshing] = useState(false);
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

  const handleLogout = () => {
    signOut();
  };

  const handleRefreshUserData = async () => {
    setRefreshing(true);
    try {
      refreshUserData();
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Get user display name with better fallback handling
  const getUserDisplayName = () => {
    if (isLoading) return "Chargement...";
    
    if (user?.nom && user?.prenom) {
      return `${user.prenom} ${user.nom}`;
    } else if (user?.nom) {
      return user.nom;
    } else if (user?.prenom) {
      return user.prenom;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return "Utilisateur";
  };

  // Show loading state if user data is being loaded
  if (isLoading) {
    return (
      <View style={[styles.card, { margin: 20, alignItems: 'center' }]}>
        <Text style={styles.cardTitle}>Chargement des données utilisateur...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: PASTEL_BG }} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image source={require("../../assets/images/miage-logo.png")} style={styles.avatar} />
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{getUserDisplayName()}</Text>
            <Text style={styles.profileSubtitle}>Candidature MIAGE L3 – Année 2025–2026</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: '#f0f9ff' }]} 
            onPress={handleRefreshUserData}
            disabled={refreshing}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={refreshing ? "refresh" : "refresh-outline"} 
              size={20} 
              color={PRIMARY} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={24} color={CTA} />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info Card with enhanced data display */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.cardTitle}>Informations utilisateur</Text>
          {refreshing && (
            <Text style={[styles.userInfoLabel, { color: PRIMARY }]}>Actualisation...</Text>
          )}
        </View>
        
        {user ? (
          <>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>ID:</Text>
              <Text style={styles.userInfoValue}>{user.id}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Email:</Text>
              <Text style={styles.userInfoValue}>{user.email}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Nom:</Text>
              <Text style={styles.userInfoValue}>{user.nom || "Non renseigné"}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Prénom:</Text>
              <Text style={styles.userInfoValue}>{user.prenom || "Non renseigné"}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Rôle:</Text>
              <Text style={styles.userInfoValue}>{user.role || "Non défini"}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Type:</Text>
              <Text style={styles.userInfoValue}>{user.type || "Non défini"}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Token:</Text>
              <Text style={styles.userInfoValue} numberOfLines={1} ellipsizeMode="tail">
                {token ? `${token.substring(0, 20)}...` : "Non disponible"}
              </Text>
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={[styles.userInfoLabel, { textAlign: 'center' }]}>
              Aucune donnée utilisateur disponible
            </Text>
            <TouchableOpacity 
              style={[styles.checklistBtn, { marginTop: 10 }]} 
              onPress={handleRefreshUserData}
            >
              <Text style={{ color: '#fff', fontSize: 12 }}>Actualiser</Text>
            </TouchableOpacity>
          </View>
        )}
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
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
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
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  userInfoLabel: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontWeight: "bold",
    width: 80,
    marginRight: 8,
  },
  userInfoValue: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    flex: 1,
  },
});