import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSession } from "../../Session/ctx";
import { useDocumentPicker } from '../../utils/hooks/useDocumentPicker';
import { useProfileData } from '../../utils/hooks/useProfileData';

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
  const { signOut } = useSession();
  const { profile, dossierStatus, progress, loading, error, lastUpdated, refresh } = useProfileData();
  const [refreshing, setRefreshing] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const router = useRouter();
  const { existingDocuments, loadingDocuments } = useDocumentPicker();

  // New checklist for required pieces
  const piecesAFournir = [
    { key: 'cv', label: 'CV', icon: 'document-text-outline' as const },
    { key: 'lettre_motivation', label: 'Lettre de motivation', icon: 'document-text-outline' as const },
    { key: 'notes', label: 'Relevés de notes', icon: 'document-text-outline' as const },
    { key: 'diplome', label: 'Diplôme(s)', icon: 'document-text-outline' as const },
    { key: 'identite', label: 'Pièce d\'identité', icon: 'person-outline' as const },
    { key: 'photo', label: 'Photo d\'identité', icon: 'image-outline' as const },
  ];

  // Compute status for each piece
  const getPieceStatus = (key: string) => {
    if (loadingDocuments) return '...';
    return existingDocuments.some(doc => doc.document_type === key) ? 'Déposé' : 'À compléter';
  };
  const completedCount = piecesAFournir.filter(item => getPieceStatus(item.key) === 'Déposé').length;
  const percent = Math.round((completedCount / piecesAFournir.length) * 100);

  const handleLogout = () => signOut();
  const handleRefresh = async () => { setRefreshing(true); await refresh(); setRefreshing(false); };

  const getUserDisplayName = () => {
    if (loading) return 'Chargement...';
    if (profile?.prenom && profile?.nom) return `${profile.prenom} ${profile.nom}`;
    if (profile?.nom) return profile.nom;
    if (profile?.prenom) return profile.prenom;
    if (profile?.email) return profile.email.split('@')[0];
    return 'Utilisateur';
  };

  return (
    <View style={{ flex: 1, backgroundColor: PASTEL_BG }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.headerContainer, { marginBottom: 0 }]}> 
          <View style={styles.headerLeft}>
            <Image source={require('../../assets/images/miage-logo.png')} style={styles.avatar} />
            <View>
              <Text style={styles.greeting}>Bonjour 👋</Text>
              <Text style={styles.userName}>{getUserDisplayName()}</Text>
              <Text style={styles.profileSubtitle}>Candidature MIAGE L3 – 2025–2026</Text>
            </View>
          </View>
        </View>

        {/* Error */}
        {error && (
          <View style={[styles.card, { alignItems: 'center', backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: 1 }]}> 
            <Text style={{ color: CTA, fontWeight: 'bold' }}>Erreur : {error}</Text>
          </View>
        )}

        {/* Pièces à fournir */}
        <View style={styles.checklistSection}>
          <Text style={styles.checklistSectionTitle}>Pièces à fournir</Text>
          {piecesAFournir.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.checklistCard, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderLeftColor: PRIMARY, borderLeftWidth: 5 }]}
              activeOpacity={0.85}
              onPress={() => router.push(`/piece/${item.key}`)}
            >
              <View style={styles.checklistLeft}>
                <Ionicons name={item.icon} size={28} color={PRIMARY} style={{ marginRight: 14 }} />
                <View>
                  <Text style={styles.checklistTitle}>{item.label}</Text>
                  <Text style={{ fontSize: 13, color: getPieceStatus(item.key) === 'Déposé' ? CIRCLE_DONE : CTA, fontWeight: 'bold', marginTop: 2 }}>
                    {getPieceStatus(item.key)}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward-outline" size={22} color={PRIMARY} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Dossier Status */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="document-text-outline" size={24} color={PRIMARY} style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Statut du dossier</Text>
          </View>
          <Text style={[styles.statutValue, { color: PRIMARY, fontSize: 18 }]}>{dossierStatus?.status ? dossierStatus.status.charAt(0).toUpperCase() + dossierStatus.status.slice(1).replace('_', ' ') : 'Non démarré'}</Text>
          {dossierStatus?.date_creation && (
            <Text style={{ fontSize: 12, color: TEXT_SECONDARY, marginTop: 4 }}>Créé le : {new Date(dossierStatus.date_creation).toLocaleDateString()}</Text>
          )}
          {dossierStatus?.date_validation && (
            <Text style={{ fontSize: 12, color: TEXT_SECONDARY }}>Validé le : {new Date(dossierStatus.date_validation).toLocaleDateString()}</Text>
          )}
        </View>
      </ScrollView>
    </View>
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