// Reto 1 · Predice la salida ANTES de ejecutar. Luego compruébalo con: go run main.go
package main

import "fmt"

func main() {
	temperatura := 18

	if temperatura > 30 {
		fmt.Println("calor")
	} else if temperatura > 15 {
		fmt.Println("templado")
	} else if temperatura > 5 {
		fmt.Println("fresco")
	} else {
		fmt.Println("frío")
	}
}
