// Paquete grupo: el party de tres personajes, sus monedas y su inventario.
package grupo

import (
	"errors"
	"fmt"

	"rpg/equipo"
	"rpg/personaje"
)

var (
	ErrMonedasInsuficientes = errors.New("monedas insuficientes")
	ErrCantidadInvalida     = errors.New("cantidad inválida")
	ErrIndiceInvalido       = errors.New("índice fuera de rango")
	ErrGrupoIncompleto      = errors.New("el grupo necesita exactamente 3 personajes")
)

// Tamano del grupo. Semana 1: constante.
const Tamano = 3

// Grupo reúne a los personajes, las monedas y las armas guardadas.
//
// Semana 3: miembros es un ARRAY (tamaño fijo, siempre 3), mientras que el
// inventario es un SLICE (crece al comprar). Elegir uno u otro es parte del diseño.
// Semana 5: monedas es privado: solo cambia con GanarMonedas y GastarMonedas.
type Grupo struct {
	miembros   [Tamano]*personaje.Personaje
	monedas    int
	inventario []equipo.Arma
}

// New crea el grupo.
// Semana 2: función variádica: recibe cualquier cantidad de personajes
// (miembros es un []*Personaje adentro) y valida que sean 3.
func New(monedas int, miembros ...*personaje.Personaje) (*Grupo, error) {
	if len(miembros) != Tamano {
		return nil, fmt.Errorf("recibió %d: %w", len(miembros), ErrGrupoIncompleto)
	}
	if monedas < 0 {
		return nil, fmt.Errorf("monedas iniciales %d: %w", monedas, ErrCantidadInvalida)
	}
	g := &Grupo{monedas: monedas}
	for i, m := range miembros {
		if m == nil {
			return nil, fmt.Errorf("el miembro %d es nil: %w", i+1, ErrGrupoIncompleto)
		}
		g.miembros[i] = m
	}
	return g, nil
}

// Miembros devuelve una copia del array (en Go, asignar un array copia sus
// elementos; aquí se copian los punteros, así que apuntan a los mismos personajes).
func (g *Grupo) Miembros() [Tamano]*personaje.Personaje { return g.miembros }

// Miembro devuelve el personaje en la posición i (desde 0).
func (g *Grupo) Miembro(i int) (*personaje.Personaje, error) {
	if i < 0 || i >= Tamano {
		return nil, fmt.Errorf("miembro %d: %w", i+1, ErrIndiceInvalido)
	}
	return g.miembros[i], nil
}

// Vivos devuelve los personajes que siguen en pie.
func (g *Grupo) Vivos() []*personaje.Personaje {
	vivos := make([]*personaje.Personaje, 0, Tamano) // semana 3: make con len 0 y cap 3
	for _, m := range g.miembros {
		if m.EstaVivo() {
			vivos = append(vivos, m)
		}
	}
	return vivos
}

// TodosCaidos dice si el grupo perdió el combate.
func (g *Grupo) TodosCaidos() bool { return len(g.Vivos()) == 0 }

// RecuperarTodos restaura vida y MP de todo el grupo.
func (g *Grupo) RecuperarTodos() {
	for _, m := range g.miembros {
		m.RecuperarTodo()
	}
}

// --- Monedas (semana 5: getter y métodos que validan) ---

func (g *Grupo) Monedas() int { return g.monedas }

func (g *Grupo) GanarMonedas(n int) error {
	if n < 0 {
		return fmt.Errorf("ganar %d: %w", n, ErrCantidadInvalida)
	}
	g.monedas += n
	return nil
}

func (g *Grupo) GastarMonedas(n int) error {
	if n < 0 {
		return fmt.Errorf("gastar %d: %w", n, ErrCantidadInvalida)
	}
	if n > g.monedas {
		return fmt.Errorf("necesitas %d y tienes %d: %w", n, g.monedas, ErrMonedasInsuficientes)
	}
	g.monedas -= n
	return nil
}

// --- Inventario de armas ---

// Inventario devuelve una copia para que nadie lo modifique desde afuera.
func (g *Grupo) Inventario() []equipo.Arma {
	return append([]equipo.Arma(nil), g.inventario...)
}

func (g *Grupo) AgregarArma(a equipo.Arma) {
	if !a.Vacia() {
		g.inventario = append(g.inventario, a)
	}
}

// SacarArma quita el arma en la posición i y la devuelve.
// Semana 3: quitar un elemento de un slice uniendo lo de antes y lo de después.
func (g *Grupo) SacarArma(i int) (equipo.Arma, error) {
	if i < 0 || i >= len(g.inventario) {
		return equipo.Arma{}, fmt.Errorf("arma %d: %w", i+1, ErrIndiceInvalido)
	}
	a := g.inventario[i]
	g.inventario = append(g.inventario[:i], g.inventario[i+1:]...)
	return a, nil
}
