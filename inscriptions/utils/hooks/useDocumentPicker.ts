import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { useToken } from '../../Session/ctx';
import { useDocumentUpload } from './useDocumentUpload';

interface Document {
  id: number;
  document_type: string;
  file_name: string;
  file_path: string;
  commentaire: string;
  created_at: string;
  valide: boolean;
}

export function useDocumentPicker() {
  const [cvFile, setCvFile] = useState<any>(null);
  const [notesFile, setNotesFile] = useState<any>(null);
  const [justificatifsFile, setJustificatifsFile] = useState<any>(null);
  
  // State for existing documents
  const [existingDocuments, setExistingDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<number | null>(null);
  
  const { uploading, uploadSuccess, uploadError, uploadDocument, clearMessages } = useDocumentUpload();
  const token = useToken();

  // Fetch existing documents from API
  const fetchDocuments = async () => {
    if (!token) return;
    
    setLoadingDocuments(true);
    setDocumentError(null);
    
    try {
      const response = await fetch('https://sunnysidecode.com/miageconnect/api/user/documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const documents = await response.json();
        setExistingDocuments(documents);
      } else {
        const errorData = await response.json();
        setDocumentError(errorData.message || 'Erreur lors du chargement des documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocumentError('Erreur de connexion lors du chargement des documents');
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Delete document from API
  const deleteDocument = async (documentId: number) => {
    if (!token) return false;
    
    try {
      const response = await fetch(`https://sunnysidecode.com/miageconnect/api/user/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the document from the local state
        setExistingDocuments(prev => prev.filter(doc => doc.id !== documentId));
        return true;
      } else {
        const errorData = await response.json();
        console.error('Delete error:', errorData.message);
        return false;
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  };

  // Download document
  const downloadDocument = async (documentId: number, fileName: string) => {
    if (!token) return;
    
    setDownloadingFile(documentId);
    
    try {
      // Get file extension from original filename
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
      
      // Create standardized filename: cv_miageconnect.[extension]
      const standardizedFileName = `cv_miageconnect.${fileExtension}`;
      
      // Create a temporary file path in the app's cache directory with standardized filename
      const fileUri = `${FileSystem.cacheDirectory}${standardizedFileName}`;
      
      // Download the file from the server
      const downloadResult = await FileSystem.downloadAsync(
        `https://sunnysidecode.com/miageconnect/api/user/documents/${documentId}/download`,
        fileUri,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (downloadResult.status === 200) {
        // Check if sharing is available
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          // Share the downloaded file with standardized filename
          await Sharing.shareAsync(fileUri, {
            mimeType: getMimeType(fileName),
            dialogTitle: `Télécharger ${standardizedFileName}`,
            UTI: getUTI(fileName), // iOS specific - helps with file type recognition
          });
        } else {
          console.log('Sharing is not available on this device');
          // You could show an alert here to inform the user
        }
      } else {
        console.error('Download failed:', downloadResult.status);
        throw new Error('Échec du téléchargement');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      // You could show an alert here to inform the user about the error
    } finally {
      setDownloadingFile(null);
    }
  };

  // Helper function to get UTI (Uniform Type Identifier) for iOS
  const getUTI = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'com.adobe.pdf';
      case 'jpg':
      case 'jpeg':
        return 'public.jpeg';
      case 'png':
        return 'public.png';
      case 'doc':
        return 'org.openxmlformats.wordprocessingml.document';
      case 'docx':
        return 'org.openxmlformats.wordprocessingml.document';
      default:
        return 'public.data';
    }
  };

  // Helper function to get MIME type based on file extension
  const getMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'application/octet-stream';
    }
  };

  // Get documents by type
  const getDocumentsByType = (type: string) => {
    return existingDocuments.filter(doc => doc.document_type === type);
  };

  // Load documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [token]);

  const handleImportCV = async () => {
    try {
      clearMessages();
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        copyToCacheDirectory: true,
      });

      console.log('Document picker result:', result);

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        console.log('Selected file:', file);
        
        // Ensure the file has the correct properties
        const formattedFile = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          size: file.size
        };
        
        setCvFile(formattedFile);
        
        // Automatically upload the file
        const uploadResult = await uploadDocument(formattedFile, 'cv');
        if (uploadResult.success) {
          // Refresh documents list after successful upload
          await fetchDocuments();
        } else {
          console.error('Upload failed:', uploadResult.message);
        }
      }
    } catch (error) {
      console.error('Error importing CV:', error);
    }
  };

  const handleImportNotes = async () => {
    try {
      clearMessages();
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        const formattedFile = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          size: file.size
        };
        
        setNotesFile(formattedFile);
        
        // Automatically upload the file
        const uploadResult = await uploadDocument(formattedFile, 'notes');
        if (uploadResult.success) {
          // Refresh documents list after successful upload
          await fetchDocuments();
        } else {
          console.error('Upload failed:', uploadResult.message);
        }
      }
    } catch (error) {
      console.error('Error importing notes:', error);
    }
  };

  const handleImportJustificatifs = async () => {
    try {
      clearMessages();
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        const formattedFile = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          size: file.size
        };
        
        setJustificatifsFile(formattedFile);
        
        // Automatically upload the file
        const uploadResult = await uploadDocument(formattedFile, 'justificatifs');
        if (uploadResult.success) {
          // Refresh documents list after successful upload
          await fetchDocuments();
        } else {
          console.error('Upload failed:', uploadResult.message);
        }
      }
    } catch (error) {
      console.error('Error importing justificatifs:', error);
    }
  };

  const clearCvFile = () => {
    setCvFile(null);
    clearMessages();
  };

  const clearNotesFile = () => {
    setNotesFile(null);
    clearMessages();
  };

  const clearJustificatifsFile = () => {
    setJustificatifsFile(null);
    clearMessages();
  };

  const retryUpload = async (file: any, documentType: string) => {
    if (file) {
      const uploadResult = await uploadDocument(file, documentType);
      if (uploadResult.success) {
        await fetchDocuments();
      }
      return uploadResult.success;
    }
    return false;
  };

  return {
    cvFile,
    notesFile,
    justificatifsFile,
    uploading,
    uploadSuccess,
    uploadError,
    // New document management functions
    existingDocuments,
    loadingDocuments,
    documentError,
    downloadingFile,
    fetchDocuments,
    deleteDocument,
    downloadDocument,
    getDocumentsByType,
    handleImportCV,
    handleImportNotes,
    handleImportJustificatifs,
    clearCvFile,
    clearNotesFile,
    clearJustificatifsFile,
    retryUpload,
    clearMessages
  };
};
