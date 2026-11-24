// Paquete enemigo: los tipos de enemigo y sus debilidades.
package enemigo

import (
	"errors"
	"fmt"

	"rpg/atributos"
	"rpg/elemento"
)

// ErrTipoDesconocido indica que se pidió un enemigo que no está en el catálogo.
var ErrTipoDesconocido = errors.New("tipo de enemigo desconocido")

// Tipo de enemigo.
// Semana 1: constantes con iota.
type Tipo int

const (
	Slime Tipo = iota
	Esqueleto
	Golem
	Espectro
	LoboHelado
)

// plantilla guarda los datos fijos de cada tipo (privada al paquete).
type plantilla struct {
	nombre                     string
	vida, ataque, defensa, oro int
	afinidad                   map[elemento.Elemento]float64
}

// catalogo: un map de Tipo a plantilla (semana 3).
//
// La afinidad multiplica el daño recibido de cada elemento:
//
//	2   débil (doble daño)      0.5  resiste (mitad)      0  inmune
//
// Los elementos que no aparecen valen 1 (daño normal).
var catalogo = map[Tipo]plantilla{
	Slime: {nombre: "Slime", vida: 30, ataque: 9, defensa: 2, oro: 12,
		afinidad: map[elemento.Elemento]float64{elemento.Fuego: 2, elemento.Fisico: 0.5}},
	Esqueleto: {nombre: "Esqueleto", vida: 45, ataque: 12, defensa: 5, oro: 20,
		afinidad: map[elemento.Elemento]float64{elemento.Luz: 2, elemento.Fisico: 1.5, elemento.Hielo: 0.5}},
	Golem: {nombre: "Gólem", vida: 70, ataque: 14, defensa: 12, oro: 35,
		afinidad: map[elemento.Elemento]float64{elemento.Rayo: 2, elemento.Fisico: 0.5, elemento.Fuego: 0.5}},
	Espectro: {nombre: "Espectro", vida: 40, ataque: 13, defensa: 4, oro: 30,
		afinidad: map[elemento.Elemento]float64{elemento.Luz: 2, elemento.Fisico: 0}},
	LoboHelado: {nombre: "Lobo helado", vida: 50, ataque: 15, defensa: 6, oro: 25,
		afinidad: map[elemento.Elemento]float64{elemento.Fuego: 2, elemento.Fisico: 1.5, elemento.Hielo: 0}},
}

// Tipos devuelve todos los tipos, para elegir uno al azar.
func Tipos() []Tipo {
	return []Tipo{Slime, Esqueleto, Golem, Espectro, LoboHelado}
}

// Enemigo en combate.
// Semana 4: incrusta Atributos igual que Personaje; por eso ambos tienen
// Vida(), RecibirDano() y EstaVivo(). En la semana 6 eso permitirá una
// interfaz común (por ejemplo, Combatiente).
type Enemigo struct {
	atributos.Atributos
	nombre   string
	tipo     Tipo
	oro      int
	afinidad map[elemento.Elemento]float64
}

// New crea un enemigo a partir del catálogo.
// Semana 4: constructor. Semana 5: error si el tipo no existe.
func New(t Tipo) (*Enemigo, error) {
	p, ok := catalogo[t]
	if !ok {
		return nil, fmt.Errorf("tipo %d: %w", t, ErrTipoDesconocido)
	}
	attrs, err := atributos.New(p.vida, p.ataque, 0, p.defensa)
	if err != nil {
		return nil, fmt.Errorf("enemigo %s: %w", p.nombre, err)
	}
	return &Enemigo{Atributos: attrs, nombre: p.nombre, tipo: t, oro: p.oro, afinidad: p.afinidad}, nil
}

// Semana 5: getters.

func (e *Enemigo) Nombre() string { return e.nombre }
func (e *Enemigo) Tipo() Tipo     { return e.tipo }
func (e *Enemigo) Oro() int       { return e.oro }

// SetSufijo distingue enemigos repetidos: «Slime A», «Slime B».
func (e *Enemigo) SetSufijo(sufijo string) {
	e.nombre = catalogo[e.tipo].nombre + " " + sufijo
}

// Multiplicador devuelve cuánto se multiplica el daño de un elemento.
func (e *Enemigo) Multiplicador(el elemento.Elemento) float64 {
	if m, ok := e.afinidad[el]; ok { // semana 3: «coma ok»
		return m
	}
	return 1
}

// Debilidades lista los elementos que le hacen más daño.
// Semana 1: for con range. Semana 3: append sobre un slice vacío.
// Se recorre elemento.Todos() y no el map, porque el orden de un map es aleatorio.
func (e *Enemigo) Debilidades() []elemento.Elemento {
	var debiles []elemento.Elemento
	for _, el := range elemento.Todos() {
		if e.Multiplicador(el) > 1 {
			debiles = append(debiles, el)
		}
	}
	return debiles
}

// Resistencias lista los elementos que le hacen menos daño (o ninguno).
func (e *Enemigo) Resistencias() []elemento.Elemento {
	var fuertes []elemento.Elemento
	for _, el := range elemento.Todos() {
		if e.Multiplicador(el) < 1 {
			fuertes = append(fuertes, el)
		}
	}
	return fuertes
}
