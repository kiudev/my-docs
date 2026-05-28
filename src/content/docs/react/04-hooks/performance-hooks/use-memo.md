---
title: useMemo
---

## ¿Qué es?

Hook para **memorizar el resultado de un cálculo**. Solo recalcula cuando cambian las dependencias. Evita repetir operaciones costosas en cada render.

```jsx
const valorMemorizado = useMemo(() => calcular(a, b), [a, b]);
```

---

## El problema que resuelve

En React, cada vez que un componente se re-renderiza todo su código se vuelve a ejecutar. Si hay un cálculo costoso, se repite aunque los datos no hayan cambiado:

```jsx
function Componente({ lista, filtro }) {
  // ❌ Se recalcula en cada render aunque lista y filtro no hayan cambiado
  const listaFiltrada = lista.filter(item => item.includes(filtro));

  return <ul>{listaFiltrada.map(item => <li>{item}</li>)}</ul>;
}
```

---

## Solución con useMemo

```jsx
function Componente({ lista, filtro }) {
  // ✅ Solo recalcula cuando cambia lista o filtro
  const listaFiltrada = useMemo(
    () => lista.filter(item => item.includes(filtro)),
    [lista, filtro]
  );

  return <ul>{listaFiltrada.map(item => <li>{item}</li>)}</ul>;
}
```

---

## Ejemplos de uso

### Cálculo costoso
```jsx
function Estadisticas({ datos }) {
  const stats = useMemo(() => {
    return {
      total: datos.length,
      media: datos.reduce((a, b) => a + b, 0) / datos.length,
      maximo: Math.max(...datos),
      minimo: Math.min(...datos),
    };
  }, [datos]);

  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>Media: {stats.media}</p>
      <p>Máximo: {stats.maximo}</p>
      <p>Mínimo: {stats.minimo}</p>
    </div>
  );
}
```

### Estabilizar un objeto como dependencia
Si pasas un objeto como dependencia a `useEffect`, cambia en cada render y provoca ejecuciones infinitas. `useMemo` lo estabiliza:

```jsx
function Componente({ id }) {
  // ❌ options es un objeto nuevo en cada render
  const options = { id, modo: "detalle" };

  useEffect(() => {
    fetchDatos(options);
  }, [options]); // Se ejecuta siempre

  // ✅ options solo cambia cuando cambia id
  const options = useMemo(() => ({ id, modo: "detalle" }), [id]);

  useEffect(() => {
    fetchDatos(options);
  }, [options]); // Solo cuando cambia id
}
```

### Estabilizar props para evitar re-renders en hijos
Si un componente hijo está envuelto en `React.memo`, solo se re-renderiza cuando sus props cambian. Si le pasas un objeto sin memorizar, siempre será nuevo:

```jsx
const Lista = React.memo(function Lista({ config }) {
  return <ul>{config.items.map(i => <li key={i}>{i}</li>)}</ul>;
});

function Padre({ items, tema }) {
  // ❌ config es nuevo en cada render → Lista siempre se re-renderiza
  const config = { items, tema };

  // ✅ config solo cambia cuando cambia items o tema
  const config = useMemo(() => ({ items, tema }), [items, tema]);

  return <Lista config={config} />;
}
```

---

## Cuándo usar useMemo

```
✅ Cálculos costosos con arrays grandes (filtrar, ordenar, transformar)
✅ Estabilizar objetos que se usan como dependencias en useEffect
✅ Estabilizar props de componentes envueltos en React.memo

❌ No usar para cálculos simples, el overhead de useMemo puede ser mayor que el cálculo
❌ No usar por defecto en todo, solo cuando haya un problema real de rendimiento
```

---

## useMemo vs useCallback

Son muy similares pero memorizan cosas distintas:

```jsx
// useMemo → memoriza el RESULTADO de una función
const listaFiltrada = useMemo(() => lista.filter(fn), [lista]);

// useCallback → memoriza la FUNCIÓN en sí
const handleClick = useCallback(() => { ... }, []);
```

| | `useMemo` | `useCallback` |
|---|---|---|
| **Memoriza** | El valor resultante | La función |
| **Devuelve** | El resultado de ejecutar la función | La función sin ejecutar |
| **Uso** | Cálculos costosos | Funciones que se pasan como props |

---

## Nota sobre el rendimiento

`useMemo` tiene un coste propio: React necesita guardar el valor y comparar las dependencias en cada render. Usarlo en exceso puede empeorar el rendimiento en lugar de mejorarlo.

> Primero escribe el código sin optimizaciones. Solo añade `useMemo` si identificas un problema real de rendimiento con React DevTools.
