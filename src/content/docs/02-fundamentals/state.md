---
title: State
---

El **state** es la memoria interna de un componente. A diferencia de las props, el state es privado y el propio componente lo controla. Cuando cambia, React vuelve a renderizar el componente automáticamente.

### useState

Es el hook básico para manejar estado:

```jsx
import { useState } from "react";

const [valor, setValor] = useState(valorInicial);
```

- valor → el dato actual
- setValor → la función para actualizarlo
- valorInicial → el valor con el que arranca

### Ejemplo básico

```jsx
function Contador() {
    const [cuenta, setCuenta] = useState(0);

    return (
        <div>
            <p>Clicks: {cuenta}</p>
            <button onClick={() => setCuenta(cuenta + 1)}>Sumar</button>
            <button onClick={() => setCuenta(cuenta - 1)}>Restar</button>
        </div>
    );
}
```

### Reglas importantes

1. Nunca mutes el estado directamente, siempre usa la función setter:

```jsx
// ❌ Incorrecto
cuenta = cuenta + 1;

// ✅ Correcto
setCuenta(cuenta + 1);
```

2. Si el nuevo estado depende del anterior, usa una función:

```jsx
// ❌ Puede dar problemas en actualizaciones rápidas
setCuenta(cuenta + 1);

// ✅ Siempre correcto
setCuenta((prev) => prev + 1);
```

3. Con objetos, siempre crea uno nuevo:

```jsx
const [usuario, setUsuario] = useState({ nombre: "Ana", edad: 25 });

// ❌ Incorrecto
usuario.nombre = "Luis";

// ✅ Correcto, spread para copiar y luego sobreescribir
setUsuario({ ...usuario, nombre: "Luis" });
```

### Múltiples estados

Puedes tener tantos useState como necesites:

```jsx
function Formulario() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [activo, setActivo] = useState(false);

    return (
        <div>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={() => setActivo(!activo)}>
                {activo ? "Desactivar" : "Activar"}
            </button>
        </div>
    );
}
```
