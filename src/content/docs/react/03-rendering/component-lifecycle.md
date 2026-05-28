---
title: Component Lifecycle
---

Es el ciclo de vida de un componente: desde que aparece en pantalla hasta que desaparece. React ejecuta código en momentos concretos de ese ciclo.

## Las 3 fases

```
Montaje          Actualización        Desmontaje
   ↓                   ↓                  ↓
Aparece en        State o props        Desaparece
pantalla            cambian           del DOM
```

## useEffect

En componentes funcionales el ciclo de vida se maneja con el hook `useEffect`:

```jsx
useEffect(() => {
    // código a ejecutar
    return () => {
        // limpieza (opcional)
    };
}, [dependencias]);
```

## Montaje

Se ejecuta una vez cuando el componente aparece en el DOM:

```jsx
useEffect(() => {
    console.log("El componente se montó");
    // Aquí se hacen llamadas a APIs, suscripciones, etc.
}, []); // Array vacío = solo al montar
```

## Actualización

Se ejecuta cada vez que cambian las dependencias que le indiques:

```jsx
useEffect(() => {
    console.log("El contador cambió:", contador);
}, [contador]); // Se ejecuta cuando cambia "contador"
```

Sin array de dependencias se ejecuta en cada render:

```jsx
useEffect(() => {
    console.log("Esto corre en cada render");
}); // Sin array = siempre
```

## Desmontaje

La función que devuelves dentro del efecto se ejecuta cuando el componente desaparece. Sirve para limpiar suscripciones, timers, etc.:

```jsx
useEffect(() => {
    const intervalo = setInterval(() => {
        console.log("tick");
    }, 1000);

    return () => {
        clearInterval(intervalo); // Limpieza al desmontar
    };
}, []);
```

## Resumen de los 3 casos

```jsx
// Solo al montar
useEffect(() => { ... }, []);

// Al montar y cuando cambia "valor"
useEffect(() => { ... }, [valor]);

// En cada render
useEffect(() => { ... });

// Limpieza al desmontar
useEffect(() => {
  return () => { ... };
}, []);
```

## Ejemplo completo real

```jsx
function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        // Montaje: llamada a la API
        fetch("https://api.ejemplo.com/usuarios")
            .then((res) => res.json())
            .then((data) => setUsuarios(data));

        // Desmontaje: cancelar si fuera necesario
        return () => {
            console.log("Componente desmontado");
        };
    }, []); // Solo al montar

    return (
        <ul>
            {usuarios.map((u) => (
                <li key={u.id}>{u.nombre}</li>
            ))}
        </ul>
    );
}
```
