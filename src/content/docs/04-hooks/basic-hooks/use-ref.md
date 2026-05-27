---
title: useRef
---

## ¿Qué es?

Hook para guardar un valor que persiste entre renders **sin causar re-renders**. Su uso más común es acceder directamente a nodos del DOM.

```jsx
const ref = useRef(valorInicial);
```

Devuelve un objeto con una sola propiedad: `ref.current`.

---

## Caso 1: Acceder al DOM directamente

Se conecta a un elemento JSX con el atributo `ref`:

```jsx
function Formulario() {
    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.focus();
    }

    return (
        <>
            <input ref={inputRef} placeholder="Escribe algo" />
            <button onClick={handleClick}>Enfocar input</button>
        </>
    );
}
```

### Otros usos frecuentes con el DOM

```jsx
// Leer el valor de un input no controlado
const valor = inputRef.current.value;

// Reproducir o pausar un video
videoRef.current.play();
videoRef.current.pause();

// Medir dimensiones de un elemento
const altura = divRef.current.offsetHeight;

// Hacer scroll a un elemento
elementoRef.current.scrollIntoView({ behavior: "smooth" });
```

---

## Caso 2: Guardar valores entre renders

A diferencia de `useState`, actualizar `ref.current` **no causa re-render**. Útil para guardar valores internos que no afectan la UI:

```jsx
function Cronometro() {
    const [tiempo, setTiempo] = useState(0);
    const intervaloRef = useRef(null);

    function iniciar() {
        intervaloRef.current = setInterval(() => {
            setTiempo((prev) => prev + 1);
        }, 1000);
    }

    function detener() {
        clearInterval(intervaloRef.current);
    }

    return (
        <>
            <p>Tiempo: {tiempo}s</p>
            <button onClick={iniciar}>Iniciar</button>
            <button onClick={detener}>Detener</button>
        </>
    );
}
```

---

## Caso 3: Guardar el valor anterior de un estado

Patrón útil para comparar el valor actual con el anterior:

```jsx
function Componente({ valor }) {
    const valorAnteriorRef = useRef(null);

    useEffect(() => {
        valorAnteriorRef.current = valor; // Se actualiza después del render
    });

    return (
        <p>
            Antes: {valorAnteriorRef.current} — Ahora: {valor}
        </p>
    );
}
```

---

## useRef vs useState

|                            | `useRef`              | `useState`              |
| -------------------------- | --------------------- | ----------------------- |
| **Causa re-render**        | No                    | Sí                      |
| **Persiste entre renders** | Sí                    | Sí                      |
| **Uso principal**          | DOM, valores internos | Datos que afectan la UI |
| **Actualización**          | `ref.current = valor` | `setState(valor)`       |

---

## forwardRef

Por defecto no puedes pasar una `ref` a un componente personalizado. Para ello se usa `forwardRef`:

```jsx
import { forwardRef } from "react";

const InputPersonalizado = forwardRef(function InputPersonalizado(props, ref) {
    return <input ref={ref} {...props} />;
});

// Ahora puedes usar ref desde fuera
function App() {
    const inputRef = useRef(null);
    return <InputPersonalizado ref={inputRef} placeholder="Hola" />;
}
```

> **React 19+:** `forwardRef` ya no es necesario. Las refs se pueden pasar como props directamente:
>
> ```jsx
> function InputPersonalizado({ ref, ...props }) {
>     return <input ref={ref} {...props} />;
> }
> ```

---

## Cuándo usar refs

```
✅ Enfocar, seleccionar texto, mover el scroll
✅ Reproducir medios (audio, video)
✅ Guardar IDs de timers o intervalos
✅ Integrar con librerías externas que manipulan el DOM
✅ Guardar el valor anterior de una prop o estado

❌ No usar para datos que deberían estar en el estado
❌ No leer ni escribir ref.current durante el render
```
