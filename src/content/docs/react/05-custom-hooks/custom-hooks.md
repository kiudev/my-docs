---
title: Custom Hooks
---

## ¿Qué son?

Son funciones de JavaScript que empiezan por `use` y encapsulan lógica reutilizable usando hooks de React. Permiten extraer y compartir lógica entre componentes sin duplicar código.

```jsx
function useNombreDelHook() {
    // lógica con hooks
    return; // lo que necesiten los componentes
}
```

---

## El problema que resuelven

Cuando varios componentes comparten la misma lógica, puedes extraerla a un custom hook en lugar de duplicarla:

```jsx
// ❌ Lógica duplicada en cada componente
function ComponenteA() {
    const [ancho, setAncho] = useState(window.innerWidth);
    useEffect(() => {
        const handler = () => setAncho(window.innerWidth);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);
}

function ComponenteB() {
    const [ancho, setAncho] = useState(window.innerWidth);
    useEffect(() => {
        const handler = () => setAncho(window.innerWidth);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);
}
```

---

## Solución con Custom Hook

```jsx
// ✅ Lógica extraída a un custom hook
function useAnchoPantalla() {
    const [ancho, setAncho] = useState(window.innerWidth);

    useEffect(() => {
        const handler = () => setAncho(window.innerWidth);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    return ancho;
}

// Uso limpio en cualquier componente
function ComponenteA() {
    const ancho = useAnchoPantalla();
    return <p>Ancho: {ancho}px</p>;
}

function ComponenteB() {
    const ancho = useAnchoPantalla();
    return <div style={{ width: ancho > 768 ? "50%" : "100%" }}>...</div>;
}
```

---

## Reglas

Los custom hooks siguen las mismas reglas que los hooks de React:

```
✅ El nombre debe empezar por use
✅ Solo llamarlos en el nivel superior del componente o de otro hook
✅ Solo usarlos dentro de componentes funcionales o custom hooks

❌ No llamarlos dentro de condicionales, bucles o funciones anidadas
```

---

## Ejemplos comunes

### useFetch

```jsx
function useFetch(url) {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch(url, { signal: controller.signal })
            .then((res) => res.json())
            .then((data) => {
                setDatos(data);
                setCargando(false);
            })
            .catch((err) => {
                if (err.name === "AbortError") return;
                setError(err);
                setCargando(false);
            });

        return () => controller.abort();
    }, [url]);

    return { datos, cargando, error };
}

// Uso
function Usuarios() {
    const { datos, cargando, error } = useFetch("/api/usuarios");

    if (cargando) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <ul>
            {datos.map((u) => (
                <li key={u.id}>{u.nombre}</li>
            ))}
        </ul>
    );
}
```

### useLocalStorage

```jsx
function useLocalStorage(clave, valorInicial) {
    const [valor, setValor] = useState(() => {
        try {
            const item = localStorage.getItem(clave);
            return item ? JSON.parse(item) : valorInicial;
        } catch {
            return valorInicial;
        }
    });

    function guardar(nuevoValor) {
        setValor(nuevoValor);
        localStorage.setItem(clave, JSON.stringify(nuevoValor));
    }

    return [valor, guardar];
}

// Uso
function Preferencias() {
    const [tema, setTema] = useLocalStorage("tema", "claro");

    return (
        <button onClick={() => setTema(tema === "claro" ? "oscuro" : "claro")}>
            Tema: {tema}
        </button>
    );
}
```

### useDebounce

```jsx
function useDebounce(valor, delay = 500) {
    const [valorDebounced, setValorDebounced] = useState(valor);

    useEffect(() => {
        const timer = setTimeout(() => setValorDebounced(valor), delay);
        return () => clearTimeout(timer);
    }, [valor, delay]);

    return valorDebounced;
}

// Uso: evita llamar a la API en cada tecla
function Buscador() {
    const [query, setQuery] = useState("");
    const queryDebounced = useDebounce(query, 300);

    useEffect(() => {
        if (queryDebounced) fetch(`/api/buscar?q=${queryDebounced}`);
    }, [queryDebounced]);

    return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### useToggle

```jsx
function useToggle(valorInicial = false) {
    const [valor, setValor] = useState(valorInicial);
    const toggle = useCallback(() => setValor((prev) => !prev), []);
    return [valor, toggle];
}

// Uso
function Modal() {
    const [abierto, toggleAbierto] = useToggle(false);

    return (
        <>
            <button onClick={toggleAbierto}>
                {abierto ? "Cerrar" : "Abrir"} modal
            </button>
            {abierto && <div>Contenido del modal</div>}
        </>
    );
}
```

---

## Dónde colocarlos

Por convención los custom hooks van en su propia carpeta:

```
src/
├── hooks/
│   ├── useFetch.js
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   └── useToggle.js
└── components/
```

---

## Custom Hooks vs otras formas de compartir lógica

|                     | Custom Hook | HOC            | Render Props    |
| ------------------- | ----------- | -------------- | --------------- |
| **Comparte lógica** | Sí          | Sí             | Sí              |
| **Añade JSX**       | No          | Sí             | Sí              |
| **Legibilidad**     | Muy limpio  | Puede anidarse | Puede anidarse  |
| **Composición**     | Fácil       | Media          | Media           |
| **Uso actual**      | Preferido   | Legacy         | Menos frecuente |

---

## Cuándo crear un custom hook

```
✅ La misma lógica aparece en dos o más componentes
✅ Un componente tiene demasiada lógica y quieres separar responsabilidades
✅ Quieres testear la lógica de forma independiente al componente
✅ Quieres encapsular una integración con una API externa o del navegador
```
