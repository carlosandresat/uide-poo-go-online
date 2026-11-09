// Reto 3: predice qué imprime y luego compruébalo con go run main.go
package main

import "fmt"

func main() {
	origen := []int{4, 8, 15, 16}
	destino := make([]int, 2)
	n := copy(destino, origen)
	destino[0] = 100
	fmt.Println(n, destino, origen)

	a := [3]int{1, 2}
	b := [3]int{1, 2, 0}
	fmt.Println(a == b)
}
