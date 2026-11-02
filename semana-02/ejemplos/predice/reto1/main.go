// Reto 1: predice qué imprime y luego compruébalo con go run main.go
package main

import "fmt"

func etiqueta(nombre string, stock int) (string, int) {
	if stock == 0 {
		return nombre + " (agotado)", 0
	}
	return nombre, stock * 2
}

func main() {
	a, b := etiqueta("lápiz", 0)
	c, d := etiqueta("cuaderno", 3)
	fmt.Println(a, b)
	fmt.Println(d, c)
}
