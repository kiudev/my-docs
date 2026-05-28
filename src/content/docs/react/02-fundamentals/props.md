---
title: Props
---

Las **props** son los parámetros que le pasas a un componente desde fuera. Fluyen siempre en una dirección: de padre a hijo. Un componente no puede modificar sus propias props.

## Sintaxis básica

```jsx
// Definir el componente recibiendo props
function Tarjeta({ titulo, descripcion }) {
    return (
        <div>
            <h2>{titulo}</h2>
            <p>{descripcion}</p>
        </div>
    );
}

// Usar el componente pasándole props
<Tarjeta titulo="React" descripcion="Una biblioteca de JavaScript" />;
```

## Qué puedes pasar como prop

Cualquier tipo de dato de JavaScript:

```jsx
<Componente
    texto="hola" // string
    numero={42} // número
    activo={true} // booleano
    lista={[1, 2, 3]} // array
    objeto={{ edad: 25 }} // objeto
    funcion={handleClick} // función
/>
```

> Los strings se pasan con "", el resto siempre con {}

## Props por defecto

Si no te pasan una prop puedes definir un valor por defecto:

```jsx
function Boton({ texto = "Click aquí", color = "azul" }) {
  return <button style={{ color }}>{texto}</button>;
}

// Sin props → usa los valores por defecto
<Boton />

// Con props → sobreescribe los valores
<Boton texto="Enviar" color="rojo" />
```

## La prop especial: `children`

Es el contenido que se pone entre las etiquetas del componente:

```jsx
function Contenedor({ children }) {
    return <div className="caja">{children}</div>;
}

// Uso
<Contenedor>
    <h1>Título</h1>
    <p>Cualquier contenido aquí</p>
</Contenedor>;
```

## Flujo unidireccional

Las props solo bajan, nunca suben. Si un hijo necesita comunicarse con el padre, se le pasa una función como prop:

```jsx
function Padre() {
    function handleClick() {
        console.log("El hijo hizo click");
    }

    return <Hijo onClick={handleClick} />;
}

function Hijo({ onClick }) {
    return <button onClick={onClick}>Soy el hijo</button>;
}
```
