---
title: React Testing Library
---

## ¿Qué es?

React Testing Library (RTL) es una librería de utilidades para testear componentes React. Su filosofía es testear los componentes como lo haría un usuario: buscando elementos por su texto, rol o etiqueta, no por detalles de implementación como clases CSS o nombres de componentes.

> "Cuanto más se parezcan tus tests al uso real del software, más confianza te darán."
> — Kent C. Dodds, creador de RTL

---

## Instalación

```bash
npm install --save-dev @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

---

## render

Renderiza un componente en un DOM virtual y devuelve utilidades para interactuar con él:

```jsx
import { render, screen } from "@testing-library/react";
import Saludo from "./Saludo";

it("muestra el saludo correctamente", () => {
    render(<Saludo nombre="Ana" />);

    expect(screen.getByText("Hola, Ana")).toBeInTheDocument();
});
```

---

## Queries: encontrar elementos

RTL provee varias formas de buscar elementos en el DOM renderizado.

### Por prioridad recomendada

```jsx
// 1. getByRole → accesible para todos los usuarios
screen.getByRole("button", { name: "Enviar" });
screen.getByRole("textbox", { name: "Email" });
screen.getByRole("heading", { name: "Título" });

// 2. getByLabelText → inputs asociados a un label
screen.getByLabelText("Contraseña");

// 3. getByPlaceholderText → por placeholder
screen.getByPlaceholderText("Escribe tu nombre");

// 4. getByText → por texto visible
screen.getByText("Iniciar sesión");

// 5. getByDisplayValue → valor actual de un input
screen.getByDisplayValue("Ana García");

// 6. getByAltText → para imágenes
screen.getByAltText("Logo de la empresa");

// 7. getByTitle → por atributo title
screen.getByTitle("Cerrar modal");

// 8. getByTestId → último recurso, añade data-testid al elemento
screen.getByTestId("mi-componente");
```

### Variantes de las queries

Cada query tiene tres variantes:

| Variante     | Si no encuentra     | Si encuentra más de uno |
| ------------ | ------------------- | ----------------------- |
| `getBy...`   | Lanza error         | Lanza error             |
| `queryBy...` | Devuelve `null`     | Lanza error             |
| `findBy...`  | Lanza error (async) | Lanza error             |

```jsx
// getBy → para elementos que deben estar presentes
const boton = screen.getByRole("button");

// queryBy → para verificar que algo NO está en el DOM
expect(screen.queryByText("Error")).not.toBeInTheDocument();

// findBy → para elementos que aparecen de forma asíncrona
const mensaje = await screen.findByText("Datos cargados");
```

Y versiones `AllBy` para múltiples elementos:

```jsx
const botones = screen.getAllByRole("button");
expect(botones).toHaveLength(3);
```

---

## Matchers de jest-dom

```jsx
expect(elemento).toBeInTheDocument();
expect(elemento).toBeVisible();
expect(elemento).toBeDisabled();
expect(elemento).toBeEnabled();
expect(elemento).toBeChecked();
expect(elemento).toHaveValue("Ana");
expect(elemento).toHaveTextContent("Hola");
expect(elemento).toHaveClass("activo");
expect(elemento).toHaveAttribute("href", "/about");
expect(elemento).toHaveFocus();
```

---

## userEvent: simular interacciones

`userEvent` simula interacciones reales del usuario, más fiel que `fireEvent`:

```jsx
import userEvent from "@testing-library/user-event";

it("actualiza el input al escribir", async () => {
    const user = userEvent.setup();

    render(<input placeholder="Nombre" />);

    const input = screen.getByPlaceholderText("Nombre");
    await user.type(input, "Ana García");

    expect(input).toHaveValue("Ana García");
});
```

### Interacciones comunes

```jsx
const user = userEvent.setup();

// Click
await user.click(screen.getByRole("button"));

// Escribir
await user.type(screen.getByRole("textbox"), "texto");

// Limpiar y escribir
await user.clear(input);
await user.type(input, "nuevo texto");

// Seleccionar opción
await user.selectOptions(select, "opcion2");

// Checkbox
await user.click(screen.getByRole("checkbox"));

// Teclado
await user.keyboard("{Enter}");
await user.keyboard("{Tab}");
```

---

## Ejemplo: testear un formulario

```jsx
// Formulario.jsx
function Formulario({ onSubmit }) {
    const [nombre, setNombre] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!nombre) {
            setError("El nombre es obligatorio");
            return;
        }
        onSubmit(nombre);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre</label>
            <input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
            {error && <p role="alert">{error}</p>}
            <button type="submit">Enviar</button>
        </form>
    );
}
```

```jsx
// Formulario.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Formulario from "./Formulario";

describe("Formulario", () => {
    it("muestra error si se envía vacío", async () => {
        const user = userEvent.setup();
        render(<Formulario onSubmit={vi.fn()} />);

        await user.click(screen.getByRole("button", { name: "Enviar" }));

        expect(screen.getByRole("alert")).toHaveTextContent(
            "El nombre es obligatorio",
        );
    });

    it("llama a onSubmit con el nombre introducido", async () => {
        const user = userEvent.setup();
        const mockSubmit = vi.fn();
        render(<Formulario onSubmit={mockSubmit} />);

        await user.type(screen.getByLabelText("Nombre"), "Ana");
        await user.click(screen.getByRole("button", { name: "Enviar" }));

        expect(mockSubmit).toHaveBeenCalledWith("Ana");
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
});
```

---

## Testear componentes asíncronos

```jsx
// ListaUsuarios.jsx
function ListaUsuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        fetch("/api/usuarios")
            .then((r) => r.json())
            .then(setUsuarios);
    }, []);

    return (
        <ul>
            {usuarios.map((u) => (
                <li key={u.id}>{u.nombre}</li>
            ))}
        </ul>
    );
}
```

```jsx
// ListaUsuarios.test.jsx
it("muestra los usuarios tras cargarlos", async () => {
    global.fetch = vi.fn().mockResolvedValue({
        json: () =>
            Promise.resolve([
                { id: 1, nombre: "Ana" },
                { id: 2, nombre: "Luis" },
            ]),
    });

    render(<ListaUsuarios />);

    // findBy espera a que aparezca el elemento
    expect(await screen.findByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Luis")).toBeInTheDocument();
});
```

---

## Wrappers: proveer contexto en tests

Si el componente necesita un Provider (Context, Router, QueryClient...), envuélvelo:

```jsx
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

function renderConRouter(ui) {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
}

it("navega correctamente", async () => {
    const user = userEvent.setup();
    renderConRouter(<MiComponente />);

    await user.click(screen.getByRole("link", { name: "About" }));
    expect(screen.getByText("Página About")).toBeInTheDocument();
});
```

Para reutilizarlo en muchos tests, crea un render personalizado:

```jsx
// test-utils.jsx
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function AllProviders({ children }) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
    );
}

function customRender(ui, options) {
    return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
```

---

## Qué evitar

```
❌ Buscar por className o por estructura del DOM
❌ Acceder a la instancia del componente o su estado interno
❌ Testear que cierta función se llama internamente
❌ Usar getByTestId cuando hay una query semántica disponible
```

```jsx
// ❌ Detalles de implementación
expect(wrapper.find(".boton-primario")).toExist();
expect(component.state.contador).toBe(1);

// ✅ Comportamiento visible
expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
expect(screen.getByText("Contador: 1")).toBeInTheDocument();
```
