// Reto 2: predice qué imprime y luego compruébalo con go run main.go
package main

import "fmt"

func main() {
	stock := map[string]int{"tinta": 4, "papel": 0}
	a := stock["papel"]
	b, ok1 := stock["papel"]
	c, ok2 := stock["sobres"]
	fmt.Println(a, b, ok1, c, ok2)
	delete(stock, "sobres") // ¿falla si la clave no existe?
	fmt.Println(len(stock))
}
