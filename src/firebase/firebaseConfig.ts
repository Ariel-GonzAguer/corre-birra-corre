import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

// Vite env typing fix
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}

// Extend the ImportMeta interface globally
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para guardar puntaje
export async function saveScore(nombre: string, puntuacion: string) {
  try {
    // Obtener ID del cliente
    const clientID = getClientID();
    
    // Verificar límite diario
    const canSave = await checkAndUpdateRateLimit(clientID);
    
    if (!canSave) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    
    const docRef = await addDoc(collection(db, "puntuacionGlobal"), {
      nombre,
      puntuacion: parseInt(puntuacion),
      createdAt: new Date(),
      clientID: clientID, // Guardamos el ID para referencia
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error guardando puntaje:", error);
    throw error;
  }
}

// Función para obtener top10 puntajes
export async function getTopScores() {
  try {
    const q = query(
      collection(db, 'puntuacionGlobal'), 
      orderBy('puntuacion', 'desc'), 
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const puntuaciones: Array<{nombre: string, puntuacion: number}> = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      puntuaciones.push({
        nombre: data.nombre || 'Anónimo',
        puntuacion: data.puntuacion || 0
      });
    });
    
    return puntuaciones;
  } catch (error) {
    console.error('Error al obtener puntuaciones:', error);
    return []; // Retornar array vacío en caso de error
  }
}

// Función para obtener el ID del cliente (simulado en frontend)
export function getClientID(): string {
  // En un entorno real de producción, esto debería manejarse en el backend
  // Por ahora, usaremos una combinación de navegador + timestamp del día para simular ID único
  const userAgent = navigator.userAgent;
  const today = new Date().toDateString(); // Cambia cada día
  const simulated = btoa(userAgent + today).substring(0, 12);
  const clientID = `sim_${simulated}`;
  
  return clientID;
}

// Función para obtener la clave del documento de rate limiting
function getRateLimitKey(clientID: string): string {
  const today = new Date().toDateString(); // YYYY-MM-DD formato
  return `${clientID}_${today}`;
}

// Constante para el límite máximo diario
export const MAX_DAILY_ATTEMPTS = 5;



// Función interna para obtener el estado del rate limiting
async function getRateLimitDocument(clientID: string) {
  const rateLimitKey = getRateLimitKey(clientID);
  const rateLimitRef = doc(db, "rateLimiting", rateLimitKey);
  const rateLimitDoc = await getDoc(rateLimitRef);
  
  return { rateLimitRef, rateLimitDoc };
}

// Función para verificar el estado actual del rate limiting (usando localStorage como fallback)
export async function checkRateLimitStatus(ip?: string): Promise<{canSave: boolean, remainingAttempts: number, totalAttempts: number}> {
  try {
    const clientID = ip || getClientID();
    const rateLimitKey = getRateLimitKey(clientID);
    
    // Intentar Firebase primero
    try {
      const { rateLimitDoc } = await getRateLimitDocument(clientID);
      
      if (rateLimitDoc.exists()) {
        const data = rateLimitDoc.data();
        const currentCount = data.count || 0;
        
        return {
          canSave: currentCount < MAX_DAILY_ATTEMPTS,
          remainingAttempts: Math.max(0, MAX_DAILY_ATTEMPTS - currentCount),
          totalAttempts: currentCount
        };
      } else {
        return {
          canSave: true,
          remainingAttempts: MAX_DAILY_ATTEMPTS,
          totalAttempts: 0
        };
      }
    } catch (firebaseError) {
      // Usar localStorage como fallback
      const localKey = `rateLimit_${rateLimitKey}`;
      const localData = localStorage.getItem(localKey);
      
      if (localData) {
        try {
          const { count } = JSON.parse(localData);
          
          return {
            canSave: count < MAX_DAILY_ATTEMPTS,
            remainingAttempts: Math.max(0, MAX_DAILY_ATTEMPTS - count),
            totalAttempts: count
          };
        } catch (parseError) {
          // Error parsing localStorage, asumir clean slate
        }
      }
      
      // Si no hay datos locales o hay error, asumir que puede guardar
      return {
        canSave: true,
        remainingAttempts: MAX_DAILY_ATTEMPTS,
        totalAttempts: 0
      };
    }
  } catch (error) {
    console.error('Error verificando estado de rate limit:', error);
    // En caso de error completo, asumir que puede guardar
    return {
      canSave: true,
      remainingAttempts: MAX_DAILY_ATTEMPTS,
      totalAttempts: 0
    };
  }
}

// Función para verificar y actualizar el contador de rate limiting
export async function checkAndUpdateRateLimit(clientID: string): Promise<boolean> {
  const rateLimitKey = getRateLimitKey(clientID);
  
  try {
    const { rateLimitRef, rateLimitDoc } = await getRateLimitDocument(clientID);
    
    if (rateLimitDoc.exists()) {
      const data = rateLimitDoc.data();
      const currentCount = data.count || 0;
      
      if (currentCount >= MAX_DAILY_ATTEMPTS) {
        return false; // Límite alcanzado
      }
      
      // Incrementar el contador
      await updateDoc(rateLimitRef, {
        count: increment(1),
        lastUpdated: new Date()
      });
    } else {
      // Crear nuevo documento con contador = 1
      await setDoc(rateLimitRef, {
        clientID: clientID,
        date: new Date().toDateString(),
        count: 1,
        createdAt: new Date(),
        lastUpdated: new Date()
      });
    }
    
    return true; // Permitir guardar el puntaje
  } catch (error) {
    console.error('❌ Error verificando rate limit en Firebase:', error);
    
    // Usar localStorage como respaldo
    try {
      const localKey = `rateLimit_${rateLimitKey}`;
      const localData = localStorage.getItem(localKey);
      
      if (localData) {
        const { count } = JSON.parse(localData);
        
        if (count >= MAX_DAILY_ATTEMPTS) {
          return false;
        }
        
        // Incrementar contador local
        localStorage.setItem(localKey, JSON.stringify({
          count: count + 1,
          date: new Date().toDateString(),
          lastUpdated: new Date().toISOString()
        }));
      } else {
        // Crear nuevo registro local
        localStorage.setItem(localKey, JSON.stringify({
          count: 1,
          date: new Date().toDateString(),
          lastUpdated: new Date().toISOString()
        }));
      }
      
      return true;
    } catch (localError) {
      console.error('❌ Error en localStorage fallback:', localError);
      // Si todo falla, permitir el guardado (fail open)
      return true;
    }
  }
}
