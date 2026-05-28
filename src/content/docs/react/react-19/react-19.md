---
title: React 19
---

# React v19

**5 de diciembre de 2024 — The React Team**

React v19 ya está disponible en npm.

---

## Novedades en React 19

### Actions

Un caso de uso común en apps React es realizar una mutación de datos y luego actualizar el estado. Antes había que manejar manualmente los estados de carga, errores, actualizaciones optimistas y peticiones secuenciales:

```jsx
// Antes de Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    }
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

En React 19 se añade soporte para funciones async en transiciones. Por convención, las funciones que usan transiciones async se llaman **Actions**:

```jsx
// Usando Actions con useTransition
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      }
      redirect("/path");
    });
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

Las Actions gestionan automáticamente:

- **Estado pendiente** — arranca al inicio de la petición y se resetea al confirmar el estado final
- **Actualizaciones optimistas** — mediante el nuevo hook `useOptimistic`
- **Manejo de errores** — muestra Error Boundaries si falla y revierte actualizaciones optimistas
- **Formularios** — los elementos `<form>` ahora aceptan funciones en las props `action` y `formAction`

---

### Nuevo hook: `useActionState`

Simplifica los casos más comunes de las Actions:

```jsx
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      return error;
    }
    return null;
  },
  null,
);
```

Recibe una función (la Action) y devuelve una Action envuelta, el último resultado como `data` y el estado pendiente como `pending`.

> Anteriormente se llamaba `ReactDOM.useFormState` en las versiones Canary. Ha sido renombrado y `useFormState` queda deprecado.

El ejemplo anterior con `useActionState` y `<form>` Actions queda así:

```jsx
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

---

### React DOM: `<form>` Actions

Se añade soporte para pasar funciones como props `action` y `formAction` en `<form>`, `<input>` y `<button>`. Los formularios se resetean automáticamente al enviarse con éxito:

```jsx
<form action={actionFunction}>
```

---

### Nuevo hook: `useFormStatus`

Permite a componentes de sistemas de diseño acceder al estado del formulario padre sin necesidad de prop drilling:

```jsx
import { useFormStatus } from 'react-dom';

function DesignButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} />;
}
```

---

### Nuevo hook: `useOptimistic`

Muestra el estado final de forma optimista mientras la petición async está en curso. Si la actualización falla, React revierte automáticamente al valor original:

```jsx
function ChangeName({ currentName, onUpdateName }) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <input type="text" name="name" disabled={currentName !== optimisticName} />
    </form>
  );
}
```

---

### Nueva API: `use`

Nueva API para leer recursos durante el render. Puede leer promesas (suspende hasta que se resuelven) y contextos (incluso condicionalmente):

```jsx
import { use } from 'react';

// Leer una promesa
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

// Leer un contexto condicionalmente
function Heading({ children }) {
  if (children == null) return null;

  // Funciona aunque haya un early return antes
  const theme = use(ThemeContext);
  return <h1 style={{ color: theme.color }}>{children}</h1>;
}
```

> `use` puede llamarse condicionalmente, a diferencia de los hooks. Las promesas pasadas a `use` no deben crearse durante el render.

---

## Nuevas APIs estáticas de React DOM

Se añaden dos nuevas APIs en `react-dom/static` para generación de sitios estáticos:

- `prerender`
- `prerenderToNodeStream`

Mejoran `renderToString` esperando a que los datos se carguen antes de generar el HTML estático:

```jsx
import { prerender } from 'react-dom/static';

async function handler(request) {
  const { prelude } = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

---

## React Server Components

### Server Components

Permiten renderizar componentes por adelantado, antes del bundling, en un entorno separado del cliente. Pueden ejecutarse una vez en tiempo de build o en cada petición. React 19 incluye todas las funcionalidades de Server Components del canal Canary.

### Server Actions

Permiten a los Client Components llamar funciones async que se ejecutan en el servidor. Se definen con la directiva `"use server"`:

```jsx
// En un Server Component o archivo de servidor
"use server";

export async function updateUser(formData) {
  // lógica del servidor
}
```

> La directiva `"use server"` es para Server Actions, no para Server Components. Los Server Components no tienen directiva propia.

---

## Mejoras en React 19

### `ref` como prop

Los componentes funcionales ya pueden recibir `ref` como prop directamente. `forwardRef` ya no es necesario:

```jsx
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />;
}

// Uso
<MyInput ref={ref} />
```

> En versiones futuras `forwardRef` será deprecado y eliminado.

---

### `<Context>` como provider

Ya no es necesario usar `<Context.Provider>`. Se puede usar el contexto directamente:

```jsx
const ThemeContext = createContext('');

function App({ children }) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );
}
```

> En versiones futuras `<Context.Provider>` será deprecado.

---

### Funciones de limpieza en refs

Los callbacks de ref ahora pueden devolver una función de limpieza que se ejecuta al desmontar el componente:

```jsx
<input
  ref={(ref) => {
    // ref creada

    return () => {
      // limpieza al desmontar
    };
  }}
/>
```

---

### `useDeferredValue` con valor inicial

Se añade la opción `initialValue` para el primer render:

```jsx
function Search({ deferredValue }) {
  // En el render inicial devuelve ''
  // Luego programa un re-render con deferredValue
  const value = useDeferredValue(deferredValue, '');

  return <Results query={value} />;
}
```

---

### Soporte nativo para metadatos del documento

Las etiquetas `<title>`, `<link>` y `<meta>` dentro de componentes se elevan automáticamente al `<head>` del documento:

```jsx
function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>Contenido del artículo...</p>
    </article>
  );
}
```

---

### Soporte para hojas de estilo

React 19 gestiona el orden de inserción de estilos en el DOM mediante la prop `precedence`:

```jsx
<link rel="stylesheet" href="foo" precedence="default" />
<link rel="stylesheet" href="bar" precedence="high" />
```

Si el mismo stylesheet se renderiza desde varios componentes, React lo incluye una sola vez en el documento.

---

### Soporte para scripts async

Los scripts async pueden colocarse en cualquier parte del árbol de componentes. React los deduplica automáticamente:

```jsx
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  );
}
```

---

### APIs de precarga de recursos

Nuevas APIs para optimizar la carga de recursos:

```jsx
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom';

function MyComponent() {
  preinit('https://.../script.js', { as: 'script' });
  preload('https://.../font.woff', { as: 'font' });
  preload('https://.../stylesheet.css', { as: 'style' });
  prefetchDNS('https://...');
  preconnect('https://...');
}
```

---

### Mejor reporte de errores

Los errores de hidratación ahora muestran un único mensaje con un diff del mismatch en lugar de múltiples errores duplicados.

Se añaden dos nuevas opciones en `createRoot` y `hydrateRoot`:

- `onCaughtError` — cuando React captura un error en un Error Boundary
- `onUncaughtError` — cuando un error no es capturado por ningún Error Boundary
- `onRecoverableError` — cuando un error se lanza y se recupera automáticamente

---

### Soporte para Custom Elements

React 19 añade soporte completo para custom elements:

- **SSR**: las props de tipo primitivo se renderizan como atributos; las de tipo objeto, función o `false` se omiten
- **CSR**: las props que coinciden con una propiedad del custom element se asignan como propiedades; el resto como atributos

---

## Cómo actualizar

Consulta la [guía de actualización a React 19](https://es.react.dev/blog/2024/04/25/react-19-upgrade-guide) para instrucciones paso a paso y la lista completa de cambios.
