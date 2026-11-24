// Paquete atributos: vida, ataque, magia y defensa. Lo comparten personajes y
// enemigos incrustándolo (semana 4).
package atributos

import (
	"errors"
	"fmt"
)

// ErrValorInvalido indica que un atributo no tiene sentido (vida 0, ataque negativo...).
// Semana 5: error con nombre, para compararlo con errors.Is.
var ErrValorInvalido = errors.New("valor de atributo inválido")

// Atributos agrupa las estadísticas de combate.
// Semana 4: struct. Semana 5: campos en minúscula (encapsulación): fuera del
// paquete nadie puede escribir a.vida = 9999; solo se cambian con los métodos.
type Atributos struct {
	vida        int
	vidaMax     int
	ataque      int // poder de ataque (golpes físicos)
	magia       int // poder mágico (hechizos)
	defensa     int
	defendiendo bool
}

// New crea unos atributos válidos con la vida al máximo.
// Semana 4: constructor. Semana 5: devuelve un error si los datos no son válidos.
func New(vidaMax, ataque, magia, defensa int) (Atributos, error) {
	if vidaMax <= 0 {
		// Semana 5: %w envuelve el error para que errors.Is lo siga reconociendo.
		return Atributos{}, fmt.Errorf("vida máxima %d: %w", vidaMax, ErrValorInvalido)
	}
	if ataque < 0 || magia < 0 || defensa < 0 {
		return Atributos{}, fmt.Errorf("ataque %d, magia %d, defensa %d: %w", ataque, magia, defensa, ErrValorInvalido)
	}
	return Atributos{vida: vidaMax, vidaMax: vidaMax, ataque: ataque, magia: magia, defensa: defensa}, nil
}

// Semana 5: getters. En Go no se antepone «Get»: es Vida(), no GetVida().
// Receptor de valor porque solo leen.

func (a Atributos) Vida() int         { return a.vida }
func (a Atributos) VidaMax() int      { return a.vidaMax }
func (a Atributos) Ataque() int       { return a.ataque }
func (a Atributos) Magia() int        { return a.magia }
func (a Atributos) Defensa() int      { return a.defensa }
func (a Atributos) EstaVivo() bool    { return a.vida > 0 }
func (a Atributos) Defendiendo() bool { return a.defendiendo }

// RecibirDano resta vida y devuelve el daño que realmente se aplicó.
// Semana 4: receptor puntero, porque modifica el struct.
func (a *Atributos) RecibirDano(dano int) int {
	if dano < 0 {
		dano = 0
	}
	if a.defendiendo {
		dano /= 2 // defenderse reduce el golpe a la mitad
	}
	if dano > a.vida {
		dano = a.vida // la vida nunca baja de 0
	}
	a.vida -= dano
	return dano
}

// Curar suma vida sin pasar del máximo y devuelve lo que realmente curó.
// A un caído no se le cura (todavía no hay hechizo de revivir).
func (a *Atributos) Curar(cantidad int) int {
	if !a.EstaVivo() || cantidad <= 0 {
		return 0
	}
	if a.vida+cantidad > a.vidaMax {
		cantidad = a.vidaMax - a.vida
	}
	a.vida += cantidad
	return cantidad
}

// Defender reduce a la mitad el daño que llegue hasta el siguiente turno.
func (a *Atributos) Defender() { a.defendiendo = true }

// DejarDeDefender se llama al empezar cada ronda.
func (a *Atributos) DejarDeDefender() { a.defendiendo = false }

// Restaurar devuelve la vida al máximo (al terminar un combate).
func (a *Atributos) Restaurar() {
	a.vida = a.vidaMax
	a.defendiendo = false
}
