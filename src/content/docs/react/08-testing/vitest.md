---
title: Vitest
---

## ¿Qué es?

Vitest es un framework de testing moderno diseñado para proyectos con Vite. Comparte la configuración de Vite, soporta TypeScript y ESModules de forma nativa, y es significativamente más rápido que Jest en proyectos con Vite.

---

## Instalación

```bash
npm install --save-dev vitest
```

Para testear componentes React también necesitas:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
```

---

## Configuración

Añade Vitest a `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom", // Simula el DOM del navegador
        globals: true, // describe, it, expect disponibles sin importar
        setupFiles: "./src/setupTests.js", // Archivo de configuración inicial
    },
});
```

Crea el archivo de setup para extender los matchers de Testing Library:

```js
// src/setupTests.js
import "@testing-library/jest-dom";
```

Añade el script en `package.json`:

```json
{
    "scripts": {
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:coverage": "vitest --coverage"
    }
}
```

---

## Estructura básica

```jsx
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("Mi módulo", () => {
    beforeEach(() => {
        // Se ejecuta antes de cada test
    });

    afterEach(() => {
        // Se ejecuta después de cada test
    });

    it("hace algo correctamente", () => {
        expect(1 + 1).toBe(2);
    });

    it("otro caso", () => {
        expect("hola").toContain("ol");
    });
});
```

---

## Matchers principales

```jsx
// Igualdad
expect(valor).toBe(2); // ===
expect(objeto).toEqual({ a: 1 }); // igualdad profunda
expect(valor).not.toBe(3); // negación

// Tipos y existencia
expect(valor).toBeDefined();
expect(valor).toBeNull();
expect(valor).toBeTruthy();
expect(valor).toBeFalsy();

// Números
expect(valor).toBeGreaterThan(5);
expect(valor).toBeLessThanOrEqual(10);
expect(valor).toBeCloseTo(0.3); // para flotantes

// Strings
expect(texto).toContain("hola");
expect(texto).toMatch(/^hola/);

// Arrays
expect(lista).toHaveLength(3);
expect(lista).toContain("item");
expect(lista).toEqual(expect.arrayContaining(["a", "b"]));

// Errores
expect(() => lanzarError()).toThrow();
expect(() => lanzarError()).toThrow("mensaje de error");

// Promesas
await expect(promesa).resolves.toBe("valor");
await expect(promesa).rejects.toThrow("error");
```

---

## Mocks con vi

### Funciones mock

```jsx
import { vi } from "vitest";

const mockFn = vi.fn();

mockFn("argumento");

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith("argumento");
expect(mockFn).toHaveBeenCalledTimes(1);
```

### Mock con valor de retorno

```jsx
const mockFn = vi.fn().mockReturnValue(42);
const mockFnAsync = vi.fn().mockResolvedValue({ id: 1, nombre: "Ana" });

expect(mockFn()).toBe(42);
await expect(mockFnAsync()).resolves.toEqual({ id: 1, nombre: "Ana" });
```

### Mock de módulos

```jsx
import { vi } from "vitest";

// Mock de un módulo completo
vi.mock("./api", () => ({
    fetchUsuarios: vi.fn().mockResolvedValue([{ id: 1, nombre: "Ana" }]),
}));

// Mock de fetch global
global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ id: 1 }),
});
```

### Restaurar mocks

```jsx
afterEach(() => {
    vi.restoreAllMocks(); // Restaura todos los mocks al estado original
});
```

---

## Spies

Un spy observa una función real sin reemplazarla:

```jsx
import { vi } from "vitest";
import * as utils from "./utils";

const spy = vi.spyOn(utils, "calcularTotal");

utils.calcularTotal(10, 5);

expect(spy).toHaveBeenCalledWith(10, 5);
```

---

## Testing asíncrono

```jsx
// Con async/await
it("carga los datos correctamente", async () => {
    const datos = await fetchDatos();
    expect(datos).toHaveLength(3);
});

// Con promesas
it("resuelve correctamente", () => {
    return fetchDatos().then((datos) => {
        expect(datos).toHaveLength(3);
    });
});
```

---

## Timers falsos

Para testear código con setTimeout, setInterval o Date:

```jsx
import { vi } from "vitest";

it("ejecuta el callback después del delay", () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    setTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
});
```

---

## Cobertura de código

```bash
npm install --save-dev @vitest/coverage-v8
```

```js
// vite.config.js
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    exclude: ['node_modules/', 'src/setupTests.js'],
  },
}
```

```bash
npm run test:coverage
```

Genera un reporte mostrando qué porcentaje del código está cubierto por tests.

---

## UI de Vitest

Vitest incluye una interfaz web para visualizar y ejecutar tests:

```bash
npm install --save-dev @vitest/ui
npx vitest --ui
```

---

## Organización de archivos de test

Dos convenciones comunes:

```
# Junto al archivo que testea
src/
├── components/
│   ├── Boton.jsx
│   └── Boton.test.jsx
└── hooks/
    ├── useFetch.js
    └── useFetch.test.js

# En carpeta __tests__ separada
src/
├── components/
│   └── Boton.jsx
└── __tests__/
    └── Boton.test.jsx
```

> La convención más usada es junto al archivo, facilita encontrar el test de cada módulo.
