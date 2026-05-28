---
title: Jotai
---

## ¿Qué es?

Jotai es una librería de state management basada en **átomos**: unidades mínimas de estado que los componentes pueden suscribirse de forma independiente. Su enfoque es bottom-up (de abajo hacia arriba), en contraste con Redux que tiene un único store centralizado.

El nombre viene del japonés 状態 (_jōtai_), que significa "estado".

---

## Instalación

```bash
npm install jotai
```

---

## Átomos

Un átomo es la unidad mínima de estado. Se define fuera de los componentes:

```jsx
import { atom } from "jotai";

const countAtom = atom(0);
const nombreAtom = atom("Ana");
const temaAtom = atom("claro");
```

---

## Usar átomos en componentes

`useAtom` funciona igual que `useState` pero el estado es global y compartido:

```jsx
import { useAtom } from "jotai";

function Contador() {
    const [count, setCount] = useAtom(countAtom);

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
            <button onClick={() => setCount((c) => c - 1)}>-</button>
        </div>
    );
}

// Cualquier otro componente puede usar el mismo átomo
function MostrarContador() {
    const [count] = useAtom(countAtom);
    return <p>Valor actual: {count}</p>;
}
```

Si solo necesitas leer o solo escribir, hay hooks específicos:

```jsx
import { useAtomValue, useSetAtom } from "jotai";

// Solo lectura — no re-renderiza al escribir
const count = useAtomValue(countAtom);

// Solo escritura — no suscribe al valor
const setCount = useSetAtom(countAtom);
```

---

## Átomos derivados

Puedes crear átomos que se calculan a partir de otros:

```jsx
const precioAtom = atom(100);
const cantidadAtom = atom(3);

// Átomo derivado de solo lectura
const totalAtom = atom((get) => get(precioAtom) * get(cantidadAtom));

function Resumen() {
    const total = useAtomValue(totalAtom);
    return <p>Total: {total}€</p>;
}
```

---

## Átomos de lectura y escritura

Un átomo derivado también puede ser escribible si defines cómo actualizar los átomos base:

```jsx
const celsiusAtom = atom(0);

const fahrenheitAtom = atom(
    (get) => get(celsiusAtom) * 1.8 + 32, // lectura
    (get, set, nuevoValor) => {
        // escritura
        set(celsiusAtom, (nuevoValor - 32) / 1.8);
    },
);

function Conversor() {
    const [celsius, setCelsius] = useAtom(celsiusAtom);
    const [fahrenheit, setFahrenheit] = useAtom(fahrenheitAtom);

    return (
        <div>
            <input
                type="number"
                value={celsius}
                onChange={(e) => setCelsius(Number(e.target.value))}
            />{" "}
            °C
            <input
                type="number"
                value={fahrenheit}
                onChange={(e) => setFahrenheit(Number(e.target.value))}
            />{" "}
            °F
        </div>
    );
}
```

---

## Átomos asíncronos

Los átomos pueden ser asíncronos. React Suspense maneja el estado de carga automáticamente:

```jsx
const usuariosAtom = atom(async () => {
    const res = await fetch("/api/usuarios");
    return res.json();
});

function ListaUsuarios() {
    const usuarios = useAtomValue(usuariosAtom);
    return (
        <ul>
            {usuarios.map((u) => (
                <li key={u.id}>{u.nombre}</li>
            ))}
        </ul>
    );
}

// En el componente padre
function App() {
    return (
        <Suspense fallback={<p>Cargando...</p>}>
            <ListaUsuarios />
        </Suspense>
    );
}
```

---

## Persistencia con atomWithStorage

```jsx
import { atomWithStorage } from "jotai/utils";

// El valor se guarda y restaura automáticamente de localStorage
const temaAtom = atomWithStorage("tema", "claro");

function BotonTema() {
    const [tema, setTema] = useAtom(temaAtom);

    return (
        <button onClick={() => setTema(tema === "claro" ? "oscuro" : "claro")}>
            Tema: {tema}
        </button>
    );
}
```

---

## atomWithReducer

Para átomos con lógica de actualización más compleja, similar a `useReducer`:

```jsx
import { atomWithReducer } from "jotai/utils";

function reducer(state, action) {
    switch (action.type) {
        case "incrementar":
            return { count: state.count + 1 };
        case "decrementar":
            return { count: state.count - 1 };
        case "reset":
            return { count: 0 };
        default:
            return state;
    }
}

const contadorAtom = atomWithReducer({ count: 0 }, reducer);

function Contador() {
    const [state, dispatch] = useAtom(contadorAtom);

    return (
        <div>
            <p>{state.count}</p>
            <button onClick={() => dispatch({ type: "incrementar" })}>+</button>
            <button onClick={() => dispatch({ type: "decrementar" })}>-</button>
        </div>
    );
}
```

---

## Provider (opcional)

Jotai funciona sin Provider por defecto, usando un store global implícito. El Provider es útil para aislar estados en tests o en partes específicas de la app:

```jsx
import { Provider } from "jotai";

// Sin Provider → store global compartido
function App() {
    return <Contador />;
}

// Con Provider → store aislado para ese subárbol
function App() {
    return (
        <Provider>
            <Contador />
        </Provider>
    );
}
```

---

## Jotai vs Zustand vs Redux Toolkit

|                   | Jotai                       | Zustand                        | Redux Toolkit                  |
| ----------------- | --------------------------- | ------------------------------ | ------------------------------ |
| **Modelo**        | Átomos (bottom-up)          | Store único                    | Store único                    |
| **Granularidad**  | Por átomo                   | Por selector                   | Por selector                   |
| **Re-renders**    | Solo suscriptores del átomo | Solo suscriptores del selector | Solo suscriptores del selector |
| **Async**         | Nativo con Suspense         | Manual                         | createAsyncThunk               |
| **Boilerplate**   | Mínimo                      | Mínimo                         | Medio                          |
| **DevTools**      | Básicas                     | Buenas                         | Excelentes                     |
| **Cuándo usarlo** | Estado atómico y granular   | Estado global simple           | Apps grandes                   |

---

## Cuándo usar Jotai

```
✅ Estado granular donde distintos componentes necesitan distintos trozos
✅ Quieres átomos derivados con cálculos reactivos
✅ Integración natural con React Suspense para estado asíncrono
✅ Prefieres un enfoque bottom-up en lugar de un store centralizado

❌ Apps con flujos muy complejos → Redux Toolkit tiene mejores devtools
❌ Si el equipo ya conoce Zustand y es suficiente para el proyecto
❌ Server state → TanStack Query es más apropiado
```
