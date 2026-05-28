---
title: useId
---

## ¿Qué es?

Hook para generar **IDs únicos y estables** que son consistentes entre el servidor y el cliente. Está pensado principalmente para asociar elementos de accesibilidad como labels e inputs.

```jsx
const id = useId();
```

---

## El problema que resuelve

Cuando necesitas un `id` único en HTML para asociar un `<label>` con su `<input>`, no puedes usar un número aleatorio porque cambia en cada render y causa problemas con SSR (el servidor y el cliente generarían IDs distintos):

```jsx
// ❌ Math.random cambia en cada render y no es consistente con SSR
function Input({ label }) {
    const id = Math.random();
    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input id={id} />
        </>
    );
}
```

---

## Solución con useId

```jsx
import { useId } from "react";

function Input({ label }) {
    const id = useId();

    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input id={id} />
        </>
    );
}
```

El ID generado es estable entre renders y consistente entre servidor y cliente.

---

## Múltiples IDs en el mismo componente

Si necesitas varios IDs relacionados, genera uno base y crea variantes con un sufijo. Así evitas llamar a `useId` más veces de las necesarias:

```jsx
function FormularioPassword() {
    const id = useId();

    return (
        <div>
            <label htmlFor={`${id}-password`}>Contraseña</label>
            <input id={`${id}-password`} type="password" />

            <label htmlFor={`${id}-confirmar`}>Confirmar contraseña</label>
            <input id={`${id}-confirmar`} type="password" />
        </div>
    );
}
```

---

## Ejemplo real: campo de formulario reutilizable

```jsx
function Campo({ label, tipo = "text", ...props }) {
    const id = useId();

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input id={id} type={tipo} {...props} />
        </div>
    );
}

// Cada instancia genera su propio ID único
function App() {
    return (
        <form>
            <Campo label="Nombre" />
            <Campo label="Email" tipo="email" />
            <Campo label="Contraseña" tipo="password" />
        </form>
    );
}
```

---

## Con atributos ARIA

Muy útil para asociar elementos con descripciones de accesibilidad:

```jsx
function InputConError({ label, error }) {
    const id = useId();
    const errorId = `${id}-error`;

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                aria-describedby={error ? errorId : undefined}
                aria-invalid={!!error}
            />
            {error && <p id={errorId}>{error}</p>}
        </div>
    );
}
```

---

## Cuándo usar useId

```
✅ Asociar <label> con <input> mediante htmlFor e id
✅ Atributos ARIA que necesitan referencias entre elementos (aria-describedby, aria-labelledby)
✅ Cualquier caso donde necesites un ID único estable y compatible con SSR

❌ No usar como key en listas, para eso usa el ID de los datos
❌ No usar para generar IDs de base de datos o valores de negocio
```

> `useId` genera IDs con el formato `:r0:`, `:r1:`... No están pensados para ser legibles ni para usarse como selectores CSS.
