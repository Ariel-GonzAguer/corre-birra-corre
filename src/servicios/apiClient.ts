import { 
  saveScore as firebaseSaveScore, 
  getTopScores as firebaseGetTopScores,
  checkRateLimitStatus,
  MAX_DAILY_ATTEMPTS
} from "../firebase/firebaseConfig";

const NEGATIVE_WORDS = [
  "odio",
  "odiar",
  "malo",
  "maldito",
  "maldita",
  "horrible",
  "terrible",
  "asco",
  "asqueroso",
  "asquerosa",
  "mierda",
  "pesimo",
  "pesimo",
  "perdedor",
  "perdedora",
  "loser",
  "hate",
  "trash",
  "stupid",
  "estupido",
  "estupida",
  "idiota",
  "feo",
  "fea",
  "suicida",
  "muerte",
  "suicidio",
  "matar",
  "matarse",
  "fail"
] as const;

const SAFE_FALLBACK_NAME = "Persona anónima";
const NEGATIVE_REPLACEMENT = "***";
const MAX_NAME_LENGTH = 30;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function sanitizePlayerName(input: string): string {
  if (!input) {
    return SAFE_FALLBACK_NAME;
  }

  let sanitized = input.normalize("NFC");

  sanitized = sanitized
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[^\p{L}\p{N}\s'¡!¿?.,-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const word of NEGATIVE_WORDS) {
    const pattern = new RegExp(`\\b${escapeRegExp(word)}\\b`, "gi");
    sanitized = sanitized.replace(pattern, NEGATIVE_REPLACEMENT);
  }

  sanitized = sanitized.replace(/\s+/g, " ").trim();

  if (!sanitized) {
    return SAFE_FALLBACK_NAME;
  }

  if (sanitized.length > MAX_NAME_LENGTH) {
    sanitized = sanitized.slice(0, MAX_NAME_LENGTH).trim();
  }

  return sanitized || SAFE_FALLBACK_NAME;
}

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
    const sanitizedNombre = sanitizePlayerName(nombre);
    const docId = await firebaseSaveScore(
      sanitizedNombre,
      puntuacion.toString()
    );
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
    return scores
      .slice(0, limit)
      .map((score) => ({
        ...score,
        nombre: sanitizePlayerName(score?.nombre ?? ""),
      }));
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
