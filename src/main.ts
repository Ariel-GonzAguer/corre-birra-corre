// Importar kaplay y tipos globales
import kaplay from "kaplay";
import "kaplay/global";

kaplay({
  debugKey: "p",
});

// ---------------------- Sprites inlined ----------------------
// cerveza sprite
loadSprite("cerveza", "./sprites/beer-sprite.png", {
  sliceX: 2,
  sliceY: 2,
  anims: {
    correr: { from: 0, to: 3, speed: 9, loop: true },
  },
});

// borracho sprite
loadSprite("borracho", "./sprites/borracho.png");
const borracho = add([sprite("borracho"), "borracho", "malo"]);

// gato sprite
loadSprite("gato", "./sprites/gato-rojo-bueno.png");
const gato = add([sprite("gato"), "gato", "bueno"]);

// fondo para el menú
loadSprite("fondo-menu", "./sprites/fondo-menu.png");

const fondoMenu = () => {
  getSprite("fondo-menu").then((spr) => {
    const scaleVal = Math.max(width() / spr.width, height() / spr.height);
    add([
      sprite("fondo-menu"),
      pos(0, -700),
      anchor("topleft"),
      scale(scaleVal),
      z(-10),
    ]);
  });
};

// fondo para el juego
loadSprite("fondo", "./sprites/fondo-juego.png");

const fondoJuego = () => {
  getSprite("fondo").then((spr) => {
    const scaleVal = Math.max(width() / spr.width, height() / spr.height);
    add([
      sprite("fondo"),
      pos(0, 0),
      anchor("topleft"),
      scale(scaleVal),
      z(-10),
    ]);
  });
};

// ---------------------- Escena Menu inlined ----------------------
const escenaMenu = () => {
  // cargar y añadir fondo
  fondoMenu();

  scene("menu", () => {
    // fondo del título
    add([
      rect(720, 100),
      pos(center()),
      anchor("center"),
      color(0, 0, 0),
      opacity(0.75),
      z(0),
    ]);
    add([
      rect(475, 50),
      pos(770, 425),
      anchor("center"),
      color(0, 0, 0),
      opacity(0.6),
      z(0),
    ]);
    // título
    add([
      text("Corre Birra Corre", { size: 70 }),
      color(255, 255, 255),
      pos(center()),
      anchor("center"),
      z(1),
    ]);
    // subtítulo
    add([
      text("huye de los borrachos y bacterias", { size: 24 }),
      color(255, 255, 255),
      pos(center().x, center().y + 80),
      anchor("center"),
      z(1),
    ]);

    // botón iniciar
    const btnPos = vec2(center().x, center().y + 150);
    const startBtn = add([
      rect(300, 70),
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

    // permitir iniciar con teclado
    onKeyDown("enter", () => go("juego"));
  });
};

// ---------------------- Escena Juego inlined ----------------------
scene("juego", () => {
  setGravity(1900);

  // fondo
  fondoJuego();

  // Crear el sprite
  const birra = add([
    sprite("cerveza"),
    pos(24, height() - 60),
    area({ scale: 0.8 }),
    body(),
    health(1),
    anchor("botleft"), // Anclar desde la parte inferior izquierda
    z(2),
  ]);

  // Reproducir la animación con tecla
  onKeyDown("a", () => {
    birra.play("correr");
  });

  // Detener la animación
  onKeyDown("s", () => {
    birra.stop();
  });

  // Controlar el salto
    // control de saltos (max 1 salto seguido)
    let jumpCount = 0;
    const maxJumps = 1;
    // usar onKeyPress para asegurar que cada pulsación cuenta
    onKeyPress("space", () => {
      if (jumpCount < maxJumps) {
        birra.jump(900);
        jumpCount++;
      }
    });

    // Resetear contador al tocar el suelo: doble mecanismo
    birra.onCollide("ground", () => {
      jumpCount = 0;
    });
    // fallback: si la birra está en la Y del suelo, resetear
    const groundY = height() - 60;
    onUpdate(() => {
      if (birra.pos && typeof birra.pos.y === "number") {
        if (birra.pos.y >= groundY - 1) {
          jumpCount = 0;
        }
      }
    });

  birra.onCollide("tree", () => {
    shake();
    destroy(birra);
    go("lose");
  });

  // piso
  add([
    rect(width(), 60),
      pos(0, height() - 60),
    outline(4),
    area(),
    body({ isStatic: true }),
    color(194, 194, 194),
      "ground",
      z(1),
  ]);

  // aparición random de obstáculos: borracho o gato (alineados y escalados a la birra)
  function genteRandom() {
    // generar una velocidad compartida para esta aparición
    const speed = rand(140, 260);
    // elegir aleatoriamente entre 'borracho' y 'gato'
    const opciones = [
      { name: "borracho", tag: "borracho" },
      { name: "gato", tag: "gato" },
    ];
    const elegido = opciones[Math.floor(rand(0, opciones.length))];

    // obtener dimensiones de las sprites para calcular escala
    Promise.all([getSprite("cerveza"), getSprite(elegido.name)])
      .then(([sprBirra, sprEnemigo]) => {
        const birraHeight = sprBirra?.height || 1;
        const enemigoHeight = sprEnemigo?.height || 1;
        // escala para igualar alturas visuales
        let scaleVal = birraHeight / enemigoHeight;
        // si es gato, hacerlo más pequeño (factor ajustable)
        if (elegido.name === "gato") {
          scaleVal *= 0.7; // reduce al 70% de la altura equivalente
        }

        // usar siempre la Y del suelo para que no aparezcan volando
        const y = height() - 60;

        add([
          sprite(elegido.name),
          pos(width(), y),
          anchor("botleft"),
          scale(scaleVal),
          area(),
          move(LEFT, speed),
          elegido.tag,
          z(1),
        ]);
      })
      .catch(() => {
        // fallback visual si las sprites no se han cargado aún
        add([
          rect(48, 64),
          area(),
          outline(4),
          pos(width(), height() - 60),
          anchor("botleft"),
          color(255, 180, 255),
          move(LEFT, speed || 160),
          "tree",
        ]);
      });

    // volver a llamar la función tras un intervalo aleatorio
    wait(rand(1, 5), () => {
      genteRandom();
    });
  }
  // activar el spawn
  genteRandom();

  let score = 0;
  // fondo para el score
  add([rect(80, 40), pos(16, 16), color(0, 0, 0), opacity(0.5), z(5)]);
  const scoreLabel = add([
    text(score, { size: 32 }),
    pos(24, 24),
    color(255, 255, 255),
    z(6),
  ]);

  // increment score every frame
  onUpdate(() => {
    score++;
    scoreLabel.text = score;
  });
});

scene("lose", () => {
  add([
    text("Game Over", { size: 64 }),
    pos(center()),
    anchor("center"),
    color(255, 60, 60),
    z(10),
  ]);
});

// iniciar menu y entrar (se llama después de que escenaMenu esté definida)
escenaMenu();
// go("menu");
go("juego");
