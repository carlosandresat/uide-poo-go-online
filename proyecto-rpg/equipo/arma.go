// Paquete equipo: las armas que se compran y se equipan.
package equipo

import (
	"errors"
	"fmt"

	"rpg/elemento"
)

// ErrArmaInvalida indica datos imposibles al crear un arma.
var ErrArmaInvalida = errors.New("arma inválida")

// TipoArma decide qué clase puede usar el arma.
// Semana 1: constantes con iota.
type TipoArma int

const (
	Espada TipoArma = iota // guerrero
	Baculo                 // mago blanco
	Vara                   // mago negro
)

// Nombre devuelve el nombre legible del tipo de arma.
// Semana 1: switch, sin break (en Go cada caso termina solo).
func (t TipoArma) Nombre() string {
	switch t {
	case Espada:
		return "espada"
	case Baculo:
		return "báculo"
	case Vara:
		return "vara"
	default:
		return "desconocido"
	}
}

// Arma suma poder de ataque y poder mágico a quien la equipa.
// Un arma elemental cambia el elemento del ataque normal: la espada de fuego
// golpea con fuego, así que aprovecha la debilidad del enemigo al fuego.
// Semana 4: struct. Semana 5: campos privados, solo lectura con getters.
type Arma struct {
	nombre   string
	tipo     TipoArma
	ataque   int
	magia    int
	elemento elemento.Elemento
	precio   int
}

// NewArma valida y crea un arma.
// Semana 4: constructor. Semana 5: error si el arma no tiene sentido.
func NewArma(nombre string, tipo TipoArma, ataque, magia int, elem elemento.Elemento, precio int) (Arma, error) {
	if nombre == "" {
		return Arma{}, fmt.Errorf("sin nombre: %w", ErrArmaInvalida)
	}
	if ataque < 0 || magia < 0 || precio < 0 {
		return Arma{}, fmt.Errorf("%s con valores negativos: %w", nombre, ErrArmaInvalida)
	}
	return Arma{nombre: nombre, tipo: tipo, ataque: ataque, magia: magia, elemento: elem, precio: precio}, nil
}

// Semana 5: getters (receptor de valor: no modifican nada).

func (a Arma) Nombre() string              { return a.nombre }
func (a Arma) Tipo() TipoArma              { return a.tipo }
func (a Arma) Ataque() int                 { return a.ataque }
func (a Arma) Magia() int                  { return a.magia }
func (a Arma) Elemento() elemento.Elemento { return a.elemento }
func (a Arma) Precio() int                 { return a.precio }

// Vacia dice si el valor es el «valor cero» de Arma (ninguna arma).
// Semana 4: el valor cero de un struct tiene todos sus campos en cero.
func (a Arma) Vacia() bool { return a.nombre == "" }

// Descripcion arma una línea para los menús.
func (a Arma) Descripcion() string {
	texto := fmt.Sprintf("%-18s %-7s ATQ +%-2d MAG +%-2d", a.nombre, a.tipo.Nombre(), a.ataque, a.magia)
	if a.elemento != elemento.Fisico {
		texto += " [" + a.elemento.Nombre() + "]"
	}
	return texto
}
