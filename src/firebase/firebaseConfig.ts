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
    // Obtener IP del cliente
    const clientIP = getClientIP();
    
    // Verificar límite diario
    const canSave = await checkAndUpdateRateLimit(clientIP);
    
    if (!canSave) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    
    const docRef = await addDoc(collection(db, "puntuacionGlobal"), {
      nombre,
      puntuacion: parseInt(puntuacion),
      createdAt: new Date(),
      clientIP: clientIP, // Guardamos la IP para referencia
    });
    console.log("Puntaje guardado");
    return docRef.id;
  } catch (error) {
    console.error("Error guardando puntaje:", error);
    throw error;
  }
}

// Función para obtener top10 puntajes
export async function getTopScores() {
  try {
    console.log('Obteniendo puntuaciones...'); // Debug
    
    const q = query(
      collection(db, 'puntuacionGlobal'), 
      orderBy('puntuacion', 'desc'), 
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const puntuaciones: Array<{nombre: string, puntuacion: number}> = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Documento encontrado:', data); // Debug
      
      puntuaciones.push({
        nombre: data.nombre || 'Anónimo',
        puntuacion: data.puntuacion || 0
      });
    });
    
    console.log('Puntuaciones obtenidas:', puntuaciones); // Debug
    return puntuaciones;
  } catch (error) {
    console.error('Error al obtener puntuaciones:', error);
    return []; // Retornar array vacío en caso de error
  }
}

// Función para obtener la IP del cliente (simulada en frontend)
export function getClientIP(): string {
  // En un entorno real de producción, esto debería manejarse en el backend
  // Por ahora, usaremos una combinación de navegador + timestamp del día para simular IP única
  const userAgent = navigator.userAgent;
  const today = new Date().toDateString(); // Cambia cada día
  const simulated = btoa(userAgent + today).substring(0, 12);
  const clientIP = `sim_${simulated}`;
  
  console.log('🔍 DEBUG - getClientIP():');
  console.log('  - UserAgent:', userAgent.substring(0, 50) + '...');
  console.log('  - Today:', today);
  console.log('  - Generated IP:', clientIP);
  
  return clientIP;
}

// Función para obtener la clave del documento de rate limiting
function getRateLimitKey(ip: string): string {
  const today = new Date().toDateString(); // YYYY-MM-DD formato
  return `${ip}_${today}`;
}

// Constante para el límite máximo diario
const MAX_DAILY_ATTEMPTS = 5;

// Función interna para obtener el estado del rate limiting
async function getRateLimitDocument(ip: string) {
  const rateLimitKey = getRateLimitKey(ip);
  const rateLimitRef = doc(db, "rateLimiting", rateLimitKey);
  const rateLimitDoc = await getDoc(rateLimitRef);
  
  return { rateLimitRef, rateLimitDoc };
}

// Función para verificar el estado actual del rate limiting (usando localStorage como fallback)
export async function checkRateLimitStatus(ip?: string): Promise<{canSave: boolean, remainingAttempts: number, totalAttempts: number}> {
  try {
    const clientIP = ip || getClientIP();
    const rateLimitKey = getRateLimitKey(clientIP);
    
    console.log('🔍 DEBUG - checkRateLimitStatus():');
    console.log('  - Client IP:', clientIP);
    console.log('  - Rate limit key:', rateLimitKey);
    
    // Intentar Firebase primero
    try {
      const { rateLimitDoc } = await getRateLimitDocument(clientIP);
      console.log('  - Using Firebase, Document exists:', rateLimitDoc.exists());
      
      if (rateLimitDoc.exists()) {
        const data = rateLimitDoc.data();
        const currentCount = data.count || 0;
        
        console.log('  - Current count:', currentCount);
        console.log('  - Max attempts:', MAX_DAILY_ATTEMPTS);
        console.log('  - Can save:', currentCount < MAX_DAILY_ATTEMPTS);
        
        return {
          canSave: currentCount < MAX_DAILY_ATTEMPTS,
          remainingAttempts: Math.max(0, MAX_DAILY_ATTEMPTS - currentCount),
          totalAttempts: currentCount
        };
      } else {
        console.log('  - No Firebase record, can save');
        return {
          canSave: true,
          remainingAttempts: MAX_DAILY_ATTEMPTS,
          totalAttempts: 0
        };
      }
    } catch (firebaseError) {
      console.log('  - Firebase error, using localStorage fallback');
      // Usar localStorage como fallback
      const localData = localStorage.getItem(rateLimitKey);
      const currentCount = localData ? parseInt(localData) : 0;
      
      console.log('  - LocalStorage count:', currentCount);
      console.log('  - Max attempts:', MAX_DAILY_ATTEMPTS);
      console.log('  - Can save:', currentCount < MAX_DAILY_ATTEMPTS);
      
      return {
        canSave: currentCount < MAX_DAILY_ATTEMPTS,
        remainingAttempts: Math.max(0, MAX_DAILY_ATTEMPTS - currentCount),
        totalAttempts: currentCount
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
export async function checkAndUpdateRateLimit(ip: string): Promise<boolean> {
  try {
    const rateLimitKey = getRateLimitKey(ip);
    const { rateLimitRef, rateLimitDoc } = await getRateLimitDocument(ip);
    
    console.log('🔍 DEBUG - checkAndUpdateRateLimit():');
    console.log('  - IP:', ip);
    console.log('  - Rate limit key:', rateLimitKey);
    console.log('  - Document exists:', rateLimitDoc.exists());
    
    if (rateLimitDoc.exists()) {
      const data = rateLimitDoc.data();
      const currentCount = data.count || 0;
      
      console.log('  - Current count BEFORE increment:', currentCount);
      console.log('  - Max attempts:', MAX_DAILY_ATTEMPTS);
      
      if (currentCount >= MAX_DAILY_ATTEMPTS) {
        console.log(`❌ Límite diario alcanzado para IP: ${ip}`);
        return false; // Límite alcanzado
      }
      
      // Incrementar el contador
      await updateDoc(rateLimitRef, {
        count: increment(1),
        lastUpdated: new Date()
      });
      
      console.log('  - ✅ Counter incremented successfully');
    } else {
      console.log('  - Creating new rate limit document');
      // Crear nuevo documento con contador = 1
      await setDoc(rateLimitRef, {
        ip: ip,
        date: new Date().toDateString(),
        count: 1,
        createdAt: new Date(),
        lastUpdated: new Date()
      });
      
      console.log('  - ✅ New document created with count = 1');
    }
    
    return true; // Permitir guardar el puntaje
  } catch (error) {
    console.error('❌ Error verificando rate limit:', error);
    // En caso de error, permitir el guardado (fail open)
    return true;
  }
}
