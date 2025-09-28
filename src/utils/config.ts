// constants.ts
export const GAME_CONFIG = {
  GRAVITY: 1900,
  JUMP_FORCE: 1060,
  MAX_JUMPS: 1,
  SPAWN_RATES: {
    CHARACTERS: { min: 1.25, max: 4 },
    POWERUPS: { min: 10, max: 20 },
  },
  SPEEDS: {
    CHARACTERS: 350,
    POWERUPS: 200,
  },
  DEBUGKEY: "p",
  // Configuración del límite diario de puntajes
  DAILY_SCORE_LIMIT: 5,
};

export const UI_CONFIG = {
  MOBILE: {
    TITLE_SIZE: 74,
    SUBTITLE_SIZE: 38,
    SCORE_SIZE: 65,
  },
  DESKTOP: {
    TITLE_SIZE: 48,
    SUBTITLE_SIZE: 28,
    SCORE_SIZE: 32,
  },
};
