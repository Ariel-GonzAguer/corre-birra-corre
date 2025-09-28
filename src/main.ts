// Importar kaplay y tipos globales
import kaplay from "kaplay";
import "kaplay/global";

// Importar funciones de Firebase
import {
  saveScore,
  getTopScores,
  MAX_DAILY_ATTEMPTS,
} from "./servicios/apiClient";

// importar funciones firebase para límite diario
import { getRateLimitStatus } from "./servicios/apiClient";

// importar utils
import { createResponsiveBackground } from "./utils/utils";
import { GAME_CONFIG, UI_CONFIG } from "./utils/config";
import {
  setupGameControls,
  setupTextInputControls,
  setupNavigationControls,
  isMobile,
} from "./utils/controls";

// Importar Vercel Analytics
import { inject, track } from "@vercel/analytics";

// Inicializar Vercel Analytics
// NOTA: Las analíticas solo funcionan en producción (desplegado en Vercel)
inject();

kaplay({
  debugKey: GAME_CONFIG.DEBUGKEY,
});

// entre mayor sea el eje Y, más lejos de la parte superior (más abajo en la pantalla)
// height() - 100 → posiciona a 100px de distancia del borde inferior. height() retorna la altura total de la pantalla

// constantes y variables globales
// puntuación
let score = 0;

// vidas de la cerveza
let vidas = "❤❤❤";

// sistema de inmunidad (escudo contra borrachos)
let tieneEscudo = false;

// nombre de la persona jugadora
export let nombre = "";

// Variables globales para control de límite diario (persisten durante toda la sesión)
let dailyLimitChecked = false;
let canSaveScore = true;
let attemptsToday = 0;
let dailyLimitStatus: any = null;

// Función para verificar el límite diario solo una vez por sesión
async function checkDailyLimitOnce() {
  if (!dailyLimitChecked) {
    // En móvil no se puede guardar puntajes, así que no verificamos Firebase
    if (isMobile) {
      canSaveScore = false;
      attemptsToday = 0;
      dailyLimitStatus = {
        canSave: false,
        remainingAttempts: 0,
        totalAttempts: 0,
      };
    } else {
      // Solo en desktop verificamos Firebase
      dailyLimitStatus = await getRateLimitStatus();
      canSaveScore = dailyLimitStatus.canSave;
      attemptsToday = dailyLimitStatus.totalAttempts;
    }
    dailyLimitChecked = true;
  }
  return {
    canSave: canSaveScore,
    attemptsToday: attemptsToday,
    status: dailyLimitStatus,
  };
}

// sprites de personajes y constantes de personajes
// birra
loadSprite("cerveza", "./sprites/beer-sprite.png", {
  sliceX: 2,
  sliceY: 2,
  anims: {
    correr: { from: 0, to: 3, speed: 9, loop: true },
  },
});

// gato
loadSprite("gato", "./sprites/gato-rojo-bueno.png");

const gato = add([
  sprite("gato"),
  pos(rand(0, width()), 695),
  scale(0.3),
  area(),
  body(),
  anchor("botright"),
  "gato",
  "bueno",
]);

// lúpulo
loadSprite("lupulo", "./sprites/lupulo.png");

const lupulo = add([
  sprite("lupulo"),
  pos(rand(0, width()), 695),
  scale(0.3),
  area(),
  body(),
  anchor("botright"),
  "lupulo",
  "bueno",
]);

// cebada
loadSprite("cebada", "./sprites/cebada.png");

const cebada = add([
  sprite("cebada"),
  pos(rand(0, width()), 695),
  scale(0.3),
  area(),
  body(),
  anchor("botright"),
  "cebada",
  "bueno",
]);

// borracho
loadSprite("borracho", "./sprites/borracho.png");

const borracho = add([
  sprite("borracho"),
  pos(rand(0, width()), 695),
  scale(0.75),
  area(),
  body(),
  anchor("botleft"),
  "borracho",
  "malo",
]);

// bacteria
loadSprite("bacteria", "./sprites/bacteria.png");

const bacteria = add([
  sprite("bacteria"),
  pos(rand(0, width()), 695),
  scale(0.3),
  area(),
  body(),
  anchor("botright"),
  "bacteria",
  "malo",
]);

// escenas
// menú
// imagen de fondo
loadSprite("fondo-menu", "./sprites/fondo-menu.png");
// imagen logo Gato Rojo Lab
loadSprite("gatoRojoLab", "./sprites/gatoRojoLab-logo.png");

// Inicialización: verificar límite diario una vez al cargar el juego
checkDailyLimitOnce();

scene("menu", () => {
  // Track página del menú
  track("page_view", { page: "menu" });

  // color de fondo en rgb
  setBackground(0, 0, 0);
  // fondo responsive
  createResponsiveBackground("fondo-menu");

  add([
    text("¡Corre Birra Corre!", {
      size: isMobile
        ? UI_CONFIG.MOBILE.TITLE_SIZE
        : UI_CONFIG.DESKTOP.TITLE_SIZE,
      color: rgb(255, 255, 255),
      width: width(),
      align: "center",
    }),
    pos(width() / 2, isMobile ? 100 : 50),
    anchor("center"),
    z(2),
  ]);

  // fondo para título
  add([
    rect(isMobile ? 900 : 600, isMobile ? 150 : 80),
    pos(width() / 2, isMobile ? 100 : 50),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(1),
  ]);

  // subtítulo
  add([
    text("¡Huye de los borrachos y bacterias!", {
      size: isMobile
        ? UI_CONFIG.MOBILE.SUBTITLE_SIZE
        : UI_CONFIG.DESKTOP.SUBTITLE_SIZE,
      color: rgb(255, 255, 255),
      width: width(),
      align: "center",
    }),
    pos(width() / 2, isMobile ? 700 : 200),
    anchor("center"),
    z(2),
  ]);

  // fondo para subtítulo
  add([
    rect(isMobile ? 850 : 600, isMobile ? 100 : 50),
    pos(width() / 2, isMobile ? 700 : 200),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(1),
  ]);

  // logo Gato Rojo Lab
  add([
    sprite("gatoRojoLab"),
    pos(width() / 2, isMobile ? height() - 200 : height() - 100),
    anchor("center"),
    scale(isMobile ? 1 : 0.7),
    z(3),
  ]);

  // fondo para logo
  add([
    rect(isMobile ? 500 : 300, isMobile ? 350 : 175),
    pos(width() / 2, isMobile ? height() - 200 : height() - 100),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(2),
  ]);

  // botón iniciar
  const btnPos = vec2(width() / 2, height() / 2 + 50);
  const startBtn = add([
    rect(isMobile ? 350 : 250, isMobile ? 100 : 60),
    pos(btnPos),
    anchor("center"),
    color(40, 180, 40),
    outline(6),
    area(),
    z(1),
  ]);

  // texto del botón para iniciar
  add([
    text("Iniciar", { size: isMobile ? 50 : 36 }),
    pos(btnPos),
    anchor("center"),
    color(255, 255, 255),
    z(2),
  ]);

  // usar teclado para iniciar
  setupNavigationControls(() => go("como-jugar"));

  startBtn.onClick(() => {
    go("como-jugar");
  });
});

// cómo jugar
// imagen de fondo
loadSprite("fondo-como-jugar", "./sprites/fondo-como-jugar.png");

scene("como-jugar", () => {
  // fondo responsive
  createResponsiveBackground("fondo-como-jugar");

  // inicialización de variable para darle valor dentro de un if, y usar sus propiedades después
  if (isMobile) {
    add([
      text(
        "Instrucciones\n- Use el botón ↑ para saltar. ¡Puede hacer saltos dobles!\n- Use las flechas ← y → para moverse hacia atrás y adelante, respectivamente.\nImportante: Si retrocede mucho, la cerveza desaparece y hay que reiniciar el juego.\n- Si colisiona con un borracho pierde una vida ♥️.\n- Si toca una bacteria pierde el juego.\n- Si toca un lúpulo obtiene protección contra el siguiente borracho que llegue.\n- Si toca la cebada obtiene una vida extra.\nImportante: No use el dispositivo en modo horizontal.\n🎮 En dispositivos móviles no se pueden registrar puntajes, solo en desktop.",
        {
          size: 36,
          color: rgb(255, 255, 255),
          width: 550, // ancho menor al rect del fondo (600) para dejar margen
          align: "left", // alineación izquierda para mejor legibilidad
          lineSpacing: 12, // espaciado entre líneas
        }
      ),
      pos(width() / 2, height() / 2 - 50), // posición ajustada para centrarse mejor en el fondo
      anchor("center"),
      z(1),
    ]);

    // fondo para instrucciones
    add([
      rect(700, height() - 250),
      pos(width() / 2, height() / 2),
      anchor("center"),
      color(0, 0, 0),
      opacity(0.8),
      z(0),
    ]);
  } else {
    // texto de instrucciones (dentro del fondo)
    add([
      text(
        "Instrucciones\n- Use la barra de espacio para saltar. ¡Puede hacer saltos dobles!\n- Use las flechas izquierda y derecha para moverse hacia atrás y adelante, respectivamente.\nImportante: Si retrocede mucho, la cerveza desaparece y hay que reiniciar el juego.\n- Si colisiona con un borracho pierde una vida ♥️.\n- Si toca una bacteria pierde el juego.\n- Si toca un lúpulo obtiene protección contra el siguiente borracho que llegue.\n- Si toca la cebada obtiene una vida extra.",
        {
          size: 24,
          color: rgb(255, 255, 255),
          width: 550, // ancho menor al rect del fondo (600) para dejar margen
          align: "left", // alineación izquierda para mejor legibilidad
          lineSpacing: 8, // espaciado entre líneas
        }
      ),
      pos(width() / 2, height() / 2 - 50), // posición ajustada para centrarse mejor en el fondo
      anchor("center"),
      z(1),
    ]);

    // fondo para instrucciones
    add([
      rect(600, height() - 50),
      pos(width() / 2, height() / 2),
      anchor("center"),
      color(0, 0, 0),
      opacity(0.8),
      z(0),
    ]);
  }

  // botón iniciar
  const btnPos = isMobile
    ? vec2(width() / 2, height() / 2 + 750)
    : vec2(width() / 2, height() / 2 + 250);
  const startBtn = add([
    rect(isMobile ? 300 : 250, 60),
    pos(btnPos),
    anchor("center"),
    color(40, 180, 40),
    outline(6),
    area(),
    z(1),
  ]);

  // texto del botón para iniciar
  add([
    text("¡Todo listo!", { size: 36 }),
    pos(btnPos),
    anchor("center"),
    color(255, 255, 255),
    z(2),
  ]);

  // usar teclado para iniciar
  setupNavigationControls(() => {
    track("game_started", { method: "keyboard" });
    go("juego");
  });

  startBtn.onClick(() => {
    track("game_started", { method: "button" });
    go("juego");
  });
});

// juego
// fondo del juego
loadSprite("fondo", "./sprites/fondo-juego.png");

scene("juego", () => {
  // gravedad → va dentro de la escena
  setGravity(GAME_CONFIG.GRAVITY);

  // personaje principal y acciones
  const cerveza = add([
    sprite("cerveza"),
    pos(0, height() - 60),
    area({ scale: 0.8 }),
    body(), // para que actúe con la gravedad
    health(3),
    anchor("botleft"), // Anclar desde la parte inferior izquierda
    z(2),
    "cerveza",
    "player",
  ]);

  // fondo para el score
  add([
    rect(isMobile ? 180 : 80, isMobile ? 100 : 40),
    pos(16, 16),
    color(0, 0, 0),
    opacity(0.5),
    z(5),
  ]);
  // texto del score
  const scoreLabel = add([
    text(score, {
      size: isMobile
        ? UI_CONFIG.MOBILE.SCORE_SIZE
        : UI_CONFIG.DESKTOP.SCORE_SIZE,
    }),
    color(255, 255, 255),
    pos(24, 24),
    z(6),
  ]);

  // fondo para las vidas
  const fondoVidas = add([
    rect(isMobile ? 200 : 110, isMobile ? 70 : 40),
    pos(isMobile ? 16 : width() / 2 - 5, isMobile ? 180 : 16),
    color(0, 0, 0),
    opacity(0.5),
    z(5),
  ]);
  // texto de las vidas
  const vidasLabel = add([
    text(vidas, {
      size: isMobile
        ? UI_CONFIG.MOBILE.SCORE_SIZE
        : UI_CONFIG.DESKTOP.SCORE_SIZE,
    }),
    pos(isMobile ? 16 : width() / 2, isMobile ? 180 : 24),
    color(255, 0, 0),
    z(6),
  ]);

  // fondo para el escudo
  add([
    rect(isMobile ? 250 : 240, isMobile ? 40 : 33),
    pos(isMobile ? 16 : width() - 250, isMobile ? 500 : 16),
    color(0, 0, 0),
    opacity(0.5),
    z(5),
  ]);
  // texto del escudo
  const escudoLabel = add([
    text("Escudo: No", { size: 40 }),
    pos(isMobile ? 16 : width() - 250, isMobile ? 500 : 16),
    color(255, 255, 255),
    z(6),
  ]);

  // Configurar controles del juego usando el módulo modular
  const { jumpCount, maxJumps } = setupGameControls({
    cerveza,
    enableKeyboard: true,
    enableMobile: true,
  });

  // Resetear contador al tocar el suelo: doble mecanismo
  cerveza.onCollide("ground", () => {
    // jumpCount = 0; // Esto lo maneja el módulo automáticamente
  });

  // aparición de otros personajes
  /**
   * Genera un personaje aleatorio ("borracho", "gato" o "bacteria") en el borde derecho de la pantalla,
   * moviéndolo hacia la izquierda a una velocidad fija. Cada personaje utiliza su propio scale y área de colisión.
   * La función se programa a sí misma de nuevo tras un intervalo aleatorio entre 1.25 y 4 segundos,
   * asegurando la aparición continua de personajes.
   *
   * Dependencias:
   * - Supone que los objetos `borracho`, `gato` y `bacteria` están definidos con propiedades `scale` y `area`.
   * - Utiliza funciones y objetos globales: `sprite`, `pos`, `width`, `height`, `anchor`, `move`, `LEFT`, `area`, `scale`, `z`, `add`, `wait` y `rand`.
   */
  function aparecionPersonajes() {
    const rapidez = 350;
    const opciones = [
      {
        name: "borracho",
        tag: "borracho",
        scale: borracho.scale,
        area: borracho.area,
      },
      {
        name: "gato",
        tag: "gato",
        scale: gato.scale,
        area: gato.area,
      },
      {
        name: "bacteria",
        tag: "bacteria",
        scale: bacteria.scale,
        area: bacteria.area,
      },
    ];

    const personajeRandom = opciones[Math.floor(rand(0, opciones.length))];

    const personaje = add([
      sprite(personajeRandom.name),
      pos(width(), height()), // Aparecen desde la derecha, a nivel del suelo
      anchor("botright"),
      move(LEFT, rapidez),
      area(personajeRandom.area),
      scale(personajeRandom.scale),
      personajeRandom.tag,
      z(1),
    ]);

    // destruir personaje cuando la cerveza lo sobrepasa
    personaje.onUpdate(() => {
      if (personaje.pos.x < cerveza.pos.x) {
        destroy(personaje);
      }
    });

    // llamar a la función de nuevo tras un tiempo aleatorio
    wait(
      rand(
        GAME_CONFIG.SPAWN_RATES.CHARACTERS.min,
        GAME_CONFIG.SPAWN_RATES.CHARACTERS.max
      ),
      () => {
        aparecionPersonajes();
      }
    );
  }

  // activar el spawn
  aparecionPersonajes();

  // aparición power-ups
  function aparecionPowerUps() {
    const rapidez = 200;
    const opciones = [
      {
        name: "lupulo",
        tag: "lupulo",
        scale: lupulo.scale,
        area: lupulo.area,
      },
      {
        name: "cebada",
        tag: "cebada",
        scale: cebada.scale,
        area: cebada.area,
      },
    ];

    const powerUpRandom = opciones[Math.floor(rand(0, opciones.length))];

    const powerUp = add([
      sprite(powerUpRandom.name),
      pos(width(), height()), // Aparecen desde la derecha, a nivel del suelo
      anchor("botright"),
      move(LEFT, rapidez),
      area(powerUpRandom.area),
      scale(powerUpRandom.scale),
      powerUpRandom.tag,
      z(1),
    ]);
    // destruir power-up cuando la cerveza lo sobrepasa
    powerUp.onUpdate(() => {
      if (powerUp.pos.x < cerveza.pos.x) {
        destroy(powerUp);
      }
    });

    // llamar a la función de nuevo tras un tiempo aleatorio
    wait(
      rand(
        GAME_CONFIG.SPAWN_RATES.POWERUPS.min,
        GAME_CONFIG.SPAWN_RATES.POWERUPS.max
      ),
      () => {
        aparecionPowerUps();
      }
    );
  }

  // activar el spawn
  aparecionPowerUps();

  // interacción entre personajes
  cerveza.onCollide("borracho", () => {
    if (tieneEscudo) {
      // consumir el escudo y no recibir daño
      tieneEscudo = false;
      escudoLabel.text = "Escudo: No";
      shake(); // shake para indicar que se bloqueó el ataque
      return; // salir sin hacer daño
    }

    shake();
    addKaboom(cerveza.pos);
    cerveza.hurt(1);
    vidas = vidas.slice(0, -1);
    vidasLabel.text = vidas.toString();
    fondoVidas.width -= 25; // ajustar el fondo según las vidas
    // si la vida = 0, se pierde
    if (cerveza.hp() <= 0) {
      destroy(cerveza);
      track("game_over", { final_score: score, reason: "no_lives" });
      go("perdido");
    }
  });

  cerveza.onCollide("bacteria", () => {
    vidas = cerveza.hp();
    vidasLabel.text = vidas.toString();
    cerveza.hp(0);
    track("game_over", { final_score: score, reason: "bacteria" });
    go("perdido");
  });

  cerveza.onCollide("gato", () => {
    score += 100;
    scoreLabel.text = score.toString();
  });

  // interacción power-ups
  cerveza.onCollide("lupulo", () => {
    // otorgar escudo de inmunidad contra borrachos
    tieneEscudo = true;
    escudoLabel.text = "Escudo: Sí";
  });

  cerveza.onCollide("cebada", () => {
    cerveza.setHP(cerveza.hp() + 1);
    vidas = "❤".repeat(cerveza.hp());
    fondoVidas.width = 55 + 25 * cerveza.hp(); // ajustar el fondo según las vidas
    vidasLabel.text = vidas.toString();
  });

  // iniciar animación al cargar la escena
  onLoad(() => {
    cerveza.play("correr");
  });

  // fondo responsive
  createResponsiveBackground("fondo");

  // piso
  add([
    rect(width(), 60),
    pos(0, height()),
    outline(4),
    area(),
    body({ isStatic: true }),
    color(194, 194, 194),
    "ground",
    z(1),
  ]);
});

// escena de perder
// fondo del juego
loadSprite("fondo-perdido", "./sprites/fondo-perdido.png");
scene("perdido", async () => {
  // Verificar estado del límite diario (solo una vez por sesión)
  await checkDailyLimitOnce();
  // Usar el estado global actual, que puede haber cambiado después de un intento de guardado
  const canSave = canSaveScore;

  // fondo responsive
  createResponsiveBackground("fondo-perdido");

  // texto de perder
  add([
    text("¡Se tomaron la birra!", {
      size: 100,
      width: width(),
      align: "center",
    }),
    color(255, 255, 255),
    pos(center()),
    anchor("center"),
    z(3),
  ]);

  // fondo para el texto de perder
  add([
    rect(1200, isMobile ? 250 : 200),
    pos(center()),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.5),
    z(1),
  ]);

  const btnPos = vec2(width() / 2, height() / 2 + 200);
  const startBtn = add([
    rect(370, 60),
    pos(btnPos),
    anchor("center"),
    color(40, 180, 40),
    outline(6),
    area(),
    z(1),
  ]);

  // texto del botón para iniciar
  add([
    text("Volver al Inicio", { size: 36 }),
    pos(btnPos),
    anchor("center"),
    color(255, 255, 255),
    z(2),
  ]);

  // texto de puntuación final
  add([
    text(`Puntuación: ${score}`, { size: isMobile ? 50 : 32 }),
    pos(width() / 2, height() / 2 - 240),
    anchor("center"),
    color(255, 0, 0),
    z(2),
  ]);

  // fondo para el texto de puntuación
  add([
    rect(isMobile ? 550 : 300, isMobile ? 100 : 50),
    pos(width() / 2, height() / 2 - 240),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(1),
  ]);

  // Si no es móvil, la puntuación es mayor a 0 y puede guardar, mostrar opción de guardar
  // botón guardar / alcanzar el límite diario
  const btnGuardar = vec2(width() / 2, height() / 2 + 300);
  if (!isMobile && score > 0 && canSave) {
    // guardar puntuación
    const guardarBtn = add([
      rect(400, 60),
      pos(btnGuardar),
      anchor("center"),
      color(255, 255, 0),
      outline(6),
      area(),
      z(1),
    ]);

    // texto del botón para guardar
    add([
      text("Guardar Puntuación", { size: 36 }),
      pos(btnGuardar),
      anchor("center"),
      color(0, 0, 0),
      z(2),
    ]);

    // guardar puntuación
    guardarBtn.onClick(() => {
      go("teclado");
    });
    //
  } else if (!isMobile && score > 0 && !canSave) {
    add([
      rect(440, 80),
      pos(btnGuardar),
      anchor("center"),
      color(255, 255, 0),
      outline(6),
      area(),
      z(1),
    ]);
    add([
      text(
        `Registro de puntuaciones alcanzado.\nMáximo de ${MAX_DAILY_ATTEMPTS} por día.\nIntenta mañana 🍻`,
        {
          size: 22,
          align: "center",
        }
      ),
      pos(btnGuardar),
      anchor("center"),
      color(0, 0, 0),
      z(2),
    ]);
  } else if (isMobile && score > 0) {
    const btnVerPuntuaciones = add([
      rect(500, 100),
      pos(btnGuardar),
      anchor("center"),
      color(255, 255, 0),
      outline(6),
      area(),
      z(1),
    ]);
    add([
      text(
        "Ver Puntuaciones máximas 🚀.\nEn dispositivos móviles no se pueden registrar puntajes, solo en desktop.",
        {
          size: 22,
          align: "center",
        }
      ),
      pos(btnGuardar),
      anchor("center"),
      color(0, 0, 0),
      z(2),
    ]);

    // ver puntuaciones altas
    btnVerPuntuaciones.onClick(() => {
      go("highScores");
    });
  }

  // reiniciar juego
  startBtn.onClick(() => {
    window.location.reload();
  });
});

// escena teclado, para ingresar nombre de la persona jugadora
loadSprite("fondo-nombre", "./sprites/fondo-nombre.png");
scene("teclado", () => {
  // fondo responsive
  createResponsiveBackground("fondo-nombre");

  // texto de instrucciones
  add([
    text("Escriba su nombre", { size: 48 }),
    pos(width() / 2, height() / 2 - 100),
    anchor("center"),
    color(255, 255, 255),
    z(3),
  ]);
  // fondo para el texto de instrucciones
  add([
    rect(500, 80),
    pos(width() / 2, height() / 2 - 100),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(1),
  ]);

  // texto del nombre
  const nombreTexto = add([
    text(`${nombre}`, { size: 32 }),
    pos(width() / 2, height() / 2),
    anchor("center"),
    z(3),
  ]);

  // Función para actualizar el texto
  function actualizarNombre() {
    nombreTexto.text = `${nombre}`;
  }

  // fondo para el texto del nombre
  add([
    rect(400, 60),
    pos(width() / 2, height() / 2),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(2),
  ]);

  // Configurar controles de entrada de texto usando el módulo modular
  setupTextInputControls(
    actualizarNombre,
    (char: string) => {
      nombre += char;
    },
    () => {
      nombre = nombre.slice(0, -1);
    }
  );

  // puntuación
  add([
    text(`Puntuación: ${score}`, { size: isMobile ? 50 : 32 }),
    pos(width() / 2, height() / 2 - 240),
    anchor("center"),
    color(255, 0, 0),
    z(2),
  ]);

  // fondo para el texto de puntuación
  add([
    rect(isMobile ? 550 : 300, isMobile ? 100 : 50),
    pos(width() / 2, height() / 2 - 240),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.8),
    z(1),
  ]);

  // guardar puntuación
  // botón siguiente
  const btnSiguiente = vec2(width() / 2, height() / 2 + 275);
  const siguienteBtn = add([
    rect(400, 60),
    pos(btnSiguiente),
    anchor("center"),
    color(255, 255, 0),
    outline(6),
    area(),
    z(1),
  ]);

  // texto del botón para siguiente
  const siguienteBtnText = add([
    text("Siguiente", { size: 36 }),
    pos(btnSiguiente),
    anchor("center"),
    color(0, 0, 0),
    z(2),
  ]);

  // guardar puntuación
  siguienteBtn.onClick(async () => {
    try {
      if (nombre.trim() === "") {
        alert("Por favor, ingrese un nombre válido.");
        return;
      }
      destroy(siguienteBtnText);
      destroy(siguienteBtn);
      add([
        rect(400, 60),
        pos(btnSiguiente),
        anchor("center"),
        color(0, 200, 0),
        outline(6),
        z(1),
      ]);
      add([
        text("Guardando...", { size: 36 }),
        pos(btnSiguiente),
        anchor("center"),
        color(0, 0, 0),
        z(2),
      ]);

      // En móvil no se guarda en Firebase, solo ir directo a highScores
      if (isMobile) {
        track("score_not_saved_mobile", { score: score, player_name: nombre });
        go("highScores");
        return;
      }

      await saveScore(nombre, score);

      // Actualizar estado global después de guardar exitosamente
      attemptsToday++;
      if (attemptsToday >= MAX_DAILY_ATTEMPTS) {
        canSaveScore = false;
        console.log(
          `🚫 Límite diario alcanzado después de guardar puntaje (${attemptsToday}/${MAX_DAILY_ATTEMPTS})`
        );
      }

      track("score_saved", { score: score, player_name: nombre });
      go("highScores");
    } catch (error) {
      console.error("Error al guardar la puntuación:", error);

      // Si es error de límite diario, actualizar estado global
      if (
        error instanceof Error &&
        error.message.includes("Límite diario alcanzado")
      ) {
        canSaveScore = false;
        attemptsToday = MAX_DAILY_ATTEMPTS; // Marcar como límite alcanzado
        console.log(
          `🚫 Estado global actualizado: Límite diario alcanzado (${attemptsToday}/${MAX_DAILY_ATTEMPTS})`
        );
      }
    }
  });
});

// escena de puntuaciones altas
loadSprite("fondo-puntajesAltos", "./sprites/fondo-puntajesAltos.png");
scene("highScores", async () => {
  // Track página de puntajes altos
  track("page_view", { page: "high_scores" });

  // fondo responsive
  createResponsiveBackground("fondo-puntajesAltos");

  // texto de título
  add([
    text("Puntuaciones Altas", { size: 64 }),
    pos(width() / 2, 100),
    anchor("center"),
    color(255, 255, 255),
    z(3),
  ]);

  // fondo para el texto de título
  add([
    rect(700, 100),
    pos(width() / 2, 100),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(1),
  ]);

  // obtener y mostrar las puntuaciones
  try {
    const topScores = await getTopScores();
    if (topScores.length === 0) {
      add([
        text("No hay puntuaciones registradas.", { size: 32 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(255, 255, 255),
        z(3),
      ]);
    } else {
      topScores.forEach((score, index) => {
        add([
          text(`${index + 1}. ${score.nombre}: ${score.puntuacion}`, {
            size: 32,
          }),
          pos(width() / 2, 180 + index * 40),
          anchor("center"),
          color(255, 255, 255),
          z(3),
        ]);
        // fondo para cada puntuación
        add([
          rect(600, 40),
          pos(width() / 2, 180 + index * 40),
          anchor("center"),
          color(0, 0, 0),
          opacity(0.7),
          z(2),
        ]);
      });
    }

    // botón reiniciar
    const btnPos = vec2(width() / 2, height() - 100);
    const startBtn = add([
      rect(350, 60),
      pos(btnPos),
      anchor("center"),
      color(40, 180, 40),
      outline(6),
      area(),
      z(1),
    ]);

    // texto del botón para reiniciar
    add([
      text("Volver al Inicio", { size: 36 }),
      pos(btnPos),
      anchor("center"),
      color(255, 255, 255),
      z(2),
    ]);

    // usar teclado para reiniciar
    setupNavigationControls(() => window.location.reload());

    // reiniciar juegos
    startBtn.onClick(() => {
      window.location.reload();
    });
  } catch (error) {
    console.error("Error al obtener las puntuaciones:", error);
  }
});

go("menu");
