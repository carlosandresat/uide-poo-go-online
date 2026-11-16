// Ejercicio de la semana 4 (salas y grabación): la entidad principal de TU sistema.
// Ejecutar: go run main.go
package main

import "fmt"

// 1. Cambia Elemento por una entidad de tu sistema (Libro, Reserva, Pedido...) con 3 campos o más.
type Elemento struct {
	Nombre string
}

// 2. Escribe un constructor NewElemento que reciba los datos y devuelva *Elemento.

// 3. Escribe un método con receptor de valor que solo lea (por ejemplo, Resumen() string).

// 4. Escribe un método con receptor puntero que modifique un campo (por ejemplo, CambiarEstado).

func main() {
	e := Elemento{Nombre: "ejemplo"}
	fmt.Println(e)
	// 5. Crea dos instancias con tu constructor, llama a los dos métodos e imprime el resultado.
}
