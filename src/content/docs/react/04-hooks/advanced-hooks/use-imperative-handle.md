---
title: useImperativeHandle
---

## ¿Qué es?

Hook para **personalizar el valor que se expone a través de una ref** cuando un componente padre accede a un componente hijo. Permite controlar exactamente qué métodos o propiedades son accesibles desde fuera.

```jsx
useImperativeHandle(
    ref,
    () => ({
        // métodos y propiedades que expones
    }),
    [dependencias],
);
```

---

## El problema que resuelve

Por defecto, cuando pasas una `ref` a un componente hijo, obtienes acceso directo al nodo DOM completo. Esto puede ser excesivo o no es lo que quieres exponer:

```jsx
// El padre tiene acceso a TODO el DOM del input
// incluyendo métodos que no debería usar
const inputRef = useRef(null);
<Input ref={inputRef} />;
inputRef.current.value; // acceso directo al DOM
inputRef.current.style.color; // el padre no debería hacer esto
```

Con `useImperativeHandle` defines una API controlada y limitada.

---

## Ejemplo básico

```jsx
import { useRef, useImperativeHandle, forwardRef } from "react";

const Input = forwardRef(function Input(props, ref) {
    const inputRef = useRef(null);

    // Solo expones los métodos que quieres
    useImperativeHandle(ref, () => ({
        focus() {
            inputRef.current.focus();
        },
        clear() {
            inputRef.current.value = "";
        },
    }));

    return <input ref={inputRef} {...props} />;
});

// Uso desde el padre
function App() {
    const inputRef = useRef(null);

    return (
        <>
            <Input ref={inputRef} placeholder="Escribe algo" />
            <button onClick={() => inputRef.current.focus()}>Enfocar</button>
            <button onClick={() => inputRef.current.clear()}>Limpiar</button>
            {/* inputRef.current.style NO existe → API controlada */}
        </>
    );
}
```

---

## Ejemplo real: reproductor de video

```jsx
const VideoPlayer = forwardRef(function VideoPlayer({ src }, ref) {
    const videoRef = useRef(null);

    useImperativeHandle(ref, () => ({
        play() {
            videoRef.current.play();
        },
        pause() {
            videoRef.current.pause();
        },
        reiniciar() {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        },
        get duracion() {
            return videoRef.current.duration;
        },
    }));

    return <video ref={videoRef} src={src} />;
});

function App() {
    const playerRef = useRef(null);

    return (
        <>
            <VideoPlayer ref={playerRef} src="video.mp4" />
            <button onClick={() => playerRef.current.play()}>▶ Play</button>
            <button onClick={() => playerRef.current.pause()}>⏸ Pausa</button>
            <button onClick={() => playerRef.current.reiniciar()}>
                ↩ Reiniciar
            </button>
        </>
    );
}
```

---

## Con React 19

A partir de React 19, `forwardRef` ya no es necesario. Las refs se pasan como props directamente:

```jsx
// React 19+
function Input({ ref, ...props }) {
    const inputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus() {
            inputRef.current.focus();
        },
        clear() {
            inputRef.current.value = "";
        },
    }));

    return <input ref={inputRef} {...props} />;
}
```

---

## Cuándo usar useImperativeHandle

```
✅ Exponer una API limitada y controlada de un componente hijo
✅ Componentes de UI reutilizables: inputs, modales, reproductores, sliders
✅ Cuando el padre necesita disparar acciones imperativas (focus, play, scroll...)
✅ Ocultar detalles de implementación interna del componente

❌ No usar para pasar datos, para eso están las props
❌ No usar como alternativa al flujo normal de datos de React
❌ Evitar su uso si el problema se puede resolver con props y callbacks
```

---

## Nota

`useImperativeHandle` siempre se usa junto a `forwardRef` (o refs como props en React 19). Sin pasar la ref al componente hijo, el hook no tiene efecto.

> Es una herramienta para casos específicos. La mayoría de interacciones entre componentes deben manejarse con props y estado, no con refs imperativas.
