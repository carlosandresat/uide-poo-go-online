// Caso en vivo de la semana 2: un módulo con un paquete propio.
// Ejecutar desde esta carpeta: go run .
package main

import (
	"fmt"
	"tienda/inventario" // ruta del módulo + carpeta; nunca el archivo .go
)

func main() {
	fmt.Println("Stock inicial:", inventario.Stock)

	total := inventario.Agregar(5) // se guarda lo que devuelve
	fmt.Println("Después de agregar:", total)

	inventario.Agregar(-3) // compila, pero el valor devuelto se pierde (y validar lo rechaza)

	ok, falta := inventario.Disponible(18)
	fmt.Println("¿Alcanza para 18?", ok, "· faltan:", falta)

	_, falta = inventario.Disponible(12) // _ descarta el primer valor
	fmt.Println("Para 12 faltan:", falta)

	// inventario.validar(3) // no compila: validar no está exportada
}
