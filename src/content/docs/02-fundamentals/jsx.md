---
title: JSX
---

**JSX (JavaScript XML)** es una extensión de sintaxis de JavaScript. No es HTML, aunque se parece. El navegador no lo entiende directamente, por eso React lo transforma a JavaScript puro antes de ejecutarse (mediante Babel o el compilador de React).

### Diferencias con HTML

| HTML                   | JSX                    |
| ---------------------- | ---------------------- |
| `class`                | `className`            |
| `for`                  | `htmlFor`              |
| `onclick`              | `onClick`              |
| Atributos en minúscula | Atributos en camelCase |

```jsx
// HTML
<div class="caja" onclick="handleClick()"></div>

// JSX
<div className="caja" onClick={handleClick}></div>
```

### Reglas importantes

1. **Un solo elemento raíz** — todo debe estar envuelto en un contenedor:

```jsx
// ❌ Incorrecto
return (
  <h1>Título</h1>
  <p>Texto</p>
);

// ✅ Correcto
return (
  <div>
    <h1>Título</h1>
    <p>Texto</p>
  </div>
);

// ✅ También correcto (Fragment, no añade nodo al DOM)
return (
  <>
    <h1>Título</h1>
    <p>Texto</p>
  </>
);
```

2. **Etiquetas siempre cerradas**:

```jsx
// ❌ Incorrecto
<input>
<img>

// ✅ Correcto
<input />
<img />
```

3. **Expresiones JavaScript con llaves `{}`**:

```jsx
const precio = 99;
const activo = true;

return (
    <div>
        <p>Precio: {precio}€</p>
        <p>Estado: {activo ? "Activo" : "Inactivo"}</p>
    </div>
);
```

> #### Lo que NO puedes meter en {}
>
> Las llaves solo aceptan expresiones, no sentencias:
>
> ```jsx
> // ❌ No puedes usar if, for, while dentro de {}
> { if (activo) { ... } }
>
> // ✅ Sí puedes usar ternarios u operadores lógicos
> { activo ? <p>Activo</p> : <p>Inactivo</p> }
> { activo && <p>Activo</p> }
> ```
