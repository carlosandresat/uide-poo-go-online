// Pregunta del Forms de la semana 2. Ejecutar: go run main.go
package main

import "fmt"

func precioFinal(precio float64, cantidad int) (float64, bool) {
	total := precio * float64(cantidad)
	return total, total > 50
}

func main() {
	t, envioGratis := precioFinal(12.5, 4)
	fmt.Println(envioGratis, t)
}
