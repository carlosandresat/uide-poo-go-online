// Paquete elemento: los tipos de daño del juego (físico y mágicos).
//
// Semana 2: cada carpeta es un paquete; lo que empieza con mayúscula se exporta.
package elemento

// Elemento es un tipo propio basado en int.
// Semana 1: constantes con iota (Fisico = 0, Fuego = 1, ...).
type Elemento int

const (
	Fisico Elemento = iota // el ataque normal
	Fuego
	Hielo
	Rayo
	Luz
)

// Semana 3: un map de Elemento a texto.
var nombres = map[Elemento]string{
	Fisico: "físico",
	Fuego:  "fuego",
	Hielo:  "hielo",
	Rayo:   "rayo",
	Luz:    "luz",
}

// Nombre devuelve el nombre legible del elemento.
// Semana 4: un método sobre un tipo propio (receptor de valor).
func (e Elemento) Nombre() string {
	// Semana 3: el modismo «coma ok» distingue «no está» de «está vacío».
	if n, ok := nombres[e]; ok {
		return n
	}
	return "desconocido"
}

// Todos devuelve los elementos en orden.
// Semana 3: un slice literal.
func Todos() []Elemento {
	return []Elemento{Fisico, Fuego, Hielo, Rayo, Luz}
}
