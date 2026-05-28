---
title: Conceptos base de manejo de estado en React
---

## ¿Qué es el state management?

Es la forma en que una aplicación gestiona y comparte datos entre sus componentes. A medida que una app crece, manejar el estado se vuelve más complejo y requiere estrategias y herramientas específicas.

---

## Tipos de estado

No todo el estado es igual. Clasificarlo ayuda a elegir la herramienta correcta:

| Tipo             | Descripción                            | Ejemplos                             |
| ---------------- | -------------------------------------- | ------------------------------------ |
| **Local**        | Pertenece a un solo componente         | Input controlado, toggle, contador   |
| **Global**       | Compartido entre múltiples componentes | Usuario autenticado, tema, carrito   |
| **Server state** | Datos que vienen del servidor          | Listas de usuarios, posts, productos |
| **URL state**    | Estado en la URL                       | Filtros, paginación, rutas           |
| **Form state**   | Estado de formularios                  | Valores, errores, estado de envío    |

---

## Local state

Es el estado que solo necesita un componente. Se gestiona con `useState` o `useReducer` directamente:

```jsx
function Contador() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

Señales de que el estado debería seguir siendo local:

- Solo lo usa un componente
- No necesita persistir cuando el componente se desmonta
- No lo necesita ningún componente hermano o padre

---

## Global state

Estado que varios componentes necesitan leer o modificar, independientemente de su posición en el árbol:

```
App
├── Navbar          → necesita saber si el usuario está autenticado
├── Sidebar         → necesita saber el tema (claro/oscuro)
└── Dashboard
    ├── Perfil      → necesita los datos del usuario
    └── Ajustes     → necesita poder cambiar el tema
```

Pasar estos datos por props desde un componente raíz genera **prop drilling**: pasar datos a través de capas intermedias que no los necesitan.

---

## Server state

Es un tipo especial de estado global que proviene del servidor. Tiene características propias:

- **Es asíncrono**: hay que manejar estados de carga y error
- **Puede quedar desactualizado**: otros usuarios o procesos pueden modificarlo
- **Necesita caché**: para no hacer la misma petición varias veces
- **Necesita sincronización**: mantenerlo actualizado con el servidor

Gestionar esto manualmente con `useEffect` y `useState` es costoso:

```jsx
// ❌ Gestión manual del server state — repetitivo y propenso a bugs
function Usuarios() {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/usuarios")
            .then((r) => r.json())
            .then((data) => {
                setDatos(data);
                setCargando(false);
            })
            .catch((err) => {
                setError(err);
                setCargando(false);
            });
    }, []);
}
```

Librerías como **TanStack Query** o **SWR** resuelven esto de forma declarativa.

---

## Cuándo necesitas state management global

No siempre es necesaria una librería. Antes de añadir una, pregúntate:

```
¿El estado lo usan 2 o más componentes no relacionados?
        ↓ No → useState local es suficiente
        ↓ Sí
¿Hay más de 2-3 niveles de prop drilling?
        ↓ No → Reestructura los componentes o usa Context
        ↓ Sí
¿El estado cambia con frecuencia y en muchos sitios?
        ↓ No → Context API puede ser suficiente
        ↓ Sí → Considera una librería (Zustand, Redux...)
```

---

## Context API vs librerías externas

Context API es la solución nativa de React para estado global. Es suficiente para muchos casos pero tiene limitaciones:

|                   | Context API                    | Zustand / Redux                              |
| ----------------- | ------------------------------ | -------------------------------------------- |
| **Configuración** | Mínima                         | Media                                        |
| **Re-renders**    | Todos los consumidores         | Solo los suscritos al trozo relevante        |
| **DevTools**      | Básicas                        | Avanzadas                                    |
| **Escalabilidad** | Media                          | Alta                                         |
| **Cuándo usarlo** | Estado simple y poco frecuente | Estado complejo o con muchas actualizaciones |

---

## Regla general

> Usa el estado más local posible. Eleva el estado solo cuando sea necesario. Añade librerías solo cuando el problema lo justifique.

```
useState / useReducer    → estado local
Context API              → estado global simple, poco frecuente
Zustand / Jotai          → estado global con muchas actualizaciones
Redux Toolkit            → estado global complejo en apps grandes
TanStack Query / SWR     → server state
```
