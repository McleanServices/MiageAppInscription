import React, { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

// Liste des pays du monde (extrait, à compléter si besoin)
const countries = [
  "Afghanistan", "Afrique du Sud", "Albanie", "Algérie", "Allemagne", "Andorre", "Angola", "Antigua-et-Barbuda", "Arabie saoudite", "Argentine", "Arménie", "Australie", "Autriche", "Azerbaïdjan", "Bahamas", "Bahreïn", "Bangladesh", "Barbade", "Belgique", "Belize", "Bénin", "Bhoutan", "Biélorussie", "Birmanie", "Bolivie", "Bosnie-Herzégovine", "Botswana", "Brésil", "Brunei", "Bulgarie", "Burkina Faso", "Burundi", "Cambodge", "Cameroun", "Canada", "Cap-Vert", "République centrafricaine", "Chili", "Chine", "Chypre", "Colombie", "Comores", "Congo-Brazzaville", "Congo-Kinshasa", "Îles Cook", "Corée du Nord", "Corée du Sud", "Costa Rica", "Côte d'Ivoire", "Croatie", "Cuba", "Danemark", "Djibouti", "Dominique", "Égypte", "Émirats arabes unis", "Équateur", "Érythrée", "Espagne", "Estonie", "Eswatini", "États-Unis", "Éthiopie", "Fidji", "Finlande", "France", "Gabon", "Gambie", "Géorgie", "Ghana", "Grèce", "Grenade", "Guatemala", "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Guyana", "Haïti", "Honduras", "Hongrie", "Inde", "Indonésie", "Irak", "Iran", "Irlande", "Islande", "Israël", "Italie", "Jamaïque", "Japon", "Jordanie", "Kazakhstan", "Kenya", "Kirghizistan", "Kiribati", "Koweït", "Laos", "Lesotho", "Lettonie", "Liban", "Liberia", "Libye", "Liechtenstein", "Lituanie", "Luxembourg", "Macédoine du Nord", "Madagascar", "Malaisie", "Malawi", "Maldives", "Mali", "Malte", "Maroc", "Îles Marshall", "Maurice", "Mauritanie", "Mexique", "Micronésie", "Moldavie", "Monaco", "Mongolie", "Monténégro", "Mozambique", "Namibie", "Nauru", "Népal", "Nicaragua", "Niger", "Nigéria", "Norvège", "Nouvelle-Zélande", "Oman", "Ouganda", "Ouzbékistan", "Pakistan", "Palaos", "Palestine", "Panama", "Papouasie-Nouvelle-Guinée", "Paraguay", "Pays-Bas", "Pérou", "Philippines", "Pologne", "Portugal", "Qatar", "Roumanie", "Royaume-Uni", "Russie", "Rwanda", "Saint-Kitts-et-Nevis", "Saint-Marin", "Saint-Vincent-et-les-Grenadines", "Sainte-Lucie", "Salomon", "Salvador", "Samoa", "Sao Tomé-et-Principe", "Sénégal", "Serbie", "Seychelles", "Sierra Leone", "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan", "Soudan du Sud", "Sri Lanka", "Suède", "Suisse", "Suriname", "Syrie", "Tadjikistan", "Tanzanie", "Tchad", "République tchèque", "Thaïlande", "Timor oriental", "Togo", "Tonga", "Trinité-et-Tobago", "Tunisie", "Turkménistan", "Turquie", "Tuvalu", "Ukraine", "Uruguay", "Vanuatu", "Vatican", "Venezuela", "Viêt Nam", "Yémen", "Zambie", "Zimbabwe"
];

// Define colors and styles at the top
const mainColor = '#0C284F';

const inputStyle = {
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingVertical: 16,
  paddingLeft: 20,
  paddingRight: 20,
  marginBottom: 12,
  fontSize: 16,
  borderWidth: 2,
  borderColor: '#E5E7EB',
  color: '#1F2937',
  height: 56,
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  transition: 'all 0.2s ease-in-out',
  ':focus': {
    borderColor: mainColor,
    boxShadow: '0 0 0 3px rgba(12, 40, 79, 0.1)',
    outline: 'none'
  }
};

const dateMenuStyle = {
  borderWidth: 2,
  borderColor: '#E5E7EB',
  borderRadius: 12,
  paddingVertical: 16,
  paddingHorizontal: 20,
  marginRight: 8,
  backgroundColor: '#fff',
  height: 56,
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  transition: 'all 0.2s ease-in-out',
  ':focus': {
    borderColor: mainColor,
    boxShadow: '0 0 0 3px rgba(12, 40, 79, 0.1)',
    outline: 'none'
  }
};

export default function Index() {
  // 1. État pour la page sélectionnée
  const [selectedPage, setSelectedPage] = useState("infos");
  // État pour la civilité
  const [civilite, setCivilite] = useState("");
  // État pour la date de naissance (unifié)
  const [birthDate, setBirthDate] = useState("");
  // État pour diplôme français
  const [diplomeFrancais, setDiplomeFrancais] = useState("");
  // État pour le choix des relevés de notes
  const [notesSituation, setNotesSituation] = useState("");
  // État pour la déclaration d'aucune expérience professionnelle
  const [noExperience, setNoExperience] = useState(false);

  // 2. Fonction pour afficher le contenu principal selon la page
  function renderMainContent() {
    if (selectedPage === "infos") {
      return (
        <>
          {/* Logos */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Image source={require('../../assets/images/icon.png')} style={{ width:187.5, height: 100, resizeMode: 'contain', marginRight: 30 }} />
            <Image source={require('../../assets/images/icon.png')} style={{ width: 340, height: 122, resizeMode: 'contain', marginRight: 30 }} />
          </View>
          {/* Title */}
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>Mes informations personnelles</Text>
          <Text style={{ color: '#444', fontSize: 13, marginBottom: 2 }}>Complétez ci-dessous vos données personnelles telles qu&apos;elles apparaissent sur vos documents d&apos;identité.</Text>
          <Text style={{ color: '#aaa', fontSize: 11, marginBottom: 18 }}>Les informations suivies de * sont obligatoires.</Text>
          {/* Civilité */}
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Civilité *</Text>
          <View style={{ flexDirection: 'row', marginBottom: 18 }}>
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: mainColor, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18, marginRight: 12, backgroundColor: civilite === 'madame' ? '#EAF0FB' : '#fff' }}
              onPress={() => setCivilite('madame')}
            >
              <Text style={{ color: mainColor, fontWeight: civilite === 'madame' ? 'bold' : 'normal' }}>{civilite === 'madame' ? '●' : '○'} Madame</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: mainColor, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18, backgroundColor: civilite === 'monsieur' ? '#EAF0FB' : '#fff' }}
              onPress={() => setCivilite('monsieur')}
            >
              <Text style={{ color: mainColor, fontWeight: civilite === 'monsieur' ? 'bold' : 'normal' }}>{civilite === 'monsieur' ? '●' : '○'} Monsieur</Text>
            </TouchableOpacity>
          </View>
          {/* Nom, Prénom, Nationalité */}
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Nom*</Text>
          <TextInput placeholder="" style={inputStyle} />
          <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Prénom *</Text>
          <TextInput placeholder="" style={inputStyle} />
          <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Nationalité*</Text>
          <TextInput placeholder="" style={inputStyle} />
          {/* Naissance */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 30, marginBottom: 12 }}>Naissance</Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Date de naissance *</Text>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '12px',
              fontSize: '16px',
              border: '2px solid #E5E7EB',
              color: '#1F2937',
              height: '56px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s ease-in-out',
              minWidth: '200px',
              cursor: 'pointer',
              outline: 'none',
            }}
            max={new Date().toISOString().split('T')[0]}
            onFocus={e => { e.target.style.outline = 'none'; e.target.style.boxShadow = 'none'; }}
            onBlur={e => { e.target.style.outline = 'none'; e.target.style.boxShadow = 'none'; }}
          />
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Pays de naissance *</Text>
          <View style={[inputStyle, { padding: 0, marginBottom: 12 }]}> 
            <select
              style={{ 
                borderWidth: 0, 
                backgroundColor: 'transparent', 
                color: '#1F2937', 
                fontSize: 16, 
                width: '100%', 
                height: 56,
                padding: '0 20px',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
              onFocus={e => { e.target.style.outline = 'none'; e.target.style.boxShadow = 'none'; }}
              onBlur={e => { e.target.style.outline = 'none'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="" style={{ padding: '16px 0' }}>Sélectionnez un pays</option>
              {countries.map((c) => (
                <option key={c} value={c} style={{ padding: '16px 0' }}>{c}</option>
              ))}
            </select>
          </View>
          <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Département de naissance *</Text>
          <TextInput placeholder="" style={inputStyle} />
          <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Ville de naissance *</Text>
          <TextInput placeholder="" style={inputStyle} />
          {/* Adresse */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 30, marginBottom: 12 }}>Adresse</Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Pays*</Text>
          <View style={[inputStyle, { padding: 0, marginBottom: 12 }]}> 
            <select
              style={{ 
                borderWidth: 0, 
                backgroundColor: 'transparent', 
                color: '#1F2937', 
                fontSize: 16, 
                width: '100%', 
                height: 56,
                padding: '0 20px',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
              onFocus={e => { e.target.style.outline = 'none'; e.target.style.boxShadow = 'none'; }}
              onBlur={e => { e.target.style.outline = 'none'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="" style={{ padding: '16px 0' }}>Sélectionnez un pays</option>
              {countries.map((c) => (
                <option key={c} value={c} style={{ padding: '16px 0' }}>{c}</option>
              ))}
            </select>
          </View>
          <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Adresse</Text>
          <TextInput placeholder="" style={inputStyle} />
          <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Ville/Commune</Text>
          <TextInput placeholder="" style={inputStyle} />
          <TouchableOpacity style={{ 
            backgroundColor: mainColor, 
            borderColor: mainColor, 
            borderWidth: 2, 
            borderRadius: 12, 
            padding: 16, 
            marginTop: 24, 
            alignItems: 'center', 
            width: 200, 
            height: 56, 
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Enregistrer</Text>
          </TouchableOpacity>
        </>
      );
    }
    if (selectedPage === "coordonnees") {
      return (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Image source={require('../../assets/images/icon.png')} style={{ width:187.5, height: 100, resizeMode: 'contain', marginRight: 30 }} />
            <Image source={require('../../assets/images/icon.png')} style={{ width: 340, height: 122, resizeMode: 'contain', marginRight: 30 }} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>Mes coordonnées</Text>
          <Text style={{ color: '#444', fontSize: 13, marginBottom: 2 }}>Complétez vos coordonnées.</Text>
          <Text style={{ color: '#aaa', fontSize: 11, marginBottom: 18 }}>Les informations suivies de * sont obligatoires.</Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Adresse électronique *</Text>
          <TextInput placeholder="" style={inputStyle} />
          <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Téléphone*</Text>
          <Text style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>
            Pour un numéro de téléphone portable français, indiquez votre numéro de téléphone au format 06XXXXXXXX, 07XXXXXXXX, +336XXXXXXXX ou +337XXXXXXXX.{"\n"}
            Pour un numéro de téléphone portable étranger ou des DROM-COM, indiquez votre numéro de téléphone au format international avec indicatif. Par exemple, pour un numéro de portable algérien, exemple : +213XXXXXXXX.{"\n"}
            Ce numéro de téléphone portable pourra être utilisé dans le cadre de la procédure pour vous contacter en cas de difficulté ou pour vous transmettre par SMS des informations importantes.
          </Text>
          <TextInput placeholder="" style={inputStyle} />
          <TouchableOpacity style={{ backgroundColor: '#fff', borderColor: mainColor, borderWidth: 1, borderRadius: 6, padding: 12, marginTop: 18, alignItems: 'center', width: 180, height: 48, justifyContent: 'center' }}>
            <Text style={{ color: mainColor, fontWeight: 'bold' }}>Enregistrer</Text>
          </TouchableOpacity>
        </>
      );
    }
    if (selectedPage === "cv") {
      return (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Image source={require('../../assets/images/icon.png')} style={{ width:187.5, height: 100, resizeMode: 'contain', marginRight: 30 }} />
            <Image source={require('../../assets/images/icon.png')} style={{ width: 340, height: 122, resizeMode: 'contain', marginRight: 30 }} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>Mon curriculum vitae (CV)</Text>
          <Text style={{ color: '#444', fontSize: 13, marginBottom: 12 }}>
            Votre curriculum vitae (CV) doit notamment comprendre la description de l'ensemble de votre cursus depuis le baccalauréat.{"\n"}
            Un CV qui présente vos expériences des plus récentes aux plus anciennes est préconisé, afin de permettre une analyse plus rapide de votre dossier par les établissements.{"\n"}
            N'hésitez pas à indiquer dans votre CV des éléments pertinents non demandés dans le dossier candidat.
          </Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Mon curriculum vitae (CV) *</Text>
          <Text style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
            Téléversez votre curriculum vitae (CV). Le fichier téléversé doit avoir une taille maximale de 2 Mo. Les formats de fichiers supportés sont : JPEG, JPG, PNG, PDF.{"\n"}
            Assurez-vous que le nom du fichier n&apos;est pas trop long, ne contient que des caractères latins et ne contient pas de caractère accentué.
          </Text>
          {/* Zone d'upload fictive */}
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
            <TouchableOpacity style={{
              backgroundColor: mainColor,
              borderColor: mainColor,
              borderWidth: 1,
              borderRadius: 6,
              padding: 12,
              alignItems: 'center',
              justifyContent: 'center',
              width: 180,
              height: 48
            }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Importer</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={{ backgroundColor: mainColor, borderRadius: 6, padding: 12, alignItems: 'center', width: 180 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Supprimer le fichier</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ backgroundColor: '#fff', borderColor: mainColor, borderWidth: 1, borderRadius: 6, padding: 12, marginTop: 18, alignItems: 'center', width: 180, height: 48, justifyContent: 'center' }}>
            <Text style={{ color: mainColor, fontWeight: 'bold' }}>Enregistrer</Text>
          </TouchableOpacity>
        </>
      );
    }
    if (selectedPage === "parcours") {
      return (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Image source={require('../../assets/images/icon.png')} style={{ width:187.5, height: 100, resizeMode: 'contain', marginRight: 30 }} />
            <Image source={require('../../assets/images/icon.png')} style={{ width: 340, height: 122, resizeMode: 'contain', marginRight: 30 }} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>Ajouter une année de cursus post-baccalauréat</Text>
          <Text style={{ color: '#444', fontSize: 13, marginBottom: 2 }}>
            Complétez ci-dessous vos données personnelles telles qu&apos;elles apparaissent sur vos documents d&apos;identité.
          </Text>
          <Text style={{ color: '#aaa', fontSize: 11, marginBottom: 18 }}>
            Les informations suivies de * sont obligatoires.
          </Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Année universitaire*</Text>
          <TextInput placeholder="" style={inputStyle} />
          <Text style={{ fontWeight: 'bold', marginBottom: 8, marginTop: 12 }}>S&apos;agit-il d&apos;un diplôme français ? *</Text>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: mainColor, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18, marginRight: 12, backgroundColor: diplomeFrancais === 'oui' ? '#EAF0FB' : '#fff' }}
              onPress={() => setDiplomeFrancais('oui')}
            >
              <Text style={{ color: mainColor, fontWeight: diplomeFrancais === 'oui' ? 'bold' : 'normal' }}>{diplomeFrancais === 'oui' ? '●' : '○'} Oui</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: mainColor, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18, backgroundColor: diplomeFrancais === 'non' ? '#EAF0FB' : '#fff' }}
              onPress={() => setDiplomeFrancais('non')}
            >
              <Text style={{ color: mainColor, fontWeight: diplomeFrancais === 'non' ? 'bold' : 'normal' }}>{diplomeFrancais === 'non' ? '●' : '○'} Non</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
            Si vous avez préparé un diplôme français lors de l&apos;année concernée, répondez Oui.{"\n"}
            S&apos;il s&apos;agit d&apos;un diplôme étranger, répondez Non.{"\n"}
            Si vous ne disposez d&apos;aucun diplôme de l&apos;enseignement supérieur, répondez Oui.
          </Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Niveau post-bac du diplôme préparé *</Text>
          <Text style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>
            Sélectionnez le niveau post-bac du diplôme préparé pour l&apos;année renseignée. Si cette année de cursus post-bac ne prépare à aucun diplôme, sélectionner « Pas de diplôme de l&apos;enseignement supérieur »
          </Text>
          <TextInput placeholder="" style={inputStyle} />
          <TouchableOpacity style={{ backgroundColor: '#fff', borderColor: mainColor, borderWidth: 1, borderRadius: 6, padding: 12, marginTop: 18, alignItems: 'center', width: 180, height: 48, justifyContent: 'center' }}>
            <Text style={{ color: mainColor, fontWeight: 'bold' }}>Enregistrer</Text>
          </TouchableOpacity>
        </>
      );
    }
    if (selectedPage === "notes") {
      return (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Image source={require('../../assets/images/icon.png')} style={{ width:187.5, height: 100, resizeMode: 'contain', marginRight: 30 }} />
            <Image source={require('../../assets/images/icon.png')} style={{ width: 340, height: 122, resizeMode: 'contain', marginRight: 30 }} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>Mes relevés de notes</Text>
          <Text style={{ color: '#444', fontSize: 13, marginBottom: 12 }}>
            Vous devez fournir tous les relevés de notes de votre cursus post-baccalauréat.{"\n"}
            Si certains de ces relevés sont en langue étrangère, vous devez en fournir une version traduite en français ou en anglais.{"\n"}
            Le cas échéant, indiquez la raison pour laquelle vous ne disposez pas de ces relevés.{"\n"}
            Attention, toute fraude ou tentative de fraude peut entraîner l'annulation de vos candidatures et propositions d'admission.
          </Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Tous les relevés de notes de mon cursus post-baccalauréat *</Text>
          <TouchableOpacity
            style={{ padding: 10, marginBottom: 8, backgroundColor: '#fff' }}
            onPress={() => setNotesSituation('dispo')}
          >
            <Text style={{ color: mainColor, fontWeight: notesSituation === 'dispo' ? 'bold' : 'normal' }}>{notesSituation === 'dispo' ? '●' : '○'} Je dispose de mes relevés de notes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 10, marginBottom: 8, backgroundColor: '#fff' }}
            onPress={() => setNotesSituation('dispo-traduits')}
          >
            <Text style={{ color: mainColor, fontWeight: notesSituation === 'dispo-traduits' ? 'bold' : 'normal' }}>{notesSituation === 'dispo-traduits' ? '●' : '○'} Je dispose de mes relevés de notes et ceux obtenus à l&apos;étranger sont traduits en français ou en anglais</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 10, marginBottom: 8, backgroundColor: '#fff' }}
            onPress={() => setNotesSituation('partiel')}
          >
            <Text style={{ color: mainColor, fontWeight: notesSituation === 'partiel' ? 'bold' : 'normal' }}>{notesSituation === 'partiel' ? '●' : '○'} Je ne dispose pas de la totalité de mes relevés de note</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 10, marginBottom: 8, backgroundColor: '#fff' }}
            onPress={() => setNotesSituation('aucun')}
          >
            <Text style={{ color: mainColor, fontWeight: notesSituation === 'aucun' ? 'bold' : 'normal' }}>{notesSituation === 'aucun' ? '●' : '○'} Je ne dispose d&apos;aucun relevé de notes</Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', marginBottom: 8, marginTop: 16 }}>Vos relevés de notes *</Text>
          <Text style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
            Téléversez les relevés de notes de tout votre cursus post-baccalauréat, en un seul document. Le fichier téléversé doit avoir une taille maximale de 2 Mo. Les formats de fichiers supportés sont : JPEG, JPG, PNG, PDF.{"\n"}
            Assurez-vous que le nom du fichier n&apos;est pas trop long, ne contient que des caractères latins et ne contient pas de caractère accentué.
          </Text>
          <TouchableOpacity style={{ backgroundColor: '#fff', borderColor: mainColor, borderWidth: 1, borderRadius: 6, padding: 12, marginBottom: 10, alignItems: 'center', width: 180 }}>
            <Text style={{ color: mainColor, fontWeight: 'bold' }}>Importer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: '#eee', borderRadius: 6, padding: 12, marginBottom: 10, alignItems: 'center', width: 180 }}>
            <Text style={{ color: mainColor, fontWeight: 'bold' }}>Supprimer le fichier</Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Commentaire</Text>
          <TextInput placeholder="" style={inputStyle} />
          <TouchableOpacity style={{ backgroundColor: '#fff', borderColor: mainColor, borderWidth: 1, borderRadius: 6, padding: 12, marginTop: 18, alignItems: 'center', width: 180, height: 48, justifyContent: 'center' }}>
            <Text style={{ color: mainColor, fontWeight: 'bold' }}>Enregistrer</Text>
          </TouchableOpacity>
        </>
      );
    }
    if (selectedPage === "experiences") {
      return (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Image source={require('../../assets/images/icon.png')} style={{ width:187.5, height: 100, resizeMode: 'contain', marginRight: 30 }} />
            <Image source={require('../../assets/images/icon.png')} style={{ width: 340, height: 122, resizeMode: 'contain', marginRight: 30 }} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>Ajouter une expérience professionnelle</Text>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
            onPress={() => setNoExperience(!noExperience)}
          >
            <Text style={{ color: mainColor, marginRight: 8 }}>{noExperience ? '☑' : '☐'}</Text>
            <Text style={{ color: '#444', fontSize: 13 }}>
              Je ne déclare aucune expérience professionnelle. En cochant cette case, je ne déclare aucune expérience professionnelle à prendre en compte par les établissements lors de l&apos;examen de mes candidatures.
            </Text>
          </TouchableOpacity>
          {noExperience ? (
            <TouchableOpacity style={{ backgroundColor: '#fff', borderColor: mainColor, borderWidth: 1, borderRadius: 6, padding: 12, marginTop: 18, alignItems: 'center', width: 180, height: 48, justifyContent: 'center' }}>
              <Text style={{ color: mainColor, fontWeight: 'bold' }}>Enregistrer</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={{ fontWeight: 'bold', marginBottom: 8, marginTop: 16 }}>J&apos;ajoute une expérience professionnelle</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Année du début*</Text>
              <TextInput placeholder="" style={inputStyle} />
              <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Durée en mois*</Text>
              <TextInput placeholder="" style={inputStyle} />
              <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Temps plein ou partiel *</Text>
              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <TouchableOpacity style={{ borderWidth: 1, borderColor: mainColor, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18, marginRight: 12 }}>
                  <Text style={{ color: mainColor }}>○ Temps partiel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ borderWidth: 1, borderColor: mainColor, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 18 }}>
                  <Text style={{ color: mainColor }}>○ Temps plein</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Employeur ou organisme *</Text>
              <TextInput placeholder="" style={inputStyle} />
              <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Intitulé*</Text>
              <TextInput placeholder="" style={inputStyle} />
              <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Descriptif</Text>
              <TextInput placeholder="" style={inputStyle} />
              <TouchableOpacity style={{ backgroundColor: '#fff', borderColor: mainColor, borderWidth: 1, borderRadius: 6, padding: 12, marginTop: 18, alignItems: 'center', width: 180, height: 48, justifyContent: 'center' }}>
                <Text style={{ color: mainColor, fontWeight: 'bold' }}>Enregistrer</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      );
    }
    if (selectedPage === "justificatifs") {
      return (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Image source={require('../../assets/images/icon.png')} style={{ width:187.5, height: 100, resizeMode: 'contain', marginRight: 30 }} />
            <Image source={require('../../assets/images/icon.png')} style={{ width: 340, height: 122, resizeMode: 'contain', marginRight: 30 }} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>Autres documents justificatifs</Text>
          <Text style={{ color: '#444', fontSize: 13, marginBottom: 12 }}>
            Veuillez joindre les pièces justificatives suivantes à votre demande : une pièce d&apos;identité en cours de validité ainsi que le dossier de validation dûment complété
          </Text>
          <Text style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
            Le fichier téléversé doit avoir une taille maximale de 2 Mo. Les formats de fichiers supportés sont : JPEG, JPG, PNG, PDF.{"\n"}
            Assurez-vous que le nom du fichier n&apos;est pas trop long, ne contient que des caractères latins et ne contient pas de caractère accentué
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
            <TouchableOpacity style={{
              backgroundColor: mainColor,
              borderColor: mainColor,
              borderWidth: 1,
              borderRadius: 6,
              padding: 12,
              alignItems: 'center',
              justifyContent: 'center',
              width: 180,
              height: 48
            }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Importer</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={{ backgroundColor: mainColor, borderRadius: 6, padding: 12, alignItems: 'center', width: 180 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Supprimer le fichier</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Commentaire</Text>
          <TextInput placeholder="" style={inputStyle} />
          <TouchableOpacity style={{ backgroundColor: '#fff', borderColor: mainColor, borderWidth: 1, borderRadius: 6, padding: 12, marginTop: 18, alignItems: 'center', width: 180, height: 48, justifyContent: 'center' }}>
            <Text style={{ color: mainColor, fontWeight: 'bold' }}>Enregistrer</Text>
          </TouchableOpacity>
        </>
      );
    }
    // Ajoute d'autres pages ici plus tard
    return null;
  }

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: "#fff" }}>
      {/* Sidebar */}
      <View style={{ width: 220, backgroundColor: "#FAFAFA", paddingTop: 40, paddingLeft: 0, borderRightWidth: 1, borderRightColor: '#F0F0F0', minHeight: '100%' }}>
        <TouchableOpacity
          onPress={() => setSelectedPage("infos")}
          style={{ backgroundColor: selectedPage === "infos" ? '#F36F21' : 'transparent', borderRadius: 6, marginHorizontal: 20, marginBottom: 16 }}
        >
          <Text style={{ color: selectedPage === "infos" ? '#fff' : '#888', padding: 12, fontWeight: 'bold', fontSize: 13 }}>Mes informations personnelles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedPage("coordonnees")}
          style={{ backgroundColor: selectedPage === "coordonnees" ? '#F36F21' : 'transparent', borderRadius: 6, marginHorizontal: 20, marginBottom: 16 }}
        >
          <Text style={{ color: selectedPage === "coordonnees" ? '#fff' : '#888', padding: 12, fontWeight: 'bold', fontSize: 13 }}>Mes coordonnées</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedPage("cv")}
          style={{ backgroundColor: selectedPage === "cv" ? '#F36F21' : 'transparent', borderRadius: 6, marginHorizontal: 20, marginBottom: 16 }}
        >
          <Text style={{ color: selectedPage === "cv" ? '#fff' : '#888', padding: 12, fontWeight: 'bold', fontSize: 13 }}>Mon curriculum vitae(CV)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedPage("parcours")}
          style={{ backgroundColor: selectedPage === "parcours" ? '#F36F21' : 'transparent', borderRadius: 6, marginHorizontal: 20, marginBottom: 16 }}
        >
          <Text style={{ color: selectedPage === "parcours" ? '#fff' : '#888', padding: 12, fontWeight: 'bold', fontSize: 13 }}>Mon parcours post-baccalauréat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedPage("notes")}
          style={{ backgroundColor: selectedPage === "notes" ? '#F36F21' : 'transparent', borderRadius: 6, marginHorizontal: 20, marginBottom: 16 }}
        >
          <Text style={{ color: selectedPage === "notes" ? '#fff' : '#888', padding: 12, fontWeight: 'bold', fontSize: 13 }}>Mes relevés de notes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedPage("experiences")}
          style={{ backgroundColor: selectedPage === "experiences" ? '#F36F21' : 'transparent', borderRadius: 6, marginHorizontal: 20, marginBottom: 16 }}
        >
          <Text style={{ color: selectedPage === "experiences" ? '#fff' : '#888', padding: 12, fontWeight: 'bold', fontSize: 13 }}>Mes expériences professionnelles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedPage("justificatifs")}
          style={{ backgroundColor: selectedPage === "justificatifs" ? '#F36F21' : 'transparent', borderRadius: 6, marginHorizontal: 20, marginBottom: 16 }}
        >
          <Text style={{ color: selectedPage === "justificatifs" ? '#fff' : '#888', padding: 12, fontWeight: 'bold', fontSize: 13 }}>Autres documents justificatifs</Text>
        </TouchableOpacity>
      </View>
      {/* Main content */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 64, paddingTop: 48 }}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {renderMainContent()}
      </ScrollView>
    </View>
  );
}
