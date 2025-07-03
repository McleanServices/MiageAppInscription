export interface PersonalInfo {
  civilite: string;
  nom_naissance: string;
  prenom: string;
  nom_usage: string;
  date_naissance: string;
  pays_naissance: string;
  departement_naissance: string;
  ville_naissance: string;
  adresse_actuelle?: string;
  ville_actuelle?: string;
  nationalite?: string;
  pays_residence?: string;
}

export interface ContactInfo {
  email: string;
  telephone_fixe?: string;
  telephone: string;
  adresse: string;
  ville: string;
  code_postal: string;
}

export interface AcademicBackground {
  diplome_francais: boolean;
  niveau_post_bac?: string;
  etablissement?: string;
  specialite?: string;
}

export interface Experience {
  id: string;
  anneeDebut: string;
  dureeEnMois: string;
  tempsPlein: string;
  employeur: string;
  intitule: string;
  descriptif: string;
}

export interface ApiExperience {
  id: number;
  annee_debut: number;
  duree_en_mois: number;
  temps_plein: string;
  employeur: string;
  intitule: string;
  descriptif: string;
}
