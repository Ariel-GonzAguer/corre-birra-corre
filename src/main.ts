// Importar kaplay y tipos globales
import kaplay from "kaplay";
import "kaplay/global";

kaplay({
  // debugKey: "p",
});

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

// borracho
loadSprite("borracho", "./sprites/borracho.png");

const borracho = add([
  sprite("borracho"),
  pos(rand(0, width()), 695),
  scale(0.8),
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
      size: 48,
      color: rgb(255, 255, 255),
      width: width(),
      align: "center",
    }),
    pos(width() / 2, 100),
    anchor("center"),
    z(1),
  ]);

  // fondo para título
  add([
    rect(600, 80),
    pos(width() / 2, 100),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(0),
  ]);

  // subtítulo
  add([
    text("¡Huye de los borrachos y bacterias!", {
      size: 28,
      color: rgb(255, 255, 255),
      width: width(),
      align: "center",
    }),
    pos(width() / 2, 200),
    anchor("center"),
    z(1),
  ]);

  // fondo para subtítulo
  add([
    rect(600, 50),
    pos(width() / 2, 200),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(0),
  ]);

  // logo Gato Rojo Lab
  add([
    sprite("gatoRojoLab"),
    pos(width() / 2, height() - 100),
    anchor("center"),
    scale(0.7),
    z(3),
  ]);

  // fondo para logo
  add([
    rect(300, 175),
    pos(width() / 2, height() - 100),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(2),
  ]);

  // botón iniciar
  const btnPos = vec2(width() / 2, height() / 2 + 50);
  const startBtn = add([
    rect(250, 60),
    pos(btnPos),
    anchor("center"),
    color(40, 180, 40),
    outline(6),
    area(),
    z(1),
  ]);

  // texto del botón para iniciar
  add([
    text("Iniciar", { size: 36 }),
    pos(btnPos),
    anchor("center"),
    color(255, 255, 255),
    z(2),
  ]);

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

  // puntuación
  let score = 0;
  // fondo para el score
  add([rect(80, 40), pos(16, 16), color(0, 0, 0), opacity(0.5), z(5)]);
  const scoreLabel = add([
    text(score, { size: 32 }),
    pos(24, 24),
    color(255, 255, 255),
    z(6),
  ]);

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

  // vidas de la cerveza
  let vidas = "❤❤❤";
  // fondo para el score
  add([rect(110, 40), pos(150, 16), color(0, 0, 0), opacity(0.5), z(5)]);
  const vidasLabel = add([
    text(vidas, { size: 32 }),
    color(255, 0, 0),
    pos(160, 24),
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
  // Detectar si es un dispositivo móvil
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in window;
  
  if (isMobile) {
    // Botón de salto (centro-derecha)
    const jumpButton = add([
      rect(80, 80),
      pos(width() - 100, height() - 100),
      color(255, 255, 255),
      opacity(0.7),
      anchor("center"),
      z(10),
      "jumpButton"
    ]);
    
    // Texto del botón de salto
    add([
      text("↑", { size: 48 }),
      pos(width() - 100, height() - 100),
      color(0, 0, 0),
      anchor("center"),
      z(11)
    ]);

    // Botón izquierda
    const leftButton = add([
      rect(70, 70),
      pos(30, height() - 100),
      color(255, 255, 255),
      opacity(0.7),
      anchor("center"),
      z(10),
      "leftButton"
    ]);
    
    // Texto del botón izquierda
    add([
      text("←", { size: 36 }),
      pos(30, height() - 100),
      color(0, 0, 0),
      anchor("center"),
      z(11)
    ]);

    // Botón derecha
    const rightButton = add([
      rect(70, 70),
      pos(120, height() - 100),
      color(255, 255, 255),
      opacity(0.7),
      anchor("center"),
      z(10),
      "rightButton"
    ]);
    
    // Texto del botón derecha
    add([
      text("→", { size: 36 }),
      pos(120, height() - 100),
      color(0, 0, 0),
      anchor("center"),
      z(11)
    ]);

    // Eventos táctiles para el botón de salto
    jumpButton.onClick(() => {
      if (jumpCount < maxJumps) {
        cerveza.jump(900);
        jumpCount++;
      }
    });

    // Eventos táctiles para movimiento
    leftButton.onClick(() => {
      cerveza.pos.x -= 30;
    });

    rightButton.onClick(() => {
      cerveza.pos.x += 30;
    });

    // Variables para controles táctiles continuos
    let leftPressed = false;
    let rightPressed = false;

    // Eventos de toque para movimiento continuo
    leftButton.onHover(() => {
      leftPressed = true;
    });

    leftButton.onHoverEnd(() => {
      leftPressed = false;
    });

    rightButton.onHover(() => {
      rightPressed = true;
    });

    rightButton.onHoverEnd(() => {
      rightPressed = false;
    });

    // Actualización continua para movimiento
    onUpdate(() => {
      if (leftPressed) {
        cerveza.pos.x -= 3;
      }
      if (rightPressed) {
        cerveza.pos.x += 3;
      }
    });
  }

  // saltos
  onKeyPress("space", () => {
    if (jumpCount < maxJumps) {
      cerveza.jump(900);
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

    add([
      sprite(personajeRandom.name),
      pos(width(), height()), // Aparecen desde la derecha, a nivel del suelo
      anchor("botright"),
      move(LEFT, rapidez),
      area(personajeRandom.area),
      scale(personajeRandom.scale),
      personajeRandom.tag,
      z(1),
    ]);

    wait(rand(1.25, 4), () => {
      aparecionPersonajes();
    });
  }

  // activar el spawn
  aparecionPersonajes();

  // interacción entre personajes
  cerveza.onCollide("borracho", () => {
    shake();
    addKaboom(cerveza.pos);
    cerveza.hurt(1);
    vidas = vidas.slice(0, -1);
    vidasLabel.text = vidas.toString();
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
    rect(1200, 200),
    pos(center()),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.5),
    z(1),
  ]);

  const btnPos = vec2(width() / 2, height() / 2 + 200);
  const startBtn = add([
    rect(350, 60),
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

  startBtn.onClick(() => {
    go("menu");
  });
});

// go("perdido");

// DESCOMENTAR AL FINAL
go("menu");
