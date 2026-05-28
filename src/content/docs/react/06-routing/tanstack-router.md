---
title: TanStack Router
---

## ¿Qué es?

TanStack Router es una librería de routing moderna para React con **tipado completo de TypeScript**. A diferencia de React Router, el sistema de tipos cubre URLs, parámetros, query params y el estado de las rutas, detectando errores en tiempo de compilación.

---

## Instalación

```bash
npm install @tanstack/react-router
```

Para generación automática de rutas (recomendado):

```bash
npm install --save-dev @tanstack/router-plugin
```

---

## Dos formas de definir rutas

### 1. Code-based (manual)

Defines las rutas directamente en el código:

```tsx
import {
    createRouter,
    createRoute,
    createRootRoute,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Inicio,
});

const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/about",
    component: About,
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

const router = createRouter({ routeTree });
```

### 2. File-based (recomendado)

Las rutas se generan automáticamente según la estructura de archivos, similar a Next.js:

```
src/routes/
├── __root.tsx        → layout raíz
├── index.tsx         → /
├── about.tsx         → /about
└── usuarios/
    ├── index.tsx     → /usuarios
    └── $id.tsx       → /usuarios/:id
```

---

## Configuración básica

```tsx
// main.tsx
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

function App() {
    return <RouterProvider router={router} />;
}
```

---

## Rutas tipadas: la gran diferencia

TanStack Router infiere los tipos de todos los parámetros automáticamente:

```tsx
// Con React Router — sin tipos, id es string | undefined
const { id } = useParams();

// Con TanStack Router — id tiene el tipo correcto inferido
const { id } = usuariosIdRoute.useParams();
// TypeScript sabe exactamente qué parámetros existen en esta ruta
```

---

## Rutas dinámicas

Los parámetros dinámicos se definen con `$` en el nombre del archivo o en el path:

```tsx
// src/routes/usuarios/$id.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/usuarios/$id")({
    component: PerfilUsuario,
});

function PerfilUsuario() {
    const { id } = Route.useParams(); // id tipado como string
    return <p>Usuario: {id}</p>;
}
```

---

## Query params tipados

TanStack Router valida y tipa los query params mediante un schema:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const busquedaSchema = z.object({
    q: z.string().default(""),
    pagina: z.number().default(1),
    orden: z.enum(["nombre", "fecha"]).default("nombre"),
});

export const Route = createFileRoute("/buscar")({
    validateSearch: busquedaSchema,
    component: Buscador,
});

function Buscador() {
    const { q, pagina, orden } = Route.useSearch();
    // Todos los valores están tipados y validados

    return <input value={q} />;
}
```

---

## Navegación tipada

Los links comprueban en tiempo de compilación que la ruta y los parámetros existen:

```tsx
import { Link } from "@tanstack/react-router";

function Navbar() {
    return (
        <nav>
            <Link to="/">Inicio</Link>
            <Link to="/usuarios/$id" params={{ id: "42" }}>
                Perfil
            </Link>
            {/* Error de TypeScript si la ruta no existe o faltan params */}
        </nav>
    );
}
```

---

## Loaders: carga de datos por ruta

Cada ruta puede definir un `loader` que carga los datos necesarios antes de renderizar:

```tsx
export const Route = createFileRoute("/usuarios/$id")({
    loader: async ({ params }) => {
        const usuario = await fetch(`/api/usuarios/${params.id}`).then((r) =>
            r.json(),
        );
        return { usuario };
    },
    component: PerfilUsuario,
});

function PerfilUsuario() {
    const { usuario } = Route.useLoaderData();
    return <h1>{usuario.nombre}</h1>;
}
```

---

## Rutas anidadas con layouts

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: () => (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    ),
});
```

---

## Navegación programática

```tsx
import { useNavigate } from "@tanstack/react-router";

function Formulario() {
    const navigate = useNavigate();

    async function handleSubmit() {
        await guardarDatos();
        navigate({ to: "/confirmacion" });
        navigate({ to: "/usuarios/$id", params: { id: "42" } }); // tipado
    }
}
```

---

## TanStack Router vs React Router

|                        | React Router v6     | TanStack Router                 |
| ---------------------- | ------------------- | ------------------------------- |
| **TypeScript**         | Parcial             | Completo, inferido              |
| **Query params**       | Manual              | Validados con schema            |
| **Loaders**            | No nativo           | Integrado                       |
| **File-based routing** | No                  | Sí (con plugin)                 |
| **Madurez**            | Muy alta            | Alta, en crecimiento            |
| **Tamaño bundle**      | Pequeño             | Similar                         |
| **Cuándo usarlo**      | Proyectos generales | Proyectos TypeScript intensivos |

---

## Cuándo elegir TanStack Router

```
✅ Proyecto con TypeScript donde el tipado de rutas aporta valor
✅ Necesitas validación de query params con schema
✅ Quieres loaders de datos integrados en las rutas
✅ Equipo que valora la seguridad de tipos en la navegación

❌ Proyectos sin TypeScript
❌ Si el equipo ya conoce bien React Router y no hay necesidad de migrar
❌ Proyectos muy pequeños donde la configuración extra no compensa
```
