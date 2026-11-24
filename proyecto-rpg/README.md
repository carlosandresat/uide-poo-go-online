# RPG por turnos en Go

Proyecto de ejemplo del curso. Es un juego de rol clásico por turnos en la consola. Usa **solo lo visto hasta la semana 5**: sintaxis, funciones y paquetes, arrays, slices y maps, structs y métodos, encapsulación y errores. Cada parte del código lleva un comentario `// Semana N` con el concepto que ilustra.

Es un ejemplo para leer y modificar. Tu proyecto del curso sigue siendo tu propio sistema de gestión.

## Cómo ejecutarlo

Desde esta carpeta:

```
go run .
```

Para repetir siempre la misma partida (útil para comparar con un compañero), fija la semilla del azar:

```
go run . -semilla 42
```

## Cómo se juega

- **El grupo:** Aldric (guerrero), Lumen (mago blanco) y Morgana (mago negro). Empiezan con 100 monedas.
- **El menú principal:** iniciar combate, tienda de armas, cambiar equipamiento y ver grupo.
- **En combate**, cada personaje elige una acción por ronda:
  - **Atacar:** ataque normal con el **poder de ataque** del personaje más el de su arma. Su elemento es el del arma: físico, o fuego con la espada de fuego.
  - **Magia:** usa el **poder mágico**. El mago negro lanza Fuego, Hielo y Rayo. El mago blanco lanza Cura y Destello (luz). Cada hechizo gasta MP.
  - **Defender:** recibe la mitad del daño hasta la ronda siguiente.
  - **Examinar enemigo:** muestra sus debilidades y resistencias. No gasta el turno.
  - **Huir:** sale del combate sin recompensa.
- **Los enemigos** tienen debilidades y resistencias por elemento, y el físico también cuenta como elemento:

| Enemigo | Débil a (×2 o ×1,5) | Resiste (×0,5) o inmune (×0) |
|---|---|---|
| Slime | fuego | físico ×0,5 |
| Esqueleto | luz ×2, físico ×1,5 | hielo ×0,5 |
| Gólem | rayo | físico ×0,5, fuego ×0,5 |
| Espectro | luz | físico ×0 (inmune) |
| Lobo helado | fuego ×2, físico ×1,5 | hielo ×0 (inmune) |

- **Daño:** `(poder × variación − defensa / 2) × multiplicador`, con una variación al azar entre 0,9 y 1,1 y un mínimo de 1 (0 si el enemigo es inmune).
- **Al ganar** recibes las monedas de los enemigos; **al perder**, pierdes la mitad. En los dos casos el grupo se recupera por completo: todavía no hay posada ni pociones.
- **La tienda** vende espadas (guerrero), báculos (mago blanco) y varas (mago negro), y compra tus armas guardadas a la mitad de su precio. Lo que compras queda en el inventario hasta que lo equipas.

## Estructura

```
proyecto-rpg/
├── main.go           menú principal y creación del grupo
├── entrada.go        leer opciones del teclado, barras de vida
├── menu_combate.go   el combate visto por el jugador
├── menu_tienda.go    comprar y vender
├── menu_equipo.go    cambiar el arma de un personaje
├── elemento/         Fisico, Fuego, Hielo, Rayo, Luz
├── atributos/        vida, ataque, magia, defensa (lo incrustan personajes y enemigos)
├── equipo/           armas
├── personaje/        guerrero, mago blanco, mago negro y sus hechizos
├── enemigo/          tipos de enemigo y sus afinidades
├── grupo/            el party, las monedas y el inventario
├── tienda/           catálogo, compra y venta
└── combate/          reglas del combate y fórmula de daño
```

Los paquetes `combate`, `tienda` y `grupo` no leen el teclado ni imprimen: devuelven valores y errores, y el paquete `main` decide qué mostrar. Esa separación es la que permitirá, en la semana 7, convertir el juego en un servicio web sin reescribir las reglas.

## Dónde está cada semana

| Semana | Concepto | Dónde verlo |
|---|---|---|
| 1 | Constantes con `iota` | `elemento.go`, `arma.go`, `personaje.go`, `enemigo.go` |
| 1 | `for` infinito + `switch` (menú) | `main.go`, `leerOpcion` en `entrada.go` |
| 1 | `switch` sin expresión | `Efectividad` en `combate/dano.go` |
| 1 | Conversión explícita de tipos | `CalcularDano` (`float64` ↔ `int`) |
| 2 | Paquetes, exportar con mayúscula | cada carpeta; `nuevo` (privado) frente a `NewGuerrero` (exportado) |
| 2 | Múltiples retornos `(valor, error)` | casi todos los constructores; `Terminado()` con retornos con nombre |
| 2 | Función variádica | `grupo.New(monedas, miembros...)` |
| 2 | *Closure* | `anotar` en `TurnoEnemigos` |
| 2 | Función pura | `CalcularDano` |
| 3 | Array frente a slice | `Grupo.miembros` (array de 3) frente a `inventario` y `enemigos` (slices) |
| 3 | Map, «coma ok», valor cero | `nombres`, `catalogo`, `hechizosDeClase`, `Multiplicador` |
| 3 | `append`, `make`, quitar de un slice | `Vivos`, `SacarArma`, `nombresElementos` |
| 3 | Devolver copias del slice | `Hechizos()`, `Inventario()`, `Catalogo()` |
| 3 | Orden de un map | `Debilidades()` recorre `elemento.Todos()`, no el map |
| 4 | Structs y constructores `NewX` | todos los paquetes |
| 4 | Receptor de valor frente a puntero | getters de `Atributos` frente a `RecibirDano`, `Curar` |
| 4 | Incrustación y promoción | `Personaje` y `Enemigo` incrustan `atributos.Atributos` |
| 4 | Un método que tapa al promovido | `Personaje.Ataque()` suma el arma a `Atributos.Ataque()` |
| 5 | Campos no exportados y *getters* sin `Get` | `Atributos`, `Arma`, `Personaje`, `Grupo` |
| 5 | *Setter* que valida y devuelve `error` | `SetNombre`, `GastarMP`, `Equipar`, `GastarMonedas` |
| 5 | Cuándo sí exportar campos | `Hechizo` (dato simple sin reglas) |
| 5 | `errors.New`, `fmt.Errorf` con `%w` | variables `Err...` de cada paquete |
| 5 | Propagar y reconocer con `errors.Is` | `tienda.Comprar` → `menu_tienda.go`; MP en `menu_combate.go`; `io.EOF` en `main.go` |

## Para seguir (semanas 6 y 7)

- **Semana 6, interfaces:** `Personaje` y `Enemigo` ya tienen los mismos métodos (`Nombre`, `Vida`, `RecibirDano`, `EstaVivo`). Una interfaz `Combatiente` permitiría escribir una sola función de ataque para los dos. También se podría reemplazar el `switch` sobre la clase por un tipo por clase.
- **Semana 7, concurrencia, web y *testing*:** `CalcularDano` es una función pura, así que se prueba fácil con `go test`. Los paquetes de reglas no dependen de la consola, así que se pueden exponer como servicios web con JSON (por ejemplo, `GET /grupo` o `POST /tienda/comprar`).

## Ideas para practicar

1. Agrega un enemigo nuevo al catálogo con sus debilidades. ¿Cuántos archivos tuviste que tocar?
2. Agrega un hechizo **Hielo+** al mago negro: más potencia y más costo.
3. Agrega pociones a la tienda. ¿Dónde las guardarías: un slice, un map de nombre a cantidad o un struct nuevo?
4. Haz que `SetNombre` rechace nombres repetidos dentro del grupo. ¿En qué paquete va esa regla?
5. Cambia la recuperación después del combate: en vez de recuperarse gratis, que el grupo pague una posada de 20 monedas. ¿Qué error devuelves si no alcanza?
