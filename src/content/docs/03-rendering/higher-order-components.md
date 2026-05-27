---
title: Higher Order Components
---

## ¿Qué son?

Un Higher Order Component es una **función que recibe un componente y devuelve un nuevo componente** con funcionalidad añadida. Es un patrón de composición para reutilizar lógica entre componentes.

```jsx
const ComponenteMejorado = miHOC(ComponenteOriginal);
```

No es una feature de React, es un patrón derivado de las funciones de orden superior de JavaScript.

---

## El problema que resuelve

Igual que render props, evita duplicar lógica. Si varios componentes necesitan lo mismo (autenticación, logging, permisos, loading states...) se extrae a un HOC:

```jsx
// ❌ Lógica de autenticación duplicada
function Perfil() {
    if (!usuario) return <Redirect to="/login" />;
    return <div>Perfil</div>;
}

function Dashboard() {
    if (!usuario) return <Redirect to="/login" />;
    return <div>Dashboard</div>;
}
```

---

## Estructura básica

Por convención los HOCs se nombran con el prefijo `with`:

```jsx
function withAutenticacion(Componente) {
    return function ComponenteProtegido(props) {
        const usuario = obtenerUsuario();

        if (!usuario) {
            return <p>Acceso denegado. Inicia sesión.</p>;
        }

        return <Componente {...props} usuario={usuario} />;
    };
}

// Uso
const PerfilProtegido = withAutenticacion(Perfil);
const DashboardProtegido = withAutenticacion(Dashboard);
```

> `{...props}` es fundamental: pasa todas las props originales al componente envuelto para no romper su comportamiento.

---

## Ejemplo real: HOC de loading

```jsx
function withLoading(Componente) {
    return function ComponenteConLoading({ isLoading, ...props }) {
        if (isLoading) return <p>Cargando...</p>;
        return <Componente {...props} />;
    };
}

// Componente base
function ListaUsuarios({ usuarios }) {
    return (
        <ul>
            {usuarios.map((u) => (
                <li key={u.id}>{u.nombre}</li>
            ))}
        </ul>
    );
}

// Componente mejorado
const ListaConLoading = withLoading(ListaUsuarios);

// Uso
<ListaConLoading isLoading={cargando} usuarios={datos} />;
```

---

## Ejemplo real: HOC de logging

```jsx
function withLogging(Componente) {
    return function ComponenteConLog(props) {
        useEffect(() => {
            console.log(`${Componente.name} montado`);
            return () => console.log(`${Componente.name} desmontado`);
        }, []);

        return <Componente {...props} />;
    };
}

const BotonConLog = withLogging(Boton);
```

---

## Componer varios HOCs

Los HOCs se pueden anidar, aunque puede volverse difícil de leer:

```jsx
const Componente = withAutenticacion(withLoading(withLogging(MiComponente)));
```

Para mejorar la legibilidad se suele usar una función `compose`:

```jsx
const compose =
    (...hocs) =>
    (Componente) =>
        hocs.reduceRight((comp, hoc) => hoc(comp), Componente);

const Componente = compose(
    withAutenticacion,
    withLoading,
    withLogging,
)(MiComponente);
```

---

## Reglas importantes

**1. No mutates el componente original**, siempre devuelve uno nuevo:

```jsx
// ❌ Incorrecto
function withAlgo(Componente) {
  Componente.prototype.algoNuevo = ...; // Mutación
  return Componente;
}

// ✅ Correcto
function withAlgo(Componente) {
  return function NuevoComponente(props) {
    return <Componente {...props} />;
  };
}
```

**2. Pasa siempre las props con spread:**

```jsx
// ❌ Las props originales se pierden
return <Componente />;

// ✅ Las props originales se mantienen
return <Componente {...props} />;
```

**3. Asigna un displayName para facilitar el debugging:**

```jsx
function withAlgo(Componente) {
    function NuevoComponente(props) {
        return <Componente {...props} />;
    }

    NuevoComponente.displayName = `withAlgo(${Componente.displayName || Componente.name})`;

    return NuevoComponente;
}
```

---

## HOC vs Custom Hook vs Render Props

|                     | HOC                  | Custom Hook | Render Props         |
| ------------------- | -------------------- | ----------- | -------------------- |
| **Comparte lógica** | Sí                   | Sí          | Sí                   |
| **Añade props**     | Sí                   | No          | Sí                   |
| **Legibilidad**     | Puede anidarse mucho | Muy limpio  | Puede anidarse mucho |
| **Uso actual**      | Legacy / librerías   | Preferido   | Menos frecuente      |

---

## Cuándo usar HOCs hoy

- Librerías que aún los usan (Redux `connect`, React Router `withRouter`)
- Cuando necesitas envolver un componente con JSX adicional
- Al trabajar con código anterior a hooks

> En código nuevo, preferir custom hooks. Son más simples, más fáciles de tipar con TypeScript y no añaden niveles extra al árbol de componentes.
