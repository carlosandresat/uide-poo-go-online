package personaje

import "rpg/elemento"

// TipoHechizo separa los hechizos que dañan de los que curan.
// Semana 1: constantes con iota.
type TipoHechizo int

const (
	Ataque TipoHechizo = iota
	Curacion
)

// Hechizo es un dato simple, sin reglas que proteger: por eso sus campos
// van en mayúscula (exportados). Compáralo con Personaje, que sí tiene
// reglas (la vida no baja de 0, el MP no se gasta si no alcanza) y por eso
// esconde sus campos.
// Semana 4: struct. Semana 5: cuándo exportar campos y cuándo no.
type Hechizo struct {
	Nombre   string
	Elemento elemento.Elemento
	Tipo     TipoHechizo
	Costo    int // MP que gasta
	Potencia int // se suma al poder mágico de quien lo lanza
}

// hechizosDeClase define qué sabe lanzar cada clase.
// Semana 3: un map cuyo valor es un slice. El guerrero no aparece:
// leer una clave que no existe devuelve el valor cero (un slice nil, len 0).
var hechizosDeClase = map[Clase][]Hechizo{
	MagoBlanco: {
		{Nombre: "Cura", Elemento: elemento.Luz, Tipo: Curacion, Costo: 6, Potencia: 25},
		{Nombre: "Destello", Elemento: elemento.Luz, Tipo: Ataque, Costo: 5, Potencia: 12},
	},
	MagoNegro: {
		{Nombre: "Fuego", Elemento: elemento.Fuego, Tipo: Ataque, Costo: 5, Potencia: 12},
		{Nombre: "Hielo", Elemento: elemento.Hielo, Tipo: Ataque, Costo: 5, Potencia: 12},
		{Nombre: "Rayo", Elemento: elemento.Rayo, Tipo: Ataque, Costo: 5, Potencia: 12},
	},
}
