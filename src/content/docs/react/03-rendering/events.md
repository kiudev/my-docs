---
title: Events
---

Son las interacciones del usuario con la UI: clicks, teclas, movimientos del ratón, cambios en inputs, etc. React los maneja con eventos sintéticos, una capa por encima de los eventos nativos del navegador que normaliza el comportamiento entre navegadores.

## Sintaxis básica

```jsx
function Boton() {
    function handleClick() {
        console.log("Click!");
    }

    return <button onClick={handleClick}>Pulsar</button>;
}
```

> Se pasa la referencia a la función, no la llamada:

```jsx
// ❌ Esto la ejecuta al renderizar, no al hacer click
<button onClick={handleClick()}>

// ✅ Esto la ejecuta al hacer click
<button onClick={handleClick}>
```

### El objeto event

React te pasa automáticamente el objeto evento con información del evento:

```jsx
function Input() {
    function handleChange(e) {
        console.log(e.target.value); // valor del input
        console.log(e.target.name); // nombre del input
    }

    return <input onChange={handleChange} />;
}
```

### Eventos más comunes

| Evento                          | Cuándo se dispara                  |
| ------------------------------- | ---------------------------------- |
| `onClick`                       | Click del ratón                    |
| `onChange`                      | Cambio en input, select, textarea` |
| `onSubmit`                      | Envío de formulario                |
| `onKeyDown` / `onKeyUp`         | Tecla pulsada / soltada            |
| `onFocus` / `onBlur`            | Foco ganado / perdido              |
| `onMouseEnter` / `onMouseLeave` | Ratón entra / sale                 |

### Pasar argumentos a un handler

Si necesitas pasar datos extra, usa una función flecha:

```jsx
function Lista() {
    function handleClick(id) {
        console.log("ID seleccionado:", id);
    }

    return (
        <ul>
            <li onClick={() => handleClick(1)}>Item 1</li>
            <li onClick={() => handleClick(2)}>Item 2</li>
        </ul>
    );
}
```

### Detener comportamiento por defecto

Algunos elementos HTML tienen comportamiento nativo que a veces quieres evitar:

```jsx
function Formulario() {
    function handleSubmit(e) {
        e.preventDefault(); // Evita que recargue la página
        console.log("Formulario enviado");
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">Enviar</button>
        </form>
    );
}
```

### Propagación de eventos

Los eventos suben por el árbol de componentes (bubbling). Puedes detenerlo con stopPropagation:

```jsx
function Tarjeta() {
    return (
        <div onClick={() => console.log("Click en tarjeta")}>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // No llega al div
                    console.log("Click en botón");
                }}
            >
                Pulsar
            </button>
        </div>
    );
}
```
