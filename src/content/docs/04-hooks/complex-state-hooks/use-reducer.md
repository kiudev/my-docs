---
title: useReducer
---

## ¿Qué es?

Hook para manejar estado complejo mediante un **reducer**: una función pura que recibe el estado actual y una acción, y devuelve el nuevo estado.

```jsx
const [estado, dispatch] = useReducer(reducer, estadoInicial);
```

- `estado` → el valor actual del estado
- `dispatch` → función para enviar acciones al reducer
- `reducer` → función que define cómo cambia el estado
- `estadoInicial` → valor con el que arranca el estado

---

## El reducer

Es una función pura que recibe el estado actual y una acción, y devuelve el nuevo estado. Nunca muta el estado directamente:

```jsx
function reducer(estado, accion) {
    switch (accion.type) {
        case "incrementar":
            return { ...estado, contador: estado.contador + 1 };
        case "decrementar":
            return { ...estado, contador: estado.contador - 1 };
        case "reset":
            return { ...estado, contador: 0 };
        default:
            throw new Error(`Acción desconocida: ${accion.type}`);
    }
}
```

---

## Ejemplo básico: contador

```jsx
const estadoInicial = { contador: 0 };

function reducer(estado, accion) {
    switch (accion.type) {
        case "incrementar":
            return { contador: estado.contador + 1 };
        case "decrementar":
            return { contador: estado.contador - 1 };
        case "reset":
            return { contador: 0 };
        default:
            throw new Error(`Acción desconocida: ${accion.type}`);
    }
}

function Contador() {
    const [estado, dispatch] = useReducer(reducer, estadoInicial);

    return (
        <div>
            <p>Contador: {estado.contador}</p>
            <button onClick={() => dispatch({ type: "incrementar" })}>+</button>
            <button onClick={() => dispatch({ type: "decrementar" })}>-</button>
            <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
        </div>
    );
}
```

---

## Acciones con payload

Las acciones pueden llevar datos adicionales en el campo `payload`:

```jsx
function reducer(estado, accion) {
    switch (accion.type) {
        case "añadir_tarea":
            return {
                ...estado,
                tareas: [...estado.tareas, accion.payload],
            };
        case "eliminar_tarea":
            return {
                ...estado,
                tareas: estado.tareas.filter((t) => t.id !== accion.payload),
            };
        case "completar_tarea":
            return {
                ...estado,
                tareas: estado.tareas.map((t) =>
                    t.id === accion.payload ? { ...t, completada: true } : t,
                ),
            };
        default:
            throw new Error(`Acción desconocida: ${accion.type}`);
    }
}

// Uso
dispatch({ type: "añadir_tarea", payload: { id: 1, texto: "Aprender React" } });
dispatch({ type: "eliminar_tarea", payload: 1 });
dispatch({ type: "completar_tarea", payload: 1 });
```

---

## Ejemplo real: lista de tareas

```jsx
const estadoInicial = {
    tareas: [],
    filtro: "todas",
};

function reducer(estado, accion) {
    switch (accion.type) {
        case "añadir":
            return {
                ...estado,
                tareas: [
                    ...estado.tareas,
                    {
                        id: Date.now(),
                        texto: accion.payload,
                        completada: false,
                    },
                ],
            };
        case "completar":
            return {
                ...estado,
                tareas: estado.tareas.map((t) =>
                    t.id === accion.payload
                        ? { ...t, completada: !t.completada }
                        : t,
                ),
            };
        case "eliminar":
            return {
                ...estado,
                tareas: estado.tareas.filter((t) => t.id !== accion.payload),
            };
        case "cambiar_filtro":
            return { ...estado, filtro: accion.payload };
        default:
            throw new Error(`Acción desconocida: ${accion.type}`);
    }
}

function TodoApp() {
    const [estado, dispatch] = useReducer(reducer, estadoInicial);
    const [texto, setTexto] = useState("");

    const tareasFiltradas = estado.tareas.filter((t) => {
        if (estado.filtro === "completadas") return t.completada;
        if (estado.filtro === "pendientes") return !t.completada;
        return true;
    });

    return (
        <div>
            <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Nueva tarea"
            />
            <button
                onClick={() => {
                    dispatch({ type: "añadir", payload: texto });
                    setTexto("");
                }}
            >
                Añadir
            </button>

            <select
                onChange={(e) =>
                    dispatch({
                        type: "cambiar_filtro",
                        payload: e.target.value,
                    })
                }
            >
                <option value="todas">Todas</option>
                <option value="completadas">Completadas</option>
                <option value="pendientes">Pendientes</option>
            </select>

            <ul>
                {tareasFiltradas.map((t) => (
                    <li key={t.id}>
                        <span
                            style={{
                                textDecoration: t.completada
                                    ? "line-through"
                                    : "none",
                            }}
                        >
                            {t.texto}
                        </span>
                        <button
                            onClick={() =>
                                dispatch({ type: "completar", payload: t.id })
                            }
                        >
                            ✓
                        </button>
                        <button
                            onClick={() =>
                                dispatch({ type: "eliminar", payload: t.id })
                            }
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

---

## Lazy initialization

Al igual que `useState`, puedes pasar una función para calcular el estado inicial solo una vez:

```jsx
function init(estadoInicial) {
    return { contador: estadoInicial, historial: [] };
}

const [estado, dispatch] = useReducer(reducer, 0, init);
```

---

## useReducer vs useState

|                               | `useState`               | `useReducer`                        |
| ----------------------------- | ------------------------ | ----------------------------------- |
| **Complejidad del estado**    | Simple                   | Complejo, con múltiples sub-valores |
| **Lógica de actualización**   | Directa                  | Centralizada en el reducer          |
| **Número de actualizaciones** | Pocas                    | Muchas acciones relacionadas        |
| **Testing**                   | En el componente         | El reducer se testea por separado   |
| **Legibilidad**               | Mejor para casos simples | Mejor para casos complejos          |

---

## Cuándo usar useReducer

```
✅ Estado con múltiples sub-valores relacionados
✅ La lógica de actualización es compleja
✅ El nuevo estado depende del anterior de forma elaborada
✅ Quieres centralizar y testear la lógica de estado por separado

❌ Estado simple con una o dos variables
❌ Actualizaciones independientes entre sí
```

> Una buena señal para migrar de `useState` a `useReducer`: cuando tienes varios `useState` relacionados y los setters siempre se llaman juntos.
