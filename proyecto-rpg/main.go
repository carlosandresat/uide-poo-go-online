// RPG por turnos: proyecto de ejemplo del curso, con lo visto hasta la semana 5.
//
// Ejecutar desde esta carpeta:   go run .
// Misma partida cada vez:        go run . -semilla 42
//
// Cada comentario «Semana N» señala el concepto que ilustra esa parte.
package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"math/rand/v2"
	"os"
	"time"

	"rpg/elemento"
	"rpg/equipo"
	"rpg/grupo"
	"rpg/personaje"
	"rpg/tienda"
)

const monedasIniciales = 100 // semana 1: constante

func main() {
	semilla := flag.Uint64("semilla", 0, "semilla del azar (0 = una distinta cada vez)")
	flag.Parse()
	if *semilla == 0 {
		*semilla = uint64(time.Now().UnixNano())
	}
	rng := rand.New(rand.NewPCG(*semilla, 0))

	// Semana 5: si algo falla al crear el mundo, no tiene sentido seguir.
	g, err := crearGrupo()
	if err != nil {
		fmt.Println("Error al crear el grupo:", err)
		os.Exit(1)
	}
	t, err := tienda.New()
	if err != nil {
		fmt.Println("Error al crear la tienda:", err)
		os.Exit(1)
	}

	titulo("RPG POR TURNOS · POO con Go")
	fmt.Println("Tu grupo está listo para la aventura.")

	// Semana 1: el menú es un for infinito con un switch.
	for {
		fmt.Printf("\n--- MENÚ PRINCIPAL (monedas: %d) ---\n", g.Monedas())
		fmt.Println("1. Iniciar combate")
		fmt.Println("2. Tienda de armas")
		fmt.Println("3. Cambiar equipamiento")
		fmt.Println("4. Ver grupo")
		fmt.Println("0. Salir")
		opcion, err := leerOpcion("> ", 0, 4)
		if err == nil {
			switch opcion {
			case 1:
				err = menuCombate(g, rng)
			case 2:
				err = menuTienda(g, t)
			case 3:
				err = menuEquipo(g)
			case 4:
				mostrarGrupo(g)
			case 0:
				fmt.Println("¡Hasta la próxima aventura!")
				return
			}
		}
		// Semana 5: errors.Is reconoce io.EOF aunque venga envuelto.
		if errors.Is(err, io.EOF) {
			fmt.Println("Fin de la entrada. ¡Hasta la próxima aventura!")
			return
		}
		if err != nil {
			fmt.Println("Error:", err)
		}
	}
}

// crearGrupo arma el party inicial: un personaje de cada clase.
// Semana 2: función auxiliar que devuelve (valor, error) y propaga errores.
func crearGrupo() (*grupo.Grupo, error) {
	espada, err := equipo.NewArma("Espada corta", equipo.Espada, 4, 0, elemento.Fisico, 30)
	if err != nil {
		return nil, err
	}
	baculo, err := equipo.NewArma("Báculo de roble", equipo.Baculo, 1, 3, elemento.Fisico, 30)
	if err != nil {
		return nil, err
	}
	vara, err := equipo.NewArma("Vara de aprendiz", equipo.Vara, 1, 3, elemento.Fisico, 30)
	if err != nil {
		return nil, err
	}

	guerrero, err := personaje.NewGuerrero("Aldric", espada)
	if err != nil {
		return nil, err
	}
	blanco, err := personaje.NewMagoBlanco("Lumen", baculo)
	if err != nil {
		return nil, err
	}
	negro, err := personaje.NewMagoNegro("Morgana", vara)
	if err != nil {
		return nil, err
	}
	// Semana 2: llamada a una función variádica con tres argumentos.
	return grupo.New(monedasIniciales, guerrero, blanco, negro)
}

// mostrarGrupo imprime el estado de cada personaje.
func mostrarGrupo(g *grupo.Grupo) {
	titulo("GRUPO")
	for i, p := range g.Miembros() {
		fmt.Printf("%d. %-8s %-11s Vida %3d/%-3d %s  MP %2d/%-2d\n",
			i+1, p.Nombre(), p.Clase().Nombre(), p.Vida(), p.VidaMax(),
			barra(p.Vida(), p.VidaMax(), 10), p.MP(), p.MPMax())
		fmt.Printf("   Ataque %2d · Magia %2d · Defensa %2d · Arma: %s\n",
			p.Ataque(), p.Magia(), p.Defensa(), p.Arma().Nombre())
	}
	fmt.Printf("Monedas: %d · Armas guardadas: %d\n", g.Monedas(), len(g.Inventario()))
}
