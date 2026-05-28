---
title: Redux Toolkit
---

## ¿Qué es?

Redux Toolkit (RTK) es la forma oficial y moderna de usar Redux. Simplifica drásticamente la configuración y elimina el boilerplate de Redux clásico. Incluye utilidades para crear stores, reducers y acciones de forma concisa.

---

## Instalación

```bash
npm install @reduxjs/toolkit react-redux
```

---

## Conceptos clave

| Concepto     | Descripción                                         |
| ------------ | --------------------------------------------------- |
| **Store**    | Contenedor único del estado global                  |
| **Slice**    | Fragmento del estado con sus reducers y acciones    |
| **Action**   | Objeto que describe qué ocurrió                     |
| **Reducer**  | Función que calcula el nuevo estado según la acción |
| **Dispatch** | Función para enviar acciones al store               |
| **Selector** | Función para leer partes del estado                 |

---

## Crear un slice

Un slice agrupa el estado, los reducers y las acciones de una funcionalidad:

```jsx
import { createSlice } from "@reduxjs/toolkit";

const contadorSlice = createSlice({
    name: "contador",
    initialState: { value: 0 },
    reducers: {
        incrementar: (state) => {
            state.value += 1; // RTK usa Immer internamente → mutación directa
        },
        decrementar: (state) => {
            state.value -= 1;
        },
        incrementarPor: (state, action) => {
            state.value += action.payload;
        },
        reset: (state) => {
            state.value = 0;
        },
    },
});

// RTK genera las acciones automáticamente
export const { incrementar, decrementar, incrementarPor, reset } =
    contadorSlice.actions;

export default contadorSlice.reducer;
```

---

## Configurar el store

```jsx
// store.js
import { configureStore } from "@reduxjs/toolkit";
import contadorReducer from "./contadorSlice";
import usuarioReducer from "./usuarioSlice";

export const store = configureStore({
    reducer: {
        contador: contadorReducer,
        usuario: usuarioReducer,
    },
});
```

---

## Conectar el store a la app

```jsx
// main.jsx
import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>,
);
```

---

## Leer y modificar el estado

```jsx
import { useSelector, useDispatch } from "react-redux";
import { incrementar, decrementar, reset } from "./contadorSlice";

function Contador() {
    const count = useSelector((state) => state.contador.value);
    const dispatch = useDispatch();

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => dispatch(incrementar())}>+</button>
            <button onClick={() => dispatch(decrementar())}>-</button>
            <button onClick={() => dispatch(reset())}>Reset</button>
        </div>
    );
}
```

---

## Ejemplo real: slice de usuario

```jsx
// usuarioSlice.js
import { createSlice } from "@reduxjs/toolkit";

const usuarioSlice = createSlice({
    name: "usuario",
    initialState: {
        datos: null,
        autenticado: false,
    },
    reducers: {
        login: (state, action) => {
            state.datos = action.payload;
            state.autenticado = true;
        },
        logout: (state) => {
            state.datos = null;
            state.autenticado = false;
        },
        actualizarPerfil: (state, action) => {
            state.datos = { ...state.datos, ...action.payload };
        },
    },
});

export const { login, logout, actualizarPerfil } = usuarioSlice.actions;
export default usuarioSlice.reducer;

// Selectores reutilizables
export const selectUsuario = (state) => state.usuario.datos;
export const selectAutenticado = (state) => state.usuario.autenticado;
```

```jsx
// Uso en componentes
function Navbar() {
    const autenticado = useSelector(selectAutenticado);
    const usuario = useSelector(selectUsuario);
    const dispatch = useDispatch();

    return (
        <nav>
            {autenticado ? (
                <>
                    <p>Hola, {usuario.nombre}</p>
                    <button onClick={() => dispatch(logout())}>
                        Cerrar sesión
                    </button>
                </>
            ) : (
                <Link to="/login">Iniciar sesión</Link>
            )}
        </nav>
    );
}
```

---

## Acciones asíncronas con createAsyncThunk

Para peticiones a APIs u operaciones asíncronas:

```jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Definir el thunk
export const fetchUsuarios = createAsyncThunk("usuarios/fetchAll", async () => {
    const response = await fetch("/api/usuarios");
    return response.json();
});

const usuariosSlice = createSlice({
    name: "usuarios",
    initialState: {
        lista: [],
        cargando: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsuarios.pending, (state) => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(fetchUsuarios.fulfilled, (state, action) => {
                state.cargando = false;
                state.lista = action.payload;
            })
            .addCase(fetchUsuarios.rejected, (state, action) => {
                state.cargando = false;
                state.error = action.error.message;
            });
    },
});

export default usuariosSlice.reducer;
```

```jsx
// Uso en componentes
function ListaUsuarios() {
    const dispatch = useDispatch();
    const { lista, cargando, error } = useSelector((state) => state.usuarios);

    useEffect(() => {
        dispatch(fetchUsuarios());
    }, [dispatch]);

    if (cargando) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {lista.map((u) => (
                <li key={u.id}>{u.nombre}</li>
            ))}
        </ul>
    );
}
```

---

## RTK Query

Redux Toolkit incluye RTK Query, una solución integrada para server state que evita la necesidad de TanStack Query si ya usas Redux:

```jsx
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getUsuarios: builder.query({ query: () => "/usuarios" }),
        getUsuario: builder.query({ query: (id) => `/usuarios/${id}` }),
        crearUsuario: builder.mutation({
            query: (usuario) => ({
                url: "/usuarios",
                method: "POST",
                body: usuario,
            }),
        }),
    }),
});

export const {
    useGetUsuariosQuery,
    useGetUsuarioQuery,
    useCrearUsuarioMutation,
} = apiSlice;
```

```jsx
// Uso
function ListaUsuarios() {
    const { data: usuarios, isLoading, isError } = useGetUsuariosQuery();

    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error</p>;

    return (
        <ul>
            {usuarios.map((u) => (
                <li key={u.id}>{u.nombre}</li>
            ))}
        </ul>
    );
}
```

---

## Estructura de archivos recomendada

```
src/
├── store.js
└── features/
    ├── usuario/
    │   ├── usuarioSlice.js
    │   └── usuarioSelectors.js
    ├── carrito/
    │   └── carritoSlice.js
    └── productos/
        └── productosSlice.js
```

---

## Redux Toolkit vs Zustand

|                          | Redux Toolkit                 | Zustand                          |
| ------------------------ | ----------------------------- | -------------------------------- |
| **Boilerplate**          | Medio                         | Mínimo                           |
| **Provider**             | Necesario                     | No necesario                     |
| **DevTools**             | Excelentes                    | Buenas                           |
| **Curva de aprendizaje** | Media-alta                    | Baja                             |
| **Server state**         | RTK Query                     | TanStack Query                   |
| **Escalabilidad**        | Muy alta                      | Alta                             |
| **Cuándo usarlo**        | Apps grandes, equipos grandes | Apps medianas, menos complejidad |

---

## Cuándo usar Redux Toolkit

```
✅ Apps grandes con estado complejo y muchas acciones
✅ Equipos grandes que necesitan convenciones estrictas
✅ Necesitas RTK Query como solución integrada de server state
✅ El proyecto ya usa Redux y quieres modernizarlo

❌ Apps pequeñas o medianas → Zustand es más simple
❌ Solo necesitas server state → TanStack Query es suficiente
❌ El estado es mayormente local → useState y Context
```
