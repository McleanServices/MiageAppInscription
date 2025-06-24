import React, { useState } from "react";
import {
 View,
 Text,
 StyleSheet,
 TouchableOpacity,
 ScrollView,
 Alert,
 TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

// --- ChampTexte ---
const ChampTexte = ({ label, value, onChangeText, placeholder, multiline = false }: { 
 label: string, 
 value: string, 
 onChangeText: (text: string) => void, 
 placeholder: string,
 multiline?: boolean 
}) => (
 <View style={styles.champContainer}>
 <Text style={styles.champLabel}>{label}</Text>
 <TextInput
 style={[styles.champInput, multiline && styles.champInputMultiline]}
 value={value}
 onChangeText={onChangeText}
 placeholder={placeholder}
 multiline={multiline}
 numberOfLines={multiline ? 3 : 1}
 />
 </View>
);

// --- ChampDate ---
const ChampDate = ({ label, value, onChangeText, placeholder }: { 
 label: string, 
 value: string, 
 onChangeText: (text: string) => void, 
 placeholder: string 
}) => (
 <View style={styles.champContainer}>
 <Text style={styles.champLabel}>{label}</Text>
 <TextInput
 style={styles.champInput}
 value={value}
 onChangeText={onChangeText}
 placeholder={placeholder}
 keyboardType="numeric"
 />
 </View>
);

// --- ChampCompétences ---
const ChampCompétences = ({ label, value, onChangeText, placeholder }: { 
 label: string, 
 value: string, 
 onChangeText: (text: string) => void, 
 placeholder: string 
}) => (
 <View style={styles.champContainer}>
 <Text style={styles.champLabel}>{label}</Text>
 <TextInput
 style={[styles.champInput, styles.champInputMultiline]}
 value={value}
 onChangeText={onChangeText}
 placeholder={placeholder}
 multiline
 numberOfLines={4}
 />
 </View>
);

// --- TableauExpériences ---
const TableauExpériences = ({ experiences, onDelete }: { 
 experiences: any[], 
 onDelete: (index: number) => void 
}) => (
 <View style={styles.tableauContainer}>
 <Text style={styles.tableauTitre}>Expériences professionnelles</Text>
 {experiences.length === 0 ? (
 <Text style={styles.emptyText}>Aucune expérience ajoutée</Text>
 ) : (
 experiences.map((experience, index) => (
 <View key={index} style={styles.experienceItem}>
 <View style={styles.experienceHeader}>
 <MaterialIcons name="work" size={20} color="#1686B0" />
 <Text style={styles.experienceTitre}>{experience.poste}</Text>
 <TouchableOpacity onPress={() => onDelete(index)}>
 <Ionicons name="trash-outline" size={20} color="#E53935" />
 </TouchableOpacity>
 </View>
 <View style={styles.experienceDetails}>
 <Text style={styles.experienceDetail}>Entreprise: {experience.entreprise}</Text>
 <Text style={styles.experienceDetail}>Période: {experience.dateDebut} - {experience.dateFin}</Text>
 <Text style={styles.experienceDetail}>Type: {experience.type}</Text>
 {experience.description && (
 <Text style={styles.experienceDetail}>Description: {experience.description}</Text>
 )}
 {experience.competences && (
 <Text style={styles.experienceDetail}>Compétences: {experience.competences}</Text>
 )}
 {experience.projets && (
 <Text style={styles.experienceDetail}>Projets: {experience.projets}</Text>
 )}
 </View>
 </View>
 ))
 )}
 </View>
);

// --- BoutonAjouterExpérience ---
const BoutonAjouterExpérience = ({ onPress }: { onPress: () => void }) => (
 <TouchableOpacity style={styles.ajouterBtn} onPress={onPress}>
 <Ionicons name="add-circle" size={24} color="#fff" />
 <Text style={styles.ajouterBtnText}>Ajouter une expérience</Text>
 </TouchableOpacity>
);

// --- BoutonSoumettre ---
const BoutonSoumettre = ({ onPress, disabled }: { onPress: () => void, disabled: boolean }) => (
 <TouchableOpacity 
 style={[styles.validationBtn, disabled && styles.validationBtnDisabled]} 
 onPress={onPress}
 disabled={disabled}
 >
 <Ionicons name="checkmark-circle" size={24} color="#fff" />
 <Text style={styles.validationBtnText}>Soumettre le formulaire</Text>
 </TouchableOpacity>
);

// --- NotificationErreurValidation ---
const NotificationErreurValidation = ({ visible, message }: { visible: boolean, message: string }) => {
 if (!visible) return null;
 
 return (
 <View style={styles.errorContainer}>
 <Ionicons name="warning" size={20} color="#E53935" />
 <Text style={styles.errorText}>{message}</Text>
 </View>
 );
};

// --- Main Page ---
export default function Fiche() {
 const [fontsLoaded] = useFonts({
 Poppins_400Regular,
 Poppins_700Bold,
 });
 
 const [showError, setShowError] = useState(false);
 const [errorMessage, setErrorMessage] = useState("");
 const [showSuccess, setShowSuccess] = useState(false);
 const [currentView, setCurrentView] = useState<'form' | 'success'>('form');

 // État du formulaire parcours professionnel
 const [formData, setFormData] = useState({
 secteurActivite: "",
 anneesExperience: "",
 competencesPrincipales: "",
 objectifsProfessionnels: "",
 });

 const [experiences, setExperiences] = useState<any[]>([]);
 const [nouvelleExperience, setNouvelleExperience] = useState({
 poste: "",
 entreprise: "",
 dateDebut: "",
 dateFin: "",
 type: "",
 description: "",
 competences: "",
 projets: "",
 });

 if (!fontsLoaded) return null;

 const handleAjouterExperience = () => {
 if (!nouvelleExperience.poste || !nouvelleExperience.entreprise || !nouvelleExperience.dateDebut) {
 setErrorMessage("Veuillez remplir au minimum le poste, l'entreprise et la date de début");
 setShowError(true);
 setTimeout(() => setShowError(false), 3000);
 return;
 }

 setExperiences([...experiences, { ...nouvelleExperience }]);
 setNouvelleExperience({
 poste: "",
 entreprise: "",
 dateDebut: "",
 dateFin: "",
 type: "",
 description: "",
 competences: "",
 projets: "",
 });
 };

 const handleSupprimerExperience = (index: number) => {
 setExperiences(experiences.filter((_, i) => i !== index));
 };

 const handleSoumettre = () => {
 // Validation basique
 const requiredFields = ['secteurActivite', 'anneesExperience'];
 const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
 
 if (missingFields.length > 0) {
 setErrorMessage("Veuillez remplir tous les champs obligatoires");
 setShowError(true);
 setTimeout(() => setShowError(false), 3000);
 return;
 }

 if (experiences.length === 0) {
 setErrorMessage("Veuillez ajouter au moins une expérience professionnelle");
 setShowError(true);
 setTimeout(() => setShowError(false), 3000);
 return;
 }

 // Simulation de soumission réussie
 setShowSuccess(true);
 setTimeout(() => {
 setShowSuccess(false);
 setCurrentView('success');
 }, 2000);
 };

 const isFormValid = formData.secteurActivite && formData.anneesExperience && 
 experiences.length > 0;

 // Vue de succès
 if (currentView === 'success') {
 return (
 <View style={{ flex: 1, backgroundColor: "#fff" }}>
 <View style={styles.successContainer}>
 <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
 <Text style={styles.successTitre}>Formulaire soumis avec succès !</Text>
 <Text style={styles.successMessage}>
 Votre parcours professionnel a été enregistré. 
 Vous recevrez une confirmation par email.
 </Text>
 <TouchableOpacity 
 style={styles.successBtn} 
 onPress={() => setCurrentView('form')}
 >
 <Text style={styles.successBtnText}>Retour au formulaire</Text>
 </TouchableOpacity>
 </View>
 </View>
 );
 }

 // Vue principale (formulaire)
 return (
 <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
 {/* Header */}
 <View style={styles.header}>
 <Text style={styles.headerTitre}>Formulaire de parcours professionnel</Text>
 <Text style={styles.headerSousTitre}>Saisie détaillée de l'expérience professionnelle</Text>
 </View>

 <View style={styles.container}>
 {/* Informations générales */}
 <View style={styles.sectionContainer}>
 <View style={styles.sectionHeader}>
 <MaterialIcons name="business" size={24} color="#1686B0" />
 <Text style={styles.sectionTitre}>Informations générales</Text>
 </View>
 
 <ChampTexte 
 label="Secteur d'activité *" 
 value={formData.secteurActivite} 
 onChangeText={(text) => setFormData({...formData, secteurActivite: text})}
 placeholder="Ex: Informatique, Finance, Marketing..."
 />
 <ChampTexte 
 label="Années d'expérience *" 
 value={formData.anneesExperience} 
 onChangeText={(text) => setFormData({...formData, anneesExperience: text})}
 placeholder="Nombre d'années d'expérience"
 />
 <ChampCompétences 
 label="Compétences principales" 
 value={formData.competencesPrincipales} 
 onChangeText={(text) => setFormData({...formData, competencesPrincipales: text})}
 placeholder="Listez vos compétences principales..."
 />
 <ChampTexte 
 label="Objectifs professionnels" 
 value={formData.objectifsProfessionnels} 
 onChangeText={(text) => setFormData({...formData, objectifsProfessionnels: text})}
 placeholder="Décrivez vos objectifs professionnels..."
 multiline
 />
 </View>

 {/* Expériences professionnelles */}
 <View style={styles.sectionContainer}>
 <View style={styles.sectionHeader}>
 <MaterialIcons name="work" size={24} color="#1686B0" />
 <Text style={styles.sectionTitre}>Expériences professionnelles</Text>
 </View>
 
 <TableauExpériences experiences={experiences} onDelete={handleSupprimerExperience} />
 
 <BoutonAjouterExpérience onPress={handleAjouterExperience} />

 {/* Formulaire d'ajout d'expérience */}
 <View style={styles.experienceForm}>
 <ChampTexte 
 label="Poste occupé *" 
 value={nouvelleExperience.poste} 
 onChangeText={(text) => setNouvelleExperience({...nouvelleExperience, poste: text})}
 placeholder="Ex: Développeur, Chef de projet..."
 />
 <ChampTexte 
 label="Entreprise *" 
 value={nouvelleExperience.entreprise} 
 onChangeText={(text) => setNouvelleExperience({...nouvelleExperience, entreprise: text})}
 placeholder="Nom de l'entreprise"
 />
 <ChampDate 
 label="Date de début *" 
 value={nouvelleExperience.dateDebut} 
 onChangeText={(text) => setNouvelleExperience({...nouvelleExperience, dateDebut: text})}
 placeholder="MM/AAAA"
 />
 <ChampDate 
 label="Date de fin" 
 value={nouvelleExperience.dateFin} 
 onChangeText={(text) => setNouvelleExperience({...nouvelleExperience, dateFin: text})}
 placeholder="MM/AAAA (En cours si vide)"
 />
 <ChampTexte 
 label="Type d'expérience" 
 value={nouvelleExperience.type} 
 onChangeText={(text) => setNouvelleExperience({...nouvelleExperience, type: text})}
 placeholder="Ex: CDI, CDD, Stage, Freelance..."
 />
 <ChampTexte 
 label="Description des missions" 
 value={nouvelleExperience.description} 
 onChangeText={(text) => setNouvelleExperience({...nouvelleExperience, description: text})}
 placeholder="Décrivez vos missions principales..."
 multiline
 />
 <ChampCompétences 
 label="Compétences acquises" 
 value={nouvelleExperience.competences} 
 onChangeText={(text) => setNouvelleExperience({...nouvelleExperience, competences: text})}
 placeholder="Listez les compétences développées..."
 />
 <ChampTexte 
 label="Projets réalisés" 
 value={nouvelleExperience.projets} 
 onChangeText={(text) => setNouvelleExperience({...nouvelleExperience, projets: text})}
 placeholder="Décrivez les projets principaux..."
 multiline
 />
 </View>
 </View>

 {/* Notification d'erreur */}
 <NotificationErreurValidation visible={showError} message={errorMessage} />

 {/* Bouton de soumission */}
 <BoutonSoumettre onPress={handleSoumettre} disabled={!isFormValid} />

 {/* Message d'avertissement */}
 {!isFormValid && (
 <View style={styles.warningContainer}>
 <Ionicons name="warning" size={20} color="#FBC02D" />
 <Text style={styles.warningText}>
 Veuillez remplir tous les champs obligatoires et ajouter au moins une expérience
 </Text>
 </View>
 )}
 </View>
 </ScrollView>
 );
}

// --- Styles ---
const styles = StyleSheet.create({
 header: {
 backgroundColor: "#1686B0",
 paddingTop: 50,
 paddingBottom: 20,
 paddingHorizontal: 20,
 alignItems: "center",
 },
 headerTitre: {
 fontFamily: "Poppins_700Bold",
 fontSize: 24,
 color: "#fff",
 marginBottom: 5,
 },
 headerSousTitre: {
 fontFamily: "Poppins_400Regular",
 fontSize: 14,
 color: "#E3F2FD",
 },
 container: { 
 flex: 1, 
 padding: 20, 
 backgroundColor: "#fff" 
 },
 sectionContainer: {
 backgroundColor: "#F5F5F5",
 borderRadius: 14,
 padding: 16,
 marginBottom: 20,
 },
 sectionHeader: {
 flexDirection: "row",
 alignItems: "center",
 marginBottom: 15,
 },
 sectionTitre: {
 fontFamily: "Poppins_700Bold",
 fontSize: 18,
 color: "#1686B0",
 marginLeft: 10,
 },
 champContainer: {
 marginBottom: 15,
 },
 champLabel: {
 fontFamily: "Poppins_700Bold",
 fontSize: 14,
 color: "#333",
 marginBottom: 5,
 },
 champInput: {
 backgroundColor: "#fff",
 borderRadius: 8,
 padding: 12,
 fontSize: 14,
 fontFamily: "Poppins_400Regular",
 borderWidth: 1,
 borderColor: "#E0E0E0",
 },
 champInputMultiline: {
 height: 80,
 textAlignVertical: "top",
 },
 tableauContainer: {
 backgroundColor: "#fff",
 borderRadius: 8,
 padding: 12,
 marginBottom: 15,
 },
 tableauTitre: {
 fontFamily: "Poppins_700Bold",
 fontSize: 16,
 color: "#1686B0",
 marginBottom: 10,
 },
 emptyText: {
 fontFamily: "Poppins_400Regular",
 fontSize: 14,
 color: "#888",
 textAlign: "center",
 fontStyle: "italic",
 },
 experienceItem: {
 backgroundColor: "#F8F9FA",
 borderRadius: 8,
 padding: 12,
 marginBottom: 10,
 borderLeftWidth: 4,
 borderLeftColor: "#1686B0",
 },
 experienceHeader: {
 flexDirection: "row",
 alignItems: "center",
 justifyContent: "space-between",
 marginBottom: 8,
 },
 experienceTitre: {
 fontFamily: "Poppins_700Bold",
 fontSize: 14,
 color: "#333",
 flex: 1,
 marginLeft: 8,
 },
 experienceDetails: {
 marginLeft: 28,
 },
 experienceDetail: {
 fontFamily: "Poppins_400Regular",
 fontSize: 12,
 color: "#666",
 marginBottom: 2,
 },
 ajouterBtn: {
 backgroundColor: "#1686B0",
 flexDirection: "row",
 alignItems: "center",
 justifyContent: "center",
 borderRadius: 8,
 padding: 12,
 marginBottom: 15,
 },
 ajouterBtnText: {
 color: "#fff",
 fontFamily: "Poppins_700Bold",
 fontSize: 14,
 marginLeft: 8,
 },
 experienceForm: {
 backgroundColor: "#fff",
 borderRadius: 8,
 padding: 12,
 borderWidth: 1,
 borderColor: "#E0E0E0",
 },
 validationBtn: {
 backgroundColor: "#4CAF50",
 flexDirection: "row",
 alignItems: "center",
 justifyContent: "center",
 borderRadius: 12,
 padding: 16,
 marginBottom: 15,
 shadowColor: "#4CAF50",
 shadowOpacity: 0.3,
 shadowRadius: 8,
 elevation: 4,
 },
 validationBtnDisabled: {
 backgroundColor: "#BDBDBD",
 shadowOpacity: 0,
 elevation: 0,
 },
 validationBtnText: {
 color: "#fff",
 fontFamily: "Poppins_700Bold",
 fontSize: 16,
 marginLeft: 8,
 },
 errorContainer: {
 flexDirection: "row",
 alignItems: "center",
 backgroundColor: "#FFEBEE",
 borderRadius: 8,
 padding: 12,
 marginBottom: 15,
 borderLeftWidth: 4,
 borderLeftColor: "#E53935",
 },
 errorText: {
 fontFamily: "Poppins_400Regular",
 fontSize: 12,
 color: "#E53935",
 marginLeft: 8,
 flex: 1,
 },
 warningContainer: {
 flexDirection: "row",
 alignItems: "center",
 backgroundColor: "#FFF8E1",
 borderRadius: 8,
 padding: 12,
 },
 warningText: {
 fontFamily: "Poppins_400Regular",
 fontSize: 12,
 color: "#F57C00",
 marginLeft: 8,
 flex: 1,
 },
 successContainer: {
 flex: 1,
 justifyContent: "center",
 alignItems: "center",
 padding: 40,
 backgroundColor: "#fff",
 },
 successTitre: {
 fontFamily: "Poppins_700Bold",
 fontSize: 24,
 color: "#333",
 marginTop: 20,
 marginBottom: 10,
 textAlign: "center",
 },
 successMessage: {
 fontFamily: "Poppins_400Regular",
 fontSize: 16,
 color: "#666",
 textAlign: "center",
 lineHeight: 24,
 marginBottom: 30,
 },
 successBtn: {
 backgroundColor: "#1686B0",
 paddingHorizontal: 30,
 paddingVertical: 15,
 borderRadius: 8,
 },
 successBtnText: {
 color: "#fff",
 fontFamily: "Poppins_700Bold",
 fontSize: 16,
 },
});