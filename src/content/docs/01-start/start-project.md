---
title: Empezar proyecto con React
---

## Requisitos previos

Necesitas tener instalado **Node.js** (incluye npm). Puedes verificarlo con:

```bash
node -v
npm -v
```

Si no lo tienes, descárgalo desde [nodejs.org](https://nodejs.org).

---

## Opciones para crear un proyecto

### 1. Vite (recomendado)

Es la opción más moderna y rápida. Arranque casi instantáneo y configuración mínima:

```bash
npm create vite@latest mi-app -- --template react
cd mi-app
npm install
npm run dev
```

Para usar TypeScript:

```bash
npm create vite@latest mi-app -- --template react-ts
```

### 2. Create React App (CRA)

La opción clásica, hoy en día en desuso. Más lenta y menos mantenida que Vite:

```bash
npx create-react-app mi-app
cd mi-app
npm start
```

> CRA ya no se recomienda para proyectos nuevos. Usa Vite o Next.js en su lugar.

### 3. Next.js

Si necesitas SSR (Server Side Rendering), SSG (Static Site Generation), o una aplicación fullstack:

```bash
npx create-next-app@latest mi-app
cd mi-app
npm run dev
```

---

## ¿Cuál elegir?

|                   | Vite                      | CRA       | Next.js                 |
| ----------------- | ------------------------- | --------- | ----------------------- |
| **Velocidad**     | Muy rápido                | Lento     | Rápido                  |
| **Mantenimiento** | Activo                    | En desuso | Activo                  |
| **SSR / SSG**     | No                        | No        | Sí                      |
| **Fullstack**     | No                        | No        | Sí                      |
| **Configuración** | Mínima                    | Mínima    | Media                   |
| **Cuándo usarlo** | SPAs, proyectos generales | Legacy    | Apps con SEO, fullstack |

> Para la mayoría de proyectos nuevos: **Vite**. Para apps con SEO o fullstack: **Next.js**.

---

## Estructura de un proyecto Vite + React

```
mi-app/
├── public/              # Archivos estáticos (favicon, imágenes públicas)
├── src/
│   ├── assets/          # Imágenes, fuentes, iconos
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Vistas o páginas
│   ├── hooks/           # Custom hooks
│   ├── App.jsx          # Componente raíz
│   └── main.jsx         # Punto de entrada, monta la app en el DOM
├── index.html           # HTML base
├── package.json         # Dependencias y scripts
└── vite.config.js       # Configuración de Vite
```

---

## Archivos clave

### `main.jsx`

Punto de entrada de la app. Monta el componente raíz en el DOM:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
```

### `App.jsx`

Componente raíz desde el que cuelga toda la aplicación:

```jsx
function App() {
    return (
        <div>
            <h1>Mi aplicación React</h1>
        </div>
    );
}

export default App;
```

### `index.html`

El HTML base. Vite inyecta la app dentro del div con id `root`:

```html
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
```

---

## Scripts disponibles

Con Vite los comandos principales son:

```bash
npm run dev      # Arranca el servidor de desarrollo en localhost:5173
npm run build    # Genera la build de producción en /dist
npm run preview  # Previsualiza la build de producción localmente
```

---

## Extensiones recomendadas para VS Code

- **ES7+ React/Redux/React-Native snippets** → snippets para crear componentes rápido
- **Prettier** → formateo automático del código
- **ESLint** → detección de errores y buenas prácticas
- **Auto Rename Tag** → renombra etiquetas de apertura y cierre a la vez

---

## React Developer Tools

Extensión de navegador imprescindible para depurar apps React. Disponible para Chrome y Firefox:

- Inspecciona el árbol de componentes
- Muestra props y state de cada componente en tiempo real
- Mide renders y rendimiento

[Descargar para Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
