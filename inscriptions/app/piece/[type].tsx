import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSession } from '../../Session/ctx';
import { useDocumentPicker } from '../../utils/hooks/useDocumentPicker';
import { useDocumentUpload } from '../../utils/hooks/useDocumentUpload';
import { PIECES_META } from '../file/index';

const PRIMARY = '#2563EB';
const CARD_BG = '#fff';
const PASTEL_BG = '#F8FAFC';
const CTA = '#E15A2D';
const TEXT_PRIMARY = '#64748b';
const TEXT_SECONDARY = '#94a3b8';
const CIRCLE_DONE = '#4ade80';

export default function PieceScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useSession();
  const meta = PIECES_META[type as keyof typeof PIECES_META];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<any>(null);
  const { existingDocuments, loadingDocuments, documentError, fetchDocuments, downloadDocument, deleteDocument } = useDocumentPicker();
  const { uploading, uploadSuccess, uploadError, uploadDocument, clearMessages } = useDocumentUpload();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadingNow, setUploadingNow] = useState(false);

  useEffect(() => {
    if (!meta) return;
    setLoading(true);
    setError(null);
    fetch('https://sunnysidecode.com/miageconnect/api/user/documents', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(docs => {
        const found = docs.find((d: any) => d.document_type === meta.apiType);
        setFile(found || null);
      })
      .catch(() => setError('Erreur lors du chargement'))
      .finally(() => setLoading(false));
  }, [type]);

  const handlePickAndUpload = async () => {
    clearMessages();
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        const formattedFile = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          size: file.size
        };
        setSelectedFile(formattedFile);
        setUploadingNow(true);
        const uploadResult = await uploadDocument(formattedFile, meta.apiType);
        setUploadingNow(false);
        if (uploadResult.success) {
          await fetchDocuments();
        }
      } else if (result.canceled) {
        // User cancelled, do nothing
      } else {
        Alert.alert('Erreur', 'Aucun fichier sélectionné ou une erreur est survenue.');
      }
    } catch (e) {
      setUploadingNow(false);
      Alert.alert('Erreur', 'Impossible d\'ouvrir le sélecteur de fichiers.');
    }
  };

  if (!meta) {
    return (
      <View style={styles.centered}><Text>Type de pièce inconnu.</Text></View>
    );
  }

  const pieceDocs = existingDocuments.filter(doc => doc.document_type === meta.apiType);

  return (
    <View style={{ flex: 1, backgroundColor: PASTEL_BG }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="document-text-outline" size={28} color={PRIMARY} style={{ marginRight: 10 }} />
            <Text style={styles.title}>{meta.label}</Text>
          </View>
          {loadingDocuments ? (
            <ActivityIndicator size="large" color={PRIMARY} style={{ marginVertical: 24 }} />
          ) : pieceDocs.length > 0 ? (
            <View>
              <Text style={{ color: TEXT_PRIMARY, marginBottom: 8 }}>Fichier déjà déposé :</Text>
              <Text style={{ color: PRIMARY, fontWeight: 'bold', marginBottom: 8 }}>{pieceDocs[0].file_name}</Text>
              <Text style={{ color: TEXT_SECONDARY, fontSize: 12, marginBottom: 8 }}>Ajouté le {new Date(pieceDocs[0].created_at).toLocaleDateString('fr-FR')}</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity style={styles.downloadButton} onPress={() => downloadDocument(pieceDocs[0].id, pieceDocs[0].file_name)}>
                  <Text style={styles.downloadButtonText}>Télécharger</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={async () => {
                    Alert.alert(
                      'Confirmation',
                      'Êtes-vous sûr de vouloir supprimer ce document ?',
                      [
                        { text: 'Annuler', style: 'cancel' },
                        {
                          text: 'Supprimer',
                          style: 'destructive',
                          onPress: async () => {
                            const success = await deleteDocument(pieceDocs[0].id);
                            if (success) {
                              Alert.alert('Succès', 'Document supprimé avec succès');
                              await fetchDocuments();
                            } else {
                              Alert.alert('Erreur', 'Erreur lors de la suppression du document');
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <TouchableOpacity style={styles.uploadButton} onPress={handlePickAndUpload} disabled={uploadingNow || uploading}>
                <Text style={styles.uploadButtonText}>{uploadingNow || uploading ? 'Téléchargement...' : 'Déposer un fichier'}</Text>
              </TouchableOpacity>
              {uploadError && <Text style={{ color: CTA, marginTop: 8 }}>{uploadError}</Text>}
              {uploadSuccess && <Text style={{ color: CIRCLE_DONE, marginTop: 8 }}>{uploadSuccess}</Text>}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 22,
    marginBottom: 18,
    shadowColor: PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    color: PRIMARY,
    fontWeight: 'bold',
  },
  fileLabel: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 4,
  },
  fileName: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  fileDate: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CTA,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 