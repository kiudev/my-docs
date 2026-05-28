---
title: useState
---

## ¿Qué es?

Hook para añadir estado local a un componente funcional. Cuando el estado cambia, React re-renderiza el componente con el nuevo valor.

```jsx
const [valor, setValor] = useState(valorInicial);
```

---

## Inicialización

### Valor directo
El valor inicial se establece una sola vez al montar el componente:

```jsx
const [count, setCount] = useState(0);
const [nombre, setNombre] = useState("Ana");
const [activo, setActivo] = useState(false);
const [lista, setLista] = useState([]);
const [usuario, setUsuario] = useState(null);
```

### Lazy initialization
Si el valor inicial es costoso de calcular, pasa una función. React la ejecuta solo en el primer render:

```jsx
// ❌ Se ejecuta en cada render aunque solo se use la primera vez
const [datos, setDatos] = useState(calcularDatosComplejos());

// ✅ Se ejecuta solo una vez al montar
const [datos, setDatos] = useState(() => calcularDatosComplejos());
```

Útil también para leer de localStorage:

```jsx
const [tema, setTema] = useState(() => {
  return localStorage.getItem("tema") || "claro";
});
```

---

## Actualizar el estado

### Valor directo
```jsx
setCount(5);
setNombre("Luis");
```

### Basado en el valor anterior
Cuando el nuevo estado depende del anterior, usa siempre una función para evitar problemas con actualizaciones asíncronas:

```jsx
// ❌ Puede dar valores desactualizados
setCount(count + 1);

// ✅ Siempre usa el valor más reciente
setCount(prev => prev + 1);
```

Esto es especialmente importante cuando se llama varias veces seguidas:

```jsx
// ❌ count solo sube 1, no 3
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);

// ✅ count sube 3
setCount(prev => prev + 1);
setCount(prev => prev + 1);
setCount(prev => prev + 1);
```

---

## Estado con objetos

React no hace merge automático del estado como los componentes de clase. Hay que hacerlo manualmente con spread:

```jsx
const [usuario, setUsuario] = useState({
  nombre: "Ana",
  edad: 25,
  ciudad: "Madrid"
});

// ❌ Borra el resto de propiedades
setUsuario({ nombre: "Luis" });

// ✅ Mantiene el resto y solo actualiza nombre
setUsuario(prev => ({ ...prev, nombre: "Luis" }));
```

---

## Estado con arrays

Los arrays también son inmutables en React. Siempre devuelve uno nuevo:

```jsx
const [lista, setLista] = useState([1, 2, 3]);

// Añadir
setLista(prev => [...prev, 4]);

// Eliminar
setLista(prev => prev.filter(item => item !== 2));

// Actualizar un elemento
setLista(prev => prev.map(item => item === 2 ? 20 : item));
```

---

## Múltiples estados vs un objeto

Ambas opciones son válidas. La elección depende de si los valores cambian juntos o por separado:

```jsx
// ✅ Separados: cambian de forma independiente
const [nombre, setNombre] = useState("");
const [email, setEmail] = useState("");
const [edad, setEdad] = useState(0);

// ✅ Juntos: suelen cambiar al mismo tiempo
const [form, setForm] = useState({
  nombre: "",
  email: "",
  edad: 0
});
```

---

## Estado derivado

Si un valor se puede calcular a partir del estado, no hace falta guardarlo como estado. Calcularlo directamente evita inconsistencias:

```jsx
const [precio, setPrecio] = useState(100);
const [cantidad, setCantidad] = useState(3);

// ❌ Estado redundante, puede quedar desincronizado
const [total, setTotal] = useState(300);

// ✅ Valor derivado, siempre consistente
const total = precio * cantidad;
```

---

## Resetear el estado

Para resetear completamente el estado de un componente puedes cambiar su `key`. React desmonta y vuelve a montar el componente desde cero:

```jsx
function App() {
  const [key, setKey] = useState(0);

  return (
    <>
      <Formulario key={key} />
      <button onClick={() => setKey(prev => prev + 1)}>
        Resetear formulario
      </button>
    </>
  );
}
```

---

## Reglas de los hooks

`useState` sigue las reglas generales de todos los hooks:

```
✅ Llamar siempre en el nivel superior del componente
✅ Llamar solo dentro de componentes funcionales o custom hooks

❌ No llamar dentro de condicionales
❌ No llamar dentro de bucles
❌ No llamar dentro de funciones anidadas
```

```jsx
// ❌ Incorrecto
if (condicion) {
  const [valor, setValor] = useState(0);
}

// ✅ Correcto
const [valor, setValor] = useState(0);
if (condicion) {
  // usar valor aquí
}
```
