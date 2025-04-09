import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, SessionBlock } from '@/types/session';

const SESSIONS_STORAGE_KEY = 'savedSessions';

export async function saveSession(session: Session): Promise<void> {
  try {
    const existingSessions = await getSessions();
    const sessionIndex = existingSessions.findIndex(s => s.id === session.id);
    
    if (sessionIndex >= 0) {
      existingSessions[sessionIndex] = session;
    } else {
      existingSessions.push(session);
    }
    
    await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(existingSessions));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export async function getSessions(): Promise<Session[]> {
  try {
    const sessions = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
}

export async function getSessionById(id: string): Promise<Session | null> {
  try {
    const sessions = await getSessions();
    const session = sessions.find(s => s.id === id);
    return session || null;
  } catch (error) {
    console.error('Error getting session by id:', error);
    return null;
  }
}

export async function deleteSession(id: string): Promise<void> {
  try {
    const sessions = await getSessions();
    const filteredSessions = sessions.filter(s => s.id !== id);
    await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filteredSessions));
  } catch (error) {
    console.error('Error deleting session:', error);
  }
}
