// Reto 3: predice qué imprime y luego compruébalo con go run main.go
package main

import "fmt"

func calcular(a, b int) (int, int, int) {
	return a / b, a % b, a * b
}

func main() {
	x, y, z := calcular(14, 4)
	fmt.Println(z, x+y)
	_, r, _ := calcular(9, 9)
	fmt.Println(r)
}
