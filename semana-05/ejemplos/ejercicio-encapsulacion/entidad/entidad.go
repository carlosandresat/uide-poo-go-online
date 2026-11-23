// Ejercicio de la semana 5 (salas y grabación): encapsula la entidad principal de TU sistema.
//  1. Cambia Entidad por tu entidad (Libro, Reserva, Pedido...) con campos en minúscula.
//  2. Constructor NewEntidad que valide y devuelva (*Entidad, error).
//  3. Un getter por campo importante, al estilo Go: Nombre(), no GetNombre().
//  4. Un setter con receptor puntero que valide y devuelva error.
//  5. Un error con nombre (var ErrAlgo = errors.New(...)) que uses en al menos un método.
package entidad

// Entidad es un ejemplo para que compile desde el inicio. Reemplázala.
type Entidad struct {
	nombre string
}

// Nombre es un getter de ejemplo.
func (e Entidad) Nombre() string { return e.nombre }
