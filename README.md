# 🍺 Corre Birra Corre

Un juego de plataformas estilo _endless runner_ donde se controla una cerveza que debe evitar borrachos mientras se encuentra gatos, y recolecta malta y lúpulo.

![Corre Birra Corre](./public/sprites/gatoRojoLab-logo.png)

🎮 **[¡Jugar ahora!](https://corre-birra-corre.vercel.app)**

---

### 🕹️ Características Principales

- 🎮 **Controles intuitivos**: Funciona con teclado, mouse y controles táctiles
- ❤️ **Sistema de vidas**: Tres vidas para completar tu misión
- 🏆 **Puntajes globales**: Compite con jugadores de todo el mundo
- 📱 **Responsive**: Optimizado para pantallas grandes y medianas, con soporte para dispositivos móviles **en posición vertical**

### 🎲 Elementos del Juego

- **🍺 Personaje principal**: Una refrescante Pale Ale
- **🌾 Cebada**: Otorga una vida extra
- **🌿 Lúpulo**: Protege contra el siguiente borracho
- **🍷 Borrachos**: Quitan una vida en cada colisión
- **🦠 Bacterias**: Lo peor. Destruyen a la birra (no es Gosé).
- **🐱 Gatos rojos**: Aliados provenientes de Gato Rojo Lab, Michigan.

---

## 🛠️ Tecnologías

- **[KaPlay](https://kaplayjs.com/)** - Motor de juegos 2D
- **TypeScript** - Desarrollo tipado
- **Vite** - Build tool ultrarrápido
- **Firebase Firestore** - Base de datos en tiempo real
- **Vercel** - Hosting y analytics

---

## 🚀 Desarrollo Local

Si quiere ejecutar el juego localmente:

```bash
# Clonar el repositorio
git clone https://github.com/Ariel-GonzAguer/corre-birra-corre.git
cd corre-birra-corre

# Instalar dependencias
pnpm install
# o npm install

# Ejecutar servidor de desarrollo
pnpm dev
# o npm run dev
```

El juego estará disponible en `http://localhost:3001`

### 📁 Estructura del Proyecto

```
corre-birra-corre/
├── public/
│   └── sprites/              # Imágenes del juego
├── src/
│   ├── main.ts              # Archivo principal del juego
│   ├── utils/               # Módulos utilitarios
│   ├── firebase/            # Configuración de Firebase
│   └── servicios/           # Cliente API
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎮 Controles

### Teclado

- **Espacio**: Saltar
- **Flecha Izquierda/Derecha**: Moverse a la izquierda/derecha
- **P**: Modo debug (desarrollo)

### Móvil/Tablet

- **Flecha ↑**: Saltar
- **Flecha ←/→**: Moverse a la izquierda/derecha

---

## 🏆 Sistema de Puntuación

- **Gato rojo**: +100 puntos

>Solo se pueden registrar 5 puntajes al día por persona (identificado por ID de cliente).

---

## 📱 Compatibilidad

- ✅ **Navegadores modernos**: Chrome, Firefox, Safari, Edge
- ✅ **Dispositivos móviles**: iOS y Android
- ✅ **Tablets**: iPadOS y tablets Android
- ✅ **Responsive**: Se debe usar en posición vertical en dispositivos móviles

---

## 🔧 Configuración Firebase

Para usar el sistema de puntuaciones globales, necesitas configurar Firebase:

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Firestore Database
3. Configurar las reglas de seguridad
4. Copiar la configuración en `src/firebase/firebaseConfig.ts`

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
