---
title: Conceptos base de testing en React
---

## ¿Por qué testear?

Los tests verifican que el código funciona correctamente y siguen haciéndolo cuando se modifica. En React, los tests dan confianza para refactorizar componentes, añadir funcionalidades y detectar regresiones antes de que lleguen a producción.

---

## Tipos de tests

### Unit tests (tests unitarios)

Testean una sola unidad de código de forma aislada: una función, un hook o un componente simple. Son rápidos y fáciles de escribir.

```
✅ Rápidos
✅ Fáciles de depurar
✅ Cubren casos límite
❌ No garantizan que las piezas funcionen juntas
```

### Integration tests (tests de integración)

Testean cómo varias piezas funcionan juntas: un componente con sus hijos, un formulario completo, un flujo de navegación.

```
✅ Mayor confianza que los unitarios
✅ Más cercanos al uso real
❌ Más lentos que los unitarios
❌ Más difíciles de depurar
```

### End-to-end tests (E2E)

Simulan el comportamiento real de un usuario en el navegador: hacer click, rellenar formularios, navegar entre páginas.

```
✅ Máxima confianza
✅ Testean el sistema completo
❌ Muy lentos
❌ Frágiles ante cambios de UI
❌ Requieren un entorno más complejo
```

---

## La pirámide de tests

```
        /\
       /E2E\          → Pocos, lentos, caros
      /------\
     /  Integ  \      → Algunos, equilibrio coste/confianza
    /------------\
   /    Unitarios  \  → Muchos, rápidos, baratos
  /----------------\
```

La idea es tener muchos tests unitarios, algunos de integración y pocos E2E. En React Testing Library se habla más de un **trofeo de tests** donde los de integración tienen más peso.

---

## Qué testear en React

### Sí testear

```
✅ Comportamiento visible para el usuario (qué ve, qué puede hacer)
✅ Lógica de negocio en hooks y funciones puras
✅ Flujos críticos (login, checkout, formularios importantes)
✅ Casos límite y manejo de errores
✅ Accesibilidad básica
```

### No testear

```
❌ Detalles de implementación (nombres de variables, estructura interna)
❌ Estilos CSS (salvo que sean críticos)
❌ Librerías de terceros
❌ Código trivial sin lógica
```

> La filosofía de React Testing Library: testea lo que el usuario ve y hace, no cómo está implementado internamente.

---

## Herramientas del ecosistema

| Herramienta                   | Tipo        | Descripción                                            |
| ----------------------------- | ----------- | ------------------------------------------------------ |
| **Vitest**                    | Test runner | Ejecuta los tests, rápido, integrado con Vite          |
| **Jest**                      | Test runner | El clásico, más configuración                          |
| **React Testing Library**     | Utilidades  | Renderiza componentes y simula interacciones           |
| **Mock Service Worker (MSW)** | Mocking     | Intercepta peticiones HTTP en tests                    |
| **Cypress**                   | E2E         | Tests en navegador real, con UI visual                 |
| **Playwright**                | E2E         | Tests en múltiples navegadores, más rápido que Cypress |

---

## Anatomía de un test

```jsx
import { describe, it, expect } from "vitest";

describe("Componente Saludo", () => {
    // Agrupa tests relacionados

    it("muestra el nombre correctamente", () => {
        // Un caso concreto
        // Arrange → preparar
        const nombre = "Ana";

        // Act → ejecutar
        const saludo = `Hola, ${nombre}`;

        // Assert → verificar
        expect(saludo).toBe("Hola, Ana");
    });
});
```

El patrón **Arrange → Act → Assert** (AAA) es la estructura recomendada para cualquier test.

---

## Qué hace cada herramienta

```
Vitest / Jest
  → Ejecutan los tests
  → Proveen describe, it, expect, beforeEach...
  → Manejan mocks con vi.fn() / jest.fn()

React Testing Library
  → Renderiza componentes en un DOM virtual
  → Provee queries para encontrar elementos (getByText, getByRole...)
  → Provee userEvent para simular interacciones reales

MSW
  → Intercepta fetch/axios en tests
  → Devuelve respuestas simuladas sin tocar el servidor real

Cypress / Playwright
  → Abren un navegador real o headless
  → Navegan por la app como un usuario real
```
