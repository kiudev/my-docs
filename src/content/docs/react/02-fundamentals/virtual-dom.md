---
title: Virtual DOM
---

Es un objeto JavaScript que representa la estructura de tu UI. Cuando algo cambia, React compara la versión anterior con la nueva, calcula la diferencia mínima y solo toca esa parte del DOM real. Así evita operaciones costosas en el navegador.

## El problema: el DOM real es lento

El DOM (Document Object Model) es la representación del HTML en memoria que maneja el navegador. Cada vez que lo modificas con JavaScript puro, el navegador tiene que:

1. Recalcular estilos
2. Recalcular el layout
3. Repintar la pantalla

Si tienes muchos cambios frecuentes, esto se vuelve muy costoso en rendimiento.

## La solución de React: Virtual DOM

React mantiene una copia ligera del DOM en memoria (un objeto JavaScript). Cuando algo cambia, el proceso es:

```
Estado cambia
      ↓
React crea un nuevo Virtual DOM
      ↓
Compara con el Virtual DOM anterior (diffing)
      ↓
Calcula los cambios mínimos necesarios
      ↓
Solo actualiza esas partes en el DOM real (reconciliación)
```

> ## **Ejemplo visual**
>
> Imagina una lista de 100 elementos y solo cambia el tercero. Sin React, podrías re-renderizar toda la lista. React detecta que solo cambió 1 nodo y toca únicamente ese.
