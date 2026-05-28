---
title: Refs
---

## ¿Qué son?

Las refs son una forma de acceder directamente a un nodo del DOM o guardar un valor que persiste entre renders **sin causar re-renders**. Son la "salida de emergencia" de React cuando el flujo normal de datos no es suficiente.

---

## useRef

Es el hook para crear refs:

```jsx
import { useRef } from "react";

const ref = useRef(valorInicial);
```

Devuelve un objeto con una sola propiedad: `ref.current`, que apunta al valor o nodo DOM almacenado.

---

## Caso 1: Acceder al DOM directamente

El uso más común. Se conecta a un elemento JSX con el atributo `ref`:

```jsx
function Formulario() {
    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.focus(); // Enfoca el input directamente
    }

    return (
        <>
            <input ref={inputRef} placeholder="Escribe algo" />
            <button onClick={handleClick}>Enfocar input</button>
        </>
    );
}
```

### Otros usos frecuentes con el DOM:

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

A diferencia de `useState`, actualizar `ref.current` **no causa re-render**. Útil para guardar valores que necesitas recordar pero que no afectan la UI:

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
        clearInterval(intervaloRef.current); // Accede al intervalo guardado
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

## Ref vs State

|                            | `useRef`              | `useState`              |
| -------------------------- | --------------------- | ----------------------- |
| **Causa re-render**        | No                    | Sí                      |
| **Persiste entre renders** | Sí                    | Sí                      |
| **Uso principal**          | DOM, valores internos | Datos que afectan la UI |
| **Actualización**          | `ref.current = valor` | `setState(valor)`       |

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

---

## Guardar el valor anterior de un estado

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

## forwardRef

Por defecto no puedes pasar una `ref` a un componente personalizado. Para hacerlo necesitas `forwardRef`:

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

> A partir de React 19, `forwardRef` ya no es necesario: las refs se pueden pasar como props directamente.
