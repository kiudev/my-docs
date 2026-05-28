---
title: useLayoutEffect
---

## ¿Qué es?

Hook idéntico a `useEffect` en sintaxis, pero se ejecuta **de forma síncrona después de que React actualiza el DOM y antes de que el navegador pinte la pantalla**.

```jsx
useLayoutEffect(() => {
    // efecto
    return () => {
        // limpieza (opcional)
    };
}, [dependencias]);
```

---

## Diferencia con useEffect

El orden de ejecución en cada render es:

```
1. React actualiza el DOM
2. useLayoutEffect corre         ← antes de pintar
3. El navegador pinta la pantalla
4. useEffect corre               ← después de pintar
```

Con `useEffect` el usuario puede ver un flash del estado anterior antes de que el efecto corrija algo. Con `useLayoutEffect` el cambio ocurre antes de que el navegador muestre nada, evitando ese parpadeo.

---

## Cuándo usarlo

### Medir el DOM antes de pintar

El caso más común: leer dimensiones o posiciones de un elemento y usarlas para ajustar el layout:

```jsx
function Tooltip({ texto, anchorRef }) {
    const tooltipRef = useRef(null);
    const [posicion, setPosicion] = useState({ top: 0, left: 0 });

    useLayoutEffect(() => {
        const anchor = anchorRef.current.getBoundingClientRect();
        const tooltip = tooltipRef.current.getBoundingClientRect();

        setPosicion({
            top: anchor.top - tooltip.height - 8,
            left: anchor.left + anchor.width / 2 - tooltip.width / 2,
        });
    }, []);

    return (
        <div
            ref={tooltipRef}
            style={{
                position: "fixed",
                top: posicion.top,
                left: posicion.left,
            }}
        >
            {texto}
        </div>
    );
}
```

Si usaras `useEffect` aquí, el tooltip aparecería primero en la posición incorrecta y luego saltaría a la correcta, causando un parpadeo visible.

### Animaciones que dependen del tamaño del DOM

```jsx
function Animacion({ visible }) {
    const ref = useRef(null);

    useLayoutEffect(() => {
        if (visible) {
            const altura = ref.current.scrollHeight;
            ref.current.style.height = `${altura}px`;
        } else {
            ref.current.style.height = "0px";
        }
    }, [visible]);

    return (
        <div
            ref={ref}
            style={{ overflow: "hidden", transition: "height 0.3s" }}
        >
            Contenido animado
        </div>
    );
}
```

---

## useEffect vs useLayoutEffect

|                          | `useEffect`         | `useLayoutEffect`               |
| ------------------------ | ------------------- | ------------------------------- |
| **Cuándo corre**         | Después de pintar   | Antes de pintar                 |
| **Bloquea el navegador** | No                  | Sí                              |
| **Riesgo de parpadeo**   | Sí                  | No                              |
| **Uso recomendado**      | La mayoría de casos | Solo cuando hay parpadeo visual |

---

## Cuándo usar useLayoutEffect

```
✅ Medir elementos del DOM (getBoundingClientRect, offsetHeight...)
✅ Posicionar elementos basándose en medidas del DOM
✅ Animaciones que necesitan el tamaño real del elemento
✅ Evitar un parpadeo visual causado por useEffect

❌ No usar por defecto, useEffect cubre la mayoría de casos
❌ No usar para llamadas a APIs o suscripciones
❌ Evitar en SSR: useLayoutEffect no funciona en el servidor
```

---

## Advertencia con SSR

`useLayoutEffect` lanza un warning en Server Side Rendering (Next.js, por ejemplo) porque no existe DOM en el servidor. En esos casos usa `useEffect` o condiciona la ejecución:

```jsx
// Opción 1: usar useEffect si no hay problema de parpadeo en tu caso
useEffect(() => { ... }, []);

// Opción 2: hook personalizado que usa el apropiado según el entorno
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

> La regla general: empieza siempre con `useEffect`. Migra a `useLayoutEffect` solo si ves un parpadeo visual que necesitas eliminar.
