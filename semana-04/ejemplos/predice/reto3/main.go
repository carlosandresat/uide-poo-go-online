// Reto 3: ¿compila? Si compila, ¿qué imprime? Compruébalo con go run main.go
package main

import "fmt"

type Sala struct {
	nombre    string
	capacidad int
}

type Auditorio struct {
	Sala
	escenario bool
}

func (a *Auditorio) Anunciar() {
	fmt.Println("Auditorio:", a.nombre, "para", a.capacidad)
}

func main() {
	aud := Auditorio{Sala: Sala{nombre: "Central", capacidad: 300}, escenario: true}
	aud.Anunciar()
}
