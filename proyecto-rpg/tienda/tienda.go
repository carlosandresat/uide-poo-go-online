// Paquete tienda: el catálogo de armas y la compra y venta.
package tienda

import (
	"errors"
	"fmt"

	"rpg/elemento"
	"rpg/equipo"
	"rpg/grupo"
)

var ErrProductoInexistente = errors.New("ese producto no existe")

// Tienda vende un catálogo fijo de armas.
type Tienda struct {
	catalogo []equipo.Arma
}

// New arma el catálogo. Si alguna arma es inválida, devuelve el error.
func New() (*Tienda, error) {
	// Semana 3: slice de structs anónimos para escribir el catálogo como una tabla.
	datos := []struct {
		nombre        string
		tipo          equipo.TipoArma
		ataque, magia int
		elem          elemento.Elemento
		precio        int
	}{
		{"Espada larga", equipo.Espada, 8, 0, elemento.Fisico, 80},
		{"Espada de fuego", equipo.Espada, 7, 0, elemento.Fuego, 140},
		{"Espada de luz", equipo.Espada, 9, 2, elemento.Luz, 200},
		{"Báculo sagrado", equipo.Baculo, 2, 6, elemento.Fisico, 90},
		{"Báculo del alba", equipo.Baculo, 3, 10, elemento.Luz, 180},
		{"Vara rúnica", equipo.Vara, 1, 7, elemento.Fisico, 100},
		{"Vara del trueno", equipo.Vara, 2, 11, elemento.Rayo, 190},
	}
	t := &Tienda{}
	for _, d := range datos {
		a, err := equipo.NewArma(d.nombre, d.tipo, d.ataque, d.magia, d.elem, d.precio)
		if err != nil {
			return nil, fmt.Errorf("catálogo de la tienda: %w", err)
		}
		t.catalogo = append(t.catalogo, a)
	}
	return t, nil
}

// Catalogo devuelve una copia de las armas en venta.
func (t *Tienda) Catalogo() []equipo.Arma {
	return append([]equipo.Arma(nil), t.catalogo...)
}

// Comprar cobra al grupo y guarda el arma en su inventario.
// Semana 5: propagación de errores. Si GastarMonedas falla, el error sube
// envuelto con más contexto y quien llama todavía puede preguntar
// errors.Is(err, grupo.ErrMonedasInsuficientes).
func (t *Tienda) Comprar(g *grupo.Grupo, i int) (equipo.Arma, error) {
	if i < 0 || i >= len(t.catalogo) {
		return equipo.Arma{}, fmt.Errorf("producto %d: %w", i+1, ErrProductoInexistente)
	}
	a := t.catalogo[i]
	if err := g.GastarMonedas(a.Precio()); err != nil {
		return equipo.Arma{}, fmt.Errorf("no se pudo comprar %s: %w", a.Nombre(), err)
	}
	g.AgregarArma(a)
	return a, nil
}

// PrecioVenta: la tienda paga la mitad del precio.
func PrecioVenta(a equipo.Arma) int { return a.Precio() / 2 }

// Vender saca el arma del inventario y paga la mitad de su precio.
func (t *Tienda) Vender(g *grupo.Grupo, i int) (equipo.Arma, int, error) {
	a, err := g.SacarArma(i)
	if err != nil {
		return equipo.Arma{}, 0, fmt.Errorf("no se pudo vender: %w", err)
	}
	pago := PrecioVenta(a)
	if err := g.GanarMonedas(pago); err != nil {
		return equipo.Arma{}, 0, err
	}
	return a, pago, nil
}
