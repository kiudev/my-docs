---
title: Forms
---

## ¿Qué son los formularios en React?

React maneja los formularios de forma diferente al HTML tradicional. En HTML, el formulario mantiene su propio estado interno. En React, el estado lo controla el componente mediante `useState`. A esto se le llama **componente controlado**.

---

## Componente controlado

El valor del input siempre viene del estado de React:

```jsx
function Formulario() {
  const [nombre, setNombre] = useState("");

  return (
    <input
      value={nombre}
      onChange={e => setNombre(e.target.value)}
    />
  );
}
```

> El flujo es: usuario escribe → `onChange` dispara → `setNombre` actualiza el estado → React re-renderiza con el nuevo valor

---

## Tipos de inputs

### Input de texto
```jsx
const [texto, setTexto] = useState("");

<input
  type="text"
  value={texto}
  onChange={e => setTexto(e.target.value)}
/>
```

### Textarea
```jsx
const [descripcion, setDescripcion] = useState("");

<textarea
  value={descripcion}
  onChange={e => setDescripcion(e.target.value)}
/>
```

### Select
```jsx
const [opcion, setOpcion] = useState("react");

<select value={opcion} onChange={e => setOpcion(e.target.value)}>
  <option value="react">React</option>
  <option value="vue">Vue</option>
  <option value="angular">Angular</option>
</select>
```

### Checkbox
```jsx
const [aceptado, setAceptado] = useState(false);

<input
  type="checkbox"
  checked={aceptado}
  onChange={e => setAceptado(e.target.checked)} // .checked, no .value
/>
```

### Radio
```jsx
const [color, setColor] = useState("rojo");

<>
  <input
    type="radio"
    value="rojo"
    checked={color === "rojo"}
    onChange={e => setColor(e.target.value)}
  /> Rojo

  <input
    type="radio"
    value="azul"
    checked={color === "azul"}
    onChange={e => setColor(e.target.value)}
  /> Azul
</>
```

---

## Formulario completo con onSubmit

```jsx
function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault(); // Evita recargar la página
    console.log("Datos enviados:", form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Contraseña"
      />
      <button type="submit">Registrarse</button>
    </form>
  );
}
```

> Con `[e.target.name]` un solo handler gestiona todos los inputs usando el atributo `name`

---

## Validación

React no tiene validación integrada, se hace manualmente:

```jsx
function Formulario() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("El email no es válido");
      return;
    }

    setError("");
    console.log("Enviado:", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

## Componente no controlado

En casos puntuales puedes dejar que el DOM maneje el estado y leerlo con una `ref`:

```jsx
function Formulario() {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

> Los no controlados se usan poco. La mayoría de casos usan componentes controlados.

---

## Controlado vs No controlado

| | Controlado | No controlado |
|---|---|---|
| **Estado en** | React (`useState`) | El DOM |
| **Acceso al valor** | `value` del estado | `ref.current.value` |
| **Validación** | Fácil, en tiempo real | Solo al enviar |
| **Uso recomendado** | La mayoría de casos | Integraciones con librerías externas |
