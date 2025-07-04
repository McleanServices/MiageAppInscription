
-- Table: Utilisateur
CREATE TABLE Utilisateur (
    id_utilisateur INT IDENTITY(1,1) PRIMARY KEY,
    nom NVARCHAR(100),
    prenom NVARCHAR(100),
    email NVARCHAR(255),
    mot_de_passe NVARCHAR(255),
    role NVARCHAR(50),
    type NVARCHAR(50) -- greta, etudiant, bureau, miage
);

-- Table: Candidat
CREATE TABLE Candidat (
    id_candidat INT IDENTITY(1,1) PRIMARY KEY,
    utilisateur_id INT FOREIGN KEY REFERENCES Utilisateur(id_utilisateur),
    civilite NVARCHAR(10),
    nom_jeune_fille NVARCHAR(100),
    nom_marital NVARCHAR(100),
    prenom NVARCHAR(100),
    date_naissance DATE,
    lieu_naissance NVARCHAR(255),
    nationalite NVARCHAR(100),
    num_securite_sociale NVARCHAR(50),
    nb_enfants INT,
    situation_familiale NVARCHAR(50),
    adresse NVARCHAR(255),
    ville NVARCHAR(100),
    code_postal NVARCHAR(10),
    telephone_fixe NVARCHAR(20),
    gsm NVARCHAR(20),
    autre_tel NVARCHAR(20),
    email NVARCHAR(255),
    mineur_representant_nom NVARCHAR(100),
    mineur_representant_adresse NVARCHAR(255),
    mineur_representant_email NVARCHAR(255),
    heberge_crous BIT,
    situation_professionnelle NVARCHAR(100),
    pole_emploi_num NVARCHAR(50),
    pole_emploi_date DATE,
    reconnaissance_handicap BIT,
    protocole_medical BIT,
    sportif_haut_niveau BIT,
    consentement_rgpd BIT
);

-- Table: CampagneInscription
CREATE TABLE CampagneInscription (
    id_campagne INT IDENTITY(1,1) PRIMARY KEY,
    annee_universitaire NVARCHAR(20),
    date_ouverture DATE,
    date_fermeture DATE,
    active BIT
);

-- Table: DossierCandidature
CREATE TABLE DossierCandidature (
    id_dossier INT IDENTITY(1,1) PRIMARY KEY,
    candidat_id INT FOREIGN KEY REFERENCES Candidat(id_candidat),
    date_creation DATE,
    statut NVARCHAR(50),
    date_validation DATE,
    campagne_id INT FOREIGN KEY REFERENCES CampagneInscription(id_campagne)
);

-- Table: Diplome
CREATE TABLE Diplome (
    id_diplome INT IDENTITY(1,1) PRIMARY KEY,
    candidat_id INT FOREIGN KEY REFERENCES Candidat(id_candidat),
    intitule NVARCHAR(100),
    niveau NVARCHAR(50),
    annee INT,
    obtenu_etranger BIT
);

-- Table: Scolarite
CREATE TABLE Scolarite (
    id_scolarite INT IDENTITY(1,1) PRIMARY KEY,
    candidat_id INT FOREIGN KEY REFERENCES Candidat(id_candidat),
    derniere_classe_suivie NVARCHAR(100),
    derniere_formation_suivie NVARCHAR(100),
    organisme NVARCHAR(100),
    formation_en_apprentissage BIT
);

-- Table: ParcoursProfessionnel
CREATE TABLE ParcoursProfessionnel (
    id_parcours INT IDENTITY(1,1) PRIMARY KEY,
    candidat_id INT FOREIGN KEY REFERENCES Candidat(id_candidat),
    a_exerce_activite BIT,
    contrat_apprentissage BIT,
    nb_annees_experience INT,
    secteurs_activites NVARCHAR(255),
    poste_occupe NVARCHAR(100)
);

-- Table: EntrepriseAccueil
CREATE TABLE EntrepriseAccueil (
    id_entreprise INT IDENTITY(1,1) PRIMARY KEY,
    candidat_id INT FOREIGN KEY REFERENCES Candidat(id_candidat),
    nom NVARCHAR(100),
    contact_nom NVARCHAR(100),
    contact_fonction NVARCHAR(100),
    contact_email NVARCHAR(255),
    contact_telephone NVARCHAR(20)
);

-- Table: OrigineCandidature
CREATE TABLE OrigineCandidature (
    id_origine INT IDENTITY(1,1) PRIMARY KEY,
    candidat_id INT FOREIGN KEY REFERENCES Candidat(id_candidat),
    source NVARCHAR(100),
    autre_precision NVARCHAR(255)
);

-- Table: PieceJustificative
CREATE TABLE PieceJustificative (
    id_piece INT IDENTITY(1,1) PRIMARY KEY,
    dossier_id INT FOREIGN KEY REFERENCES DossierCandidature(id_dossier),
    nom NVARCHAR(100),
    description NVARCHAR(255),
    type NVARCHAR(20),
    date_depot DATE,
    chemin_fichier NVARCHAR(255),
    valide BIT,
    valide_par INT FOREIGN KEY REFERENCES Utilisateur(id_utilisateur)
);

-- Table: StatutHistorique
CREATE TABLE StatutHistorique (
    id_statut INT IDENTITY(1,1) PRIMARY KEY,
    dossier_id INT FOREIGN KEY REFERENCES DossierCandidature(id_dossier),
    ancien_statut NVARCHAR(50),
    nouveau_statut NVARCHAR(50),
    date_changement DATE,
    modifie_par INT FOREIGN KEY REFERENCES Utilisateur(id_utilisateur)
);
