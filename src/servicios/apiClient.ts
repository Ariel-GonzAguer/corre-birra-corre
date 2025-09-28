import { 
  saveScore as firebaseSaveScore, 
  getTopScores as firebaseGetTopScores,
  checkRateLimitStatus,
  MAX_DAILY_ATTEMPTS
} from "../firebase/firebaseConfig";

export interface Score {
  nombre: string;
  puntuacion: number;
}

export interface RateLimitStatus {
  canSave: boolean;
  remainingAttempts: number;
  totalAttempts: number;
}

export async function saveScore(
  nombre: string,
  puntuacion: number
): Promise<string> {
  try {
    const docId = await firebaseSaveScore(nombre.trim(), puntuacion.toString());
    return docId;
  } catch (error: any) {
    console.error("Error saving score:", error);
    
    // Manejar específicamente el error de límite excedido
    if (error.message === "RATE_LIMIT_EXCEEDED") {
      throw new Error(`Límite diario alcanzado: Solo se permiten ${MAX_DAILY_ATTEMPTS} puntajes por día por usuario. ¡Inténtalo mañana!`);
    }
    
    throw error;
  }
}

export async function getTopScores(limit: number = 25): Promise<Score[]> {
  try {
    const scores = await firebaseGetTopScores();
    return scores.slice(0, limit); // Limitamos el resultado si es necesario
  } catch (error) {
    console.error("Error getting scores:", error);
    return [];
  }
}

export async function getRateLimitStatus(): Promise<RateLimitStatus> {
  try {
    return await checkRateLimitStatus();
  } catch (error) {
    console.error("Error checking rate limit status:", error);
    // En caso de error, asumir que puede guardar
    return {
      canSave: true,
      remainingAttempts: MAX_DAILY_ATTEMPTS,
      totalAttempts: 0
    };
  }
}

// Exportar constante de límite
export { MAX_DAILY_ATTEMPTS };
