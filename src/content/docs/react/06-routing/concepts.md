---
title: Conceptos base de enrutado en React
---

## ¿Qué es el routing?

El routing es el mecanismo que decide **qué contenido mostrar según la URL**. En una aplicación web, cada URL corresponde a una vista o página diferente.

---

## Client-side routing vs Server-side routing

### Server-side routing (tradicional)

En el modelo tradicional, cada vez que el usuario navega a una URL el navegador hace una petición al servidor, que devuelve un HTML nuevo. La página se recarga completamente:

```
Usuario hace click en /about
        ↓
Navegador hace petición al servidor
        ↓
Servidor devuelve HTML nuevo
        ↓
Página se recarga completamente
```

**Ventajas:**

- SEO sencillo, cada página tiene su propio HTML
- El navegador gestiona historial y navegación de forma nativa

**Desventajas:**

- Recarga completa en cada navegación, experiencia menos fluida
- El servidor tiene que procesar cada petición de página

---

### Client-side routing (SPA)

En una Single Page Application (SPA), el navegador carga el HTML una sola vez. JavaScript intercepta la navegación y actualiza el contenido sin recargar la página:

```
Usuario hace click en /about
        ↓
JavaScript intercepta la navegación
        ↓
Se actualiza la URL con history.pushState
        ↓
React renderiza el componente correspondiente
        ↓
Sin recarga de página
```

**Ventajas:**

- Navegación instantánea, sin recargas
- Experiencia más fluida, similar a una app nativa
- El estado de la app se mantiene entre navegaciones

**Desventajas:**

- SEO más complejo (aunque SSR lo soluciona)
- El bundle inicial puede ser más grande
- Requiere configuración extra en el servidor para que todas las rutas devuelvan el mismo HTML

---

## La History API

El client-side routing se apoya en la **History API** del navegador, que permite manipular la URL sin recargar la página:

```javascript
// Navegar a una nueva URL sin recargar
history.pushState({}, "", "/about");

// Reemplazar la URL actual
history.replaceState({}, "", "/about");

// Escuchar cambios de URL (botón atrás/adelante)
window.addEventListener("popstate", handler);
```

Las librerías de routing como React Router abstraen esta API para que no tengas que usarla directamente.

---

## Tipos de routing en React

### Hash routing

Usa el fragmento `#` de la URL para gestionar las rutas. No requiere configuración del servidor:

```
https://miapp.com/#/about
https://miapp.com/#/usuarios/1
```

Ya no se recomienda. Era útil cuando los servidores no podían configurarse para SPAs.

### Browser routing

Usa URLs limpias con la History API. Requiere que el servidor devuelva siempre el mismo `index.html` para cualquier ruta:

```
https://miapp.com/about
https://miapp.com/usuarios/1
```

Es el estándar actual.

### Memory routing

Gestiona el historial en memoria, sin modificar la URL del navegador. Útil para tests y entornos sin navegador (React Native, Node.js):

```
// La URL no cambia pero React Router gestiona la navegación internamente
```

---

## Opciones de routing en React

React no incluye routing de forma nativa. Las opciones más usadas son:

| Librería               | Descripción                             | Cuándo usarla             |
| ---------------------- | --------------------------------------- | ------------------------- |
| **React Router**       | La más usada históricamente, flexible   | SPAs, proyectos generales |
| **TanStack Router**    | Moderna, tipado completo con TypeScript | Proyectos con TypeScript  |
| **Next.js App Router** | File-based, integrado con SSR           | Apps fullstack, SEO       |
| **Wouter**             | Minimalista, muy ligera                 | Proyectos pequeños        |
