# Programación Orientada a Objetos (Go)

Aprendemos Go desde la sintaxis hasta los servicios web concurrentes, y lo aplicamos en un proyecto propio que crece durante todo el curso: un sistema de gestión del tema que tú elijas.

**Sesiones en vivo:** lunes a las 19:00 por Microsoft Teams, del 26 de octubre al 13 de diciembre de 2026. Todas se graban.

**Sitio del curso:** abre `index.html` (o la página de GitHub Pages de este repositorio) para ver las presentaciones y copiar los tutores con un clic.

## Cómo aprovechar cada semana

1. **Antes de la sesión, repasa con el tutor** (20–30 minutos). Copia el `tutor.md` de la semana y pégalo completo en ChatGPT, Gemini, Claude o el asistente que uses. Te hará preguntas, no te dará respuestas, y al final te entregará un ticket de entrada con tu duda para la clase: envíalo en el [formulario de tickets de entrada](https://forms.cloud.microsoft/r/ZhHFhJsKQE) hasta las 12:00 del día de la sesión.
2. **Ven a la sesión.** Empezamos en punto con una pista para el Aprendizaje Práctico de la semana, practicamos con casos reales y resolvemos dudas en vivo.
3. **¿No pudiste asistir?** Mira la grabación (los bloques se anuncian en voz alta para que puedas saltar entre ellos) y haz el ejercicio individual que aparece al cierre de la presentación.

## Sesiones

| Semana | Sesión |
|---|---|
| 1 | 26 oct |
| 2 | 2 nov |
| 3 | 9 nov |
| 4 | 16 nov |
| 5 | 23 nov |
| 6 | 30 nov |
| 7 | 7 dic |

La presentación y el tutor de cada semana se publican a medida que avanza el curso. Encuéntralos en el sitio del curso (`index.html` o la página de GitHub Pages de este repositorio), o en las carpetas `semana-01/`, `semana-02/`, etc.

## Evaluación (todo es individual)

| Componente | Qué es | Cubre | Puntos | Fecha límite | Guía |
|---|---|---|---|---|---|
| Aprendizaje Práctico (quiz) | Quiz semanal | Tema de la semana | — | Domingo de cada semana | — |
| Aprendizaje Autónomo 1 | Planeación del sistema de gestión: módulos, funciones y paquetes; video, PDF y repositorio | U1 | 12 | Domingo 15 nov | [Guía](entregas/aa1.md) |
| Aprendizaje Autónomo 2 | Desarrollo del sistema: structs, encapsulación, errores, interfaces; videos y código | U2–U3 | 12 | Domingo 6 dic | [Guía](entregas/aa2.md) |
| Evaluación en Contacto con el Docente | El sistema como aplicación web: ≥8 servicios, JSON, concurrencia y pruebas; informe y video con presentación y demostración | U1–U4 | 34 | Domingo 13 dic | [Guía](entregas/ecd.md) |

Las guías en `entregas/` aclaran lo que pide cada trabajo y **cómo se califica**. Si el enunciado de la plataforma dice algo distinto (por ejemplo, «grupal»), vale lo que dice la guía.

## Temario por semana

| Sem. | Fecha | Unidad · Tema | Subtemas | Vence el domingo |
|---|---|---|---|---|
| 01 | 26 oct – 1 nov | U1 · T1 ¿Qué es Go? | 1.1 Sintaxis · 1.2 Condicionales · 1.3 Estructuras de control de flujo iterativo | Aprendizaje Práctico |
| 02 | 2 – 8 nov | U1 · T2 Manejo de funciones | 2.1 Funciones: creación, declaración, llamado · 2.2 Tipos de funciones · 2.3 Importar, modificar y optimizar el código con su uso (paquetes) | Aprendizaje Práctico |
| 03 | 9 – 15 nov | U2 · T1 Arrays, slices, maps | 1.1 Arrays · 1.2 Slices · 1.3 Maps | Aprendizaje Práctico · **Aprendizaje Autónomo 1** |
| 04 | 16 – 22 nov | U2 · T2 Objetos en Go | 2.1 Structs · 2.2 Métodos y funciones · 2.3 Constructores | Aprendizaje Práctico |
| 05 | 23 – 29 nov | U3 · T1 Encapsulación | 1.1 Métodos *setter* · 1.2 Métodos *getter* · 1.3 Manejo de errores | Aprendizaje Práctico |
| 06 | 30 nov – 6 dic | U3 · T2 Interfaces | 2.1 Creación · 2.2 Implementación · 2.3 Polimorfismo mediante interfaces | Aprendizaje Práctico · **Aprendizaje Autónomo 2** |
| 07 | 7 – 13 dic | U4 · T1 Concurrencia **+** T2 Web | 1.1 Introducción a la concurrencia · 1.2 Goroutines · 1.3 Canales · 2.1 Servicios web · 2.2 Serialización de datos · 2.3 *Testing* | Aprendizaje Práctico · **Evaluación en Contacto con el Docente** |

## Unidades: resumen y resultados de aprendizaje

**U1 · Programación con Go.** Go como lenguaje simple y rápido, usado en aplicaciones web y servicios distribuidos. Sintaxis, ciclos y condicionales, funciones y paquetes para organizar módulos.
- RA 1.1: Entender la sintaxis del lenguaje de programación Golang.
- RA 1.2: Aplicar ciclos y condicionales dentro del entorno de programación.
- RA 1.3: Utilizar adecuadamente las funciones dentro del lenguaje.
- RA 1.4: Entender el uso de los paquetes para mejorar la programación de los módulos.

**U2 · Estructuras de datos y objetos.**
- Entender el uso de las estructuras de datos.
- Aplicar las estructuras de datos en la resolución de problemas.
- Entender el manejo de objetos en Go.
- Aplicar los objetos en función de la resolución de problemas.

**U3 · POO.**
- Entender el correcto uso de la encapsulación dentro de POO.
- Entender cómo trabajar con los errores en Go.
- Entender el uso de las interfaces para manejar una programación limpia.
- Implementar adecuadamente las interfaces dentro del entorno de programación orientado a objetos.

**U4 · Concurrencia, *testing* y web.**
- Entender la importancia del manejo de concurrencia dentro de la programación.
- Realizar servicios web.
- Entender cómo realizar *testing* de los servicios realizados.
