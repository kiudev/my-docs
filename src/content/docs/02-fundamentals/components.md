---
title: Componentes
---

Los **componentes** en React son funciones de JavaScript que devuelven JSX. Representan una pieza de la UI, pueden ser tan pequeños como un botón o tan grandes como una página entera.

### Tipos

Hoy en día React usa componentes funcionales. Los de clase son legacy y ya no se recomiendan.

```jsx
// ✅ Funcional (actual)
function Boton() {
    return <button>Click</button>;
}

// ❌ De clase (legacy)
class Boton extends React.Component {
    render() {
        return <button>Click</button>;
    }
}
```

### Reglas importantes

1. El nombre siempre en mayúscula, si no React lo interpreta como etiqueta HTML:

```jsx
// ❌ React lo trata como etiqueta HTML desconocida
function boton() { ... }

// ✅ React lo trata como componente
function Boton() { ... }
```

2. Siempre debe devolver algo, ya sea JSX o null:

```jsx
function Mensaje({ visible }) {
    if (!visible) return null;
    return <p>Soy visible</p>;
}
```

### Composición
Los componentes se pueden anidar unos dentro de otros. Esta es la idea central de React: construir UIs complejas combinando piezas simples.

```jsx
function Avatar() {
  return <img src="foto.jpg" />;
}

function Tarjeta() {
  return (
    <div>
      <Avatar />
      <p>Ana García</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <Tarjeta />
      <Tarjeta />
      <Tarjeta />
    </div>
  );
}
```
