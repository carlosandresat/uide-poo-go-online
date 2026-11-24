package main

import (
	"errors"
	"fmt"
	"math/rand/v2"
	"strings"

	"rpg/combate"
	"rpg/elemento"
	"rpg/grupo"
	"rpg/personaje"
)

// menuCombate dirige un combate completo. Las reglas están en el paquete
// combate; aquí solo se pregunta al jugador y se muestran los resultados.
func menuCombate(g *grupo.Grupo, rng *rand.Rand) error {
	c, err := combate.New(g, rng)
	if err != nil {
		return err
	}
	titulo("¡COMBATE!")
	for _, e := range c.Enemigos() {
		fmt.Printf("Aparece %s.\n", e.Nombre())
	}

	for {
		c.IniciarRonda()
		fmt.Printf("\n—— Ronda %d ——\n", c.Ronda())

		// Turno del grupo: cada personaje vivo elige una acción.
		for _, p := range g.Vivos() {
			if fin, _ := c.Terminado(); fin {
				break
			}
			mostrarCombate(c, g)
			huir, err := turnoPersonaje(c, g, p)
			if err != nil {
				return err // solo llega aquí si se acabó la entrada
			}
			if huir {
				fmt.Println("El grupo huye del combate.")
				g.RecuperarTodos()
				return nil
			}
		}

		// Turno de los enemigos.
		if fin, _ := c.Terminado(); !fin {
			fmt.Println()
			for _, linea := range c.TurnoEnemigos() {
				fmt.Println("  " + linea)
			}
		}

		if fin, victoria := c.Terminado(); fin {
			return terminarCombate(c, g, victoria)
		}
	}
}

func terminarCombate(c *combate.Combate, g *grupo.Grupo, victoria bool) error {
	if victoria {
		oro := c.Recompensa()
		if err := g.GanarMonedas(oro); err != nil {
			return err
		}
		titulo(fmt.Sprintf("¡VICTORIA! Ganas %d monedas.", oro))
	} else {
		perdida := g.Monedas() / 2
		if err := g.GastarMonedas(perdida); err != nil {
			return err
		}
		titulo(fmt.Sprintf("DERROTA. Pierdes %d monedas.", perdida))
	}
	// Por ahora no hay posada ni pociones: el grupo se recupera al terminar.
	g.RecuperarTodos()
	return nil
}

// turnoPersonaje repite hasta que el jugador haga una acción válida.
// Devuelve huir = true si el jugador escapa.
func turnoPersonaje(c *combate.Combate, g *grupo.Grupo, p *personaje.Personaje) (huir bool, err error) {
	for {
		fmt.Printf("\nTurno de %s (%s). ¿Qué hace?\n", p.Nombre(), p.Clase().Nombre())
		fmt.Println("1. Atacar   2. Magia   3. Defender   4. Examinar enemigo   5. Huir")
		accion, err := leerOpcion("> ", 1, 5)
		if err != nil {
			return false, err
		}

		var texto string
		var errAccion error
		switch accion {
		case 1:
			obj, err := elegirEnemigo(c)
			if err != nil {
				return false, err
			}
			if obj < 0 {
				continue // volvió atrás
			}
			texto, errAccion = c.Atacar(p, obj)
		case 2:
			texto, errAccion, err = turnoMagia(c, g, p)
			if err != nil {
				return false, err
			}
			if texto == "" && errAccion == nil {
				continue // volvió atrás
			}
		case 3:
			texto = c.Defender(p)
		case 4:
			if err := examinar(c); err != nil {
				return false, err
			}
			continue // examinar no gasta el turno
		case 5:
			return true, nil
		}

		// Semana 5: el error se muestra y se vuelve a pedir la acción.
		// errors.Is permite dar un consejo según el tipo de error.
		if errAccion != nil {
			fmt.Println("  No se pudo:", errAccion)
			if errors.Is(errAccion, personaje.ErrMPInsuficiente) {
				fmt.Println("  Consejo: usa un ataque normal o defiéndete.")
			}
			continue
		}
		fmt.Println("  " + texto)
		return false, nil
	}
}

// turnoMagia elige hechizo y objetivo. Devuelve el texto de la acción, el
// error de la acción (MP insuficiente, objetivo inválido...) y un error de
// entrada aparte. Texto y error vacíos significan «volver atrás».
func turnoMagia(c *combate.Combate, g *grupo.Grupo, p *personaje.Personaje) (string, error, error) {
	hechizos := p.Hechizos()
	if len(hechizos) == 0 {
		return "", fmt.Errorf("%s no sabe magia", p.Nombre()), nil
	}
	fmt.Printf("Hechizos de %s (MP %d/%d):\n", p.Nombre(), p.MP(), p.MPMax())
	for i, h := range hechizos {
		tipo := "daño de " + h.Elemento.Nombre()
		if h.Tipo == personaje.Curacion {
			tipo = "cura a un aliado"
		}
		fmt.Printf("%d. %-9s %2d MP  (%s)\n", i+1, h.Nombre, h.Costo, tipo)
	}
	fmt.Println("0. Volver")
	n, err := leerOpcion("> ", 0, len(hechizos))
	if err != nil || n == 0 {
		return "", nil, err
	}
	h := hechizos[n-1]

	var obj int
	if h.Tipo == personaje.Curacion {
		obj, err = elegirAliado(g)
	} else {
		obj, err = elegirEnemigo(c)
	}
	if err != nil || obj < 0 {
		return "", nil, err
	}
	texto, errAccion := c.LanzarHechizo(p, n-1, obj)
	return texto, errAccion, nil
}

// elegirEnemigo devuelve el índice (desde 0) o -1 para volver.
func elegirEnemigo(c *combate.Combate) (int, error) {
	enemigos := c.Enemigos()
	fmt.Println("¿A quién?")
	for i, e := range enemigos {
		estado := fmt.Sprintf("vida %d/%d", e.Vida(), e.VidaMax())
		if !e.EstaVivo() {
			estado = "derrotado"
		}
		fmt.Printf("%d. %s (%s)\n", i+1, e.Nombre(), estado)
	}
	fmt.Println("0. Volver")
	n, err := leerOpcion("> ", 0, len(enemigos))
	return n - 1, err
}

func elegirAliado(g *grupo.Grupo) (int, error) {
	fmt.Println("¿A quién?")
	for i, p := range g.Miembros() {
		fmt.Printf("%d. %s (vida %d/%d)\n", i+1, p.Nombre(), p.Vida(), p.VidaMax())
	}
	fmt.Println("0. Volver")
	n, err := leerOpcion("> ", 0, grupo.Tamano)
	return n - 1, err
}

// examinar muestra debilidades y resistencias de un enemigo.
func examinar(c *combate.Combate) error {
	n, err := elegirEnemigo(c)
	if err != nil || n < 0 {
		return err
	}
	e := c.Enemigos()[n]
	fmt.Printf("  %s · vida %d/%d · ataque %d · defensa %d\n", e.Nombre(), e.Vida(), e.VidaMax(), e.Ataque(), e.Defensa())
	fmt.Println("  Débil a:   " + nombresElementos(e.Debilidades()))
	fmt.Println("  Resiste:   " + nombresElementos(e.Resistencias()))
	return nil
}

// nombresElementos une los nombres con comas.
// Semana 3: make con la longitud justa y asignación por índice.
func nombresElementos(lista []elemento.Elemento) string {
	if len(lista) == 0 {
		return "nada"
	}
	nombres := make([]string, len(lista))
	for i, el := range lista {
		nombres[i] = el.Nombre()
	}
	return strings.Join(nombres, ", ")
}

func mostrarCombate(c *combate.Combate, g *grupo.Grupo) {
	fmt.Println()
	for _, e := range c.Enemigos() {
		if e.EstaVivo() {
			fmt.Printf("  %-13s %s %3d/%-3d\n", e.Nombre(), barra(e.Vida(), e.VidaMax(), 10), e.Vida(), e.VidaMax())
		}
	}
	fmt.Println("  ·····")
	for _, p := range g.Miembros() {
		fmt.Printf("  %-13s %s %3d/%-3d  MP %2d\n", p.Nombre(), barra(p.Vida(), p.VidaMax(), 10), p.Vida(), p.VidaMax(), p.MP())
	}
}
