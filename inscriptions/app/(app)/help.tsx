import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSession } from '../../Session/ctx';

const PRIMARY = '#2563EB';
const CIRCLE_INACTIVE = '#e5e7eb';
const TEXT_PRIMARY = '#1e293b';
const TEXT_SECONDARY = '#64748b';

const FAQ = [
  {
    category: 'Dossier de candidature',
    icon: 'document-text-outline',
    questions: [
      {
        q: 'Comment savoir si mon dossier est complet ?',
        a: "Sur la page d'accueil, une barre de progression et des badges vous indiquent les pièces manquantes. Un message d'alerte s'affiche si un élément est incomplet ou non validé.",
      },
      {
        q: 'Quels documents dois-je fournir ?',
        a: "Vous devez fournir : CV, lettre de motivation, relevés de notes, diplôme(s), pièce d'identité, photo d'identité. D'autres pièces peuvent être demandées selon votre profil.",
      },
    ],
  },
  {
    category: 'Dates et délais',
    icon: 'calendar-outline',
    questions: [
      {
        q: 'Quelle est la date limite pour envoyer ma fiche de renseignement ?',
        a: 'La fiche de renseignement doit être remplie avant le 20 juin 2025.',
      },
      {
        q: 'Quand commence la formation ?',
        a: "La rentrée universitaire MIAGE est prévue pour septembre 2025. La date exacte vous sera transmise par l'université.",
      },
    ],
  },
  {
    category: 'Procédure & étapes',
    icon: 'list-circle-outline',
    questions: [
      {
        q: 'Quelles sont les étapes de la candidature ?',
        a: `Remplir la fiche de renseignement\nTrouver une organisation d'accueil (entreprise/service public)\nFaire valider le sujet d'alternance par la MIAGE\nFinaliser l'inscription administrative à l'Université`,
      },
      {
        q: 'Comment faire valider mon sujet ?',
        a: 'Vous devez télécharger et remplir le fichier 3_DossierValidationSujet2025-2026_LICENCE3 et le transmettre à l\'équipe pédagogique via l\'espace dédié.',
      },
    ],
  },
  {
    category: 'Alternance & entreprise',
    icon: 'business-outline',
    questions: [
      {
        q: 'Je n\'ai pas encore d\'entreprise, est-ce bloquant ?',
        a: 'Non, mais votre dossier ne pourra pas être validé sans contrat d\'alternance. Vous pouvez commencer la candidature et chercher une entreprise en parallèle.',
      },
      {
        q: 'Est-ce que l\'université m\'aide à trouver une entreprise ?',
        a: 'Oui, des entretiens avec des entreprises partenaires sont organisés. Mentionnez vos préférences dans la fiche de renseignement.',
      },
    ],
  },
  {
    category: 'Support & technique',
    icon: 'chatbubbles-outline',
    questions: [
      {
        q: 'Je n\'arrive pas à envoyer un fichier, que faire ?',
        a: 'Vérifiez que le fichier est en format PDF, moins de 10 Mo. Si le problème persiste, contactez l\'assistance via le bouton "Support".',
      },
      {
        q: 'Je veux modifier une information déjà envoyée',
        a: 'Vous pouvez modifier votre fiche ou vos documents tant que le statut du dossier est "En cours". Une fois validé, contactez le Bureau MIAGE.',
      },
    ],
  },
];

export default function HelpScreen() {
  const [selected, setSelected] = useState<{cat: number, q: number} | null>(null);
  const { signOut, user } = useSession();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="help-circle-outline" size={28} color={PRIMARY} style={{ marginRight: 10 }} />
          <Text style={styles.title}>Aide intelligente / Chatbot</Text>
        </View>
        {FAQ.map((cat, catIdx) => (
          <View key={cat.category} style={styles.categoryBlock}>
            <View style={styles.categoryHeader}>
              <Ionicons name={cat.icon as any} size={20} color={PRIMARY} style={{ marginRight: 6 }} />
              <Text style={styles.categoryTitle}>{cat.category}</Text>
            </View>
            {cat.questions.map((q, qIdx) => (
              <View key={q.q} style={styles.questionBlock}>
                <TouchableOpacity
                  style={styles.questionRow}
                  activeOpacity={0.7}
                  onPress={() => setSelected(selected && selected.cat === catIdx && selected.q === qIdx ? null : {cat: catIdx, q: qIdx})}
                >
                  <Ionicons name="help-circle-outline" size={18} color={PRIMARY} style={{ marginRight: 6 }} />
                  <Text style={styles.question}>{q.q}</Text>
                </TouchableOpacity>
                {selected && selected.cat === catIdx && selected.q === qIdx && (
                  <Animated.View
                    entering={FadeIn.duration(350)}
                    exiting={FadeOut.duration(200)}
                    style={styles.answerBlock}
                  >
                    <Text style={styles.answer}>{q.a}</Text>
                  </Animated.View>
                )}
              </View>
            ))}
          </View>
        ))}
        
        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={24} color={TEXT_SECONDARY} />
            <Text style={styles.userText}>
              {user ? `${user.prenom} ${user.nom}` : 'Utilisateur'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    shadowColor: PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
    maxWidth: 440,
    marginTop: 32,
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  categoryBlock: {
    marginBottom: 18,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryTitle: {
    fontSize: 15,
    color: PRIMARY,
    fontWeight: 'bold',
  },
  questionBlock: {
    marginBottom: 8,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CIRCLE_INACTIVE,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  question: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontWeight: '500',
  },
  answerBlock: {
    padding: 12,
    backgroundColor: '#f4f8fd',
    borderRadius: 8,
    marginTop: 2,
  },
  answer: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    lineHeight: 20,
  },
  logoutSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: CIRCLE_INACTIVE,
  },
  logoutDivider: {
    height: 1,
    backgroundColor: CIRCLE_INACTIVE,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userText: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontWeight: '500',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
    marginLeft: 8,
  },
}); 