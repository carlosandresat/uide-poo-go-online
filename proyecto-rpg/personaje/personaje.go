// Paquete personaje: los miembros del grupo (guerrero, mago blanco, mago negro).
package personaje

import (
	"errors"
	"fmt"
	"strings"
	"unicode/utf8"

	"rpg/atributos"
	"rpg/elemento"
	"rpg/equipo"
)

// Semana 5: errores con nombre. Quien llama los reconoce con errors.Is
// aunque vengan envueltos con más contexto.
var (
	ErrNombreInvalido   = errors.New("nombre inválido")
	ErrMPInsuficiente   = errors.New("MP insuficiente")
	ErrArmaIncompatible = errors.New("arma incompatible con la clase")
)

// Clase del personaje.
// Semana 1: constantes con iota.
type Clase int

const (
	Guerrero Clase = iota
	MagoBlanco
	MagoNegro
)

// Nombre devuelve el nombre legible de la clase.
func (c Clase) Nombre() string {
	switch c {
	case Guerrero:
		return "Guerrero"
	case MagoBlanco:
		return "Mago blanco"
	case MagoNegro:
		return "Mago negro"
	default:
		return "Desconocida"
	}
}

// Semana 3: map para saber qué tipo de arma usa cada clase.
var armaDeClase = map[Clase]equipo.TipoArma{
	Guerrero:   equipo.Espada,
	MagoBlanco: equipo.Baculo,
	MagoNegro:  equipo.Vara,
}

// Personaje es un miembro del grupo.
//
// Semana 4: incrustación. Al escribir solo el tipo atributos.Atributos, sus
// métodos (Vida, RecibirDano, Curar...) se «promueven»: p.Vida() funciona
// como si Vida fuera de Personaje. Es composición, no herencia.
//
// Semana 6 (pendiente): aquí la clase es un campo y el código decide con
// switch. Con interfaces, cada clase podría ser su propio tipo.
type Personaje struct {
	atributos.Atributos
	nombre   string
	clase    Clase
	mp       int
	mpMax    int
	arma     equipo.Arma
	hechizos []Hechizo
}

// nuevo es el constructor común (en minúscula: privado al paquete).
// Semana 2: función con múltiples retornos (valor, error).
func nuevo(nombre string, clase Clase, vida, mp, ataque, magia, defensa int, arma equipo.Arma) (*Personaje, error) {
	attrs, err := atributos.New(vida, ataque, magia, defensa)
	if err != nil {
		return nil, fmt.Errorf("personaje %q: %w", nombre, err)
	}
	p := &Personaje{Atributos: attrs, clase: clase, mp: mp, mpMax: mp, hechizos: hechizosDeClase[clase]}
	// Semana 5: el constructor reutiliza los setters para no repetir validaciones.
	if err := p.SetNombre(nombre); err != nil {
		return nil, err
	}
	if _, err := p.Equipar(arma); err != nil {
		return nil, err
	}
	return p, nil
}

// Semana 4: constructores NewX, uno por clase. Cada clase tiene un perfil:
// el guerrero pega fuerte y aguanta; los magos dependen del poder mágico.
// Orden: vida, MP, ataque, magia, defensa.

func NewGuerrero(nombre string, arma equipo.Arma) (*Personaje, error) {
	return nuevo(nombre, Guerrero, 120, 0, 16, 2, 8, arma)
}

func NewMagoBlanco(nombre string, arma equipo.Arma) (*Personaje, error) {
	return nuevo(nombre, MagoBlanco, 80, 40, 6, 14, 4, arma)
}

func NewMagoNegro(nombre string, arma equipo.Arma) (*Personaje, error) {
	return nuevo(nombre, MagoNegro, 70, 45, 5, 18, 3, arma)
}

// --- Getters (semana 5) ---

func (p *Personaje) Nombre() string    { return p.nombre }
func (p *Personaje) Clase() Clase      { return p.clase }
func (p *Personaje) MP() int           { return p.mp }
func (p *Personaje) MPMax() int        { return p.mpMax }
func (p *Personaje) Arma() equipo.Arma { return p.arma }

// Ataque es el poder de ataque total: el del personaje más el del arma.
// Semana 4: este método «tapa» al Ataque() promovido de Atributos. El del
// struct externo tiene prioridad; al de adentro se llega con p.Atributos.Ataque().
func (p *Personaje) Ataque() int { return p.Atributos.Ataque() + p.arma.Ataque() }

// Magia es el poder mágico total (personaje + arma).
func (p *Personaje) Magia() int { return p.Atributos.Magia() + p.arma.Magia() }

// ElementoAtaque es el elemento del ataque normal: el del arma equipada.
func (p *Personaje) ElementoAtaque() elemento.Elemento { return p.arma.Elemento() }

// Hechizos devuelve una copia de la lista.
// Semana 3 y 5: si devolviéramos p.hechizos, quien llama compartiría el
// arreglo subyacente y podría modificarlo desde afuera.
func (p *Personaje) Hechizos() []Hechizo {
	return append([]Hechizo(nil), p.hechizos...)
}

// --- Setters y métodos que cambian el estado (semana 5) ---

// SetNombre valida antes de asignar: entre 1 y 12 caracteres.
func (p *Personaje) SetNombre(nombre string) error {
	nombre = strings.TrimSpace(nombre)
	// utf8.RuneCountInString cuenta caracteres; len cuenta bytes ("ñ" ocupa 2).
	if n := utf8.RuneCountInString(nombre); n == 0 || n > 12 {
		return fmt.Errorf("%q debe tener entre 1 y 12 caracteres: %w", nombre, ErrNombreInvalido)
	}
	p.nombre = nombre
	return nil
}

// GastarMP descuenta MP solo si alcanza. Si no, no cambia nada y devuelve error.
func (p *Personaje) GastarMP(costo int) error {
	if costo > p.mp {
		return fmt.Errorf("%s necesita %d MP y tiene %d: %w", p.nombre, costo, p.mp, ErrMPInsuficiente)
	}
	p.mp -= costo
	return nil
}

// PuedeUsar dice si la clase del personaje admite el arma.
func (p *Personaje) PuedeUsar(a equipo.Arma) bool {
	return a.Tipo() == armaDeClase[p.clase]
}

// Equipar cambia el arma y devuelve la anterior para guardarla en el inventario.
// Si el arma no es de su clase, devuelve error y no cambia nada.
func (p *Personaje) Equipar(a equipo.Arma) (equipo.Arma, error) {
	if !p.PuedeUsar(a) {
		return equipo.Arma{}, fmt.Errorf("%s (%s) no puede usar %s (%s): %w",
			p.nombre, p.clase.Nombre(), a.Nombre(), a.Tipo().Nombre(), ErrArmaIncompatible)
	}
	anterior := p.arma
	p.arma = a
	return anterior, nil
}

// RecuperarTodo devuelve vida y MP al máximo.
func (p *Personaje) RecuperarTodo() {
	p.Restaurar() // método promovido desde Atributos (semana 4)
	p.mp = p.mpMax
}
