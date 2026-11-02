// Reto 2: ¿compila? Si no, ¿qué línea falla y por qué? Compruébalo con go run main.go
// Pista: hay exactamente una línea que no compila. Corrígela.
package main

import "fmt"

func minutosASegundos(min int) int {
	return min * 60
}

func main() {
	s := minutosASegundos(3)
	fmt.Println(s)
	minutosASegundos(5)
	fmt.Println(minutosASegundos(2, 30))
}
