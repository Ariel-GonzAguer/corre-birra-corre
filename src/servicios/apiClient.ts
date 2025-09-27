import { saveScore as firebaseSaveScore, getTopScores as firebaseGetTopScores } from "../firebase/firebaseConfig";

export interface Score {
  nombre: string;
  puntuacion: number;
}

export async function saveScore(
  nombre: string,
  puntuacion: number
): Promise<string> {
  try {
    console.log("Guardando puntuación:", { nombre, puntuacion });
    
    const docId = await firebaseSaveScore(nombre.trim(), puntuacion.toString());
    console.log("Puntuación guardada con ID:", docId);
    return docId;
  } catch (error) {
    console.error("Error saving score:", error);
    throw error;
  }
}

export async function getTopScores(limit: number = 25): Promise<Score[]> {
  try {
    console.log("Obteniendo puntuaciones...");
    
    const scores = await firebaseGetTopScores();
    console.log("Puntuaciones obtenidas:", scores);
    return scores.slice(0, limit); // Limitamos el resultado si es necesario
  } catch (error) {
    console.error("Error getting scores:", error);
    return [];
  }
}
