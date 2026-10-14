// Reto 2 · Predice la salida ANTES de ejecutar. Luego compruébalo con: go run main.go
package main

import "fmt"

func main() {
	plan := "familiar"

	switch plan {
	case "básico", "estándar":
		fmt.Println("1 pantalla")
	case "premium", "familiar":
		fmt.Println("4 pantallas")
	default:
		fmt.Println("plan desconocido")
	}
}
