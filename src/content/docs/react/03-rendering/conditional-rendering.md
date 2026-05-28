---
title: Conditional Rendering
---

## ¿Qué es?

Renderizar un componente u otro, o nada, dependiendo de una condición. En React no hay una sintaxis especial, se usan directamente los mecanismos de JavaScript.

---

## Formas de hacerlo

### 1. Ternario

La más usada, para elegir entre dos opciones:

```jsx
function Sesion({ logueado }) {
    return <div>{logueado ? <p>Bienvenido</p> : <p>Inicia sesión</p>}</div>;
}
```

### 2. Operador `&&`

Cuando solo quieres mostrar algo o nada:

```jsx
function Notificaciones({ cantidad }) {
    return <div>{cantidad > 0 && <p>Tienes {cantidad} notificaciones</p>}</div>;
}
```

> ⚠️ Cuidado con valores `0`: `{0 && <p>...</p>}` renderiza el `0` en pantalla. Mejor usar `{cantidad > 0 && ...}`

### 3. If fuera del JSX

Para lógica más compleja:

```jsx
function Mensaje({ estado }) {
    if (estado === "cargando") return <p>Cargando...</p>;
    if (estado === "error") return <p>Algo salió mal</p>;

    return <p>Datos cargados</p>;
}
```

### 4. Variable

Cuando la condición afecta a una parte grande del JSX:

```jsx
function Panel({ esAdmin }) {
    let contenido;

    if (esAdmin) {
        contenido = <AdminPanel />;
    } else {
        contenido = <UsuarioPanel />;
    }

    return <div>{contenido}</div>;
}
```

---

## Cuándo usar cada uno

| Caso                  | Solución           |
| --------------------- | ------------------ |
| Mostrar A o B         | Ternario `? :`     |
| Mostrar algo o nada   | `&&`               |
| Múltiples condiciones | `if` fuera del JSX |
| Bloque grande de JSX  | Variable           |
