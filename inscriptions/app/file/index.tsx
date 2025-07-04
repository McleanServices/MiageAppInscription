import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import StepHeader from "../../components/StepHeader";
import { useDatePicker } from "../../utils/hooks/useDatePicker";
import { useDocumentPicker } from "../../utils/hooks/useDocumentPicker";
import { useExperienceForm } from "../../utils/hooks/useExperienceForm";
import { useFormData } from "../../utils/hooks/useFormData";
import { useLocationData } from "../../utils/hooks/useLocationData";

// Couleurs principales
const mainBlue = "#1A2341";
const mainViolet = "#7B61FF";
const mainOrange = "#A3471B";
const lightGray = "#F5F5F5";
const borderGray = "#D9D9D9";

const PAGES = [
  { key: "infos", label: "Mes informations personnelles" },
  { key: "coordonnees", label: "Mes coordonnées" },
  { key: "cv", label: "Mon curriculum vitae (CV)" },
  { key: "parcours", label: "Mon parcours post-baccalauréat" },
  { key: "notes", label: "Mes relevés de notes" },
  { key: "experiences", label: "Mes expériences professionnelles" },
  { key: "justificatifs", label: "Autres documents justificatifs" },
];

export default function InscriptionScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const [civilite, setCivilite] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nomUsage, setNomUsage] = useState("");
  const [notesOption, setNotesOption] = useState<string>("");
  const [diplomeFrancais, setDiplomeFrancais] = useState<string>("");
  const [niveauPostBac, setNiveauPostBac] = useState<string>("");
  const [showNiveauModal, setShowNiveauModal] = useState(false);
  const [dateInput, setDateInput] = useState("");
  
  // Contact info state variables
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [codePostal, setCodePostal] = useState("");
  
  // Add local state for address fields that should not be overwritten by location hook
  const [adresse, setAdresse] = useState("");

  // Add a flag to track if data has been loaded initially
  const [dataLoaded, setDataLoaded] = useState(false);

  // Use custom hooks
  const { loading, error, setError, fetchPersonalInfo, savePersonalInfo, fetchContactInfo, saveContactInfo, fetchAcademicBackground, saveAcademicBackground, fetchExperiences, saveExperience } = useFormData();
  
  const { cvFile, notesFile, justificatifsFile, uploading, uploadSuccess, uploadError, existingDocuments, loadingDocuments, documentError, downloadingFile, deleteDocument, downloadDocument, getDocumentsByType, handleImportCV, handleImportNotes, handleImportJustificatifs, clearCvFile, clearNotesFile, clearJustificatifsFile, retryUpload, clearMessages } = useDocumentPicker();
  
  const { experiences, setExperiences, showExperienceForm, setShowExperienceForm, editingExperience, currentExperience, setCurrentExperience, aucuneExperience, addExperience, editExperience, deleteExperience, cancelExperienceForm, handleAucuneExperience } = useExperienceForm();
  
  const { selectedDate, setSelectedDate, showDatePicker, setShowDatePicker, handleDateChange, confirmIOSDate, formatDate } = useDatePicker();
  
  const { countryInput, setCountryInput, showCountrySuggestions, setShowCountrySuggestions, filteredCountries, handleCountryInputChange, selectCountry, departmentInput, setDepartmentInput, showDepartmentSuggestions, setShowDepartmentSuggestions, filteredDepartments, handleDepartmentInputChange, selectDepartment, birthCityInput, setBirthCityInput, showBirthCitySuggestions, setShowBirthCitySuggestions, filteredBirthCities, handleBirthCityInputChange, selectBirthCity, currentCityInput, setCurrentCityInput, showCurrentCitySuggestions, setShowCurrentCitySuggestions, filteredCurrentCities, handleCurrentCityInputChange, selectCurrentCity } = useLocationData();

  // Prefill form with API data on mount - only once
  useEffect(() => {
    if (dataLoaded) return; // Prevent multiple API calls
    
    const fetchAll = async () => {
      try {
        // Personal info
        const personalData = await fetchPersonalInfo();
        if (personalData) {
          setCivilite(personalData.civilite || "");
          setNom(personalData.nom_naissance || "");
          setPrenom(personalData.prenom || "");
          setNomUsage(personalData.nom_usage || "");
          if (personalData.date_naissance) setSelectedDate(new Date(personalData.date_naissance));
          
          // Only set location data if user hasn't started typing
          if (!countryInput) setCountryInput(personalData.pays_naissance || "");
          if (!departmentInput) setDepartmentInput(personalData.departement_naissance || "");
          if (!birthCityInput) setBirthCityInput(personalData.ville_naissance || "");
        }

        // Contact info
        const contactData = await fetchContactInfo();
        if (contactData) {
          setEmail(contactData.email || "");
          setTelephone(contactData.telephone || "");
          setCodePostal(contactData.code_postal || "");
          setAdresse(contactData.adresse || "");
          if (!currentCityInput) setCurrentCityInput(contactData.ville || "");
        }

        // Academic background
        const acadData = await fetchAcademicBackground();
        if (acadData) {
          setDiplomeFrancais(acadData.diplome_francais ? "oui" : "non");
        }

        // Experiences
        const expData = await fetchExperiences();
        setExperiences(expData);
        
        setDataLoaded(true); // Mark data as loaded
        
        // Initialize date input with formatted date
        setDateInput(formatDate(selectedDate));
      } catch (e) {
        setError("Erreur lors du chargement des données.");
      }
    };
    fetchAll();
  }, []); // Empty dependency array - only run once

  // Navigation
  const goNext = () => {
    if (currentPage < PAGES.length - 1) setCurrentPage(currentPage + 1);
  };
  const goPrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  // Save handlers
  const handleSavePersonalInfo = async () => {
    const success = await savePersonalInfo({
      civilite,
      nom_naissance: nom,
      prenom,
      nom_usage: nomUsage,
      date_naissance: selectedDate.toISOString().slice(0, 10),
      pays_naissance: countryInput,
      departement_naissance: departmentInput,
      ville_naissance: birthCityInput,
    });
    if (success) {
      alert("Informations personnelles enregistrées !");
    }
  };

  const handleSaveContactInfo = async () => {
    const success = await saveContactInfo({
      email,
      telephone,
      code_postal: codePostal,
      adresse,
      ville: currentCityInput,
    });
    if (success) {
      alert("Coordonnées enregistrées !");
    }
  };

  const handleSaveAcademicBackground = async () => {
    const success = await saveAcademicBackground({
      diplome_francais: diplomeFrancais === "oui",
    });
    if (success) {
      alert("Parcours académique enregistré !");
    }
  };

  function renderDateNaissancePicker() {
    const handleDateChange = (text: string) => {
      // Remove any non-numeric characters except /
      let cleanedText = text.replace(/[^0-9]/g, '');
      
      // Add / separators automatically
      let formattedText = '';
      for (let i = 0; i < cleanedText.length && i < 8; i++) {
        if (i === 2 || i === 4) {
          formattedText += '/';
        }
        formattedText += cleanedText[i];
      }
      
      setDateInput(formattedText);
      
      // Try to parse the date
      const dateParts = formattedText.split('/');
      if (dateParts.length === 3 && dateParts[2].length === 4) {
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
        const year = parseInt(dateParts[2]);
        
        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
            day >= 1 && day <= 31 && month >= 0 && month <= 11 && 
            year >= 1900 && year <= new Date().getFullYear()) {
          const newDate = new Date(year, month, day);
          setSelectedDate(newDate);
        }
      }
    };

    return (
      <>
        <Text style={styles.label}>Date de naissance *</Text>
        <TextInput
          style={styles.input}
          placeholder="JJ/MM/AAAA"
          value={dateInput}
          onChangeText={handleDateChange}
          keyboardType="numeric"
          maxLength={10}
        />
        <Text style={styles.dateFormatHint}>
          Format: JJ/MM/AAAA (exemple: 15/01/1990)
        </Text>
      </>
    );
  }

  function renderNiveauPostBacPicker() {
    const niveauOptions = [
      { label: "Sélectionnez un niveau", value: "" },
      { label: "Bac+1", value: "bac1" },
      { label: "Bac+2", value: "bac2" },
      { label: "Bac+3", value: "bac3" },
      { label: "Bac+4", value: "bac4" },
      { label: "Bac+5", value: "bac5" },
      { label: "Pas de diplôme de l'enseignement supérieur", value: "none" }
    ];

    const getDisplayText = () => {
      const selectedOption = niveauOptions.find(option => option.value === niveauPostBac);
      return selectedOption ? selectedOption.label : "Sélectionnez un niveau";
    };

    return (
      <>
        <Text style={styles.label}>Niveau post-bac du diplôme préparé *</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowNiveauModal(true)}
        >
          <Text style={styles.dateButtonText}>
            {getDisplayText()}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={showNiveauModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowNiveauModal(false)}
        >
          <View style={styles.simpleModalOverlay}>
            <View style={styles.simpleModalContent}>
              <View style={styles.simpleModalHeader}>
                <Text style={styles.simpleModalTitle}>Choisir un niveau</Text>
                <TouchableOpacity
                  onPress={() => setShowNiveauModal(false)}
                  style={styles.simpleModalCloseButton}
                >
                  <Text style={styles.simpleModalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.simpleModalOptions}>
                {niveauOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.simpleModalOption,
                      niveauPostBac === option.value && styles.simpleModalOptionSelected
                    ]}
                    onPress={() => {
                      setNiveauPostBac(option.value);
                      setShowNiveauModal(false);
                    }}
                  >
                    <Text style={[
                      styles.simpleModalOptionText,
                      niveauPostBac === option.value && styles.simpleModalOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  // Helper function to render upload status
  const renderUploadStatus = (file: any, documentType: string) => {
    if (uploading) {
      return (
        <View style={styles.uploadStatus}>
          <Text style={styles.uploadingText}>Téléchargement en cours...</Text>
        </View>
      );
    }

    if (uploadSuccess) {
      return (
        <View style={styles.uploadStatus}>
          <Text style={styles.successText}>✓ {uploadSuccess}</Text>
        </View>
      );
    }

    if (uploadError) {
      return (
        <View style={styles.uploadStatus}>
          <Text style={styles.errorText}>✗ {uploadError}</Text>
          {file && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => retryUpload(file, documentType)}
            >
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return null;
  };

  // Affichage du contenu selon la page
  function renderPage() {
    const page = PAGES[currentPage];
    switch (page.key) {
      case "infos":
        return (
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <StepHeader
                current={currentPage + 1}
                total={PAGES.length}
                title={PAGES[currentPage].label}
                subtitle={
                  currentPage < PAGES.length - 1
                    ? `Étape suivante : ${PAGES[currentPage + 1].label}`
                    : ""
                }
              />

              <View style={styles.form}>
                <Text style={styles.pageSubtitle}>
                  Complétez ci-dessous vos données personnelles telles qu'elles apparaissent sur vos documents d'identité.
                </Text>
                <Text style={styles.pageNote}>
                  Les informations suivies de <Text style={{ color: mainOrange }}>*</Text> sont obligatoires.
                </Text>

                {/* Civilité */}
                <Text style={styles.label}>Civilité *</Text>
                <View style={styles.civiliteRow}>
                  <TouchableOpacity
                    style={[
                      styles.radioBtn,
                      civilite === "madame" && styles.radioBtnActive,
                    ]}
                    onPress={() => setCivilite("madame")}
                  >
                    <View style={styles.radioCircleOuter}>
                      {civilite === "madame" && <View style={styles.radioCircleInner} />}
                    </View>
                    <Text style={[
                      styles.radioText,
                      civilite === "madame" && styles.radioTextActive,
                    ]}>Madame</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioBtn,
                      civilite === "monsieur" && styles.radioBtnActive,
                    ]}
                    onPress={() => setCivilite("monsieur")}
                  >
                    <View style={styles.radioCircleOuter}>
                      {civilite === "monsieur" && <View style={styles.radioCircleInner} />}
                    </View>
                    <Text style={[
                      styles.radioText,
                      civilite === "monsieur" && styles.radioTextActive,
                    ]}>Monsieur</Text>
                  </TouchableOpacity>
                </View>

                {/* Labels et Inputs */}
                <Text style={styles.label}>Nom de naissance *</Text>
                <TextInput style={styles.input} placeholder="Nom de naissance" value={nom} onChangeText={setNom} />

                <Text style={styles.label}>Prénom *</Text>
                <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />

                <Text style={styles.label}>Nom d'usage</Text>
                <TextInput style={styles.input} placeholder="Nom d'usage" value={nomUsage} onChangeText={setNomUsage} />

                {/* Date de naissance */}
                {renderDateNaissancePicker()}

                {/* Pays de naissance */}
                <Text style={styles.label}>Pays de naissance *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Saisissez un pays..."
                    value={countryInput}
                    onChangeText={handleCountryInputChange}
                    onFocus={() => {
                      if (countryInput.length > 0) {
                        setShowCountrySuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowCountrySuggestions(false), 200);
                    }}
                  />
                  
                  {showCountrySuggestions && filteredCountries.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      <ScrollView style={styles.suggestionsList}>
                        {filteredCountries.map((country) => (
                          <TouchableOpacity
                            key={country}
                            style={styles.suggestionItem}
                            onPress={() => selectCountry(country)}
                          >
                            <Text style={styles.suggestionText}>{country}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Département de naissance */}
                <Text style={styles.label}>Département de naissance *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Saisissez un département..."
                    value={departmentInput}
                    onChangeText={handleDepartmentInputChange}
                    onFocus={() => {
                      if (departmentInput.length > 0) {
                        setShowDepartmentSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowDepartmentSuggestions(false), 200);
                    }}
                  />
                  
                  {showDepartmentSuggestions && filteredDepartments.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      <ScrollView style={styles.suggestionsList}>
                        {filteredDepartments.map((department) => (
                          <TouchableOpacity
                            key={department}
                            style={styles.suggestionItem}
                            onPress={() => selectDepartment(department)}
                          >
                            <Text style={styles.suggestionText}>{department}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Ville de naissance */}
                <Text style={styles.label}>Ville de naissance *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Saisissez une ville..."
                    value={birthCityInput}
                    onChangeText={handleBirthCityInputChange}
                    onFocus={() => {
                      if (birthCityInput.length > 0) {
                        setShowBirthCitySuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowBirthCitySuggestions(false), 200);
                    }}
                  />
                  
                  {showBirthCitySuggestions && filteredBirthCities.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      <ScrollView style={styles.suggestionsList}>
                        {filteredBirthCities.map((city) => (
                          <TouchableOpacity
                            key={city}
                            style={styles.suggestionItem}
                            onPress={() => selectBirthCity(city)}
                          >
                            <Text style={styles.suggestionText}>{city}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {error && <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>}

                {/* BOUTON ENREGISTRER */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#fff',
                    borderColor: mainBlue,
                    borderWidth: 1.5,
                    borderRadius: 8,
                    padding: 14,
                    alignItems: 'center',
                    width: "100%",
                    marginBottom: 18,
                    marginTop: 18,
                  }}
                  onPress={handleSavePersonalInfo}
                  disabled={loading}
                >
                  <Text style={{ color: mainBlue, fontWeight: 'bold', fontSize: 16 }}>
                    {loading ? "Enregistrement..." : "Enregistrer"}
                  </Text>
                </TouchableOpacity>

                {/* Navigation Buttons */}
                <View style={styles.formNavBtns}>
                  {currentPage > 0 && (
                    <TouchableOpacity style={styles.formPrevBtn} onPress={goPrev}>
                      <Text style={styles.formNavBtnText}>Précédent</Text>
                    </TouchableOpacity>
                  )}
                  {currentPage < PAGES.length - 1 && (
                    <TouchableOpacity style={styles.formNextBtn} onPress={goNext}>
                      <Text style={styles.formNavBtnText}>Suivant</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      case "coordonnees":
        return (
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <StepHeader
                current={currentPage + 1}
                total={PAGES.length}
                title={PAGES[currentPage].label}
                subtitle={
                  currentPage < PAGES.length - 1
                    ? `Étape suivante : ${PAGES[currentPage + 1].label}`
                    : ""
                }
              />

              <View style={styles.form}>
                <Text style={styles.pageSubtitle}>
                  Complétez vos coordonnées.
                </Text>
                <Text style={styles.pageNote}>
                  Les informations suivies de{" "}
                  <Text style={{ color: mainOrange }}>*</Text> sont
                  obligatoires.
                </Text>

                <Text style={styles.label}>Adresse électronique *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adresse électronique"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />

                <Text style={styles.label}>Téléphone *</Text>
                <Text style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>
                  Pour un numéro de téléphone portable français, indiquez votre
                  numéro de téléphone au format 06XXXXXXXX, 07XXXXXXXX,
                  +336XXXXXXXX ou +337XXXXXXXX.{"\n"}
                  Pour un numéro de téléphone portable étranger ou des DROM-COM,
                  indiquez votre numéro de téléphone au format international
                  avec indicatif. Par exemple, pour un numéro de portable
                  algérien, exemple : +213XXXXXXXX.{"\n"}
                  Ce numéro de téléphone portable pourra être utilisé dans le
                  cadre de la procédure pour vous contacter en cas de difficulté
                  ou pour vous transmettre par SMS des informations importantes.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Téléphone"
                  keyboardType="phone-pad"
                  value={telephone}
                  onChangeText={setTelephone}
                />

                {/* Ajoute d'autres labels/inputs si besoin */}
                <Text style={styles.label}>Code postal</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Code postal"
                  value={codePostal}
                  onChangeText={setCodePostal}
                />

                <Text style={styles.label}>Adresse *</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Adresse" 
                  value={adresse}
                  onChangeText={setAdresse}
                />

                {/* Ville/Commune */}
                <Text style={styles.label}>Ville/Commune *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Saisissez une ville..."
                    value={currentCityInput}
                    onChangeText={handleCurrentCityInputChange}
                    onFocus={() => {
                      if (currentCityInput.length > 0) {
                        setShowCurrentCitySuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowCurrentCitySuggestions(false), 200);
                    }}
                  />
                  
                  {showCurrentCitySuggestions && filteredCurrentCities.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      <ScrollView style={styles.suggestionsList}>
                        {filteredCurrentCities.map((city) => (
                          <TouchableOpacity
                            key={city}
                            style={styles.suggestionItem}
                            onPress={() => selectCurrentCity(city)}
                          >
                            <Text style={styles.suggestionText}>{city}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: mainBlue,
                    borderWidth: 1.5,
                    borderRadius: 8,
                    padding: 14,
                    marginTop: 18,
                    alignItems: "center",
                    width: "100%",
                    marginBottom: 18,
                  }}
                  onPress={handleSaveContactInfo}
                  disabled={loading}
                >
                  <Text
                    style={{
                      color: mainBlue,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {loading ? "Enregistrement..." : "Enregistrer"}
                  </Text>
                </TouchableOpacity>

                {/* Navigation Buttons */}
                <View style={styles.formNavBtns}>
                  {currentPage > 0 && (
                    <TouchableOpacity style={styles.formPrevBtn} onPress={goPrev}>
                      <Text style={styles.formNavBtnText}>Précédent</Text>
                    </TouchableOpacity>
                  )}
                  {currentPage < PAGES.length - 1 && (
                    <TouchableOpacity style={styles.formNextBtn} onPress={goNext}>
                      <Text style={styles.formNavBtnText}>Suivant</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      case "cv":
        return (
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <StepHeader
                current={currentPage + 1}
                total={PAGES.length}
                title={PAGES[currentPage].label}
                subtitle={
                  currentPage < PAGES.length - 1
                    ? `Étape suivante : ${PAGES[currentPage + 1].label}`
                    : ""
                }
              />

              <View style={styles.form}>
                <Text style={styles.pageSubtitle}>
                  Votre curriculum vitae (CV) doit notamment comprendre la
                  description de l'ensemble de votre cursus depuis le
                  baccalauréat.{"\n"}
                </Text>

                <Text style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>
                  Téléversez votre curriculum vitae (CV).{"\n"}
                  Le fichier téléversé doit avoir une taille maximale de 2 Mo.
                  Les formats de fichiers supportés sont : JPEG, JPG, PNG, PDF.
                  {"\n"}
                  Assurez-vous que le nom du fichier n'est pas trop long, ne
                  contient que des caractères latins et ne contient pas de
                  caractère accentué.
                </Text>

                {/* Bouton Importer - Only show if no CV files exist */}
                {getDocumentsByType('cv').length === 0 && (
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor: mainViolet,
                        borderRadius: 8,
                        padding: 14,
                        alignItems: "center",
                        width: "100%",
                        marginBottom: 12,
                      },
                      uploading && { opacity: 0.6 }
                    ]}
                    onPress={handleImportCV}
                    disabled={uploading}
                  >
                    <Text
                      style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                    >
                      {uploading ? "Téléchargement..." : "Importer"}
                    </Text>
                  </TouchableOpacity>
                )}

                {cvFile && (
                  <Text
                    style={{ color: "#444", fontSize: 13, marginBottom: 8 }}
                  >
                    Fichier sélectionné : {cvFile.name}
                  </Text>
                )}

                {/* Upload Status */}
                {renderUploadStatus(cvFile, 'cv')}

                {/* Existing CV Files */}
                {loadingDocuments && (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Chargement des documents...</Text>
                  </View>
                )}

                {documentError && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>✗ {documentError}</Text>
                  </View>
                )}

                {/* Display existing CV files */}
                {getDocumentsByType('cv').map((doc) => {
                  const fileExtension = doc.file_name.split('.').pop()?.toLowerCase() || '';
                  const displayName = `cv_miageconnect.${fileExtension}`;
                  
                  return (
                    <View key={doc.id} style={styles.documentCard}>
                      <View style={styles.documentInfo}>
                        <Text style={styles.documentName}>{displayName}</Text>
                        <Text style={styles.documentDate}>
                          Ajouté le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </Text>
                        {doc.commentaire && (
                          <Text style={styles.documentComment}>{doc.commentaire}</Text>
                        )}
                      </View>
                      <View style={styles.documentActions}>
                        <TouchableOpacity
                          style={[
                            styles.downloadButton,
                            downloadingFile === doc.id && { opacity: 0.6 }
                          ]}
                          onPress={() => downloadDocument(doc.id, doc.file_name)}
                          disabled={downloadingFile === doc.id}
                        >
                          <Text style={styles.downloadButtonText}>
                            {downloadingFile === doc.id ? 'Téléchargement...' : 'Télécharger'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={async () => {
                            Alert.alert(
                              'Confirmation',
                              'Êtes-vous sûr de vouloir supprimer ce document ?',
                              [
                                {
                                  text: 'Annuler',
                                  style: 'cancel',
                                },
                                {
                                  text: 'Supprimer',
                                  style: 'destructive',
                                  onPress: async () => {
                                    const success = await deleteDocument(doc.id);
                                    if (success) {
                                      Alert.alert('Succès', 'Document supprimé avec succès');
                                    } else {
                                      Alert.alert('Erreur', 'Erreur lors de la suppression du document');
                                    }
                                  },
                                },
                              ]
                            );
                          }}
                        >
                          <Text style={styles.deleteButtonText}>Supprimer</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}



                {/* Navigation Buttons */}
                <View style={styles.formNavBtns}>
                  {currentPage > 0 && (
                    <TouchableOpacity style={styles.formPrevBtn} onPress={goPrev}>
                      <Text style={styles.formNavBtnText}>Précédent</Text>
                    </TouchableOpacity>
                  )}
                  {currentPage < PAGES.length - 1 && (
                    <TouchableOpacity style={styles.formNextBtn} onPress={goNext}>
                      <Text style={styles.formNavBtnText}>Suivant</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      case "parcours":
        return (
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <StepHeader
                current={currentPage + 1}
                total={PAGES.length}
                title={PAGES[currentPage].label}
                subtitle={
                  currentPage < PAGES.length - 1
                    ? `Étape suivante : ${PAGES[currentPage + 1].label}`
                    : ""
                }
              />

              <View style={styles.form}>
                <Text style={styles.pageSubtitle}>
                  Complétez ci-dessous vos données personnelles telles qu'elles
                  apparaissent sur vos documents d'identité.
                </Text>
                <Text style={styles.pageNote}>
                  Les informations suivies de{" "}
                  <Text style={{ color: mainOrange }}>*</Text> sont
                  obligatoires.
                </Text>



                {/* Diplôme français ? */}
                <Text style={styles.label}>
                  S'agit-il d'un diplôme français ? *
                </Text>
                <Text style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>
                  Si vous avez préparé un diplôme français lors de l'année
                  concernée, répondez Oui.{"\n"}
                  S'il s'agit d'un diplôme étranger, répondez Non.{"\n"}
                  Si vous ne disposez d'aucun diplôme de l'enseignement
                  supérieur, répondez Oui.
                </Text>
                <View style={{ flexDirection: "row", marginBottom: 16 }}>
                  <TouchableOpacity
                    style={[
                      styles.radioBtn,
                      diplomeFrancais === "oui" && styles.radioBtnActive,
                      { flex: 0, marginRight: 16 },
                    ]}
                    onPress={() => setDiplomeFrancais("oui")}
                  >
                    <View style={styles.radioCircleOuter}>
                      {diplomeFrancais === "oui" && (
                        <View style={styles.radioCircleInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioText,
                        diplomeFrancais === "oui" && styles.radioTextActive,
                      ]}
                    >
                      Oui
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioBtn,
                      diplomeFrancais === "non" && styles.radioBtnActive,
                      { flex: 0 },
                    ]}
                    onPress={() => setDiplomeFrancais("non")}
                  >
                    <View style={styles.radioCircleOuter}>
                      {diplomeFrancais === "non" && (
                        <View style={styles.radioCircleInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioText,
                        diplomeFrancais === "non" && styles.radioTextActive,
                      ]}
                    >
                      Non
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Niveau post-bac du diplôme préparé */}
                <Text style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>
                  Sélectionnez le niveau post-bac du diplôme préparé pour
                  l'année renseignée. Si cette année de cursus post-bac ne
                  prépare à aucun diplôme, sélectionner « Pas de diplôme de
                  l'enseignement supérieur »
                </Text>
                {renderNiveauPostBacPicker()}

                {/* Ajoute d'autres labels/inputs si besoin */}
                <Text style={styles.label}>Label</Text>
                <TextInput style={styles.input} placeholder="Label" />

                {/* Bouton Enregistrer */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: mainBlue,
                    borderWidth: 1.5,
                    borderRadius: 8,
                    padding: 14,
                    alignItems: "center",
                    width: "100%",
                    marginBottom: 18,
                    marginTop: 18,
                  }}
                >
                  <Text
                    style={{
                      color: mainBlue,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Enregistrer
                  </Text>
                </TouchableOpacity>

                {/* Navigation Buttons */}
                <View style={styles.formNavBtns}>
                  {currentPage > 0 && (
                    <TouchableOpacity style={styles.formPrevBtn} onPress={goPrev}>
                      <Text style={styles.formNavBtnText}>Précédent</Text>
                    </TouchableOpacity>
                  )}
                  {currentPage < PAGES.length - 1 && (
                    <TouchableOpacity style={styles.formNextBtn} onPress={goNext}>
                      <Text style={styles.formNavBtnText}>Suivant</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      case "notes":
        return (
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <StepHeader
                current={currentPage + 1}
                total={PAGES.length}
                title={PAGES[currentPage].label}
                subtitle={
                  currentPage < PAGES.length - 1
                    ? `Étape suivante : ${PAGES[currentPage + 1].label}`
                    : ""
                }
              />

              <View style={styles.form}>
                <Text style={styles.pageSubtitle}>
                  Vous devez fournir tous les relevés de notes de votre cursus
                  post-baccalauréat.{"\n"}
                  Si certains de ces relevés sont en langue étrangère, vous
                  devez en fournir une version traduite en français ou en
                  anglais.{"\n"}
                  Le cas échéant, indiquez la raison pour laquelle vous ne
                  disposez pas de ces relevés.{"\n"}
                  Attention, toute fraude ou tentative de fraude peut entraîner
                  l'annulation de vos candidatures et propositions d'admission.
                </Text>
                <Text style={styles.pageNote}>
                  Les informations suivies de{" "}
                  <Text style={{ color: mainOrange }}>*</Text> sont
                  obligatoires.
                </Text>

                {/* Choix sur la disponibilité des relevés */}
                <Text style={styles.label}>
                  Tous les relevés de notes de mon cursus post-baccalauréat *
                </Text>
                <View style={{ marginBottom: 16 }}>
                  <TouchableOpacity
                    style={[
                      styles.radioBtn,
                      notesOption === "1" && styles.radioBtnActive,
                    ]}
                    onPress={() => setNotesOption("1")}
                  >
                    <View style={styles.radioCircleOuter}>
                      {notesOption === "1" && (
                        <View style={styles.radioCircleInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioText,
                        notesOption === "1" && styles.radioTextActive,
                      ]}
                    >
                      Je dispose de mes relevés de notes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioBtn,
                      notesOption === "2" && styles.radioBtnActive,
                    ]}
                    onPress={() => setNotesOption("2")}
                  >
                    <View style={styles.radioCircleOuter}>
                      {notesOption === "2" && (
                        <View style={styles.radioCircleInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioText,
                        notesOption === "2" && styles.radioTextActive,
                      ]}
                    >
                      Je dispose de mes relevés de notes et ceux obtenus à
                      l'étranger sont traduits en français ou en anglais
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioBtn,
                      notesOption === "3" && styles.radioBtnActive,
                    ]}
                    onPress={() => setNotesOption("3")}
                  >
                    <View style={styles.radioCircleOuter}>
                      {notesOption === "3" && (
                        <View style={styles.radioCircleInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioText,
                        notesOption === "3" && styles.radioTextActive,
                      ]}
                    >
                      Je ne dispose pas de la totalité de mes relevés de note
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioBtn,
                      notesOption === "4" && styles.radioBtnActive,
                    ]}
                    onPress={() => setNotesOption("4")}
                  >
                    <View style={styles.radioCircleOuter}>
                      {notesOption === "4" && (
                        <View style={styles.radioCircleInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioText,
                        notesOption === "4" && styles.radioTextActive,
                      ]}
                    >
                      Je ne dispose d'aucun relevé de notes
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Téléversement des relevés */}
                <Text style={styles.label}>Vos relevés de notes *</Text>
                <Text style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>
                  Téléversez les relevés de notes de tout votre cursus
                  post-baccalauréat, en un seul document.{"\n"}
                  Le fichier téléversé doit avoir une taille maximale de 2 Mo.
                  Les formats de fichiers supportés sont : JPEG, JPG, PNG, PDF.
                  {"\n"}
                  Assurez-vous que le nom du fichier n'est pas trop long, ne
                  contient que des caractères latins et ne contient pas de
                  caractère accentué.
                </Text>

                {/* Bouton Importer - Only show if no notes files exist */}
                {getDocumentsByType('notes').length === 0 && (
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor: mainViolet,
                        borderRadius: 8,
                        padding: 14,
                        alignItems: "center",
                        width: "100%",
                        marginBottom: 12,
                      },
                      uploading && { opacity: 0.6 }
                    ]}
                    onPress={handleImportNotes}
                    disabled={uploading}
                  >
                    <Text
                      style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                    >
                      {uploading ? "Téléchargement..." : "Importer"}
                    </Text>
                  </TouchableOpacity>
                )}

                {notesFile && (
                  <Text
                    style={{ color: "#444", fontSize: 13, marginBottom: 8 }}
                  >
                    Fichier sélectionné : {notesFile.name}
                  </Text>
                )}

                {/* Upload Status */}
                {renderUploadStatus(notesFile, 'notes')}

                {/* Existing Notes Files */}
                {loadingDocuments && (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Chargement des documents...</Text>
                  </View>
                )}

                {documentError && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>✗ {documentError}</Text>
                  </View>
                )}

                {/* Display existing notes files */}
                {getDocumentsByType('notes').map((doc) => {
                  const fileExtension = doc.file_name.split('.').pop()?.toLowerCase() || '';
                  const displayName = `notes_miageconnect.${fileExtension}`;
                  
                  return (
                    <View key={doc.id} style={styles.documentCard}>
                      <View style={styles.documentInfo}>
                        <Text style={styles.documentName}>{displayName}</Text>
                        <Text style={styles.documentDate}>
                          Ajouté le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </Text>
                        {doc.commentaire && (
                          <Text style={styles.documentComment}>{doc.commentaire}</Text>
                        )}
                      </View>
                      <View style={styles.documentActions}>
                        <TouchableOpacity
                          style={[
                            styles.downloadButton,
                            downloadingFile === doc.id && { opacity: 0.6 }
                          ]}
                          onPress={() => downloadDocument(doc.id, doc.file_name)}
                          disabled={downloadingFile === doc.id}
                        >
                          <Text style={styles.downloadButtonText}>
                            {downloadingFile === doc.id ? 'Téléchargement...' : 'Télécharger'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={async () => {
                            Alert.alert(
                              'Confirmation',
                              'Êtes-vous sûr de vouloir supprimer ce document ?',
                              [
                                {
                                  text: 'Annuler',
                                  style: 'cancel',
                                },
                                {
                                  text: 'Supprimer',
                                  style: 'destructive',
                                  onPress: async () => {
                                    const success = await deleteDocument(doc.id);
                                    if (success) {
                                      Alert.alert('Succès', 'Document supprimé avec succès');
                                    } else {
                                      Alert.alert('Erreur', 'Erreur lors de la suppression du document');
                                    }
                                  },
                                },
                              ]
                            );
                          }}
                        >
                          <Text style={styles.deleteButtonText}>Supprimer</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                {/* Commentaire */}
                <Text style={styles.label}>Commentaire</Text>
                <TextInput
                  style={[styles.input, { minHeight: 60 }]}
                  placeholder="Ajouter un commentaire (facultatif)"
                  multiline
                />

                {/* Navigation Buttons */}
                <View style={styles.formNavBtns}>
                  {currentPage > 0 && (
                    <TouchableOpacity style={styles.formPrevBtn} onPress={goPrev}>
                      <Text style={styles.formNavBtnText}>Précédent</Text>
                    </TouchableOpacity>
                  )}
                  {currentPage < PAGES.length - 1 && (
                    <TouchableOpacity style={styles.formNextBtn} onPress={goNext}>
                      <Text style={styles.formNavBtnText}>Suivant</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      case "experiences":
        return (
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <StepHeader
                current={currentPage + 1}
                total={PAGES.length}
                title={PAGES[currentPage].label}
                subtitle={
                  currentPage < PAGES.length - 1
                    ? `Étape suivante : ${PAGES[currentPage + 1].label}`
                    : ""
                }
              />

              <View style={styles.form}>
                <Text style={styles.pageSubtitle}>
                  Complétez ci-dessous vos données personnelles telles qu'elles
                  apparaissent sur vos documents d'identité.
                </Text>
                <Text style={styles.pageNote}>
                  Les informations suivies de{" "}
                  <Text style={{ color: mainOrange }}>*</Text> sont
                  obligatoires.
                </Text>

                {/* Case à cocher : aucune expérience */}
                <TouchableOpacity
                  style={[
                    styles.radioBtn, 
                    { marginBottom: 16 },
                    aucuneExperience && styles.radioBtnActive
                  ]}
                  onPress={() => handleAucuneExperience(!aucuneExperience)}
                >
                  <View style={styles.radioCircleOuter}>
                    {aucuneExperience && <View style={styles.radioCircleInner} />}
                  </View>
                  <Text style={[
                    styles.radioText,
                    aucuneExperience && styles.radioTextActive
                  ]}>
                    Je ne déclare aucune expérience professionnelle.
                  </Text>
                </TouchableOpacity>
                <Text style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>
                  En cochant cette case, je ne déclare aucune expérience
                  professionnelle à prendre en compte par les établissements
                  lors de l'examen de mes candidatures.
                </Text>

                {!aucuneExperience && (
                  <>
                    {/* Liste des expériences existantes */}
                    {experiences.map((experience, index) => (
                      <View key={experience.id} style={styles.experienceCard}>
                        <View style={styles.experienceHeader}>
                          <Text style={styles.experienceTitle}>
                            Expérience {index + 1}
                          </Text>
                          <View style={styles.experienceActions}>
                            <TouchableOpacity
                              style={styles.editButton}
                              onPress={() => editExperience(experience.id)}
                            >
                              <Text style={styles.editButtonText}>Modifier</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() => deleteExperience(experience.id)}
                            >
                              <Text style={styles.deleteButtonText}>Supprimer</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <Text style={styles.experienceDetail}>
                          <Text style={styles.experienceLabel}>Intitulé: </Text>
                          {experience.intitule}
                        </Text>
                        <Text style={styles.experienceDetail}>
                          <Text style={styles.experienceLabel}>Employeur: </Text>
                          {experience.employeur}
                        </Text>
                        <Text style={styles.experienceDetail}>
                          <Text style={styles.experienceLabel}>Année: </Text>
                          {experience.anneeDebut} - Durée: {experience.dureeEnMois} mois
                        </Text>
                        <Text style={styles.experienceDetail}>
                          <Text style={styles.experienceLabel}>Type: </Text>
                          {experience.tempsPlein === 'plein' ? 'Temps plein' : 'Temps partiel'}
                        </Text>
                        {experience.descriptif && (
                          <Text style={styles.experienceDetail}>
                            <Text style={styles.experienceLabel}>Descriptif: </Text>
                            {experience.descriptif}
                          </Text>
                        )}
                      </View>
                    ))}

                    {/* Bouton pour ajouter une nouvelle expérience */}
                    {!showExperienceForm && (
                      <TouchableOpacity
                        style={styles.addExperienceButton}
                        onPress={() => setShowExperienceForm(true)}
                      >
                        <Text style={styles.addExperienceButtonText}>
                          + Ajouter une expérience professionnelle
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Formulaire d'ajout/modification d'expérience */}
                    {showExperienceForm && (
                      <View style={styles.experienceForm}>
                        <Text style={styles.formTitle}>
                          {editingExperience ? 'Modifier l\'expérience' : 'Ajouter une expérience professionnelle'}
                        </Text>

                        <Text style={styles.label}>Année du début *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ex : 2023"
                          keyboardType="numeric"
                          value={currentExperience.anneeDebut}
                          onChangeText={(text) => setCurrentExperience(prev => ({...prev, anneeDebut: text}))}
                        />

                        <Text style={styles.label}>Durée en mois *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ex : 6"
                          keyboardType="numeric"
                          value={currentExperience.dureeEnMois}
                          onChangeText={(text) => setCurrentExperience(prev => ({...prev, dureeEnMois: text}))}
                        />

                        <Text style={styles.label}>Temps plein ou partiel *</Text>
                        <View style={{ flexDirection: "row", marginBottom: 16 }}>
                          <TouchableOpacity
                            style={[
                              styles.radioBtn,
                              currentExperience.tempsPlein === "partiel" && styles.radioBtnActive,
                              { flex: 0, marginRight: 16 },
                            ]}
                            onPress={() => setCurrentExperience(prev => ({...prev, tempsPlein: 'partiel'}))}
                          >
                            <View style={styles.radioCircleOuter}>
                              {currentExperience.tempsPlein === "partiel" && (
                                <View style={styles.radioCircleInner} />
                              )}
                            </View>
                            <Text
                              style={[
                                styles.radioText,
                                currentExperience.tempsPlein === "partiel" && styles.radioTextActive,
                              ]}
                            >
                              Temps partiel
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.radioBtn,
                              currentExperience.tempsPlein === "plein" && styles.radioBtnActive,
                              { flex: 0 },
                            ]}
                            onPress={() => setCurrentExperience(prev => ({...prev, tempsPlein: 'plein'}))}
                          >
                            <View style={styles.radioCircleOuter}>
                              {currentExperience.tempsPlein === "plein" && (
                                <View style={styles.radioCircleInner} />
                              )}
                            </View>
                            <Text
                              style={[
                                styles.radioText,
                                currentExperience.tempsPlein === "plein" && styles.radioTextActive,
                              ]}
                            >
                              Temps plein
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Employeur ou organisme *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Employeur ou organisme"
                          value={currentExperience.employeur}
                          onChangeText={(text) => setCurrentExperience(prev => ({...prev, employeur: text}))}
                        />

                        <Text style={styles.label}>Intitulé *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Intitulé"
                          value={currentExperience.intitule}
                          onChangeText={(text) => setCurrentExperience(prev => ({...prev, intitule: text}))}
                        />

                        <Text style={styles.label}>Descriptif</Text>
                        <TextInput
                          style={[styles.input, { minHeight: 60 }]}
                          placeholder="Descriptif (facultatif)"
                          multiline
                          value={currentExperience.descriptif}
                          onChangeText={(text) => setCurrentExperience(prev => ({...prev, descriptif: text}))}
                        />

                        {/* Boutons du formulaire */}
                        <View style={styles.formButtons}>
                          <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={cancelExperienceForm}
                          >
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.saveExperienceButton}
                            onPress={addExperience}
                          >
                            <Text style={styles.saveExperienceButtonText}>
                              {editingExperience ? 'Modifier' : 'Ajouter'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </>
                )}

                {/* Bouton Enregistrer */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: mainBlue,
                    borderWidth: 1.5,
                    borderRadius: 8,
                    padding: 14,
                    alignItems: "center",
                    width: "100%",
                    marginBottom: 18,
                    marginTop: 18,
                  }}
                >
                  <Text
                    style={{
                      color: mainBlue,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Enregistrer
                  </Text>
                </TouchableOpacity>

                {/* Navigation Buttons */}
                <View style={styles.formNavBtns}>
                  {currentPage > 0 && (
                    <TouchableOpacity style={styles.formPrevBtn} onPress={goPrev}>
                      <Text style={styles.formNavBtnText}>Précédent</Text>
                    </TouchableOpacity>
                  )}
                  {currentPage < PAGES.length - 1 && (
                    <TouchableOpacity style={styles.formNextBtn} onPress={goNext}>
                      <Text style={styles.formNavBtnText}>Suivant</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      case "justificatifs":
        return (
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <StepHeader
                current={currentPage + 1}
                total={PAGES.length}
                title={PAGES[currentPage].label}
                subtitle={
                  currentPage < PAGES.length - 1
                    ? `Étape suivante : ${PAGES[currentPage + 1].label}`
                    : ""
                }
              />

              <View style={styles.form}>
                <Text style={styles.pageSubtitle}>
                  Veuillez joindre les pièces justificatives suivantes à votre
                  demande : une pièce d'identité en cours de validité ainsi que
                  le dossier de validation dûment complété.{"\n"}
                  Le fichier téléversé doit avoir une taille maximale de 2 Mo.
                  Les formats de fichiers supportés sont : JPEG, JPG, PNG, PDF.
                  {"\n"}
                  Assurez-vous que le nom du fichier n'est pas trop long, ne
                  contient que des caractères latins et ne contient pas de
                  caractère accentué.
                </Text>

                {/* Bouton Importer */}
                <TouchableOpacity
                  style={[
                    {
                      backgroundColor: mainViolet,
                      borderRadius: 8,
                      padding: 14,
                      alignItems: "center",
                      width: "100%",
                      marginBottom: 12,
                    },
                    uploading && { opacity: 0.6 }
                  ]}
                  onPress={handleImportJustificatifs}
                  disabled={uploading}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                  >
                    {uploading ? "Téléchargement..." : "Importer"}
                  </Text>
                </TouchableOpacity>

                {justificatifsFile && (
                  <Text
                    style={{ color: "#444", fontSize: 13, marginBottom: 8 }}
                  >
                    Fichier sélectionné : {justificatifsFile.name}
                  </Text>
                )}

                {/* Upload Status */}
                {renderUploadStatus(justificatifsFile, 'justificatifs')}

                {/* Bouton Supprimer le fichier */}
                {justificatifsFile && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#fff",
                      borderColor: mainOrange,
                      borderWidth: 1.5,
                      borderRadius: 8,
                      padding: 14,
                      alignItems: "center",
                      width: "100%",
                      marginBottom: 18,
                    }}
                    onPress={clearJustificatifsFile}
                  >
                    <Text
                      style={{
                        color: mainOrange,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Supprimer le fichier
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Commentaire */}
                <Text style={styles.label}>Commentaire</Text>
                <TextInput
                  style={[styles.input, { minHeight: 60 }]}
                  placeholder="Ajouter un commentaire (facultatif)"
                  multiline
                />

                {/* Navigation Buttons */}
                <View style={styles.formNavBtns}>
                  {currentPage > 0 && (
                    <TouchableOpacity style={styles.formPrevBtn} onPress={goPrev}>
                      <Text style={styles.formNavBtnText}>Précédent</Text>
                    </TouchableOpacity>
                  )}
                  {currentPage < PAGES.length - 1 && (
                    <TouchableOpacity style={styles.formNextBtn} onPress={goNext}>
                      <Text style={styles.formNavBtnText}>Suivant</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      default:
        return null;
    }
  }

  return (
    <View style={styles.container}>
      {renderPage()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#23253A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: "flex-start",
    paddingHorizontal: 24,
  },
  logo: { width: 120, height: 40 },
  stepBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: mainViolet,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  stepCircleActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: mainViolet,
    backgroundColor: mainViolet,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: mainViolet,
    fontWeight: "bold",
  },
  stepLine: {
    width: 32,
    height: 2,
    backgroundColor: mainViolet,
    marginHorizontal: 2,
  },
  title: {
    color: mainOrange,
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 18,
    letterSpacing: 1,
  },
  form: { paddingHorizontal: 24 },
  label: {
    color: mainBlue,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  civiliteRow: {
    flexDirection: "row",
    marginBottom: 18,
    gap: 0,
  },
  radioBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  radioBtnActive: {
    borderColor: mainViolet,
    backgroundColor: "#F5F8FF",
  },
  radioCircleOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: mainViolet,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: mainViolet,
  },
  radioText: {
    color: mainBlue,
    fontWeight: "500",
    fontSize: 15,
    flexShrink: 1,
  },
  radioTextActive: {
    color: mainViolet,
  },
  input: {
    backgroundColor: lightGray,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
    fontSize: 16,
    color: mainBlue,
    borderWidth: 0,
  },
  dateButton: {
    backgroundColor: lightGray,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: borderGray,
  },
  dateButtonText: {
    fontSize: 16,
    color: mainBlue,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '70%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: mainBlue,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#888',
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 2,
    borderColor: mainBlue,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "#fff",
    height: 48,
    justifyContent: "center",
  },
  pickerWrapperFull: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 6,
    backgroundColor: "#fff",
    height: 48,
    justifyContent: "center",
    marginBottom: 16,
  },
  picker: { width: "100%", height: 48 },
  navBtns: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  navBtnsNextOnly: {
    justifyContent: "flex-end",
  },
  prevBtn: {
    backgroundColor: "#7B61FF",
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  nextBtn: {
    backgroundColor: "#7B61FF",
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: mainBlue,
    marginBottom: 8,
  },
  pageSubtitle: {
    color: "#444",
    fontSize: 13,
    marginBottom: 2,
  },
  pageNote: {
    color: "#aaa",
    fontSize: 11,
    marginBottom: 16,
  },
  pickerLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 2,
  },
  emptyMobileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
    marginTop: 40,
  },
  emptyMobileText: {
    color: mainBlue,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
    opacity: 0.8,
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: mainBlue,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: borderGray,
    borderRadius: 8,
    marginBottom: 14,
    maxHeight: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownList: {
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dropdownItemSelected: {
    backgroundColor: '#F5F8FF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: mainBlue,
  },
  dropdownItemTextSelected: {
    color: mainViolet,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: borderGray,
    borderRadius: 8,
    maxHeight: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  suggestionText: {
    fontSize: 16,
    color: mainBlue,
  },
  formNavBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  formPrevBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: mainBlue,
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  formNextBtn: {
    flex: 1,
    backgroundColor: mainViolet,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  formNavBtnText: {
    fontWeight: "bold",
    fontSize: 16,
    color: mainBlue,
  },
  experienceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: mainBlue,
  },
  experienceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: mainViolet,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: mainOrange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  experienceDetail: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  experienceLabel: {
    fontWeight: 'bold',
    color: mainBlue,
  },
  addExperienceButton: {
    backgroundColor: mainViolet,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  addExperienceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  experienceForm: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: mainBlue,
    marginBottom: 16,
    textAlign: 'center',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveExperienceButton: {
    flex: 1,
    backgroundColor: mainBlue,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveExperienceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  uploadStatus: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadingText: {
    color: mainViolet,
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#28a745',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: mainOrange,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: mainViolet,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Document management styles
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingText: {
    color: mainViolet,
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#fff3f3',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: mainOrange,
  },
  documentCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  documentInfo: {
    marginBottom: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: mainBlue,
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  documentComment: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  downloadButton: {
    backgroundColor: mainViolet,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionSelected: {
    backgroundColor: '#F5F8FF',
  },
  modalOptionText: {
    fontSize: 16,
    color: mainBlue,
    flex: 1,
  },
  modalOptionTextSelected: {
    color: mainViolet,
    fontWeight: '500',
  },
  modalOptionCheck: {
    fontSize: 18,
    color: mainViolet,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  datePickerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: mainBlue,
    textAlign: 'center',
    marginBottom: 12,
  },
  datePickerSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  datePickerContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: mainBlue,
    textAlign: 'center',
    marginBottom: 20,
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: mainBlue,
    width: 60,
    marginRight: 10,
  },
  datePickerScrollView: {
    flex: 1,
    maxHeight: 120,
  },
  datePickerOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 2,
  },
  datePickerOptionSelected: {
    backgroundColor: mainViolet,
  },
  datePickerOptionText: {
    fontSize: 16,
    color: mainBlue,
    textAlign: 'center',
  },
  datePickerOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  datePickerConfirmButton: {
    backgroundColor: mainViolet,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  datePickerConfirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateFormatHint: {
    fontSize: 12,
    color: '#888',
    marginTop: -10,
    marginBottom: 14,
    fontStyle: 'italic',
  },
  // Simple modal styles
  simpleModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  simpleModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '70%',
  },
  simpleModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  simpleModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: mainBlue,
  },
  simpleModalCloseButton: {
    padding: 8,
  },
  simpleModalCloseText: {
    fontSize: 20,
    color: '#888',
    fontWeight: 'bold',
  },
  simpleModalOptions: {
    paddingVertical: 8,
  },
  simpleModalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  simpleModalOptionSelected: {
    backgroundColor: '#F5F8FF',
  },
  simpleModalOptionText: {
    fontSize: 16,
    color: mainBlue,
  },
  simpleModalOptionTextSelected: {
    color: mainViolet,
    fontWeight: '500',
  },
});

export const PIECES_META = {
  cv: { label: 'CV', apiType: 'cv' },
  lettre_motivation: { label: 'Lettre de motivation', apiType: 'lettre_motivation' },
  notes: { label: 'Relevés de notes', apiType: 'notes' },
  diplome: { label: 'Diplôme(s)', apiType: 'diplome' },
  identite: { label: 'Pièce d\'identité', apiType: 'identite' },
  photo: { label: 'Photo d\'identité', apiType: 'photo' },
};
