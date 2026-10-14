// Reto 3 · Predice las tres líneas ANTES de ejecutar. Luego compruébalo con: go run main.go
package main

import "fmt"

func main() {
	a := 7
	b := 3

	fmt.Println(a + b*2)
	fmt.Println((a + b) % 4)
	fmt.Println(a/b, a%b)
}
