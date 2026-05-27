---
title: useCallback
---

## ¿Qué es?

Hook para **memorizar una función**. Devuelve la misma referencia de la función entre renders mientras no cambien sus dependencias.

```jsx
const funcionMemorizada = useCallback(() => {
    // lógica
}, [dependencias]);
```

---

## El problema que resuelve

En React, cada render crea nuevas instancias de todas las funciones definidas en el componente. Esto significa que aunque la lógica sea idéntica, la referencia cambia:

```jsx
function Padre() {
    // ❌ handleClick es una función nueva en cada render
    function handleClick() {
        console.log("click");
    }

    return <Hijo onClick={handleClick} />;
}
```

Si `Hijo` está envuelto en `React.memo`, detecta que `onClick` cambió (nueva referencia) y se re-renderiza aunque visualmente no haya cambiado nada.

---

## Solución con useCallback

```jsx
function Padre() {
    // ✅ handleClick mantiene la misma referencia entre renders
    const handleClick = useCallback(() => {
        console.log("click");
    }, []); // Sin dependencias: nunca cambia

    return <Hijo onClick={handleClick} />;
}
```

---

## Ejemplo completo con React.memo

```jsx
const Boton = React.memo(function Boton({ onClick, label }) {
    console.log(`Renderizando: ${label}`);
    return <button onClick={onClick}>{label}</button>;
});

function App() {
    const [contador, setContador] = useState(0);
    const [texto, setTexto] = useState("");

    // ❌ Sin useCallback: Boton se re-renderiza cuando cambia texto
    const incrementar = () => setContador((prev) => prev + 1);

    // ✅ Con useCallback: Boton solo se re-renderiza si cambian sus dependencias
    const incrementar = useCallback(() => {
        setContador((prev) => prev + 1);
    }, []); // No depende de nada externo

    return (
        <>
            <Boton onClick={incrementar} label="Incrementar" />
            <p>Contador: {contador}</p>
            <input value={texto} onChange={(e) => setTexto(e.target.value)} />
        </>
    );
}
```

---

## Con dependencias

Si la función usa valores del componente, deben ir en el array de dependencias:

```jsx
function Buscador({ lista }) {
    const [query, setQuery] = useState("");

    const buscar = useCallback(() => {
        return lista.filter((item) => item.includes(query));
    }, [lista, query]); // Se recrea cuando cambia lista o query

    return (
        <>
            <input value={query} onChange={(e) => setQuery(e.target.value)} />
            <Resultados onBuscar={buscar} />
        </>
    );
}
```

---

## Estabilizar funciones para useEffect

`useCallback` también es útil para estabilizar funciones que se usan como dependencias en `useEffect`:

```jsx
function Componente({ id }) {
    // ❌ fetchUsuario es nueva en cada render → useEffect se ejecuta siempre
    const fetchUsuario = async () => {
        const res = await fetch(`/api/usuarios/${id}`);
        return res.json();
    };

    useEffect(() => {
        fetchUsuario().then(setUsuario);
    }, [fetchUsuario]);

    // ✅ fetchUsuario solo cambia cuando cambia id
    const fetchUsuario = useCallback(async () => {
        const res = await fetch(`/api/usuarios/${id}`);
        return res.json();
    }, [id]);

    useEffect(() => {
        fetchUsuario().then(setUsuario);
    }, [fetchUsuario]); // Solo cuando cambia id
}
```

---

## useCallback vs useMemo

```jsx
// useCallback → memoriza la FUNCIÓN
const fn = useCallback(() => calcular(a, b), [a, b]);
fn(); // Hay que llamarla

// useMemo → memoriza el RESULTADO de ejecutar la función
const resultado = useMemo(() => calcular(a, b), [a, b]);
// resultado ya tiene el valor calculado
```

De hecho, `useCallback(fn, deps)` es equivalente a `useMemo(() => fn, deps)`.

|              | `useCallback`                               | `useMemo`          |
| ------------ | ------------------------------------------- | ------------------ |
| **Memoriza** | La función                                  | El resultado       |
| **Devuelve** | La función sin ejecutar                     | El valor calculado |
| **Uso**      | Props de callbacks, dependencias de efectos | Cálculos costosos  |

---

## Cuándo usar useCallback

```
✅ Funciones que se pasan como props a componentes con React.memo
✅ Funciones que se usan como dependencias en useEffect o useMemo
✅ Handlers en listas grandes donde cada item tiene callbacks

❌ No usar por defecto en todos los handlers
❌ No usar si el componente hijo no está en React.memo
❌ No usar para optimizaciones prematuras
```

---

## Nota sobre el rendimiento

Al igual que `useMemo`, `useCallback` tiene un coste propio. Úsalo solo cuando tengas un problema real de rendimiento identificado, no de forma preventiva en cada función.

> La regla general: escribe primero sin optimizaciones. Mide con React DevTools Profiler. Optimiza solo donde haya un problema real.
