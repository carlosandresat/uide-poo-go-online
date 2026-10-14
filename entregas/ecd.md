# Evaluación en Contacto con el Docente · Generación de Servicios Web del Sistema

**Programación Orientada a Objetos (Go)** · Vence el **domingo 13 de diciembre de 2026** · 34 puntos · **Individual** · Integra las 4 unidades

## En resumen

Cierras tu proyecto: el mismo sistema de gestión del Aprendizaje Autónomo 1 y el 2, ahora como **aplicación web**. Necesitas:
- **Al menos 8 servicios web** que reciben y responden **JSON**.
- La POO que ya construiste: structs, encapsulación, errores e interfaces.
- La **concurrencia** bien manejada: varias solicitudes a la vez sin corromper datos.
- **Pruebas** documentadas.

Los servicios web y la concurrencia se ven en la semana 7, pero en la sesión de la semana 6 haremos un arranque técnico para que empieces antes.

## Aclaraciones sobre el enunciado de la plataforma

| La plataforma dice | Qué hacer |
|---|---|
| Título «El impacto de las nuevas tecnologías en la sociedad: visualización del futuro» | Es un título equivocado, de otro curso. El trabajo es **Generación de Servicios Web del Sistema**. |
| «Crea una visualización del futuro…» (puntos e, f, g) | **No aplica** a este curso. Ignóralo. |
| Cronograma de 8 semanas y 8 temas | No es un entregable. Este periodo tiene 7 semanas. |
| «Grupo», «datos del grupo» | Es **individual**: tus datos en el `README.md`. |
| «Elegir el tipo de aplicación web» | Tu aplicación web es **tu mismo sistema de gestión**. Justifica qué funcionalidades expones como servicios. |
| «JASON» | JSON. |
| «En la última clase se debe hacer una presentación» | **No se presenta en la sesión.** La presentación va **dentro de tu video**, junto con la demostración. |

## Paso a paso recomendado

1. **Lista tus servicios** (mínimo 8, de funcionalidades distintas): por ejemplo `GET /libros`, `POST /libros`, `GET /libros/{id}`, `PUT /libros/{id}`, `DELETE /libros/{id}`, `POST /pedidos`…
2. **Expón cada servicio** con `net/http` y serializa con `encoding/json`. Ojo: los campos no exportados de un struct no aparecen en el JSON; usa etiquetas como `json:"titulo"`.
3. **Protege el estado compartido.** Cada solicitud corre en su propia goroutine, así que un map en memoria compartido necesita `sync.Mutex` (o un diseño con canales). Comprueba con `go test -race`.
4. **Prueba**:
   - Pruebas unitarias de tus métodos (`go test`).
   - Pruebas de tus servicios con `net/http/httptest`.
   - Escenarios de aceptación descritos como pasos de un usuario («crear un libro y luego consultarlo»).
   - Anota los errores que encontraste y cómo los corregiste.
5. **Dibuja el diagrama de clases** (structs, interfaces y relaciones) a partir de tu código.
6. **Completa el `README.md`**: tus datos, objetivo, fecha y funcionalidades principales.
7. **Escribe el informe**: descripción, justificación, diagrama de clases, pruebas y resultados.
8. **Graba el video** con tres partes:
   - **Presentación** (con Canva, PowerPoint u otra herramienta): introducción, por qué elegiste esas funcionalidades, decisiones técnicas y una conclusión sobre lo que aprendiste, las dificultades y lo que mejorarías.
   - **Demostración** de todos los servicios y de casos de prueba.
   - **Concurrencia**: varias solicitudes simultáneas funcionando.

## Qué entregar

- [ ] Repositorio completo en GitHub con `README.md`.
- [ ] Informe (descripción, justificación, diagrama de clases, pruebas y resultados).
- [ ] Video con presentación, demostración y concurrencia.

## Cómo se califica

| Criterio | Alcanzado | En proceso | Deficiente (0) |
|---|---|---|---|
| **Desarrollo de tema** (7 / 3.5) · alcance e integración | Sistema completo y acotado; justifica qué expone como servicios; integra de forma visible las 4 unidades. | Funciona, pero falta integrar alguna unidad o justificar el alcance. | No hay aplicación web, o no tiene relación con tu proyecto. |
| **Análisis de Software** (7 / 3.5) · diseño y servicios | ≥8 servicios distintos con JSON de entrada y salida; diagrama de clases coherente con el código. | Menos de 8 servicios, JSON parcial o diagrama que no corresponde al código. | Sin servicios ni diagrama. |
| **Resultados** (8 / 4) · funcionamiento demostrado | El video muestra todos los servicios funcionando y la concurrencia (solicitudes simultáneas sin errores; idealmente `go test -race` limpio). | Funciona la mayoría, o no se demuestra la concurrencia. | Sin demostración, o no corre. |
| **Implicaciones y limitaciones** (8 / 4) · pruebas | Pruebas unitarias, de servicios y escenarios de aceptación, con resultados, errores encontrados, cómo se corrigieron y limitaciones. | Solo pruebas unitarias, o documentación superficial. | Sin pruebas. |
| **Toma de decisiones** (2 / 1) | Justifica sus decisiones técnicas clave (paquetes, interfaces, cómo resolvió la concurrencia). | Las menciona sin justificar. | No explica decisiones. |
| **Identifica el argumento principal** (2 / 1) · presentación | La presentación del video tiene introducción, demostración y una conclusión reflexiva con pros y contras de su diseño. | Sin conclusión, o conclusión genérica. | Sin presentación. |
