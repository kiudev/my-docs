---
title: useInsertionEffect
---

## ¿Qué es?

Hook que se ejecuta **antes de que React haga cualquier cambio en el DOM**. Está diseñado exclusivamente para insertar estilos dinámicos en el documento, específicamente para autores de librerías CSS-in-JS.

```jsx
useInsertionEffect(() => {
    // insertar estilos
    return () => {
        // limpieza (opcional)
    };
}, [dependencias]);
```

---

## Contexto: el problema de CSS-in-JS

Las librerías CSS-in-JS como styled-components o Emotion necesitan inyectar estilos en el DOM antes de que los componentes se rendericen. Si los estilos se insertan demasiado tarde, el navegador recalcula el layout varias veces, causando parpadeos y problemas de rendimiento.

---

## Orden de ejecución

```
1. React calcula los cambios necesarios en el DOM
2. useInsertionEffect corre    ← antes de tocar el DOM
3. React actualiza el DOM
4. useLayoutEffect corre       ← después de actualizar el DOM, antes de pintar
5. El navegador pinta la pantalla
6. useEffect corre             ← después de pintar
```

---

## Ejemplo: librería CSS-in-JS simplificada

```jsx
import { useInsertionEffect } from "react";

function useCSS(regla) {
    useInsertionEffect(() => {
        // Insertar la regla CSS antes de que React toque el DOM
        const styleTag = document.createElement("style");
        styleTag.textContent = regla;
        document.head.appendChild(styleTag);

        return () => {
            document.head.removeChild(styleTag); // Limpieza al desmontar
        };
    }, [regla]);
}

// Uso interno de una librería
function Componente() {
    useCSS(".mi-clase { color: red; font-size: 16px; }");

    return <div className="mi-clase">Texto rojo</div>;
}
```

---

## Comparación de los tres efectos

|                          | `useInsertionEffect`         | `useLayoutEffect`            | `useEffect`                   |
| ------------------------ | ---------------------------- | ---------------------------- | ----------------------------- |
| **Cuándo corre**         | Antes de tocar el DOM        | Después de actualizar el DOM | Después de pintar             |
| **Acceso al DOM**        | No (aún no está actualizado) | Sí                           | Sí                            |
| **Uso principal**        | Inyectar estilos CSS         | Medir el DOM                 | Efectos secundarios generales |
| **Bloquea el navegador** | Sí                           | Sí                           | No                            |

---

## Limitaciones importantes

Dentro de `useInsertionEffect` **no puedes**:

```
❌ Leer ni escribir refs del DOM (aún no está actualizado)
❌ Actualizar el estado
❌ Acceder a los nodos del DOM actualizados
```

Solo debes usarlo para insertar nodos `<style>` o `<link>` en el `<head>`.

---

## Cuándo usar useInsertionEffect

```
✅ Autores de librerías CSS-in-JS que necesitan inyectar estilos dinámicos
✅ Insertar hojas de estilo antes de que React actualice el DOM

❌ No usar en código de aplicación normal
❌ No usar para manipular el DOM
❌ No usar como alternativa a useEffect o useLayoutEffect
```

> Este hook está pensado para un caso de uso muy específico: **autores de librerías CSS-in-JS**. En el código de aplicación normal nunca deberías necesitarlo. Si estás usando una librería como styled-components o Emotion, ella ya lo usa internamente por ti.
