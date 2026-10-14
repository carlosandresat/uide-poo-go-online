# Aprendizaje Autónomo 2 · Desarrollo del Sistema de Gestión

**Programación Orientada a Objetos (Go)** · Vence el **domingo 6 de diciembre de 2026** · 12 puntos · **Individual** · Temas de las unidades 2 y 3 (semanas 3 a 6)

## En resumen

Programas el sistema que diseñaste en el Aprendizaje Autónomo 1, en el mismo repositorio. Primero modelas las entidades con **structs, métodos y constructores** y usas slices y maps donde corresponda. Luego agregas **encapsulación, manejo de errores e interfaces**, y comentas las partes complejas.

## Aclaraciones sobre el enunciado de la plataforma

| La plataforma dice | Qué hacer |
|---|---|
| «El grupo…», «repositorio del grupo» | Es **individual**, en tu mismo repositorio del Aprendizaje Autónomo 1. |
| «Clases» | En Go no hay clases: son **structs con métodos**. |
| «Avance significativo» | Que funcionen la **mayoría de las funcionalidades** que definiste en el Aprendizaje Autónomo 1. |
| Los criterios del «Paso 1» hablan de «fuentes», «expertos» y «posición» | En este trabajo se refieren a tus structs, a tus decisiones de diseño y a tu avance funcional (ver la tabla de calificación). |
| Dos videos (explicativo y de demostración) | Puedes entregar **un solo video con dos partes**. |

## Paso a paso recomendado

1. **Convierte las entidades en structs** (`Libro`, `Usuario`, `Pedido`…), cada una con su constructor `NewX` y sus métodos. Las funciones sueltas del Aprendizaje Autónomo 1 pasan a ser métodos.
2. **Elige las estructuras de datos**: slice cuando importa el orden, map cuando buscas por clave.
3. **Escribe tus decisiones en el `README.md`** a medida que las tomas: por qué esas entidades, receptor de valor o de puntero, slice o map. Vale puntos.
4. **Encapsula**: campos no exportados y acceso por métodos al estilo Go (`Titulo()` y `SetTitulo()`). Los *setters* usan receptor puntero y validan.
5. **Maneja errores**: las funciones que pueden fallar devuelven `error`, y quien las llama lo revisa.
6. **Agrega al menos una interfaz** con dos o más implementaciones y úsala de forma polimórfica (por ejemplo, `Contenido` implementada por `Libro` y `Audiolibro`). Las interfaces se ven en la semana 6: deja previsto desde antes dónde irá.
7. **Comenta** el porqué de las partes complejas y documenta las funciones exportadas.
8. **Graba el video**: explica tu diseño y demuestra las funcionalidades funcionando.

## Qué entregar

- [ ] Código en tu repositorio (compila y corre).
- [ ] `README.md` con las decisiones de diseño.
- [ ] Video (o dos) con la explicación del avance y la demostración de funcionalidades.

## Cómo se califica

| Criterio | Alcanzado (2) | En proceso (1) | Deficiente (0) |
|---|---|---|---|
| **Evidencia «Paso 1»** · structs y estructuras de datos | Structs que modelan las entidades con métodos y constructores; slices o maps bien elegidos; acoplados a las funcionalidades del Aprendizaje Autónomo 1. | Structs incompletos (sin métodos o sin constructores) o estructuras mal elegidas. | Sin structs: solo funciones sueltas. |
| **Posición del estudiante «Paso 1»** · decisiones de diseño | Explica y justifica sus decisiones (entidades, receptores, slice o map) con ejemplos de su código. | Menciona decisiones sin justificarlas. | No explica decisiones. |
| **Conclusiones y logros «Paso 1»** · avance funcional | El video muestra funcionando la mayoría de las funcionalidades; el código compila y corre. | Avance parcial o con errores en la demostración. | Sin demostración, o no compila. |
| **Implementar encapsulación «Paso 2»** | Campos no exportados con acceso por métodos; *setters* con receptor puntero que validan. | Encapsulación parcial: campos expuestos sin razón o *setters* que no validan o no modifican. | Sin encapsulación. |
| **Manejo de errores e interfaces «Paso 2»** | Los errores se devuelven y se manejan; al menos una interfaz con dos o más implementaciones usada de forma polimórfica. | Solo uno de los dos bien resuelto, o errores ignorados en partes. | Ninguno de los dos. |
| **Comentarios en funcionalidades complejas** | Comentarios que explican el porqué y documentan lo exportado. | Comentarios que repiten el código o solo en algunas partes. | Sin comentarios. |
