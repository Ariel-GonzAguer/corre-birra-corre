# 🍺 Corre Birra Corre

## 📖 Guía Completa: Cómo Crear un Juego Side-Scrolling con KaPlay

Este es un tutorial completo para crear un juego de plataformas estilo "endless runner" usando **KaPlay** (anteriormente Kaboom.js). El proyecto "Corre Birra Corre" le enseñará a implementar mecánicas de juego modernas, controles táctiles para móviles, y un sistema de escenas completo.

![Corre Birra Corre](./public/sprites/gatoRojoLab-logo.png)

---

## 🎮 Sobre el Juego

**Corre Birra Corre** es un juego de plataformas donde controlas una cerveza que debe evitar obstáculos mientras corre infinitamente. Incluye:

- ✅ Controles para teclado y dispositivos táctiles
- ✅ Sistema de vidas y puntuación
- ✅ Generación procedural de enemigos
- ✅ Responsive design para múltiples pantallas
- ✅ Múltiples escenas (menú, juego, game over)
- ✅ Detección de colisiones
- ✅ Efectos de gravedad y físicas

---

## 🛠️ Tecnologías Utilizadas

- **[KaPlay v3001.0.19](https://kaplayjs.com/)** - Motor de juegos 2D
- **TypeScript** - Lenguaje de programación tipado
- **Vite** - Herramienta de desarrollo y build
- **HTML5 Canvas** - Renderizado gráfico

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrese de tener:

- **Node.js** (versión 16 o superior)
- **pnpm** o **npm** para manejo de dependencias
- Editor de código (VS Code recomendado)
- Conocimientos básicos de JavaScript/TypeScript

---

## 🚀 Instalación y Configuración

### 1. Clonar o Crear el Proyecto

```bash
# Opción 1: Clonar este repositorio
git clone https://github.com/su-usuario/corre-birra-corre.git
cd corre-birra-corre

# Opción 2: Crear desde cero
mkdir mi-juego-kaplay
cd mi-juego-kaplay
npm init -y
```

### 2. Instalar Dependencias

```bash
# Instalar KaPlay y dependencias
pnpm install kaplay
pnpm install -D typescript vite @types/node vite-plugin-checker

# O usando npm
npm install kaplay
npm install -D typescript vite @types/node vite-plugin-checker
```

### 3. Configurar package.json

```json
{
  "name": "mi-juego-kaplay",
  "type": "module",
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "kaplay": "^3001.0.19"
  },
  "devDependencies": {
    "typescript": "^5.9.2",
    "vite": "^7.1.7"
  }
}
```

### 4. Estructura de Archivos

```
mi-juego-kaplay/
├── public/
│   └── sprites/           # Imágenes del juego
│       ├── fondo-menu.png
│       ├── fondo-juego.png
│       ├── cerveza.png
│       └── enemigo.png
├── src/
│   ├── main.ts           # Archivo principal
│   └── types/
│       └── global.d.ts   # Definiciones de tipos
├── index.html
├── vite.config.js
├── tsconfig.json
└── package.json
```

---

## 🏗️ Arquitectura del Juego

### Conceptos Fundamentales de KaPlay

#### 1. **Inicialización**
```typescript
import kaplay from "kaplay";

// Inicializar KaPlay
const k = kaplay({
  width: 1024,
  height: 768,
  canvas: document.querySelector("#game-canvas"),
});

// Hacer funciones disponibles globalmente
Object.assign(globalThis, k);
```

#### 2. **Sistema de Componentes**
En KaPlay, los objetos del juego se crean combinando componentes:

```typescript
const player = add([
  sprite("player"),        // Sprite visual
  pos(100, 300),          // Posición
  area(),                 // Área de colisión
  body(),                 // Físicas/gravedad
  anchor("center"),       // Punto de anclaje
  scale(1),               // Escala
  "player"                // Tag para identificación
]);
```

#### 3. **Carga de Assets**
```typescript
// Cargar sprites
loadSprite("player", "./sprites/player.png");
loadSprite("background", "./sprites/background.png");
loadSprite("enemy", "./sprites/enemy.png");
```

---

## 🎯 Implementación Paso a Paso

### Paso 1: Configuración Inicial

#### `vite.config.js`
```javascript
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    }),
  ],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### Paso 2: Definir Tipos de KaPlay

#### `src/types/global.d.ts`
```typescript
// Definir tipos para funciones de KaPlay
declare function kaplay(options?: any): any;
declare function add(components: any[]): any;
declare function scene(name: string, callback: () => void): void;
declare function go(sceneName: string): void;
declare function loadSprite(name: string, src: string): void;
declare function sprite(name: string): any;
declare function pos(x: number, y: number): any;
declare function area(options?: any): any;
declare function body(): any;
declare function anchor(point: string): any;
declare function scale(factor: number): any;
declare function text(content: string, options?: any): any;
declare function rect(width: number, height: number): any;
declare function color(r: number, g: number, b: number): any;
declare function opacity(value: number): any;
declare function onKeyPress(key: string, callback: () => void): void;
declare function onMousePress(callback: () => void): void;
declare function onMouseRelease(callback: () => void): void;
declare function onUpdate(callback: () => void): void;
declare function mousePos(): { x: number; y: number };
declare function width(): number;
declare function height(): number;
declare function setGravity(force: number): void;
declare function health(points: number): any;
declare function move(direction: any, speed: number): any;

// Constantes de dirección
declare const LEFT: any;
declare const RIGHT: any;
```

### Paso 3: Estructura Base del Juego

#### `src/main.ts` - Configuración inicial
```typescript
import kaplay from "kaplay";

// Inicializar KaPlay
const k = kaplay({
  width: 1024,
  height: 768,
  canvas: document.querySelector("#game-canvas"),
  crisp: true
});

// Hacer funciones disponibles globalmente
Object.assign(globalThis, k);

// Cargar todos los sprites
loadSprite("fondo-menu", "./sprites/fondo-menu.png");
loadSprite("fondo-juego", "./sprites/fondo-juego.png");
loadSprite("cerveza", "./sprites/beer-sprite.png");
loadSprite("borracho", "./sprites/borracho.png");
loadSprite("gato-logo", "./sprites/gatoRojoLab-logo.png");
```

### Paso 4: Implementar Fondos Responsivos

```typescript
// Función para crear fondos responsivos
async function createResponsiveBackground(spriteName: string) {
  try {
    const sprite = await getSprite(spriteName);
    const scaleX = width() / sprite.width;
    const scaleY = height() / sprite.height;
    const finalScale = Math.max(scaleX, scaleY);

    add([
      sprite(spriteName),
      pos(width() / 2, height() / 2),
      scale(finalScale),
      anchor("center"),
      z(0)
    ]);
  } catch (error) {
    console.error(`Error loading sprite ${spriteName}:`, error);
  }
}
```

### Paso 5: Sistema de Escenas

#### Escena del Menú
```typescript
scene("menu", async () => {
  // Crear fondo responsivo
  await createResponsiveBackground("fondo-menu");

  // Logo del juego
  add([
    sprite("gato-logo"),
    pos(width() / 2, height() * 0.3),
    scale(0.5),
    anchor("center"),
    z(1)
  ]);

  // Título
  add([
    text("CORRE BIRRA CORRE", { size: 48 }),
    pos(width() / 2, height() * 0.6),
    anchor("center"),
    color(255, 255, 255),
    z(1)
  ]);

  // Instrucciones
  add([
    text("Presiona ENTER para jugar", { size: 24 }),
    pos(width() / 2, height() * 0.8),
    anchor("center"),
    color(255, 255, 255),
    z(1)
  ]);

  // Control para comenzar el juego
  onKeyPress("enter", () => go("juego"));
});
```

#### Escena Principal del Juego
```typescript
scene("juego", async () => {
  // Configurar gravedad
  setGravity(1900);

  // Crear fondo responsivo
  await createResponsiveBackground("fondo-juego");

  // Sistema de puntuación
  let score = 0;
  add([rect(80, 40), pos(16, 16), color(0, 0, 0), opacity(0.5), z(5)]);
  const scoreLabel = add([
    text(score, { size: 32 }),
    pos(24, 24),
    color(255, 255, 255),
    z(6)
  ]);

  // Crear personaje principal
  const player = add([
    sprite("cerveza"),
    pos(0, height() - 60),
    area({ scale: 0.8 }),
    body(),
    health(3),
    anchor("botleft"),
    z(2),
    "player"
  ]);

  // Sistema de controles
  setupControls(player);
  
  // Sistema de enemigos
  setupEnemySpawning(player, scoreLabel);
});
```

### Paso 6: Sistema de Controles

#### Controles de Teclado
```typescript
function setupKeyboardControls(player: any) {
  let jumpCount = 0;
  const maxJumps = 1;

  // Movimiento horizontal
  player.onKeyPress("right", () => {
    player.pos.x += 30;
  });

  player.onKeyPress("left", () => {
    player.pos.x -= 30;
  });

  // Sistema de salto
  onKeyPress("space", () => {
    if (jumpCount < maxJumps) {
      player.jump(900);
      jumpCount++;
    }
  });

  // Resetear saltos al tocar el suelo
  const groundY = height() - 60;
  onUpdate(() => {
    if (player.pos && player.pos.y >= groundY - 1) {
      jumpCount = 0;
    }
  });
}
```

#### Controles Táctiles para Móviles
```typescript
function setupTouchControls(player: any, jumpCount: number, maxJumps: number) {
  // Detectar dispositivos móviles
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in window;
  
  if (!isMobile) return;

  // Crear botones táctiles
  const jumpButton = add([
    rect(120, 120),
    pos(width() * 0.75, height() * 0.5),
    area(),
    color(255, 255, 255),
    opacity(0.8),
    anchor("center"),
    z(10),
    "jumpButton"
  ]);

  const leftButton = add([
    rect(100, 100),
    pos(width() * 0.15, height() * 0.5),
    area(),
    color(255, 255, 255),
    opacity(0.8),
    anchor("center"),
    z(10),
    "leftButton"
  ]);

  const rightButton = add([
    rect(100, 100),
    pos(width() * 0.35, height() * 0.5),
    area(),
    color(255, 255, 255),
    opacity(0.8),
    anchor("center"),
    z(10),
    "rightButton"
  ]);

  // Agregar iconos a los botones
  add([
    text("↑", { size: 64 }),
    pos(width() * 0.75, height() * 0.5),
    anchor("center"),
    z(11)
  ]);

  // Eventos de toque
  onMousePress(() => {
    if (jumpButton.isHovering() && jumpCount < maxJumps) {
      player.jump(900);
      jumpCount++;
    }
    if (leftButton.isHovering()) {
      player.pos.x -= 30;
    }
    if (rightButton.isHovering()) {
      player.pos.x += 30;
    }
  });
}
```

### Paso 7: Sistema de Enemigos

```typescript
function setupEnemySpawning(player: any, scoreLabel: any) {
  let score = 0;
  
  function spawnEnemy() {
    const speed = 350;
    const enemyTypes = [
      {
        sprite: "borracho",
        scale: 0.8,
        points: 10
      }
    ];

    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    const enemy = add([
      sprite(enemyType.sprite),
      pos(width(), height() - 60),
      area({ scale: enemyType.scale }),
      anchor("botleft"),
      move(LEFT, speed),
      z(2),
      "enemy",
      { points: enemyType.points }
    ]);

    // Eliminar enemigo cuando sale de pantalla
    enemy.onUpdate(() => {
      if (enemy.pos.x < -100) {
        destroy(enemy);
        score += enemyType.points;
        scoreLabel.text = score;
      }
    });

    // Colisión con el jugador
    enemy.onCollide("player", () => {
      player.hurt(1);
      destroy(enemy);
      
      if (player.hp() <= 0) {
        go("perdido");
      }
    });
  }

  // Generar enemigos cada 2 segundos
  const spawnTimer = loop(2, spawnEnemy);
}
```

### Paso 8: Escena de Game Over

```typescript
scene("perdido", async () => {
  await createResponsiveBackground("fondo-juego");

  add([
    rect(400, 200),
    pos(width() / 2, height() / 2),
    color(0, 0, 0),
    opacity(0.8),
    anchor("center"),
    z(5)
  ]);

  add([
    text("¡PERDISTE!", { size: 48 }),
    pos(width() / 2, height() / 2 - 30),
    anchor("center"),
    color(255, 0, 0),
    z(6)
  ]);

  add([
    text("Presiona R para reiniciar", { size: 24 }),
    pos(width() / 2, height() / 2 + 30),
    anchor("center"),
    color(255, 255, 255),
    z(6)
  ]);

  onKeyPress("r", () => go("juego"));
});
```

---

## 🎨 Optimización y Mejores Prácticas

### 1. **Gestión de Memoria**
```typescript
// Limpiar objetos cuando salen de pantalla
enemy.onUpdate(() => {
  if (enemy.pos.x < -100) {
    destroy(enemy); // Importante: destruir objetos no utilizados
  }
});
```

### 2. **Performance en Móviles**
```typescript
// Usar requestAnimationFrame para animaciones suaves
const k = kaplay({
  maxFPS: 60,        // Limitar FPS
  crisp: true,       // Pixeles nítidos
  canvas: canvas,    // Canvas existente
  touchToMouse: true // Convertir touch en eventos de mouse
});
```

### 3. **Responsive Design**
```typescript
// Usar porcentajes en lugar de valores fijos
pos(width() * 0.5, height() * 0.3)  // Centro horizontal, 30% vertical

// Escalar sprites proporcionalmente
const finalScale = Math.max(scaleX, scaleY);
```

### 4. **Debugging**
```typescript
// Modo debug para ver colisiones
const k = kaplay({
  debug: true  // Mostrar áreas de colisión
});

// Log de información útil
console.log("Player position:", player.pos);
console.log("Current scene:", getScene());
```

---

## 📱 Soporte Multi-plataforma

### Desktop
- Controles: Teclado (Flechas, Espacio, Enter)
- Resolución: Escalable automáticamente
- Performance: Óptima

### Móvil
- Controles: Botones táctiles virtuales
- Detección: User-Agent + touch events
- UI: Botones más grandes y posicionados ergonómicamente

### Web
- Deployment: Build estático con Vite
- Compatibilidad: Todos los navegadores modernos
- Carga: Assets optimizados

---

## 🚀 Deployment

### Build para Producción
```bash
pnpm run build
# Genera carpeta 'dist' con archivos estáticos
```

### Deploy en GitHub Pages
```bash
# En vite.config.js, configurar base URL
export default defineConfig({
  base: '/nombre-repositorio/',
  // ... resto de configuración
});
```

### Deploy en Netlify/Vercel
```bash
# Comando de build
npm run build

# Directorio de salida
dist
```

---

## 🔧 Extensiones y Funcionalidades Adicionales

### Power-ups
```typescript
function createPowerUp(type: string, x: number, y: number) {
  const powerUp = add([
    sprite(type),
    pos(x, y),
    area(),
    "powerup",
    { type }
  ]);

  powerUp.onCollide("player", (player) => {
    switch(type) {
      case "speed":
        player.speed *= 1.5;
        break;
      case "health":
        player.heal(1);
        break;
    }
    destroy(powerUp);
  });
}
```

### Sistema de Niveles
```typescript
let currentLevel = 1;
let enemySpeed = 300;

function levelUp() {
  currentLevel++;
  enemySpeed += 50;
  
  add([
    text(`NIVEL ${currentLevel}`, { size: 36 }),
    pos(width() / 2, 50),
    anchor("center"),
    lifespan(3), // Desaparece en 3 segundos
    z(10)
  ]);
}
```

### Efectos de Sonido
```typescript
// Cargar sonidos
loadSound("jump", "./sounds/jump.wav");
loadSound("hurt", "./sounds/hurt.wav");

// Reproducir sonidos
onKeyPress("space", () => {
  play("jump", { volume: 0.5 });
  player.jump(900);
});
```

---

## 📚 Recursos Adicionales

### Documentación Oficial
- **[KaPlay Documentation](https://kaplayjs.com/guides/)**
- **[KaPlay Examples](https://kaplayjs.com/examples/)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**

### Herramientas Útiles
- **[Sprite Editor](https://www.piskelapp.com/)** - Editor de sprites online
- **[Tiled](https://www.mapeditor.org/)** - Editor de mapas
- **[Audacity](https://www.audacityteam.org/)** - Editor de audio

### Inspiración
- **[itch.io](https://itch.io/)** - Juegos indie para inspirarse
- **[OpenGameArt](https://opengameart.org/)** - Assets gratuitos

---

## 🤝 Contribuir al Proyecto

### Setup de Desarrollo
```bash
git clone https://github.com/su-usuario/corre-birra-corre.git
cd corre-birra-corre
pnpm install
pnpm run dev
```

### Estructura de Commits
```
feat: agregar nuevos controles táctiles
fix: corregir colisión de enemigos
docs: actualizar README
style: mejorar formato del código
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Puede usar, modificar y distribuir libremente.

---

## 🎯 Conclusión

Ha aprendido a crear un juego completo con KaPlay que incluye:

✅ **Sistema de escenas** (menú, juego, game over)  
✅ **Controles multi-plataforma** (teclado + táctil)  
✅ **Físicas realistas** (gravedad, colisiones)  
✅ **UI responsiva** (adaptable a cualquier pantalla)  
✅ **Generación procedural** (enemigos automáticos)  
✅ **Gestión de estado** (vidas, puntuación)  
✅ **Optimización** (performance y memoria)  

### Próximos Pasos
1. **Agregar más tipos de enemigos**
2. **Implementar sistema de power-ups**  
3. **Crear multiple levels**
4. **Añadir efectos de sonido y música**
5. **Implementar tabla de puntuaciones**

### ¿Preguntas?
Si tiene dudas sobre la implementación o desea contribuir al proyecto, no dude en abrir un issue en el repositorio.

**¡Feliz desarrollo! 🎮**

---

*Creado con ❤️ usando [KaPlay](https://kaplayjs.com/) y TypeScript*