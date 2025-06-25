import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Picker } from '@react-native-picker/picker'; // npm install @react-native-picker/picker

const countries = [
  "Afghanistan", "Afrique du Sud", "Albanie", "Algérie", "Allemagne", "Andorre", "Angola", "Antigua-et-Barbuda", "Arabie saoudite", "Argentine", "Arménie", "Australie", "Autriche", "Azerbaïdjan", "Bahamas", "Bahreïn", "Bangladesh", "Barbade", "Belgique", "Belize", "Bénin", "Bhoutan", "Biélorussie", "Birmanie", "Bolivie", "Bosnie-Herzégovine", "Botswana", "Brésil", "Brunei", "Bulgarie", "Burkina Faso", "Burundi", "Cambodge", "Cameroun", "Canada", "Cap-Vert", "République centrafricaine", "Chili", "Chine", "Chypre", "Colombie", "Comores", "Congo-Brazzaville", "Congo-Kinshasa", "Îles Cook", "Corée du Nord", "Corée du Sud", "Costa Rica", "Côte d'Ivoire", "Croatie", "Cuba", "Danemark", "Djibouti", "Dominique", "Égypte", "Émirats arabes unis", "Équateur", "Érythrée", "Espagne", "Estonie", "Eswatini", "États-Unis", "Éthiopie", "Fidji", "Finlande", "France", "Gabon", "Gambie", "Géorgie", "Ghana", "Grèce", "Grenade", "Guatemala", "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Guyana", "Haïti", "Honduras", "Hongrie", "Inde", "Indonésie", "Irak", "Iran", "Irlande", "Islande", "Israël", "Italie", "Jamaïque", "Japon", "Jordanie", "Kazakhstan", "Kenya", "Kirghizistan", "Kiribati", "Koweït", "Laos", "Lesotho", "Lettonie", "Liban", "Liberia", "Libye", "Liechtenstein", "Lituanie", "Luxembourg", "Macédoine du Nord", "Madagascar", "Malaisie", "Malawi", "Maldives", "Mali", "Malte", "Maroc", "Îles Marshall", "Maurice", "Mauritanie", "Mexique", "Micronésie", "Moldavie", "Monaco", "Mongolie", "Monténégro", "Mozambique", "Namibie", "Nauru", "Népal", "Nicaragua", "Niger", "Nigéria", "Norvège", "Nouvelle-Zélande", "Oman", "Ouganda", "Ouzbékistan", "Pakistan", "Palaos", "Palestine", "Panama", "Papouasie-Nouvelle-Guinée", "Paraguay", "Pays-Bas", "Pérou", "Philippines", "Pologne", "Portugal", "Qatar", "Roumanie", "Royaume-Uni", "Russie", "Rwanda", "Saint-Kitts-et-Nevis", "Saint-Marin", "Saint-Vincent-et-les-Grenadines", "Sainte-Lucie", "Salomon", "Salvador", "Samoa", "Sao Tomé-et-Principe", "Sénégal", "Serbie", "Seychelles", "Sierra Leone", "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan", "Soudan du Sud", "Sri Lanka", "Suède", "Suisse", "Suriname", "Syrie", "Tadjikistan", "Tanzanie", "Tchad", "République tchèque", "Thaïlande", "Timor oriental", "Togo", "Tonga", "Trinité-et-Tobago", "Tunisie", "Turkménistan", "Turquie", "Tuvalu", "Ukraine", "Uruguay", "Vanuatu", "Vatican", "Venezuela", "Viêt Nam", "Yémen", "Zambie", "Zimbabwe"
];

const mainColor = "#0C284F";

export default function InfosScreen() {
  const [civilite, setCivilite] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nationalite, setNationalite] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthCountry, setBirthCountry] = useState("");
  const [birthDept, setBirthDept] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [addressCountry, setAddressCountry] = useState("");
  const [address, setAddress] = useState("");
  const [addressCity, setAddressCity] = useState("");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      {/* Logos */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
        <Image source={require('../assets/images/icon.png')} style={{ width: 100, height: 50, resizeMode: 'contain', marginRight: 10 }} />
        <Image source={require('../assets/images/icon.png')} style={{ width: 100, height: 50, resizeMode: 'contain' }} />
      </View>
      {/* Title */}
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 18 }}>Mes informations personnelles</Text>
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
      <TextInput value={nom} onChangeText={setNom} placeholder="" style={inputStyle} />
      <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Prénom *</Text>
      <TextInput value={prenom} onChangeText={setPrenom} placeholder="" style={inputStyle} />
      <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Nationalité*</Text>
      <TextInput value={nationalite} onChangeText={setNationalite} placeholder="" style={inputStyle} />
      {/* Naissance */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 12 }}>Naissance</Text>
      <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Date de naissance *</Text>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        {/* Jour */}
        <View style={{ flex: 1, marginRight: 4 }}>
          <Picker
            selectedValue={birthDay}
            onValueChange={setBirthDay}
          >
            <Picker.Item label="Jour" value="" />
            {[...Array(31)].map((_, i) => (
              <Picker.Item key={i+1} label={`${i+1}`} value={`${i+1}`} />
            ))}
          </Picker>
        </View>
        {/* Mois */}
        <View style={{ flex: 1, marginRight: 4 }}>
          <Picker
            selectedValue={birthMonth}
            onValueChange={setBirthMonth}
          >
            <Picker.Item label="Mois" value="" />
            {['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'].map((m, i) => (
              <Picker.Item key={i+1} label={m} value={m} />
            ))}
          </Picker>
        </View>
        {/* Année */}
        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={birthYear}
            onValueChange={setBirthYear}
          >
            <Picker.Item label="Année" value="" />
            {Array.from({length: 2024-1980+1}, (_, i) => 1980+i).reverse().map(y => (
              <Picker.Item key={y} label={`${y}`} value={`${y}`} />
            ))}
          </Picker>
        </View>
      </View>
      <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Pays de naissance *</Text>
      <Picker
        selectedValue={birthCountry}
        style={{ marginBottom: 12 }}
        onValueChange={setBirthCountry}
      >
        <Picker.Item label="Sélectionnez un pays" value="" />
        {countries.map((c) => (
          <Picker.Item key={c} label={c} value={c} />
        ))}
      </Picker>
      <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Département de naissance *</Text>
      <TextInput value={birthDept} onChangeText={setBirthDept} placeholder="" style={inputStyle} />
      <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Ville de naissance *</Text>
      <TextInput value={birthCity} onChangeText={setBirthCity} placeholder="" style={inputStyle} />
      {/* Adresse */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 12 }}>Adresse</Text>
      <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Pays*</Text>
      <Picker
        selectedValue={addressCountry}
        style={{ marginBottom: 12 }}
        onValueChange={setAddressCountry}
      >
        <Picker.Item label="Sélectionnez un pays" value="" />
        {countries.map((c) => (
          <Picker.Item key={c} label={c} value={c} />
        ))}
      </Picker>
      <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Adresse</Text>
      <TextInput value={address} onChangeText={setAddress} placeholder="" style={inputStyle} />
      <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Ville/Commune</Text>
      <TextInput value={addressCity} onChangeText={setAddressCity} placeholder="" style={inputStyle} />
      <TouchableOpacity style={{ backgroundColor: '#fff', borderColor: mainColor, borderWidth: 1, borderRadius: 6, padding: 12, marginTop: 18, alignItems: 'center', width: 180, height: 48, justifyContent: 'center' }}>
        <Text style={{ color: mainColor, fontWeight: 'bold' }}>Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const inputStyle = {
  backgroundColor: '#F5F5F5',
  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal: 14,
  marginBottom: 6,
  fontSize: 15,
  borderWidth: 0,
};