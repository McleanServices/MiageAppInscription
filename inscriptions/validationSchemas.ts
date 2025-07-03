import * as yup from 'yup';

// Personal Information Schema
export const personalInfoSchema = yup.object().shape({
  civilite: yup.string().required('La civilité est obligatoire'),
  nom: yup.string()
    .required('Le nom de naissance est obligatoire')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  prenom: yup.string()
    .required('Le prénom est obligatoire')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  nomUsage: yup.string()
    .max(50, 'Le nom d\'usage ne peut pas dépasser 50 caractères'),
  dateNaissance: yup.date()
    .required('La date de naissance est obligatoire')
    .max(new Date(), 'La date de naissance ne peut pas être dans le futur')
    .min(new Date(1900, 0, 1), 'La date de naissance doit être après 1900'),
  paysNaissance: yup.string()
    .required('Le pays de naissance est obligatoire'),
  departementNaissance: yup.string()
    .required('Le département de naissance est obligatoire'),
  villeNaissance: yup.string()
    .required('La ville de naissance est obligatoire'),
  adresse: yup.string()
    .required('L\'adresse est obligatoire')
    .min(10, 'L\'adresse doit contenir au moins 10 caractères'),
  ville: yup.string()
    .required('La ville est obligatoire'),
});

// Contact Information Schema
export const contactInfoSchema = yup.object().shape({
  email: yup.string()
    .required('L\'adresse électronique est obligatoire')
    .email('Format d\'email invalide'),
  telephone: yup.string()
    .required('Le téléphone est obligatoire')
    .matches(
      /^(\+33|0)[1-9](\d{8})$/,
      'Format de téléphone invalide. Utilisez le format 06XXXXXXXX, 07XXXXXXXX, +336XXXXXXXX ou +337XXXXXXXX'
    ),
  adresse: yup.string()
    .min(10, 'L\'adresse doit contenir au moins 10 caractères'),
});

// CV Schema
export const cvSchema = yup.object().shape({
  cvFile: yup.mixed()
    .required('Le CV est obligatoire')
    .test('fileSize', 'Le fichier ne doit pas dépasser 2 Mo', (value) => {
      if (!value) return true;
      return value.size <= 2 * 1024 * 1024; // 2MB
    })
    .test('fileType', 'Format de fichier non supporté', (value) => {
      if (!value) return true;
      const supportedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      return supportedTypes.includes(value.mimeType);
    }),
});

// Academic Path Schema
export const academicPathSchema = yup.object().shape({
  diplomeFrancais: yup.string()
    .required('Veuillez indiquer s\'il s\'agit d\'un diplôme français'),
  niveauDiplome: yup.string()
    .required('Le niveau du diplôme est obligatoire'),
  label: yup.string()
    .min(3, 'Le label doit contenir au moins 3 caractères'),
});

// Notes Schema
export const notesSchema = yup.object().shape({
  notesOption: yup.string()
    .required('Veuillez sélectionner une option concernant vos relevés de notes'),
  notesFile: yup.mixed()
    .when('notesOption', {
      is: (option: string) => option === '1' || option === '2',
      then: (schema) => schema
        .required('Le fichier de relevés de notes est obligatoire')
        .test('fileSize', 'Le fichier ne doit pas dépasser 2 Mo', (value) => {
          if (!value) return true;
          return value.size <= 2 * 1024 * 1024; // 2MB
        })
        .test('fileType', 'Format de fichier non supporté', (value) => {
          if (!value) return true;
          const supportedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
          return supportedTypes.includes(value.mimeType);
        }),
      otherwise: (schema) => schema.nullable(),
    }),
  commentaire: yup.string()
    .max(500, 'Le commentaire ne peut pas dépasser 500 caractères'),
});

// Professional Experience Schema
export const experienceSchema = yup.object().shape({
  aucuneExperience: yup.boolean(),
  experiences: yup.array().when('aucuneExperience', {
    is: false,
    then: (schema) => schema
      .min(1, 'Vous devez ajouter au moins une expérience ou cocher "Aucune expérience"')
      .of(
        yup.object().shape({
          anneeDebut: yup.string()
            .required('L\'année de début est obligatoire')
            .matches(/^\d{4}$/, 'Format d\'année invalide (YYYY)')
            .test('yearRange', 'L\'année doit être entre 1950 et l\'année actuelle', (value) => {
              if (!value) return true;
              const year = parseInt(value);
              const currentYear = new Date().getFullYear();
              return year >= 1950 && year <= currentYear;
            }),
          dureeEnMois: yup.string()
            .required('La durée en mois est obligatoire')
            .matches(/^\d+$/, 'La durée doit être un nombre')
            .test('durationRange', 'La durée doit être entre 1 et 120 mois', (value) => {
              if (!value) return true;
              const duration = parseInt(value);
              return duration >= 1 && duration <= 120;
            }),
          tempsPlein: yup.string()
            .required('Le type de temps de travail est obligatoire')
            .oneOf(['plein', 'partiel'], 'Veuillez sélectionner un type de temps de travail'),
          employeur: yup.string()
            .required('L\'employeur est obligatoire')
            .min(2, 'L\'employeur doit contenir au moins 2 caractères')
            .max(100, 'L\'employeur ne peut pas dépasser 100 caractères'),
          intitule: yup.string()
            .required('L\'intitulé est obligatoire')
            .min(2, 'L\'intitulé doit contenir au moins 2 caractères')
            .max(100, 'L\'intitulé ne peut pas dépasser 100 caractères'),
          descriptif: yup.string()
            .max(500, 'Le descriptif ne peut pas dépasser 500 caractères'),
        })
      ),
    otherwise: (schema) => schema.nullable(),
  }),
});

// Justificatifs Schema
export const justificatifsSchema = yup.object().shape({
  justificatifFile: yup.mixed()
    .required('Le justificatif est obligatoire')
    .test('fileSize', 'Le fichier ne doit pas dépasser 2 Mo', (value) => {
      if (!value) return true;
      return value.size <= 2 * 1024 * 1024; // 2MB
    })
    .test('fileType', 'Format de fichier non supporté', (value) => {
      if (!value) return true;
      const supportedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      return supportedTypes.includes(value.mimeType);
    }),
  commentaire: yup.string()
    .max(500, 'Le commentaire ne peut pas dépasser 500 caractères'),
});

// Complete form schema (for final validation)
export const completeFormSchema = yup.object().shape({
  // Personal Info
  civilite: personalInfoSchema.fields.civilite,
  nom: personalInfoSchema.fields.nom,
  prenom: personalInfoSchema.fields.prenom,
  nomUsage: personalInfoSchema.fields.nomUsage,
  dateNaissance: personalInfoSchema.fields.dateNaissance,
  paysNaissance: personalInfoSchema.fields.paysNaissance,
  departementNaissance: personalInfoSchema.fields.departementNaissance,
  villeNaissance: personalInfoSchema.fields.villeNaissance,
  adresse: personalInfoSchema.fields.adresse,
  ville: personalInfoSchema.fields.ville,
  
  // Contact Info
  email: contactInfoSchema.fields.email,
  telephone: contactInfoSchema.fields.telephone,
  
  // CV
  cvFile: cvSchema.fields.cvFile,
  
  // Academic Path
  diplomeFrancais: academicPathSchema.fields.diplomeFrancais,
  niveauDiplome: academicPathSchema.fields.niveauDiplome,
  label: academicPathSchema.fields.label,
  
  // Notes
  notesOption: notesSchema.fields.notesOption,
  notesFile: notesSchema.fields.notesFile,
  commentaire: notesSchema.fields.commentaire,
  
  // Experiences
  aucuneExperience: experienceSchema.fields.aucuneExperience,
  experiences: experienceSchema.fields.experiences,
  
  // Justificatifs
  justificatifFile: justificatifsSchema.fields.justificatifFile,
  commentaireJustificatif: justificatifsSchema.fields.commentaire,
}); 