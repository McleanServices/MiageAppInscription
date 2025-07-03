import { useState } from 'react';
import { useToken } from '../../Session/ctx';
import * as FileSystem from 'expo-file-system';

interface UploadResult {
  success: boolean;
  message: string;
  fileId?: string;
}

export const useDocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const token = useToken();

  const uploadDocument = async (
    file: any,
    documentType: string,
    commentaire: string = ''
  ): Promise<UploadResult> => {
    setUploading(true);
    setUploadSuccess(null);
    setUploadError(null);

    try {
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      console.log('Uploading file:', file);
      console.log('Document type:', documentType);
      console.log('Token exists:', !!token);

      // Use FileSystem.uploadAsync for proper file upload in React Native
      const uploadResult = await FileSystem.uploadAsync(
        'https://sunnysidecode.com/miageconnect/api/user/documents/upload',
        file.uri,
        {
          fieldName: 'document',
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          parameters: {
            document_type: documentType,
            commentaire: commentaire || '',
          },
        }
      );

      console.log('Upload result:', uploadResult);

      if (uploadResult.status === 200 || uploadResult.status === 201) {
        const data = JSON.parse(uploadResult.body);
        const successMessage = `${file.name} a été téléchargé avec succès!`;
        setUploadSuccess(successMessage);
        return {
          success: true,
          message: successMessage,
          fileId: data.id
        };
      } else {
        let errorMessage = 'Erreur lors du téléchargement';
        try {
          const errorData = JSON.parse(uploadResult.body);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.log('Could not parse error response');
        }
        setUploadError(errorMessage);
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setUploadError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setUploading(false);
    }
  };

  const clearMessages = () => {
    setUploadSuccess(null);
    setUploadError(null);
  };

  return {
    uploading,
    uploadSuccess,
    uploadError,
    uploadDocument,
    clearMessages
  };
};
  