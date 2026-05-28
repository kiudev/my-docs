---
title: Zustand
---

## ¿Qué es?

Zustand es una librería de state management minimalista para React. Su filosofía es ser lo más simple posible: un store es una función que define el estado y las acciones para modificarlo, sin boilerplate, sin providers, sin reducers.

---

## Instalación

```bash
npm install zustand
```

---

## Crear un store

```jsx
import { create } from "zustand";

const useContadorStore = create((set) => ({
    count: 0,
    incrementar: () => set((state) => ({ count: state.count + 1 })),
    decrementar: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
}));
```

- `create` define el store y devuelve un hook
- `set` actualiza el estado, similar al setter de `useState`
- El estado y las acciones van en el mismo objeto

---

## Usar el store

Sin providers ni configuración adicional, simplemente llamas al hook:

```jsx
function Contador() {
    const count = useContadorStore((state) => state.count);
    const incrementar = useContadorStore((state) => state.incrementar);

    return (
        <div>
            <p>{count}</p>
            <button onClick={incrementar}>+</button>
        </div>
    );
}
```

Puedes usar el store en cualquier componente sin necesidad de envolverlo en un Provider.

---

## Selectores

Los selectores evitan re-renders innecesarios. El componente solo se re-renderiza cuando el trozo de estado que selecciona cambia:

```jsx
// ✅ Solo re-renderiza cuando cambia count
const count = useContadorStore((state) => state.count);

// ❌ Re-renderiza cuando cambia cualquier parte del store
const store = useContadorStore();
```

---

## Ejemplo real: carrito de compra

```jsx
import { create } from "zustand";

const useCarritoStore = create((set, get) => ({
    items: [],

    añadir: (producto) =>
        set((state) => {
            const existe = state.items.find((i) => i.id === producto.id);
            if (existe) {
                return {
                    items: state.items.map((i) =>
                        i.id === producto.id
                            ? { ...i, cantidad: i.cantidad + 1 }
                            : i,
                    ),
                };
            }
            return { items: [...state.items, { ...producto, cantidad: 1 }] };
        }),

    eliminar: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        })),

    vaciar: () => set({ items: [] }),

    // get() permite acceder al estado actual dentro de las acciones
    total: () => get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
}));

// Uso en componentes
function BotonAñadir({ producto }) {
    const añadir = useCarritoStore((state) => state.añadir);
    return <button onClick={() => añadir(producto)}>Añadir al carrito</button>;
}

function ResumenCarrito() {
    const items = useCarritoStore((state) => state.items);
    const total = useCarritoStore((state) => state.total);

    return (
        <div>
            <p>{items.length} productos</p>
            <p>Total: {total()}€</p>
        </div>
    );
}
```

---

## Estado con objetos anidados

Para actualizar objetos anidados usa spread o el middleware `immer`:

```jsx
// Con spread manual
const useStore = create((set) => ({
    usuario: { nombre: "Ana", preferencias: { tema: "claro" } },

    cambiarTema: (tema) =>
        set((state) => ({
            usuario: {
                ...state.usuario,
                preferencias: { ...state.usuario.preferencias, tema },
            },
        })),
}));

// Con immer (mutación directa, más legible)
import { immer } from "zustand/middleware/immer";

const useStore = create(
    immer((set) => ({
        usuario: { nombre: "Ana", preferencias: { tema: "claro" } },

        cambiarTema: (tema) =>
            set((state) => {
                state.usuario.preferencias.tema = tema; // mutación directa
            }),
    })),
);
```

---

## Persistencia con localStorage

El middleware `persist` guarda y restaura el estado automáticamente:

```jsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTemaStore = create(
    persist(
        (set) => ({
            tema: "claro",
            toggleTema: () =>
                set((state) => ({
                    tema: state.tema === "claro" ? "oscuro" : "claro",
                })),
        }),
        {
            name: "tema-storage", // clave en localStorage
        },
    ),
);
```

---

## DevTools

Conecta el store a Redux DevTools para inspeccionar el estado:

```jsx
import { devtools } from "zustand/middleware";

const useStore = create(
    devtools((set) => ({
        count: 0,
        incrementar: () =>
            set((state) => ({ count: state.count + 1 }), false, "incrementar"),
    })),
);
```

---

## Separar el store en slices

Para stores grandes, puedes dividir el estado en partes:

```jsx
const createUsuarioSlice = (set) => ({
    usuario: null,
    setUsuario: (usuario) => set({ usuario }),
    logout: () => set({ usuario: null }),
});

const createCarritoSlice = (set) => ({
    items: [],
    añadir: (item) => set((state) => ({ items: [...state.items, item] })),
    vaciar: () => set({ items: [] }),
});

const useStore = create((...args) => ({
    ...createUsuarioSlice(...args),
    ...createCarritoSlice(...args),
}));
```

---

## Zustand vs Context API

|                   | Context API                 | Zustand                           |
| ----------------- | --------------------------- | --------------------------------- |
| **Configuración** | Mínima                      | Mínima                            |
| **Provider**      | Necesario                   | No necesario                      |
| **Re-renders**    | Todos los consumidores      | Solo los suscritos                |
| **DevTools**      | No                          | Sí                                |
| **Persistencia**  | Manual                      | Middleware integrado              |
| **Cuándo usarlo** | Estado simple, poco cambios | Estado con muchas actualizaciones |

---

## Cuándo usar Zustand

```
✅ Estado global que cambia con frecuencia
✅ Quieres evitar re-renders innecesarios
✅ Necesitas persistencia fácil con localStorage
✅ Quieres algo simple sin boilerplate

❌ Estado local de un componente → useState
❌ Server state → TanStack Query
❌ Apps muy grandes con flujos complejos → Redux Toolkit
```
