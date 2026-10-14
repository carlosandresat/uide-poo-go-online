# Aprendizaje Autónomo 1 · Selección de Sistemas de Gestión Empresarial

**Programación Orientada a Objetos (Go)** · Vence el **domingo 15 de noviembre de 2026** · 12 puntos · **Individual** · Temas de la unidad 1 (semanas 1 y 2)

## En resumen

Es la **primera etapa de un proyecto que dura todo el curso**. Eliges un sistema de gestión y diseñas cómo lo vas a organizar en Go con lo de la unidad 1: funciones y paquetes. En el Aprendizaje Autónomo 2 lo programarás con structs, encapsulación, errores e interfaces. En la Evaluación en Contacto con el Docente lo convertirás en una aplicación web con al menos 8 servicios.

**El tema es libre.** Elige un sistema que gestione información (registrar, consultar, modificar, eliminar…) y que dé para **al menos 8 funcionalidades distintas**: las vas a necesitar al final.

## Aclaraciones sobre el enunciado de la plataforma

El enunciado de la plataforma viene de versiones anteriores del curso. Donde haya diferencias, vale esta guía.

| La plataforma dice | Qué hacer |
|---|---|
| Elegir entre tres sistemas (libros electrónicos, *streaming* o *e-commerce*) | **El tema es libre.** Esos tres son solo ejemplos. Puede ser una biblioteca, un gimnasio, un inventario, una plataforma de cursos o lo que quieras construir. |
| «Grupo de hasta 4 participantes» | El trabajo es **individual**. Cada quien tiene su propio repositorio. |
| «Programación funcional» | Organiza el programa **en funciones** dentro de paquetes. Todavía sin structs (eso viene en el Aprendizaje Autónomo 2). |
| «Estructura de gestión del sistema» | Es el **árbol de paquetes** y una **tabla de funciones por módulo** (ver el paso 3). |
| «Configuración del repositorio de GitHub» | Un repositorio con `go.mod`, la estructura de paquetes, un `README.md` y las funciones declaradas. **Debe compilar**, aunque las funciones aún no hagan todo. |

## Paso a paso recomendado

1. **Elige tu sistema** (tema libre). Lo importante es que gestione información y dé para al menos 8 funcionalidades.
2. **Define el objetivo y el alcance**: qué problema resuelve, para quién, qué hace y qué no hace.
3. **Divide en módulos** (por ejemplo: catálogo, usuarios, pedidos). Para cada módulo, arma una tabla de funciones:

   | Función | Parámetros | Retorna | Qué hace |
   |---|---|---|---|
   | `AgregarLibro` | `titulo string, autor string, precio float64` | `error` | Registra un libro nuevo |

4. **Diseña los paquetes**: qué paquete corresponde a cada módulo y qué se exporta (mayúscula inicial). Si usas paquetes de terceros, explica para qué.
5. **Crea el repositorio**: `go mod init`, carpetas por paquete, funciones declaradas y un `README.md` que describa el proyecto. Comprueba que `go build ./...` funcione.
6. **Graba el video** (3–5 minutos recomendados): presenta el sistema, recorre los módulos y muestra el repositorio.

## Qué entregar

- [ ] PDF con objetivo, alcance, módulos, la tabla de funciones de cada módulo y los paquetes (con tabla o diagrama).
- [ ] Enlace al repositorio de GitHub (compila con `go build ./...`).
- [ ] Video explicativo.

## Cómo se califica

Los nombres de los criterios y los puntos son los de la plataforma. La descripción de cada nivel es la que se usa para calificar.

| Criterio | Alcanzado (4) | En proceso (2) | Deficiente (0) |
|---|---|---|---|
| **Relaciones con la disciplina** · objetivo, alcance y módulos | Objetivo claro, alcance delimitado (qué hace y qué no) y módulos que cubren el sistema, cada uno con funcionalidades concretas. | Objetivo y módulos presentes pero vagos, sin alcance delimitado o sin funcionalidades concretas. | No define objetivo ni módulos, o no corresponden al sistema elegido. |
| **Transferencia** · diseño con funciones y paquetes | Paquetes coherentes con los módulos; funciones con firma clara (parámetros, tipos, retornos) y una sola responsabilidad; paquetes de terceros justificados; el repositorio compila. | Funciones y paquetes mal repartidos (casi todo en `main`, firmas poco claras), no compila o falta documentar paquetes de terceros. | No hay estructura de funciones ni de paquetes. |
| **Comunicación integrada** · los tres entregables | PDF, repositorio y video entregados y coherentes entre sí; el PDF incluye tablas o diagramas; el `README.md` describe el proyecto. | Falta un entregable, o no coinciden entre sí. | Faltan dos o más entregables. |
