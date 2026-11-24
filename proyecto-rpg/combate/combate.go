// Paquete combate: las reglas de un combate por turnos.
// No lee del teclado ni imprime: devuelve textos y errores, y el menú
// (paquete main) decide qué mostrar. Separar reglas e interfaz es lo que
// después permitirá convertir el juego en un servicio web (semana 7).
package combate

import (
	"errors"
	"fmt"
	"math/rand/v2"

	"rpg/elemento"
	"rpg/enemigo"
	"rpg/grupo"
	"rpg/personaje"
)

var (
	ErrObjetivoInvalido = errors.New("objetivo inválido")
	ErrHechizoInvalido  = errors.New("hechizo inválido")
	ErrNoPuedeActuar    = errors.New("el personaje no puede actuar")
)

// Combate guarda el estado de una pelea.
type Combate struct {
	grupo    *grupo.Grupo
	enemigos []*enemigo.Enemigo // semana 3: slice, porque son de 1 a 3
	rng      *rand.Rand
	ronda    int
}

// New genera de 1 a 3 enemigos al azar.
func New(g *grupo.Grupo, rng *rand.Rand) (*Combate, error) {
	c := &Combate{grupo: g, rng: rng}
	tipos := enemigo.Tipos()
	cantidad := 1 + rng.IntN(3)

	// Semana 3: map para contar cuántos hay de cada tipo.
	repetidos := map[enemigo.Tipo]int{}
	for i := 0; i < cantidad; i++ { // semana 1: for clásico de tres partes
		e, err := enemigo.New(tipos[rng.IntN(len(tipos))])
		if err != nil {
			return nil, fmt.Errorf("no se pudo iniciar el combate: %w", err)
		}
		repetidos[e.Tipo()]++
		c.enemigos = append(c.enemigos, e)
	}
	// Si hay dos del mismo tipo, se les pone letra: «Slime A», «Slime B».
	letras := map[enemigo.Tipo]int{}
	for _, e := range c.enemigos {
		if repetidos[e.Tipo()] > 1 {
			e.SetSufijo(string(rune('A' + letras[e.Tipo()])))
			letras[e.Tipo()]++
		}
	}
	return c, nil
}

// Enemigos devuelve una copia del slice (los punteros apuntan a los mismos enemigos).
func (c *Combate) Enemigos() []*enemigo.Enemigo {
	return append([]*enemigo.Enemigo(nil), c.enemigos...)
}

func (c *Combate) Ronda() int { return c.ronda }

// IniciarRonda avanza el contador y quita la defensa de la ronda anterior.
func (c *Combate) IniciarRonda() {
	c.ronda++
	for _, p := range c.grupo.Vivos() {
		p.DejarDeDefender()
	}
}

// Terminado dice si acabó el combate y si el grupo ganó.
// Semana 2: dos valores de retorno con nombre.
func (c *Combate) Terminado() (terminado, victoria bool) {
	if c.grupo.TodosCaidos() {
		return true, false
	}
	for _, e := range c.enemigos {
		if e.EstaVivo() {
			return false, false
		}
	}
	return true, true
}

// Recompensa suma las monedas de todos los enemigos.
func (c *Combate) Recompensa() int {
	total := 0
	for _, e := range c.enemigos {
		total += e.Oro()
	}
	return total
}

// variacion da un número entre 0.9 y 1.1 para que el daño no sea siempre igual.
func (c *Combate) variacion() float64 { return 0.9 + c.rng.Float64()*0.2 }

// enemigoVivo valida el índice del objetivo.
func (c *Combate) enemigoVivo(i int) (*enemigo.Enemigo, error) {
	if i < 0 || i >= len(c.enemigos) {
		return nil, fmt.Errorf("enemigo %d: %w", i+1, ErrObjetivoInvalido)
	}
	e := c.enemigos[i]
	if !e.EstaVivo() {
		return nil, fmt.Errorf("%s ya fue derrotado: %w", e.Nombre(), ErrObjetivoInvalido)
	}
	return e, nil
}

// golpear aplica daño de un elemento a un enemigo y arma el mensaje.
func (c *Combate) golpear(e *enemigo.Enemigo, poder int, el elemento.Elemento) string {
	mult := e.Multiplicador(el)
	dano := e.RecibirDano(CalcularDano(poder, e.Defensa(), mult, c.variacion()))
	texto := fmt.Sprintf("%s recibe %d de daño (%s).%s", e.Nombre(), dano, el.Nombre(), Efectividad(mult))
	if !e.EstaVivo() {
		texto += fmt.Sprintf(" ¡%s cae!", e.Nombre())
	}
	return texto
}

// Atacar: ataque normal con el poder de ataque y el elemento del arma.
func (c *Combate) Atacar(p *personaje.Personaje, objetivo int) (string, error) {
	if !p.EstaVivo() {
		return "", fmt.Errorf("%s: %w", p.Nombre(), ErrNoPuedeActuar)
	}
	e, err := c.enemigoVivo(objetivo)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s ataca con %s. ", p.Nombre(), p.Arma().Nombre()) +
		c.golpear(e, p.Ataque(), p.ElementoAtaque()), nil
}

// LanzarHechizo usa el poder mágico. Un hechizo de curación apunta a un
// miembro del grupo; uno de ataque, a un enemigo.
// Semana 5: si falta MP, el error de personaje sube tal cual (ya trae contexto).
func (c *Combate) LanzarHechizo(p *personaje.Personaje, hechizo, objetivo int) (string, error) {
	if !p.EstaVivo() {
		return "", fmt.Errorf("%s: %w", p.Nombre(), ErrNoPuedeActuar)
	}
	hechizos := p.Hechizos()
	if hechizo < 0 || hechizo >= len(hechizos) {
		return "", fmt.Errorf("%s no conoce ese hechizo: %w", p.Nombre(), ErrHechizoInvalido)
	}
	h := hechizos[hechizo]
	poder := h.Potencia + p.Magia()

	switch h.Tipo {
	case personaje.Curacion:
		aliado, err := c.grupo.Miembro(objetivo)
		if err != nil {
			return "", err
		}
		if !aliado.EstaVivo() {
			return "", fmt.Errorf("%s está caído y Cura no revive: %w", aliado.Nombre(), ErrObjetivoInvalido)
		}
		if err := p.GastarMP(h.Costo); err != nil {
			return "", err
		}
		curado := aliado.Curar(poder)
		return fmt.Sprintf("%s lanza %s. %s recupera %d de vida.", p.Nombre(), h.Nombre, aliado.Nombre(), curado), nil

	default: // personaje.Ataque
		e, err := c.enemigoVivo(objetivo)
		if err != nil {
			return "", err
		}
		// Primero se valida el objetivo y después se gasta el MP:
		// así un error no le cuesta MP al jugador.
		if err := p.GastarMP(h.Costo); err != nil {
			return "", err
		}
		return fmt.Sprintf("%s lanza %s. ", p.Nombre(), h.Nombre) + c.golpear(e, poder, h.Elemento), nil
	}
}

// Defender reduce a la mitad el daño hasta la próxima ronda.
func (c *Combate) Defender(p *personaje.Personaje) string {
	p.Defender()
	return p.Nombre() + " se pone en guardia."
}

// TurnoEnemigos: cada enemigo vivo ataca a un miembro vivo al azar.
func (c *Combate) TurnoEnemigos() []string {
	var registro []string
	// Semana 2: closure + función variádica. anotar «recuerda» la variable
	// registro del método y le agrega líneas cada vez que se llama.
	anotar := func(formato string, args ...any) {
		registro = append(registro, fmt.Sprintf(formato, args...))
	}

	for _, e := range c.enemigos {
		if !e.EstaVivo() {
			continue
		}
		vivos := c.grupo.Vivos()
		if len(vivos) == 0 {
			break
		}
		p := vivos[c.rng.IntN(len(vivos))]
		guardia := ""
		if p.Defendiendo() {
			guardia = " (se defendió)"
		}
		dano := p.RecibirDano(CalcularDano(e.Ataque(), p.Defensa(), 1, c.variacion()))
		anotar("%s ataca a %s: %d de daño%s.", e.Nombre(), p.Nombre(), dano, guardia)
		if !p.EstaVivo() {
			anotar("¡%s cae!", p.Nombre())
		}
	}
	return registro
}
