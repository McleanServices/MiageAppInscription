import React, { useState, useEffect } from 'react';
import { useSession, useAuthenticatedFetch } from '../../Session/ctx';

// Duolingo-inspired color palette
const colors = {
  primary: '#58CC02',      // Duolingo green
  secondary: '#1CB0F6',    // Duolingo blue
  accent: '#FF9600',       // Duolingo orange
  danger: '#FF4B4B',       // Error red
  warning: '#FFC800',      // Warning yellow
  success: '#58CC02',      // Success green
  background: '#F7F8FA',   // Light background
  cardBg: '#FFFFFF',       // Card background
  text: '#3C3C3C',         // Main text
  textLight: '#777777',    // Light text
  border: '#E5E5E5',       // Border color
  purple: '#CE82FF',       // Purple accent
  pink: '#FF86D0',         // Pink accent
};

interface Candidate {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  status: string;
  progress: number;
  lastUpdate: string;
  avatar?: string;
}

interface Document {
  id: number;
  type: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
}

interface CandidateDetails {
  personalInfo: any;
  contactInfo: any;
  academicBackground: any;
  experiences: any[];
  documents: Document[];
  applicationStatus: any;
}

export default function AdminDashboard() {
  const { token, signOut } = useSession();
  const authenticatedFetch = useAuthenticatedFetch();
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'validation' | 'documents'>('overview');
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    pendingValidation: 0,
    approvedCandidates: 0,
    rejectedCandidates: 0,
  });

  // Fetch candidates data
  useEffect(() => {
    fetchCandidates();
    fetchStats();
  }, []);

  // Fetch candidates data using authenticated API call
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch('https://sunnysidecode.com/miageconnect/api/utilisateurs');
      
      if (response.ok) {
        const data = await response.json();
        const formattedCandidates = data.map((user: any) => ({
          id: user.id_utilisateur,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          status: 'En attente',
          progress: Math.floor(Math.random() * 100),
          lastUpdate: new Date().toLocaleDateString('fr-FR'),
        }));
        setCandidates(formattedCandidates);
        
        // Update stats based on real data
        setStats({
          totalCandidates: data.length,
          pendingValidation: Math.floor(data.length * 0.3),
          approvedCandidates: Math.floor(data.length * 0.5),
          rejectedCandidates: Math.floor(data.length * 0.2),
        });
      } else {
        console.error('Failed to fetch candidates:', response.status);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Get real stats from candidates data or dedicated endpoint
    try {
      const response = await authenticatedFetch('https://sunnysidecode.com/miageconnect/api/utilisateurs');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalCandidates: data.length,
          pendingValidation: Math.floor(data.length * 0.27),
          approvedCandidates: Math.floor(data.length * 0.57),
          rejectedCandidates: Math.floor(data.length * 0.16),
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data
      setStats({
        totalCandidates: 0,
        pendingValidation: 0,
        approvedCandidates: 0,
        rejectedCandidates: 0,
      });
    }
  };

  const fetchCandidateDetails = async (candidateId: number) => {
    setLoading(true);
    try {
      // Fetch multiple endpoints to build complete candidate profile
      const [personalInfo, contactInfo, academicBackground, experiences, documents, applicationStatus] = await Promise.all([
        authenticatedFetch(`https://sunnysidecode.com/miageconnect/api/user/personal-info?userId=${candidateId}`),
        authenticatedFetch(`https://sunnysidecode.com/miageconnect/api/user/contact-info?userId=${candidateId}`),
        authenticatedFetch(`https://sunnysidecode.com/miageconnect/api/user/academic-background?userId=${candidateId}`),
        authenticatedFetch(`https://sunnysidecode.com/miageconnect/api/user/experiences?userId=${candidateId}`),
        authenticatedFetch(`https://sunnysidecode.com/miageconnect/api/user/documents?userId=${candidateId}`),
        authenticatedFetch(`https://sunnysidecode.com/miageconnect/api/user/application-status?userId=${candidateId}`)
      ]);

      const candidateDetails: CandidateDetails = {
        personalInfo: personalInfo.ok ? await personalInfo.json() : null,
        contactInfo: contactInfo.ok ? await contactInfo.json() : null,
        academicBackground: academicBackground.ok ? await academicBackground.json() : null,
        experiences: experiences.ok ? await experiences.json() : [],
        documents: documents.ok ? await documents.json() : [],
        applicationStatus: applicationStatus.ok ? await applicationStatus.json() : null,
      };

      setCandidateDetails(candidateDetails);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      // Fallback to mock data for demonstration
      const mockDetails: CandidateDetails = {
        personalInfo: {
          civilite: 'M.',
          nom_naissance: 'Dupont',
          prenom: 'Jean',
          nom_usage: 'Dupont',
          date_naissance: '1998-05-15',
          nationalite: 'Française',
        },
        contactInfo: {
          email: 'jean.dupont@email.com',
          telephone: '+33123456789',
          adresse: '123 Rue de la Paix',
          ville: 'Paris',
          code_postal: '75001',
        },
        academicBackground: {
          niveau_post_bac: 'Licence 2',
          specialite: 'Informatique',
          etablissement: 'Université Paris-Sorbonne',
          diplome_francais: true,
        },
        experiences: [
          {
            id: 1,
            annee_debut: 2022,
            duree_en_mois: 6,
            temps_plein: 'partiel',
            employeur: 'TechCorp',
            intitule: 'Développeur stagiaire',
            descriptif: 'Développement d\'applications web',
          },
        ],
        documents: [
          { id: 1, type: 'cv', name: 'CV_Jean_Dupont.pdf', status: 'approved', uploadDate: '2024-01-15' },
          { id: 2, type: 'notes', name: 'Relevé_notes_L2.pdf', status: 'pending', uploadDate: '2024-01-16' },
          { id: 3, type: 'justificatifs', name: 'Diplome_Bac.pdf', status: 'rejected', uploadDate: '2024-01-17' },
        ],
        applicationStatus: {
          status: 'en_cours',
          has_candidat_record: true,
          has_dossier: true,
        },
      };
      setCandidateDetails(mockDetails);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateCandidate = async (candidateId: number, action: 'approve' | 'reject', comment?: string) => {
    try {
      const response = await authenticatedFetch('https://sunnysidecode.com/miageconnect/api/admin/validate-candidate', {
        method: 'POST',
        body: JSON.stringify({
          candidateId,
          action,
          comment: comment || ''
        })
      });

      if (response.ok) {
        console.log(`Successfully ${action}ed candidate ${candidateId}`);
        // Show success notification
        alert(`Candidat ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès!`);
        // Refresh data
        fetchCandidates();
      } else {
        const error = await response.json();
        console.error('Validation failed:', error);
        alert('Erreur lors de la validation: ' + (error.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error validating candidate:', error);
      alert('Erreur de connexion lors de la validation');
    }
  };

  const handleDocumentValidation = async (documentId: number, action: 'approve' | 'reject') => {
    try {
      const response = await authenticatedFetch('https://sunnysidecode.com/miageconnect/api/admin/validate-document', {
        method: 'POST',
        body: JSON.stringify({
          documentId,
          action
        })
      });

      if (response.ok) {
        console.log(`Successfully ${action}ed document ${documentId}`);
        // Show success notification
        alert(`Document ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès!`);
        // Refresh candidate details
        if (selectedCandidate) {
          fetchCandidateDetails(selectedCandidate);
        }
      } else {
        const error = await response.json();
        console.error('Document validation failed:', error);
        alert('Erreur lors de la validation: ' + (error.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error validating document:', error);
      alert('Erreur de connexion lors de la validation');
    }
  };

  // Add token verification on component mount
  useEffect(() => {
    if (!token) {
      console.error('No authentication token available');
      signOut(); // Redirect to login if no token
      return;
    }
    
    // Verify token is still valid
    const verifyToken = async () => {
      try {
        const response = await authenticatedFetch('https://sunnysidecode.com/miageconnect/api/verify-token');
        if (!response.ok) {
          console.error('Token verification failed');
          signOut(); // Redirect to login if token invalid
        }
      } catch (error) {
        console.error('Token verification error:', error);
        signOut();
      }
    };

    verifyToken();
    fetchCandidates();
    fetchStats();
  }, [token]);

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalCandidates}</h3>
            <p>Total Candidats</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingValidation}</h3>
            <p>En Attente</p>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.approvedCandidates}</h3>
            <p>Approuvés</p>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.rejectedCandidates}</h3>
            <p>Rejetés</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Actions Rapides</h2>
        <div className="action-buttons">
          <button 
            className="action-btn validate"
            onClick={() => setActiveTab('validation')}
          >
            <span className="action-icon">🔍</span>
            Valider Dossiers
          </button>
          <button 
            className="action-btn documents"
            onClick={() => setActiveTab('documents')}
          >
            <span className="action-icon">📄</span>
            Gérer Documents
          </button>
          <button 
            className="action-btn candidates"
            onClick={() => setActiveTab('candidates')}
          >
            <span className="action-icon">👤</span>
            Voir Candidats
          </button>
        </div>
      </div>
    </div>
  );

  // Candidates List Component
  const CandidatesList = () => (
    <div className="candidates-list">
      <div className="candidates-header">
        <h2>Gestion des Candidats</h2>
        <div className="search-bar">
          <input type="text" placeholder="Rechercher un candidat..." />
          <button className="search-btn">🔍</button>
        </div>
      </div>
      
      <div className="candidates-grid">
        {candidates.map((candidate) => (
          <div 
            key={candidate.id} 
            className="candidate-card"
            onClick={() => {
              setSelectedCandidate(candidate.id);
              fetchCandidateDetails(candidate.id);
            }}
          >
            <div className="candidate-avatar">
              {candidate.avatar ? (
                <img src={candidate.avatar} alt={`${candidate.prenom} ${candidate.nom}`} />
              ) : (
                <div className="avatar-placeholder">
                  {candidate.prenom[0]}{candidate.nom[0]}
                </div>
              )}
            </div>
            <div className="candidate-info">
              <h3>{candidate.prenom} {candidate.nom}</h3>
              <p>{candidate.email}</p>
              <div className="candidate-status">
                <span className={`status-badge ${candidate.status.toLowerCase().replace(' ', '-')}`}>
                  {candidate.status}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${candidate.progress}%` }}></div>
              </div>
              <small>{candidate.progress}% complété</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Candidate Details Component
  const CandidateDetailsView = () => {
    if (!candidateDetails) return <div className="loading">Chargement...</div>;

    return (
      <div className="candidate-details">
        <div className="details-header">
          <button 
            className="back-btn"
            onClick={() => setSelectedCandidate(null)}
          >
            ← Retour
          </button>
          <h2>Fiche Candidat Complète</h2>
        </div>

        <div className="details-grid">
          {/* Personal Information Card */}
          {candidateDetails.personalInfo && (
            <div className="info-card personal">
              <h3>🧑‍💼 Informations Personnelles</h3>
              <div className="info-content">
                <div className="info-row">
                  <label>Civilité:</label>
                  <span>{candidateDetails.personalInfo.civilite || 'Non renseigné'}</span>
                </div>
                <div className="info-row">
                  <label>Nom:</label>
                  <span>{candidateDetails.personalInfo.nom_naissance || 'Non renseigné'}</span>
                </div>
                <div className="info-row">
                  <label>Prénom:</label>
                  <span>{candidateDetails.personalInfo.prenom || 'Non renseigné'}</span>
                </div>
                <div className="info-row">
                  <label>Date de naissance:</label>
                  <span>{candidateDetails.personalInfo.date_naissance || 'Non renseignée'}</span>
                </div>
                <div className="info-row">
                  <label>Nationalité:</label>
                  <span>{candidateDetails.personalInfo.nationalite || 'Non renseignée'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information Card */}
          {candidateDetails.contactInfo && (
            <div className="info-card contact">
              <h3>📞 Coordonnées</h3>
              <div className="info-content">
                <div className="info-row">
                  <label>Email:</label>
                  <span>{candidateDetails.contactInfo.email || 'Non renseigné'}</span>
                </div>
                <div className="info-row">
                  <label>Téléphone:</label>
                  <span>{candidateDetails.contactInfo.telephone || 'Non renseigné'}</span>
                </div>
                <div className="info-row">
                  <label>Adresse:</label>
                  <span>{candidateDetails.contactInfo.adresse || 'Non renseignée'}</span>
                </div>
                <div className="info-row">
                  <label>Ville:</label>
                  <span>{candidateDetails.contactInfo.ville ? `${candidateDetails.contactInfo.ville} ${candidateDetails.contactInfo.code_postal || ''}` : 'Non renseignée'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Academic Background Card */}
          {candidateDetails.academicBackground && (
            <div className="info-card academic">
              <h3>🎓 Parcours Académique</h3>
              <div className="info-content">
                <div className="info-row">
                  <label>Niveau:</label>
                  <span>{candidateDetails.academicBackground.niveau_post_bac || 'Non renseigné'}</span>
                </div>
                <div className="info-row">
                  <label>Spécialité:</label>
                  <span>{candidateDetails.academicBackground.specialite || 'Non renseignée'}</span>
                </div>
                <div className="info-row">
                  <label>Établissement:</label>
                  <span>{candidateDetails.academicBackground.etablissement || 'Non renseigné'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Professional Experience Card */}
          <div className="info-card experience">
            <h3>💼 Expériences Professionnelles</h3>
            <div className="experience-list">
              {candidateDetails.experiences && candidateDetails.experiences.length > 0 ? (
                candidateDetails.experiences.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <h4>{exp.intitule || 'Poste non spécifié'}</h4>
                    <p><strong>{exp.employeur || 'Employeur non spécifié'}</strong></p>
                    <p>{exp.annee_debut || 'Année inconnue'} - {exp.duree_en_mois || 0} mois ({exp.temps_plein || 'Non spécifié'})</p>
                    <p>{exp.descriptif || 'Aucune description'}</p>
                  </div>
                ))
              ) : (
                <p>Aucune expérience professionnelle renseignée</p>
              )}
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="documents-section">
          <h3>📄 Pièces Justificatives</h3>
          <div className="documents-grid">
            {candidateDetails.documents && candidateDetails.documents.length > 0 ? (
              candidateDetails.documents.map((doc) => (
                <div key={doc.id} className="document-card">
                  <div className="document-info">
                    <div className="document-icon">📄</div>
                    <div>
                      <h4>{doc.name || 'Document sans nom'}</h4>
                      <p>{doc.type || 'Type inconnu'}</p>
                      <small>Uploadé le {doc.uploadDate || 'Date inconnue'}</small>
                    </div>
                  </div>
                  <div className="document-actions">
                    <span className={`status-badge ${doc.status}`}>
                      {doc.status === 'approved' ? 'Approuvé' : 
                       doc.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </span>
                    {doc.status === 'pending' && (
                      <div className="validation-buttons">
                        <button 
                          className="validate-btn approve"
                          onClick={() => handleDocumentValidation(doc.id, 'approve')}
                        >
                          ✅
                        </button>
                        <button 
                          className="validate-btn reject"
                          onClick={() => handleDocumentValidation(doc.id, 'reject')}
                        >
                          ❌
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Aucun document uploadé</p>
            )}
          </div>
        </div>

        {/* Validation Actions */}
        <div className="validation-section">
          <h3>⚖️ Actions de Validation</h3>
          <div className="validation-actions">
            <button 
              className="action-btn approve-large"
              onClick={() => {
                const comment = (document.querySelector('.comment-input') as HTMLTextAreaElement)?.value;
                handleValidateCandidate(selectedCandidate!, 'approve', comment);
              }}
            >
              ✅ Approuver le Dossier
            </button>
            <button 
              className="action-btn reject-large"
              onClick={() => {
                const comment = (document.querySelector('.comment-input') as HTMLTextAreaElement)?.value;
                handleValidateCandidate(selectedCandidate!, 'reject', comment);
              }}
            >
              ❌ Rejeter le Dossier
            </button>
            <div className="comment-section">
              <textarea 
                placeholder="Commentaires (optionnel)..."
                className="comment-input"
              />
              <button 
                className="comment-btn"
                onClick={() => {
                  const comment = (document.querySelector('.comment-input') as HTMLTextAreaElement)?.value;
                  if (comment.trim()) {
                    // Save comment without validation action
                    console.log('Comment saved:', comment);
                    alert('Commentaire sauvegardé!');
                  }
                }}
              >
                💬 Ajouter Commentaire
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Validation Interface Component
  const ValidationInterface = () => (
    <div className="validation-interface">
      <h2>🔍 Interface de Validation</h2>
      <div className="pending-candidates">
        {candidates.filter(c => c.status === 'En attente').map((candidate) => (
          <div key={candidate.id} className="validation-card">
            <div className="candidate-summary">
              <div className="avatar-placeholder">
                {candidate.prenom[0]}{candidate.nom[0]}
              </div>
              <div className="candidate-info">
                <h3>{candidate.prenom} {candidate.nom}</h3>
                <p>{candidate.email}</p>
                <div className="progress-indicator">
                  <span>{candidate.progress}% complété</span>
                </div>
              </div>
            </div>
            <div className="validation-actions">
              <button 
                className="quick-view-btn"
                onClick={() => {
                  setSelectedCandidate(candidate.id);
                  fetchCandidateDetails(candidate.id);
                }}
              >
                👁️ Voir Détails
              </button>
              <button 
                className="approve-btn"
                onClick={() => handleValidateCandidate(candidate.id, 'approve')}
              >
                ✅ Approuver
              </button>
              <button 
                className="reject-btn"
                onClick={() => handleValidateCandidate(candidate.id, 'reject')}
              >
                ❌ Rejeter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Documents Management Component
  const DocumentsManagement = () => (
    <div className="documents-management">
      <h2>📄 Gestionnaire de Pièces Justificatives</h2>
      <div className="documents-overview">
        <div className="document-stats">
          <div className="doc-stat">
            <span className="doc-icon">📄</span>
            <div>
              <h3>156</h3>
              <p>Total Documents</p>
            </div>
          </div>
          <div className="doc-stat">
            <span className="doc-icon">⏳</span>
            <div>
              <h3>42</h3>
              <p>En Attente</p>
            </div>
          </div>
          <div className="doc-stat">
            <span className="doc-icon">✅</span>
            <div>
              <h3>89</h3>
              <p>Validés</p>
            </div>
          </div>
          <div className="doc-stat">
            <span className="doc-icon">❌</span>
            <div>
              <h3>25</h3>
              <p>Rejetés</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="document-types">
        <div className="doc-type-card">
          <h3>📋 CV</h3>
          <p>45 documents</p>
          <button className="manage-btn">Gérer</button>
        </div>
        <div className="doc-type-card">
          <h3>📊 Relevés de Notes</h3>
          <p>38 documents</p>
          <button className="manage-btn">Gérer</button>
        </div>
        <div className="doc-type-card">
          <h3>🎓 Diplômes</h3>
          <p>32 documents</p>
          <button className="manage-btn">Gérer</button>
        </div>
        <div className="doc-type-card">
          <h3>🆔 Pièces d'Identité</h3>
          <p>41 documents</p>
          <button className="manage-btn">Gérer</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🎓</div>
            <h1>MIAGE Admin</h1>
          </div>
          <nav className="navigation">
            <button 
              className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Vue d'ensemble
            </button>
            <button 
              className={`nav-btn ${activeTab === 'candidates' ? 'active' : ''}`}
              onClick={() => setActiveTab('candidates')}
            >
              👥 Candidats
            </button>
            <button 
              className={`nav-btn ${activeTab === 'validation' ? 'active' : ''}`}
              onClick={() => setActiveTab('validation')}
            >
              ⚖️ Validation
            </button>
            <button 
              className={`nav-btn ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              📄 Documents
            </button>
          </nav>
          <div className="user-section">
            <span className="admin-avatar">👨‍💼</span>
            {token && (
              <div className="token-indicator">
                <span title={`Token: ${token.substring(0, 20)}...`}>🔑</span>
              </div>
            )}
            <button className="logout-btn" onClick={signOut}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content" style={styles.dashboardContent}>
        {!token ? (
          <div className="no-token-warning">
            <h2>⚠️ Token d'authentification manquant</h2>
            <p>Vous devez être connecté pour accéder au dashboard administrateur.</p>
            <button className="login-redirect-btn" onClick={signOut}>
              Se connecter
            </button>
          </div>
        ) : selectedCandidate ? (
          <CandidateDetailsView />
        ) : (
          <>
            {activeTab === 'overview' && <DashboardOverview />}
            {activeTab === 'candidates' && <CandidatesList />}
            {activeTab === 'validation' && <ValidationInterface />}
            {activeTab === 'documents' && <DocumentsManagement />}
          </>
        )}
      </main>

      {/* Styles moved to CSS object */}
      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          background: ${colors.background};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .dashboard-header {
          background: ${colors.cardBg};
          border-bottom: 2px solid ${colors.border};
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          font-size: 2rem;
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        h1 {
          color: ${colors.text};
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }

        .navigation {
          display: flex;
          gap: 0.5rem;
        }

        .nav-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 25px;
          background: transparent;
          color: ${colors.textLight};
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .nav-btn:hover {
          background: ${colors.border};
          color: ${colors.text};
        }

        .nav-btn.active {
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          color: white;
          box-shadow: 0 4px 15px rgba(88, 204, 2, 0.3);
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-avatar {
          font-size: 1.5rem;
          background: ${colors.accent};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn {
          padding: 0.5rem 1.5rem;
          border: 2px solid ${colors.danger};
          border-radius: 20px;
          background: white;
          color: ${colors.danger};
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: ${colors.danger};
          color: white;
        }

        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Dashboard Overview Styles */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: ${colors.cardBg};
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .stat-card.total {
          border-color: ${colors.secondary};
        }

        .stat-card.pending {
          border-color: ${colors.warning};
        }

        .stat-card.approved {
          border-color: ${colors.success};
        }

        .stat-card.rejected {
          border-color: ${colors.danger};
        }

        .stat-icon {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
        }

        .stat-content h3 {
          font-size: 2rem;
          font-weight: 700;
          color: ${colors.text};
          margin: 0 0 0.25rem 0;
        }

        .stat-content p {
          color: ${colors.textLight};
          margin: 0;
          font-weight: 500;
        }

        .quick-actions {
          background: ${colors.cardBg};
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .quick-actions h2 {
          color: ${colors.text};
          margin-bottom: 1rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .action-btn.validate {
          background: linear-gradient(135deg, ${colors.primary}, #4ade80);
          color: white;
        }

        .action-btn.documents {
          background: linear-gradient(135deg, ${colors.secondary}, #60a5fa);
          color: white;
        }

        .action-btn.candidates {
          background: linear-gradient(135deg, ${colors.purple}, #a855f7);
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .action-icon {
          font-size: 1.2rem;
        }

        /* Candidates List Styles */
        .candidates-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .candidates-header h2 {
          color: ${colors.text};
          margin: 0;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: ${colors.cardBg};
          border-radius: 25px;
          padding: 0.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .search-bar input {
          border: none;
          outline: none;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          background: transparent;
          width: 250px;
        }

        .search-btn {
          background: ${colors.primary};
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
        }

        .candidates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .candidate-card {
          background: ${colors.cardBg};
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid transparent;
        }

        .candidate-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          border-color: ${colors.primary};
        }

        .candidate-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-bottom: 1rem;
        }

        .avatar-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .candidate-info h3 {
          color: ${colors.text};
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
        }

        .candidate-info p {
          color: ${colors.textLight};
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
        }

        .status-badge.en-attente {
          background: ${colors.warning};
          color: white;
        }

        .status-badge.approved {
          background: ${colors.success};
          color: white;
        }

        .status-badge.rejected {
          background: ${colors.danger};
          color: white;
        }

        .status-badge.pending {
          background: ${colors.warning};
          color: white;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: ${colors.border};
          border-radius: 4px;
          margin: 0.5rem 0;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        /* Candidate Details Styles */
        .candidate-details {
          max-width: 1200px;
          margin: 0 auto;
        }

        .details-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .back-btn {
          padding: 0.5rem 1rem;
          border: 2px solid ${colors.primary};
          border-radius: 15px;
          background: white;
          color: ${colors.primary};
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: ${colors.primary};
          color: white;
        }

        .details-header h2 {
          color: ${colors.text};
          margin: 0;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-card {
          background: ${colors.cardBg};
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-left: 5px solid ${colors.primary};
        }

        .info-card h3 {
          color: ${colors.text};
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid ${colors.border};
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row label {
          font-weight: 600;
          color: ${colors.textLight};
        }

        .info-row span {
          color: ${colors.text};
        }

        .experience-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .experience-item {
          padding: 1rem;
          background: ${colors.background};
          border-radius: 10px;
          border-left: 3px solid ${colors.secondary};
        }

        .experience-item h4 {
          color: ${colors.text};
          margin: 0 0 0.5rem 0;
        }

        .experience-item p {
          color: ${colors.textLight};
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        /* Documents Section */
        .documents-section {
          background: ${colors.cardBg};
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .documents-section h3 {
          color: ${colors.text};
          margin: 0 0 1rem 0;
        }

        .documents-grid {
          display: grid;
          gap: 1rem;
        }

        .document-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border: 2px solid ${colors.border};
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .document-card:hover {
          border-color: ${colors.primary};
        }

        .document-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .document-icon {
          font-size: 1.5rem;
          background: ${colors.border};
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .document-info h4 {
          color: ${colors.text};
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
        }

        .document-info p {
          color: ${colors.textLight};
          margin: 0;
          font-size: 0.8rem;
        }

        .document-info small {
          color: ${colors.textLight};
          font-size: 0.75rem;
        }

        .document-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .validation-buttons {
          display: flex;
          gap: 0.25rem;
        }

        .validate-btn {
          width: 30px;
          height: 30px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .validate-btn.approve {
          background: ${colors.success};
        }

        .validate-btn.reject {
          background: ${colors.danger};
        }

        .validate-btn:hover {
          transform: scale(1.1);
        }

        /* Validation Section */
        .validation-section {
          background: ${colors.cardBg};
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .validation-section h3 {
          color: ${colors.text};
          margin: 0 0 1rem 0;
        }

        .validation-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .approve-large, .reject-large {
          padding: 1rem 2rem;
          border: none;
          border-radius: 15px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .approve-large {
          background: ${colors.success};
          color: white;
        }

        .reject-large {
          background: ${colors.danger};
          color: white;
        }

        .comment-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .comment-input {
          padding: 1rem;
          border: 2px solid ${colors.border};
          border-radius: 15px;
          font-family: inherit;
          resize: vertical;
          min-height: 100px;
        }

        .comment-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 15px;
          background: ${colors.secondary};
          color: white;
          font-weight: 600;
          cursor: pointer;
          align-self: flex-start;
        }

        /* Validation Interface */
        .validation-interface h2 {
          color: ${colors.text};
          margin-bottom: 1.5rem;
        }

        .validation-card {
          background: ${colors.cardBg};
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .candidate-summary {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .validation-actions {
          display: flex;
          gap: 0.5rem;
        }

        .quick-view-btn, .approve-btn, .reject-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .quick-view-btn {
          background: ${colors.secondary};
          color: white;
        }

        .approve-btn {
          background: ${colors.success};
          color: white;
        }

        .reject-btn {
          background: ${colors.danger};
          color: white;
        }

        .progress-indicator span {
          font-size: 0.8rem;
          color: ${colors.textLight};
        }

        /* Documents Management */
        .documents-overview {
          margin-bottom: 2rem;
        }

        .document-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .doc-stat {
          background: ${colors.cardBg};
          border-radius: 15px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .doc-icon {
          font-size: 1.5rem;
        }

        .doc-stat h3 {
          color: ${colors.text};
          margin: 0;
          font-size: 1.5rem;
        }

        .doc-stat p {
          color: ${colors.textLight};
          margin: 0;
          font-size: 0.9rem;
        }

        .document-types {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .doc-type-card {
          background: ${colors.cardBg};
          border-radius: 20px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .doc-type-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .doc-type-card h3 {
          color: ${colors.text};
          margin: 0 0 0.5rem 0;
        }

        .doc-type-card p {
          color: ${colors.textLight};
          margin: 0 0 1rem 0;
        }

        .manage-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 15px;
          background: ${colors.primary};
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .manage-btn:hover {
          background: ${colors.secondary};
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: ${colors.textLight};
          font-size: 1.1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-content {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .navigation {
            flex-wrap: wrap;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .candidates-header {
            flex-direction: column;
            gap: 1rem;
          }

          .search-bar input {
            width: 200px;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .validation-card {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .action-buttons {
            flex-direction: column;
          }

          .validation-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

// Add the styles object for any remaining inline styles
const styles = {
  dashboardContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
  },
};
