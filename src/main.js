import kaplay from "kaplay";

kaplay({
  debugKey: "p",
});


// Cargar el sprite de forma asíncrona
loadSprite("cerveza", "./sprites/beer-sprite.png", {
  sliceX: 2,
  sliceY: 2,
  anims: {
    correr: { from: 0, to: 3, speed: 9, loop: true },
  },
});

scene("juego", () => {
  setGravity(1600);

  // Crear el sprite
  const birra = add([
    sprite("cerveza"),
    pos(-20, height() - 38),
    area({ scale: 0.5 }),
    body(),
    health(1),
    anchor("botleft"), // Anclar desde la parte inferior izquierda
  ]);

  // Reproducir la animación
  birra.onKeyDown("a", () => {
    birra.play("correr");
  });

  // Detener la animación
  birra.onKeyDown("s", () => {
    birra.stop();
  });


  // Controlar el movimiento con las teclas
  birra.onKeyDown("space", () => {
    birra.jump(400);
  });


  birra.onCollide("tree", () => {
    shake();
    destroy(birra);
    go("lose");
    // birra.death(); --- IGNORE ---
  });

  // piso
  add([
    rect(width(), 60),
    pos(0, height() + 30),
    outline(4),
    area(),
    body({ isStatic: true }),
    color(127, 200, 255),
  ]);


  // aparición random de obstáculos
  function genteRandom() {
    add([
      rect(48, 64),
      area(),
      outline(4),
      pos(width(), height()),
      anchor("botleft"),
      color(255, 180, 255),
      move(LEFT, 240),
      "tree", // add a tag here
    ]);

    wait(rand(0.5, 4), () => {
      genteRandom()
    });

  };
  genteRandom();

  let score = 0;
  const scoreLabel = add([text(score), pos(24, 24)]);

  // increment score every frame
  onUpdate(() => {
    score++;
    scoreLabel.text = score;
  });

})

go("juego");

scene("lose", () => {
  add([text("Game Over"), pos(center()), anchor("center")]);
});