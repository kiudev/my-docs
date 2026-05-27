---
title: useEffect
---

## ¿Qué es?

Hook para ejecutar efectos secundarios en un componente. Un efecto secundario es cualquier cosa que ocurre fuera del renderizado: llamadas a APIs, suscripciones, timers, manipulación del DOM, etc.

```jsx
useEffect(() => {
  // efecto
  return () => {
    // limpieza (opcional)
  };
}, [dependencias]);
```

---

## Las tres formas según las dependencias

### Sin array — se ejecuta en cada render
```jsx
useEffect(() => {
  console.log("Corre después de cada render");
});
```

### Array vacío — solo al montar
```jsx
useEffect(() => {
  console.log("Corre solo al montar el componente");
}, []);
```

### Con dependencias — cuando cambian los valores indicados
```jsx
useEffect(() => {
  console.log("Corre cuando cambia 'query'");
}, [query]);
```

---

## Limpieza

La función que devuelves se ejecuta antes de que el efecto vuelva a correr y cuando el componente se desmonta. Sirve para cancelar suscripciones, limpiar timers, abortar fetch, etc.:

```jsx
useEffect(() => {
  const intervalo = setInterval(() => {
    setTiempo(prev => prev + 1);
  }, 1000);

  return () => clearInterval(intervalo); // Limpieza
}, []);
```

---

## Casos de uso frecuentes

### Llamada a una API
```jsx
useEffect(() => {
  fetch("/api/usuarios")
    .then(res => res.json())
    .then(data => setUsuarios(data));
}, []);
```

### Llamada a API con dependencia
```jsx
useEffect(() => {
  fetch(`/api/usuarios/${id}`)
    .then(res => res.json())
    .then(data => setUsuario(data));
}, [id]); // Se vuelve a ejecutar cuando cambia id
```

### Suscripción a un evento
```jsx
useEffect(() => {
  function handleResize() {
    setAncho(window.innerWidth);
  }

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize); // Limpieza
}, []);
```

### Actualizar el título del documento
```jsx
useEffect(() => {
  document.title = `${mensajes} mensajes sin leer`;
}, [mensajes]);
```

---

## Cancelar fetch con AbortController

Evita actualizar el estado si el componente se desmonta antes de que llegue la respuesta:

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/usuarios/${id}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setUsuario(data))
    .catch(err => {
      if (err.name === "AbortError") return; // Ignorar si fue cancelado
      setError(err);
    });

  return () => controller.abort(); // Cancela el fetch al desmontar
}, [id]);
```

---

## Async dentro de useEffect

`useEffect` no puede ser async directamente. Define la función async dentro:

```jsx
// ❌ Incorrecto
useEffect(async () => {
  const data = await fetch("/api/datos");
}, []);

// ✅ Correcto
useEffect(() => {
  async function cargarDatos() {
    const res = await fetch("/api/datos");
    const data = await res.json();
    setDatos(data);
  }

  cargarDatos();
}, []);
```

---

## Dependencias

### Qué incluir
Toda variable del componente que se use dentro del efecto debe estar en el array de dependencias:

```jsx
// ❌ userId se usa pero no está en dependencias
useEffect(() => {
  fetch(`/api/usuarios/${userId}`);
}, []);

// ✅ Correcto
useEffect(() => {
  fetch(`/api/usuarios/${userId}`);
}, [userId]);
```

### Dependencias estables
Las funciones y objetos creados dentro del componente cambian en cada render. Si los usas como dependencia, el efecto se ejecutará siempre. Soluciones:

```jsx
// ❌ options es un objeto nuevo en cada render → efecto infinito
const options = { method: "POST" };
useEffect(() => {
  fetch("/api", options);
}, [options]);

// ✅ Mover el objeto dentro del efecto
useEffect(() => {
  const options = { method: "POST" };
  fetch("/api", options);
}, []);

// ✅ O usar useMemo / useCallback para estabilizarlo
```

---

## Errores comunes

### Bucle infinito
```jsx
// ❌ setData actualiza el estado → re-render → efecto corre → setData...
useEffect(() => {
  setData(calcular());
}); // Sin dependencias = cada render

// ✅ Añadir dependencias correctas
useEffect(() => {
  setData(calcular());
}, []); // Solo al montar
```

### Olvidar la limpieza
```jsx
// ❌ El listener se acumula en cada render
useEffect(() => {
  window.addEventListener("click", handleClick);
}); // Sin limpieza ni dependencias

// ✅ Con limpieza
useEffect(() => {
  window.addEventListener("click", handleClick);
  return () => window.removeEventListener("click", handleClick);
}, []);
```

---

## Resumen

| Dependencias | Cuándo corre |
|---|---|
| Sin array | Después de cada render |
| `[]` | Solo al montar |
| `[a, b]` | Al montar y cuando cambia `a` o `b` |
| Función de retorno | Antes del siguiente efecto y al desmontar |
