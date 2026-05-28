---
title: React Router
---

## ¿Qué es?

React Router es la librería de routing más usada en el ecosistema React. Permite definir qué componente renderizar según la URL, gestionar navegación programática y manejar rutas dinámicas, anidadas y protegidas.

La versión actual es **React Router v6**.

---

## Instalación

```bash
npm install react-router-dom
```

---

## Configuración básica

Envuelve tu aplicación en `BrowserRouter` y define las rutas con `Routes` y `Route`:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import About from "./pages/About";
import Contacto from "./pages/Contacto";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacto" element={<Contacto />} />
            </Routes>
        </BrowserRouter>
    );
}
```

---

## Navegación con Link y NavLink

Usa `Link` en lugar de `<a>` para navegar sin recargar la página:

```jsx
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <Link to="/">Inicio</Link>
            <Link to="/about">About</Link>
            <Link to="/contacto">Contacto</Link>
        </nav>
    );
}
```

`NavLink` es igual que `Link` pero añade una clase `active` automáticamente cuando la ruta coincide:

```jsx
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <NavLink
                to="/"
                style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                })}
            >
                Inicio
            </NavLink>
            <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "activo" : "")}
            >
                About
            </NavLink>
        </nav>
    );
}
```

---

## Rutas dinámicas

Usa `:parametro` para definir segmentos dinámicos en la URL:

```jsx
<Route path="/usuarios/:id" element={<PerfilUsuario />} />
```

### useParams

Hook para leer los parámetros dinámicos de la URL:

```jsx
import { useParams } from "react-router-dom";

function PerfilUsuario() {
    const { id } = useParams();

    return <p>Perfil del usuario: {id}</p>;
}

// /usuarios/42 → id = "42"
// /usuarios/ana → id = "ana"
```

---

## Rutas anidadas

Permiten que un componente padre renderice partes de la UI comunes (navbar, sidebar) y los hijos se rendericen dentro mediante `<Outlet>`:

```jsx
// App.jsx
<Routes>
    <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="about" element={<About />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="usuarios/:id" element={<PerfilUsuario />} />
    </Route>
</Routes>
```

```jsx
// Layout.jsx
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet /> {/* Aquí se renderizan las rutas hijas */}
            </main>
            <Footer />
        </div>
    );
}
```

> `index` indica la ruta por defecto cuando el path del padre coincide exactamente.

---

## Ruta 404

Usa `path="*"` para capturar cualquier ruta que no haya coincidido:

```jsx
<Routes>
    <Route path="/" element={<Inicio />} />
    <Route path="/about" element={<About />} />
    <Route path="*" element={<PaginaNoEncontrada />} />
</Routes>
```

---

## useNavigate

Hook para navegar programáticamente:

```jsx
import { useNavigate } from "react-router-dom";

function Formulario() {
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        await guardarDatos();
        navigate("/confirmacion"); // Navegar a una ruta
        navigate(-1); // Volver atrás
        navigate("/login", { replace: true }); // Reemplazar en el historial
    }

    return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## useLocation

Hook para acceder a la información de la URL actual:

```jsx
import { useLocation } from "react-router-dom";

function Componente() {
    const location = useLocation();

    console.log(location.pathname); // "/usuarios/42"
    console.log(location.search); // "?orden=nombre"
    console.log(location.hash); // "#seccion"
    console.log(location.state); // estado pasado con navigate

    return <p>Estás en: {location.pathname}</p>;
}
```

### Pasar estado entre rutas

```jsx
// Origen
navigate("/detalle", { state: { desde: "lista" } });

// Destino
const location = useLocation();
console.log(location.state.desde); // "lista"
```

---

## Query params con useSearchParams

Hook para leer y actualizar los parámetros de búsqueda de la URL:

```jsx
import { useSearchParams } from "react-router-dom";

function Buscador() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    return (
        <input
            value={query}
            onChange={(e) => setSearchParams({ q: e.target.value })}
            placeholder="Buscar..."
        />
    );
}

// URL: /buscar?q=react
```

---

## Rutas protegidas

Patrón para restringir el acceso a rutas según autenticación:

```jsx
import { Navigate, Outlet } from "react-router-dom";

function RutaProtegida({ estaAutenticado }) {
    if (!estaAutenticado) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

// Uso en la configuración de rutas
<Routes>
    <Route path="/login" element={<Login />} />

    <Route element={<RutaProtegida estaAutenticado={usuario !== null} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracion" element={<Configuracion />} />
    </Route>
</Routes>;
```

---

## Lazy loading de rutas

Carga los componentes de cada ruta solo cuando se necesitan, reduciendo el bundle inicial:

```jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Inicio = lazy(() => import("./pages/Inicio"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<p>Cargando...</p>}>
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
```

---

## Resumen de hooks

| Hook              | Para qué sirve                                    |
| ----------------- | ------------------------------------------------- |
| `useParams`       | Leer parámetros dinámicos de la URL (`:id`)       |
| `useNavigate`     | Navegar programáticamente                         |
| `useLocation`     | Acceder a la URL actual y su estado               |
| `useSearchParams` | Leer y actualizar query params (`?q=react`)       |
| `useMatch`        | Comprobar si la URL actual coincide con un patrón |
