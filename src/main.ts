// Importar kaplay y tipos globales
import kaplay from "kaplay";
import "kaplay/global";

kaplay({
  debugKey: "p",
});

// sprites de personajes y sprites
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

// borracho
loadSprite("borracho", "./sprites/borracho.png");

// bacteria
loadSprite("bacteria", "./sprites/bacteria.png");

const bacteria = add([sprite("bacteria"), "bacteria", "malo"]);

// escenas
// menú
// imagen de fondo
loadSprite("fondo-menu", "./sprites/fondo-menu.png");
// imagen logo Gato Rojo Lab
loadSprite("gatoRojoLab", "./sprites/gatoRojoLab-logo.png");

scene("menu", () => {
  // color de fondo en rgb
  setBackground(0, 0, 0);

  // imagen de fondo
  add([
    sprite("fondo-menu"),
    pos(250, 790),
    anchor("botleft"),
    scale(1),
    z(-10),
  ]);

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
    pos(width() / 2, 180),
    anchor("center"),
    z(1),
  ]);

  // fondo para subtítulo
  add([
    rect(550, 50),
    pos(width() / 2, 180),
    anchor("center"),
    color(0, 0, 0),
    opacity(0.7),
    z(0),
  ]);

  // logo Gato Rojo Lab
  add([
    sprite("gatoRojoLab"),
    pos(width() / 2, 600),
    anchor("center"),
    scale(0.7),
    z(3),
  ]);

  // fondo para logo
  add([
    rect(300, 175),
    pos(width() / 2, 600),
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

  // personaje principal y acciones
  const cerveza = add([
    sprite("cerveza"),
    pos(0, height() - 60),
    area({ scale: 0.8 }),
    body(), // para que actúe con la gravedad
    health(1),
    anchor("botleft"), // Anclar desde la parte inferior izquierda
    health(3),
    z(2),
    "cerveza",
    "player",
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

  // borracho
  add([
    sprite("borracho"),
    pos(rand(0, width()), 695),
    area({ scale: 0.9 }),
    body(),
    anchor("botright"),
    "borracho",
    "malo",
  ]);

  // gato
  const gato = add([
    sprite("gato"),
    pos(rand(0, width()), 695),
    scale(0.3),
    area({ scale: 0.85 }),
    body(),
    anchor("botright"),
    "gato",
    "bueno",
  ]);

  // interacción entre personajes
  cerveza.onCollide("borracho", () => {
    shake();
    addKaboom(cerveza.pos);
    cerveza.hurt(1);
    // si la vida = 0, se pierde
    if (cerveza.hp() <= 0) {
      destroy(cerveza);
      go("lose");
    }
  });

  // iniciar animación al cargar la escena
  onLoad(() => {
    cerveza.play("correr");
  });

  // fondo
  add([sprite("fondo"), pos(750, 310), anchor("center"), scale(1.35), z(-1)]);

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

go("juego");

// DESCOMENTAR AL FINAL
// go("menu");
