import { useState } from 'react';
import { useAuthenticatedFetch, useToken } from '../../Session/ctx';

export function useFormData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authenticatedFetch = useAuthenticatedFetch();
  const token = useToken();

  const apiCall = async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
    }

    const response = await authenticatedFetch(`https://sunnysidecode.com${url}`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur serveur');
    }
    
    return response.json();
  };

  const fetchPersonalInfo = async () => {
    try {
      setError(null);
      return await apiCall('/miageconnect/api/user/personal-info');
    } catch (err) {
      console.error('Error fetching personal info:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      return null;
    }
  };

  const savePersonalInfo = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await apiCall('/miageconnect/api/user/personal-info', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return true;
    } catch (err) {
      console.error('Error saving personal info:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchContactInfo = async () => {
    try {
      setError(null);
      return await apiCall('/miageconnect/api/user/contact-info');
    } catch (err) {
      console.error('Error fetching contact info:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      return null;
    }
  };

  const saveContactInfo = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await apiCall('/miageconnect/api/user/contact-info', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return true;
    } catch (err) {
      console.error('Error saving contact info:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicBackground = async () => {
    try {
      setError(null);
      return await apiCall('/miageconnect/api/user/academic-background');
    } catch (err) {
      console.error('Error fetching academic background:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      return null;
    }
  };

  const saveAcademicBackground = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await apiCall('/miageconnect/api/user/academic-background', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return true;
    } catch (err) {
      console.error('Error saving academic background:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      setError(null);
      return await apiCall('/miageconnect/api/user/experiences');
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      return [];
    }
  };

  const saveExperience = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await apiCall('/miageconnect/api/user/experiences', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return true;
    } catch (err) {
      console.error('Error saving experience:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    fetchPersonalInfo,
    savePersonalInfo,
    fetchContactInfo,
    saveContactInfo,
    fetchAcademicBackground,
    saveAcademicBackground,
    fetchExperiences,
    saveExperience,
  };
}