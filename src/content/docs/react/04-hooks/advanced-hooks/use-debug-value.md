---
title: useDebugValue
---

## ¿Qué es?

Hook para **mostrar una etiqueta personalizada en React DevTools** al inspeccionar un custom hook. No afecta al comportamiento de la aplicación, es puramente una herramienta de debugging.

```jsx
useDebugValue(valor);
```

---

## El problema que resuelve

Cuando creas un custom hook y lo inspeccionas en React DevTools, por defecto solo ves el nombre del hook y los valores de sus estados internos. Con `useDebugValue` puedes añadir una etiqueta descriptiva que facilita el debugging.

---

## Ejemplo básico

```jsx
import { useState, useDebugValue } from "react";

function useEstadoConexion() {
    const [conectado, setConectado] = useState(false);

    useDebugValue(conectado ? "Conectado" : "Desconectado");

    return [conectado, setConectado];
}
```

En React DevTools verías:

```
useEstadoConexion: "Conectado"
```

En lugar del menos descriptivo:

```
useEstadoConexion
  useState: false
```

---

## Ejemplo real: custom hook de fetch

```jsx
function useFetch(url) {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useDebugValue({ url, cargando, tieneError: !!error });

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setDatos(data);
                setCargando(false);
            })
            .catch((err) => {
                setError(err);
                setCargando(false);
            });
    }, [url]);

    return { datos, cargando, error };
}
```

En DevTools verías:

```
useFetch: {url: "/api/usuarios", cargando: false, tieneError: false}
```

---

## Formateo diferido

Si el valor de debug requiere un cálculo costoso para formatearlo, puedes pasar una función como segundo argumento. React solo la ejecutará cuando DevTools esté abierto:

```jsx
useDebugValue(fecha, (fecha) => fecha.toLocaleDateString("es-ES"));
```

Sin la función de formateo, `toLocaleDateString` se ejecutaría en cada render aunque DevTools no esté abierto.

```jsx
function useFechaUltimoAcceso() {
    const [fecha, setFecha] = useState(new Date());

    // ✅ El formateo solo ocurre cuando DevTools está inspeccionando
    useDebugValue(
        fecha,
        (f) => `Último acceso: ${f.toLocaleDateString("es-ES")}`,
    );

    return [fecha, setFecha];
}
```

---

## Cuándo usar useDebugValue

```
✅ Custom hooks de librerías que serán usados por otros desarrolladores
✅ Custom hooks complejos con estado difícil de interpretar en DevTools
✅ Cuando el estado interno del hook no es suficientemente descriptivo por sí solo

❌ No usar en componentes, solo en custom hooks
❌ No usar en hooks simples donde el estado ya es claro
❌ No añadirlo por defecto a todos los custom hooks
```

> Es una herramienta para mejorar la experiencia de desarrollo, especialmente útil al crear librerías de hooks o en equipos grandes donde otros desarrolladores usan tus hooks.
