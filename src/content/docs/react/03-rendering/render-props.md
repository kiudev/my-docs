---
title: Render Props
---

## ¿Qué son?

Es un patrón para compartir lógica entre componentes pasando una **función como prop**. Esa función devuelve JSX, de ahí el nombre. El componente que recibe la prop no decide qué renderizar, se lo delega a quien lo usa.

---

## El problema que resuelve

Imagina que tienes lógica de seguimiento del ratón que quieres reutilizar en varios componentes. Sin render props tendrías que duplicar esa lógica:

```jsx
// ❌ Lógica duplicada en cada componente
function ComponenteA() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    // ... misma lógica de mousemove
}

function ComponenteB() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    // ... misma lógica de mousemove
}
```

---

## Solución con Render Props

Extraes la lógica a un componente y le dices cómo renderizar mediante una función:

```jsx
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    setPos({ x: e.clientX, y: e.clientY });
  }

  return (
    <div onMouseMove={handleMouseMove}>
      {render(pos)} {/* Delega el renderizado */}
    </div>
  );
}

// Uso: cada componente decide qué hacer con los datos
<MouseTracker render={pos => (
  <p>Ratón en: {pos.x}, {pos.y}</p>
)} />

<MouseTracker render={pos => (
  <img src="cursor.png" style={{ left: pos.x, top: pos.y }} />
)} />
```

---

## Variante: usando `children` como función

En lugar de una prop llamada `render`, se puede usar `children` directamente. Es más limpio visualmente:

```jsx
function MouseTracker({ children }) {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    function handleMouseMove(e) {
        setPos({ x: e.clientX, y: e.clientY });
    }

    return <div onMouseMove={handleMouseMove}>{children(pos)}</div>;
}

// Uso más limpio
<MouseTracker>
    {(pos) => (
        <p>
            Ratón en: {pos.x}, {pos.y}
        </p>
    )}
</MouseTracker>;
```

---

## Ejemplo real: lógica de fetch compartida

```jsx
function FetchData({ url, render }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [url]);

    return render({ data, loading, error });
}

// Cada uso decide cómo mostrar los datos
<FetchData
    url="/api/usuarios"
    render={({ data, loading, error }) => {
        if (loading) return <p>Cargando...</p>;
        if (error) return <p>Error: {error.message}</p>;
        return (
            <ul>
                {data.map((u) => (
                    <li key={u.id}>{u.nombre}</li>
                ))}
            </ul>
        );
    }}
/>;
```

---

## Render Props vs Custom Hooks

Hoy en día los **custom hooks** resuelven el mismo problema de forma más sencilla. Render props sigue siendo válido pero su uso ha disminuido:

```jsx
// Con render props
<MouseTracker
    render={(pos) => (
        <p>
            {pos.x}, {pos.y}
        </p>
    )}
/>;

// Con custom hook (más limpio)
function Componente() {
    const pos = useMousePosition();
    return (
        <p>
            {pos.x}, {pos.y}
        </p>
    );
}
```

|                        | Render Props         | Custom Hook |
| ---------------------- | -------------------- | ----------- |
| **Comparte lógica**    | Sí                   | Sí          |
| **Legibilidad**        | Puede anidarse mucho | Más limpio  |
| **Composición en JSX** | Sí                   | No          |
| **Uso actual**         | Menos frecuente      | Preferido   |

---

## Cuándo usar render props hoy

- Librerías que aún lo usan (Formik, React Router v4/v5, Downshift)
- Cuando necesitas que el componente controle el renderizado desde JSX
- Al trabajar con código legacy anterior a hooks

> En código nuevo, preferir custom hooks sobre render props.
