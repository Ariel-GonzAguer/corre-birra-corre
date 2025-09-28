/**
 * Módulo de controles del juego
 * Maneja controles de teclado, táctiles y de entrada de texto
 */

import { GAME_CONFIG } from "./config";

// Detectar si es un dispositivo móvil
export const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || "ontouchstart" in window;

/**
 * Configuración de controles de teclado para el personaje principal
 */
export function setupKeyboardControls(cerveza: any): void {
  let jumpCount = 0;
  const maxJumps = GAME_CONFIG.MAX_JUMPS;

  // Movimiento horizontal
  cerveza.onKeyPress("right", () => {
    cerveza.pos.x += 30;
  });
  
  cerveza.onKeyPress("left", () => {
    cerveza.pos.x -= 30;
  });

  // Saltos con espacio
  onKeyPress("space", () => {
    if (jumpCount < maxJumps) {
      cerveza.jump(GAME_CONFIG.JUMP_FORCE);
      jumpCount++;
    }
  });

  // Reset de saltos cuando toca el suelo
  const groundY = height() - 60;
  onUpdate(() => {
    if (cerveza.pos && typeof cerveza.pos.y === "number") {
      if (cerveza.pos.y >= groundY - 1) {
        jumpCount = 0;
      }
    }
  });

}

/**
 * Configuración de controles táctiles para dispositivos móviles
 */
export function setupMobileControls(cerveza: any): void {
  let jumpCount = 0;
  const maxJumps = GAME_CONFIG.MAX_JUMPS;

  if (!isMobile) {
    return;
  }

  // Botón de salto (centro-derecha de la mitad de pantalla)
  const jumpButton = add([
    rect(200, 200),
    pos(width() - 100, height() * 0.5),
    area(),
    color(255, 255, 255),
    opacity(0.8),
    anchor("center"),
    z(10),
    "jumpButton",
  ]);

  // Texto del botón de salto
  add([
    text("↑", { size: 64 }),
    pos(width() - 100, height() * 0.5),
    color(0, 0, 0),
    anchor("center"),
    z(11),
  ]);

  // Botón izquierda (centro-izquierda de la mitad de pantalla)
  const leftButton = add([
    rect(200, 200),
    pos(width() * 0.15, height() * 0.5),
    area(),
    color(255, 255, 255),
    opacity(0.8),
    anchor("center"),
    z(10),
    "leftButton",
  ]);

  // Texto del botón izquierda
  add([
    text("←", { size: 56 }),
    pos(width() * 0.15, height() * 0.5),
    color(0, 0, 0),
    anchor("center"),
    z(11),
  ]);

  // Botón derecha (al lado del botón izquierda)
  const rightButton = add([
    rect(200, 200),
    pos(width() * 0.35, height() * 0.6),
    area(),
    color(255, 255, 255),
    opacity(0.8),
    anchor("center"),
    z(10),
    "rightButton",
  ]);

  // Texto del botón derecha
  add([
    text("→", { size: 56 }),
    pos(width() * 0.35, height() * 0.6),
    color(0, 0, 0),
    anchor("center"),
    z(11),
  ]);

  // Variables para controles táctiles
  let leftPressed = false;
  let rightPressed = false;

  // Eventos de clic para cada botón
  onMousePress(() => {
    // Verificar clic en botón de salto
    if (jumpButton.isHovering()) {
      if (jumpCount < maxJumps) {
        cerveza.jump(GAME_CONFIG.JUMP_FORCE);
        jumpCount++;
      }
    }

    // Verificar clic en botón izquierdo
    if (leftButton.isHovering()) {
      leftPressed = true;
      cerveza.pos.x -= 30;
    }

    // Verificar clic en botón derecho
    if (rightButton.isHovering()) {
      rightPressed = true;
      cerveza.pos.x += 30;
    }
  });

  // Liberar botones al soltar
  onMouseRelease(() => {
    leftPressed = false;
    rightPressed = false;
  });

  // Movimiento continuo mientras se mantiene presionado
  onUpdate(() => {
    if (leftPressed && leftButton.isHovering()) {
      cerveza.pos.x -= 2;
    }
    if (rightPressed && rightButton.isHovering()) {
      cerveza.pos.x += 2;
    }
  });

  // Reset de saltos cuando toca el suelo
  const groundY = height() - 60;
  onUpdate(() => {
    if (cerveza.pos && typeof cerveza.pos.y === "number") {
      if (cerveza.pos.y >= groundY - 1) {
        jumpCount = 0;
      }
    }
  });

}

/**
 * Configuración de controles para entrada de texto (solo desktop)
 */
export function setupTextInputControls(
  updateCallback: () => void,
  addCharCallback: (char: string) => void,
  removeCharCallback: () => void
): void {
  if (isMobile) {
    return; // Los controles de texto no se aplican en móvil
  }

  const letras = "abcdefghijklmnopqrstuvwxyz0123456789-ñ.!";

  // Añadir letras y números
  for (const letra of letras) {
    onKeyPress(letra, () => {
      addCharCallback(letra);
      updateCallback();
    });
  }

  // Añadir espacio
  onKeyPress("space", () => {
    addCharCallback(" ");
    updateCallback();
  });

  // Eliminar último carácter
  onKeyPress("backspace", () => {
    removeCharCallback();
    updateCallback();
  });
}

/**
 * Configuración de controles de navegación básicos
 */
export function setupNavigationControls(
  enterCallback?: () => void,
  escapeCallback?: () => void
): void {
  if (enterCallback) {
    onKeyPress("enter", enterCallback);
  }

  if (escapeCallback) {
    onKeyPress("escape", escapeCallback);
  }
}

/**
 * Tipo de configuración para controles combinados
 */
export interface GameControlsConfig {
  cerveza: any;
  enableKeyboard?: boolean;
  enableMobile?: boolean;
}

/**
 * Función helper que configura todos los controles del juego
 */
export function setupGameControls(config: GameControlsConfig): void {
  const { cerveza, enableKeyboard = true, enableMobile = true } = config;

  if (enableKeyboard) {
    setupKeyboardControls(cerveza);
  }

  if (enableMobile && isMobile) {
    setupMobileControls(cerveza);
  }
}
