---
title: NextJS App Router
---

## ¿Qué es?

El App Router es el sistema de routing de Next.js introducido en la versión 13 y estabilizado en la 14. Está basado en el sistema de archivos: la estructura de carpetas dentro de `app/` define automáticamente las rutas de la aplicación.

---

## File-based routing

Cada carpeta dentro de `app/` representa un segmento de la URL. El archivo `page.tsx` dentro de esa carpeta es el componente que se renderiza:

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [slug]/
│       └── page.tsx      → /blog/:slug
└── dashboard/
    ├── page.tsx          → /dashboard
    ├── perfil/
    │   └── page.tsx      → /dashboard/perfil
    └── configuracion/
        └── page.tsx      → /dashboard/configuracion
```

---

## Archivos especiales

El App Router define varios archivos con propósitos específicos:

| Archivo         | Propósito                                                     |
| --------------- | ------------------------------------------------------------- |
| `page.tsx`      | UI única de una ruta, la hace accesible públicamente          |
| `layout.tsx`    | UI compartida entre varias rutas, persiste entre navegaciones |
| `loading.tsx`   | UI de carga mientras el contenido se está cargando            |
| `error.tsx`     | UI de error cuando algo falla en la ruta                      |
| `not-found.tsx` | UI cuando no se encuentra la ruta                             |
| `template.tsx`  | Como layout pero se re-monta en cada navegación               |
| `route.ts`      | API endpoint (no renderiza UI)                                |

---

## Layouts

Los layouts envuelven las páginas y persisten entre navegaciones. No se re-montan al cambiar de ruta:

```tsx
// app/layout.tsx — layout raíz, obligatorio
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
```

Los layouts se anidan automáticamente:

```
app/
├── layout.tsx            → layout raíz (Navbar + Footer)
└── dashboard/
    ├── layout.tsx        → layout del dashboard (Sidebar)
    └── page.tsx          → contenido del dashboard
```

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard">
            <Sidebar />
            <main>{children}</main>
        </div>
    );
}
```

---

## Rutas dinámicas

Los segmentos dinámicos se definen con corchetes `[param]`:

```
app/
└── usuarios/
    └── [id]/
        └── page.tsx      → /usuarios/:id
```

```tsx
// app/usuarios/[id]/page.tsx
export default function PerfilUsuario({ params }: { params: { id: string } }) {
    return <h1>Usuario: {params.id}</h1>;
}
```

### Segmentos catch-all

Captura múltiples segmentos de la URL:

```
app/docs/[...slug]/page.tsx  → /docs/a, /docs/a/b, /docs/a/b/c
```

```tsx
export default function Docs({ params }: { params: { slug: string[] } }) {
    return <p>Ruta: {params.slug.join("/")}</p>;
}
```

---

## Server Components vs Client Components

Por defecto, todos los componentes en el App Router son **Server Components**. Se ejecutan en el servidor y envían HTML al cliente:

```tsx
// Server Component (por defecto)
// Puede hacer fetch directamente, sin useEffect
export default async function Usuarios() {
    const usuarios = await fetch("/api/usuarios").then((r) => r.json());

    return (
        <ul>
            {usuarios.map((u) => (
                <li key={u.id}>{u.nombre}</li>
            ))}
        </ul>
    );
}
```

Para usar hooks, eventos o APIs del navegador, necesitas un **Client Component** con la directiva `'use client'`:

```tsx
"use client";

import { useState } from "react";

export default function Contador() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Cuándo usar cada uno

|                          | Server Component | Client Component      |
| ------------------------ | ---------------- | --------------------- |
| **Fetch de datos**       | ✅ Directo       | ❌ Necesita useEffect |
| **Hooks**                | ❌               | ✅                    |
| **Eventos (onClick...)** | ❌               | ✅                    |
| **Estado**               | ❌               | ✅                    |
| **APIs del navegador**   | ❌               | ✅                    |
| **SEO**                  | ✅ Mejor         | ⚠️ Peor sin SSR       |

---

## Loading UI

El archivo `loading.tsx` se muestra automáticamente mientras el Server Component carga los datos:

```tsx
// app/usuarios/loading.tsx
export default function Loading() {
    return <p>Cargando usuarios...</p>;
}
```

Funciona gracias a React Suspense de forma automática.

---

## Error handling

El archivo `error.tsx` captura errores en la ruta y sus hijos. Debe ser Client Component:

```tsx
// app/usuarios/error.tsx
"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div>
            <p>Algo salió mal: {error.message}</p>
            <button onClick={reset}>Intentar de nuevo</button>
        </div>
    );
}
```

---

## Navegación

### Link

```tsx
import Link from "next/link";

function Navbar() {
    return (
        <nav>
            <Link href="/">Inicio</Link>
            <Link href="/about">About</Link>
            <Link href="/usuarios/42">Perfil</Link>
        </nav>
    );
}
```

### Navegación programática

```tsx
"use client";

import { useRouter } from "next/navigation";

function Formulario() {
    const router = useRouter();

    async function handleSubmit() {
        await guardarDatos();
        router.push("/confirmacion");
        router.replace("/login");
        router.back();
    }
}
```

### usePathname y useSearchParams

```tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";

function Componente() {
    const pathname = usePathname(); // "/usuarios/42"
    const searchParams = useSearchParams();
    const query = searchParams.get("q"); // ?q=react
}
```

---

## Route Groups

Permiten organizar rutas sin afectar la URL usando paréntesis `(grupo)`:

```
app/
├── (marketing)/
│   ├── layout.tsx        → layout solo para marketing
│   ├── page.tsx          → /
│   └── about/
│       └── page.tsx      → /about
└── (dashboard)/
    ├── layout.tsx        → layout solo para dashboard
    └── dashboard/
        └── page.tsx      → /dashboard
```

---

## Rutas paralelas y interceptadas

### Rutas paralelas (`@slot`)

Renderizan múltiples páginas simultáneamente en el mismo layout:

```
app/
└── dashboard/
    ├── layout.tsx
    ├── @analytics/
    │   └── page.tsx
    └── @equipo/
        └── page.tsx
```

### Rutas interceptadas

Permiten mostrar una ruta dentro del contexto de otra (por ejemplo, un modal con una foto que tiene su propia URL):

```
app/
├── feed/
│   └── page.tsx
└── foto/
    ├── [id]/
    │   └── page.tsx      → /foto/42 (página completa)
    └── (..)foto/
        └── [id]/
            └── page.tsx  → /foto/42 (modal sobre el feed)
```

---

## App Router vs Pages Router

Next.js tiene dos sistemas de routing. El Pages Router es el antiguo:

|                       | App Router       | Pages Router                                    |
| --------------------- | ---------------- | ----------------------------------------------- |
| **Introducido en**    | Next.js 13       | Next.js inicial                                 |
| **Server Components** | ✅ Por defecto   | ❌                                              |
| **Layouts anidados**  | ✅               | ❌                                              |
| **Streaming**         | ✅               | Limitado                                        |
| **Data fetching**     | En el componente | `getServerSideProps`, `getStaticProps`          |
| **Estado actual**     | Recomendado      | Mantenido, no recomendado para proyectos nuevos |
