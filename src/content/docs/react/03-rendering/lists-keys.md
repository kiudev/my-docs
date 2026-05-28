---
title: List and Keys
---

## Renderizar listas

En React se renderizan listas usando el método `.map()` de JavaScript, que transforma un array de datos en un array de elementos JSX:

```jsx
const frutas = ["Manzana", "Pera", "Naranja"];

function Lista() {
    return (
        <ul>
            {frutas.map((fruta) => (
                <li>{fruta}</li>
            ))}
        </ul>
    );
}
```

---

## Keys

Al renderizar listas React necesita una `key` en cada elemento para identificarlos de forma única. Sin ella React no sabe qué elemento cambió, se añadió o se eliminó.

```jsx
function Lista() {
    return (
        <ul>
            {frutas.map((fruta) => (
                <li key={fruta}>{fruta}</li>
            ))}
        </ul>
    );
}
```

> La `key` debe ser única entre hermanos, no globalmente en toda la app.

---

## ¿Qué usar como key?

Lo ideal es usar un **identificador único y estable** de los datos:

```jsx
// ✅ ID de base de datos, siempre único y estable
{
    usuarios.map((usuario) => <li key={usuario.id}>{usuario.nombre}</li>);
}

// ⚠️ El propio valor, solo si no hay duplicados
{
    frutas.map((fruta) => <li key={fruta}>{fruta}</li>);
}

// ❌ El índice del array, evitar si la lista puede cambiar de orden
{
    frutas.map((fruta, index) => <li key={index}>{fruta}</li>);
}
```

### ¿Por qué evitar el índice?

Si el array se reordena o se eliminan elementos, los índices cambian y React asocia mal los elementos con su estado anterior, causando bugs difíciles de detectar.

---

## Listas de objetos

El caso más frecuente en aplicaciones reales:

```jsx
const usuarios = [
    { id: 1, nombre: "Ana", rol: "Admin" },
    { id: 2, nombre: "Luis", rol: "Editor" },
    { id: 3, nombre: "María", rol: "Viewer" },
];

function ListaUsuarios() {
    return (
        <ul>
            {usuarios.map((usuario) => (
                <li key={usuario.id}>
                    {usuario.nombre} — {usuario.rol}
                </li>
            ))}
        </ul>
    );
}
```

---

## Extraer el componente de cada item

Cuando el item es complejo, lo habitual es extraerlo a su propio componente. La `key` va en el componente, no dentro de él:

```jsx
function TarjetaUsuario({ usuario }) {
    return (
        <div>
            <h3>{usuario.nombre}</h3>
            <p>{usuario.rol}</p>
        </div>
    );
}

function ListaUsuarios({ usuarios }) {
    return (
        <div>
            {usuarios.map((usuario) => (
                <TarjetaUsuario key={usuario.id} usuario={usuario} /> // key aquí
            ))}
        </div>
    );
}
```

> La `key` nunca es accesible como prop dentro del componente hijo. Si la necesitas, pásala como otra prop.

---

## Filtrar y ordenar antes de renderizar

Se puede combinar `.filter()` y `.sort()` con `.map()`:

```jsx
function ListaActivos({ usuarios }) {
    return (
        <ul>
            {usuarios
                .filter((u) => u.activo)
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((u) => (
                    <li key={u.id}>{u.nombre}</li>
                ))}
        </ul>
    );
}
```

---

## Listas vacías

Siempre conviene manejar el caso de lista vacía:

```jsx
function Lista({ items }) {
    if (items.length === 0) {
        return <p>No hay elementos que mostrar.</p>;
    }

    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}>{item.nombre}</li>
            ))}
        </ul>
    );
}
```

---

## Resumen

| Concepto                    | Detalle                             |
| --------------------------- | ----------------------------------- |
| **Método para renderizar**  | `.map()`                            |
| **Key ideal**               | ID único de los datos               |
| **Evitar**                  | Índice del array si la lista cambia |
| **Dónde poner la key**      | En el elemento raíz del `.map()`    |
| **Key accesible como prop** | No, es interna de React             |
