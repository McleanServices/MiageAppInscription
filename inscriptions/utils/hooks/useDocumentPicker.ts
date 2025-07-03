import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { useDocumentUpload } from './useDocumentUpload';

export function useDocumentPicker() {
  const [cvFile, setCvFile] = useState<any>(null);
  const [notesFile, setNotesFile] = useState<any>(null);
  const [justificatifsFile, setJustificatifsFile] = useState<any>(null);
  
  const { uploading, uploadSuccess, uploadError, uploadDocument, clearMessages } = useDocumentUpload();

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
        if (!uploadResult.success) {
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
        if (!uploadResult.success) {
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
        if (!uploadResult.success) {
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
