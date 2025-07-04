import * as SQLite from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from '../../Session/ctx';

const DB_NAME = 'miage_profile.db';
const PROFILE_TABLE = 'profile';
const DOSSIER_TABLE = 'dossier_status';
const PROGRESS_TABLE = 'form_progress';

function getApiUrl(path: string) {
  // TODO: Replace with your real API base URL if needed
  return `https://sunnysidecode.com${path}`;
}

export function useProfileData() {
  const { token } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [dossierStatus, setDossierStatus] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  // Create tables if not exist
  const initDb = useCallback(async () => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${PROFILE_TABLE} (
        id INTEGER PRIMARY KEY, data TEXT, lastUpdated TEXT
      );
      CREATE TABLE IF NOT EXISTS ${DOSSIER_TABLE} (
        id INTEGER PRIMARY KEY, data TEXT, lastUpdated TEXT
      );
      CREATE TABLE IF NOT EXISTS ${PROGRESS_TABLE} (
        id INTEGER PRIMARY KEY, data TEXT, lastUpdated TEXT
      );
    `);
    setDb(db);
    return db;
  }, []);

  // Load from SQLite
  const loadFromDb = useCallback(async (db: SQLite.SQLiteDatabase) => {
    try {
      const [profileRow] = await db.getAllAsync<any>(`SELECT * FROM ${PROFILE_TABLE} WHERE id = 1`);
      const [dossierRow] = await db.getAllAsync<any>(`SELECT * FROM ${DOSSIER_TABLE} WHERE id = 1`);
      const [progressRow] = await db.getAllAsync<any>(`SELECT * FROM ${PROGRESS_TABLE} WHERE id = 1`);
      if (profileRow) {
        setProfile(JSON.parse(profileRow.data));
        setLastUpdated(profileRow.lastUpdated);
      }
      if (dossierRow) setDossierStatus(JSON.parse(dossierRow.data));
      if (progressRow) setProgress(JSON.parse(progressRow.data));
    } catch (err) {
      // ignore
    }
  }, []);

  // Save to SQLite
  const saveToDb = useCallback(async (db: SQLite.SQLiteDatabase, table: string, data: any) => {
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT OR REPLACE INTO ${table} (id, data, lastUpdated) VALUES (1, ?, ?)`,
      JSON.stringify(data),
      now
    );
    if (table === PROFILE_TABLE) setLastUpdated(now);
  }, []);

  // Fetch from API
  const fetchAll = useCallback(async (db: SQLite.SQLiteDatabase) => {
    setLoading(true);
    setError(null);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [profileRes, dossierRes, progressRes] = await Promise.all([
        fetch(getApiUrl('/miageconnect/api/profile'), { headers }),
        fetch(getApiUrl('/miageconnect/api/user/application-status'), { headers }),
        fetch(getApiUrl('/miageconnect/api/user/form-progress'), { headers }),
      ]);
      if (!profileRes.ok) throw new Error('Erreur profil');
      if (!dossierRes.ok) throw new Error('Erreur dossier');
      if (!progressRes.ok) throw new Error('Erreur progression');
      const profileData = await profileRes.json();
      const dossierData = await dossierRes.json();
      const progressData = await progressRes.json();
      setProfile(profileData);
      setDossierStatus(dossierData);
      setProgress(progressData);
      await saveToDb(db, PROFILE_TABLE, profileData);
      await saveToDb(db, DOSSIER_TABLE, dossierData);
      await saveToDb(db, PROGRESS_TABLE, progressData);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [token, saveToDb]);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const db = await initDb();
      if (!isMounted) return;
      await loadFromDb(db);
      setLoading(false);
      // Try to refresh from API
      if (token) fetchAll(db);
    })();
    return () => { isMounted = false; };
  }, [initDb, loadFromDb, fetchAll, token]);

  // Manual refresh
  const refresh = useCallback(async () => {
    if (!db) return;
    await fetchAll(db);
  }, [db, fetchAll]);

  return { profile, dossierStatus, progress, loading, error, lastUpdated, refresh };
} 