// Importar kaplay y tipos globales
import kaplay from "kaplay";
import "kaplay/global";

kaplay({
  debugKey: "p",
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

// Detectar si es un dispositivo móvil
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || "ontouchstart" in window;

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

scene("menu", () => {
  // color de fondo en rgb
  setBackground(0, 0, 0);

  // imagen de fondo responsive
  getSprite("fondo-menu").then((menuSprite) => {
    if (menuSprite) {
      const scaleX = width() / menuSprite.width;
      const scaleY = height() / menuSprite.height;
      const menuScale = Math.max(scaleX, scaleY);

      add([
        sprite("fondo-menu"),
        pos(width() / 2, height() / 2),
        anchor("center"),
        scale(menuScale),
        z(-10),
      ]);
    }
  });

  // texto de título
  add([
    text("¡Corre Birra Corre!", {
      size: isMobile ? 74 : 48,
      color: rgb(255, 255, 255),
      width: width(),
      align: "center",
    }),
    pos(width() / 2, 200),
    anchor("center"),
    z(1),
  ]);

  // fondo para título
  add([
    rect(isMobile ? 900 : 600, isMobile ? 150 : 80),
    pos(width() / 2, 200),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(0),
  ]);

  // subtítulo
  add([
    text("¡Huye de los borrachos y bacterias!", {
      size: isMobile ? 38 : 28,
      color: rgb(255, 255, 255),
      width: width(),
      align: "center",
    }),
    pos(width() / 2, isMobile ? 700 : 200),
    anchor("center"),
    z(1),
  ]);

  // fondo para subtítulo
  add([
    rect(isMobile ? 850 : 600, isMobile ? 100 : 50),
    pos(width() / 2, isMobile ? 700 : 200),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(0),
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
  onKeyPress("enter", () => {
    go("como-jugar");
  });

  startBtn.onClick(() => {
    go("como-jugar");
  });
});

// cómo jugar
// imagen de fondo
loadSprite("fondo-como-jugar", "./sprites/fondo-como-jugar.png");

scene("como-jugar", () => {
  // fondo responsive
  getSprite("fondo-como-jugar").then((comoJugarSprite) => {
    if (comoJugarSprite) {
      const scaleX = width() / comoJugarSprite.width;
      const scaleY = height() / comoJugarSprite.height;
      const menuScale = Math.max(scaleX, scaleY);

      add([
        sprite("fondo-como-jugar"),
        pos(width() / 2, height() / 2),
        anchor("center"),
        scale(menuScale),
        z(-10),
      ]);
    }
  });

  // inicialización de variable para darle valor dentro de un if, y usar sus propiedades después
  if (isMobile) {
    add([
      text(
        "Instrucciones\n- Use el botón ↑ para saltar. ¡Puede hacer saltos dobles!\n- Use las flechas ← y → para moverse hacia atrás y adelante, respectivamente.\nImportante: Si retrocede mucho, la cerveza desaparece y hay que reiniciar el juego.\n- Si colisiona con un borracho pierde una vida ♥️.\n- Si toca una bacteria pierde el juego.\n- Si toca un lúpulo obtiene protección contra el siguiente borracho que llegue.\n- Si toca la cebada obtiene una vida extra.\nImportante: No use el dispositivo en modo horizontal.",
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
    ? vec2(width() / 2, height() / 2 + 600)
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
  onKeyPress("enter", () => {
    go("juego");
  });

  startBtn.onClick(() => {
    go("juego");
  });
});

// juego
// fondo del juego
loadSprite("fondo", "./sprites/fondo-juego.png");

scene("juego", () => {
  // gravedad → va dentro de la escena
  setGravity(1900);

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
    text(score, { size: isMobile ? 65 : 32 }),
    color(255, 255, 255),
    pos(24, 24),
    z(6),
  ]);

  // fondo para las vidas
  const fondoVidas = add([
<<<<<<< HEAD
    rect(isMobile ? 50 : 110, isMobile ? 150 : 40),
=======
    rect(isMobile ? 200 : 110, isMobile ? 70 : 40), 
>>>>>>> 31cc6155814ad6ed22f4d23fd86ad69f747cd547
    pos(isMobile ? 16 : width() / 2 - 5, isMobile ? 180 : 16),
    color(0, 0, 0),
    opacity(0.5),
    z(5),
  ]);
  // texto de las vidas
  const vidasLabel = add([
    text(vidas, { size: isMobile ? 65 : 32 }),
    pos(isMobile ? 16 : width() / 2, isMobile ? 180 : 24),
    color(255, 0, 0),
    z(6),
  ]);

  // fondo para el escudo
  add([
<<<<<<< HEAD
    rect(isMobile ? 200 : 240, isMobile ? 80 : 33),
=======
    rect(isMobile ? 250 : 185, isMobile ? 40 : 33),
>>>>>>> 31cc6155814ad6ed22f4d23fd86ad69f747cd547
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

  // manejar la cerveza
  cerveza.onKeyPress("right", () => {
    cerveza.pos.x += 30;
  });
  cerveza.onKeyPress("left", () => {
    cerveza.pos.x -= 30;
  });

  // Controlar el salto
  // control de saltos (max 1 salto seguido)
  let jumpCount = 0;
  const maxJumps = 1;

  // Controles táctiles para móviles
  if (isMobile) {
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
          cerveza.jump(1060);
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
  }

  // saltos
  onKeyPress("space", () => {
    if (jumpCount < maxJumps) {
      cerveza.jump(1060);
      jumpCount++;
    }
  });
  // si la cerveza está en la Y del suelo, resetear
  const groundY = height() - 60;
  onUpdate(() => {
    if (cerveza.pos && typeof cerveza.pos.y === "number") {
      if (cerveza.pos.y >= groundY - 1) {
        jumpCount = 0;
      }
    }
  });
  // Resetear contador al tocar el suelo: doble mecanismo
  cerveza.onCollide("ground", () => {
    jumpCount = 0;
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
    wait(rand(1.25, 4), () => {
      aparecionPersonajes();
    });
  }

  // activar el spawn
  aparecionPersonajes(); // ******************

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
    wait(rand(10, 20), () => {
      aparecionPowerUps();
    });
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
      go("perdido");
    }
  });

  cerveza.onCollide("bacteria", () => {
    vidas = cerveza.hp();
    vidasLabel.text = vidas.toString();
    cerveza.hp(0);
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
  getSprite("fondo").then((backgroundSprite) => {
    if (backgroundSprite) {
      const scaleX = width() / backgroundSprite.width;
      const scaleY = height() / backgroundSprite.height;
      const backgroundScale = Math.max(scaleX, scaleY);

      add([
        sprite("fondo"),
        pos(width() / 2, height() / 2),
        anchor("center"),
        scale(backgroundScale),
        z(-1),
      ]);
    }
  });

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
scene("perdido", () => {
  // fondo responsive
  getSprite("fondo-perdido").then((backgroundSprite) => {
    if (backgroundSprite) {
      const scaleX = width() / backgroundSprite.width;
      const scaleY = height() / backgroundSprite.height;
      const backgroundScale = Math.max(scaleX, scaleY);
      add([
        sprite("fondo-perdido"),
        pos(width() / 2, height() / 2),
        anchor("center"),
        scale(backgroundScale),
        z(-10),
      ]);
    }
  });

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

  // guardar puntuación
  // botón guardar
  const btnGuardar = vec2(width() / 2, height() / 2 + 275);
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

  // reiniciar juego
  startBtn.onClick(() => {
    window.location.reload();
  });
});

// escena teclado, para ingresar nombre de la persona jugadora
loadSprite("fondo-nombre", "./sprites/fondo-nombre.png");
scene("teclado", () => {
  // fondo responsive
  getSprite("fondo-nombre").then((backgroundSprite) => {
    if (backgroundSprite) {
      const scaleX = width() / backgroundSprite.width;
      const scaleY = height() / backgroundSprite.height;
      const backgroundScale = Math.max(scaleX, scaleY);
      add([
        sprite("fondo-nombre"),
        pos(width() / 2, height() / 2),
        anchor("center"),
        scale(backgroundScale),
        z(-10),
      ]);
    }
  });

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
    text(`${nombre}`, {
      size: 32,
    }),
    pos(width() / 2, height() / 2),
    anchor("center"),
    z(3),
  ]);
  // fondo para el texto del nombre
  add([
    rect(400, 50),
    pos(width() / 2, height() / 2),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(1),
  ]);

  // Función para actualizar el texto
  function actualizarNombre() {
    nombreTexto.text = `${nombre}`;
  }

  // Manejar todas las letras del alfabeto
  const letras = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (const letra of letras) {
    onKeyPress(letra, () => {
      nombre += letra;
      actualizarNombre();
    });
  }

  // Manejar espacio
  onKeyPress("space", () => {
    nombre += " ";
    actualizarNombre();
  });

  // Manejar borrar (tecla backspace)
  onKeyPress("backspace", () => {
    nombre = nombre.slice(0, -1); // quitar última letra
    actualizarNombre();
  });

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
  add([
    text("Siguiente", { size: 36 }),
    pos(btnSiguiente),
    anchor("center"),
    color(0, 0, 0),
    z(2),
  ]);

  // guardar puntuación
  siguienteBtn.onClick(() => {
    go("highScores");
  });


});

// go("perdido");

// DESCOMENTAR AL FINAL
go("menu");
