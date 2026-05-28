---
title: useContext
---

## ¿Qué es?

Hook para consumir un contexto. El contexto permite pasar datos a través del árbol de componentes sin tener que pasar props manualmente en cada nivel. Resuelve el problema del **prop drilling**.

---

## El problema: Prop Drilling

Pasar datos por varios niveles de componentes intermedios que no los necesitan:

```jsx
// ❌ usuario se pasa por App → Layout → Header → Avatar solo para llegar a Avatar
function App() {
    const usuario = { nombre: "Ana" };
    return <Layout usuario={usuario} />;
}

function Layout({ usuario }) {
    return <Header usuario={usuario} />;
}

function Header({ usuario }) {
    return <Avatar usuario={usuario} />;
}

function Avatar({ usuario }) {
    return <img src={usuario.foto} />;
}
```

---

## Solución con Context

### 1. Crear el contexto

```jsx
import { createContext } from "react";

const UsuarioContext = createContext(null);
```

### 2. Proveer el contexto

El `Provider` envuelve los componentes que necesitan acceso al valor:

```jsx
function App() {
    const usuario = { nombre: "Ana", foto: "foto.jpg" };

    return (
        <UsuarioContext.Provider value={usuario}>
            <Layout />
        </UsuarioContext.Provider>
    );
}
```

> **React 19+:** ya no es necesario usar `.Provider`. Puedes usar el contexto directamente como componente:
>
> ```jsx
> // React 18 y anteriores
> <UsuarioContext.Provider value={usuario}>
>
> // React 19+
> <UsuarioContext value={usuario}>
> ```
>
> `.Provider` sigue siendo válido y no está eliminado, es simplemente la sintaxis antigua.

### 3. Consumir el contexto con useContext

Cualquier componente dentro del Provider puede acceder al valor directamente:

```jsx
import { useContext } from "react";

function Avatar() {
    const usuario = useContext(UsuarioContext);
    return <img src={usuario.foto} alt={usuario.nombre} />;
}
```

> Los componentes intermedios (Layout, Header) ya no necesitan saber nada del usuario.

---

## Patrón recomendado: módulo propio

Lo más habitual es encapsular el contexto en su propio archivo con un custom hook para consumirlo:

```jsx
// context/UsuarioContext.jsx
import { createContext, useContext, useState } from "react";

const UsuarioContext = createContext(null);

export function UsuarioProvider({ children }) {
    const [usuario, setUsuario] = useState({ nombre: "Ana" });

    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </UsuarioContext.Provider>
    );
}

export function useUsuario() {
    const context = useContext(UsuarioContext);

    if (!context) {
        throw new Error("useUsuario debe usarse dentro de UsuarioProvider");
    }

    return context;
}
```

```jsx
// App.jsx
import { UsuarioProvider } from "./context/UsuarioContext";

function App() {
    return (
        <UsuarioProvider>
            <Layout />
        </UsuarioProvider>
    );
}
```

```jsx
// Avatar.jsx
import { useUsuario } from "../context/UsuarioContext";

function Avatar() {
    const { usuario } = useUsuario();
    return <img src={usuario.foto} alt={usuario.nombre} />;
}
```

---

## Ejemplo real: tema claro/oscuro

```jsx
// context/TemaContext.jsx
import { createContext, useContext, useState } from "react";

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
    const [tema, setTema] = useState("claro");

    function toggleTema() {
        setTema((prev) => (prev === "claro" ? "oscuro" : "claro"));
    }

    return (
        <TemaContext.Provider value={{ tema, toggleTema }}>
            {children}
        </TemaContext.Provider>
    );
}

export function useTema() {
    return useContext(TemaContext);
}
```

```jsx
// Componente que lo consume
function BotonTema() {
    const { tema, toggleTema } = useTema();

    return <button onClick={toggleTema}>Modo actual: {tema}</button>;
}
```

---

## Valor por defecto del contexto

El valor que pasas a `createContext` se usa cuando el componente no está dentro de ningún Provider:

```jsx
const TemaContext = createContext("claro"); // Valor por defecto
```

En la práctica se suele poner `null` y lanzar un error en el custom hook si no hay Provider, para detectar usos incorrectos antes.

---

## Re-renders

Cuando el valor del Provider cambia, **todos los componentes que consumen ese contexto se re-renderizan**. Para optimizarlo:

```jsx
// ❌ Objeto nuevo en cada render → todos los consumidores re-renderizan siempre
<MiContext.Provider value={{ usuario, setUsuario }}>

// ✅ Memorizar el valor para evitar re-renders innecesarios
const value = useMemo(() => ({ usuario, setUsuario }), [usuario]);
<MiContext.Provider value={value}>
```

---

## Cuándo usar Context

```
✅ Datos globales: usuario autenticado, tema, idioma
✅ Evitar prop drilling profundo (3+ niveles)
✅ Estado compartido entre componentes no relacionados

❌ No usar para todo el estado de la app (para eso hay librerías como Redux o Zustand)
❌ No usar si los datos solo los necesita un componente o su hijo directo
```

---

## Context vs Props

|                   | Props                  | Context                        |
| ----------------- | ---------------------- | ------------------------------ |
| **Alcance**       | Padre a hijo directo   | Cualquier descendiente         |
| **Prop drilling** | Sí                     | No                             |
| **Re-renders**    | Solo el árbol afectado | Todos los consumidores         |
| **Cuándo usarlo** | Datos locales          | Datos globales o semi-globales |
