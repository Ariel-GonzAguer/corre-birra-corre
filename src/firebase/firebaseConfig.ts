import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

// Vite env typing fix
interface ImportMetaEnv {
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
}

// Extend the ImportMeta interface globally
declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
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
    const docRef = await addDoc(collection(db, "puntuacionGlobal"), {
      nombre,
      puntuacion: parseInt(puntuacion),
      createdAt: new Date(),
    });
    console.log("Puntaje guardado");
    return docRef.id;
  } catch (error) {
    console.error("Error guardando puntaje:", error);
    throw error;
  }
}

// Función para obtener top 25 puntajes
export async function getTopScores() {
  try {
    console.log('Obteniendo puntuaciones...'); // Debug
    
    const q = query(
      collection(db, 'puntuacionGlobal'), 
      orderBy('puntuacion', 'desc'), 
      limit(25)
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
