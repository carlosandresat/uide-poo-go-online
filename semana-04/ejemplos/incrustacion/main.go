// Incrustación (composición) de structs. Ejecutar: go run main.go
package main

import "fmt"

type Vehiculo struct {
	placa  string
	modelo string
}

func (v Vehiculo) Describir() string {
	return v.modelo + " · " + v.placa
}

// Taxi incrusta Vehiculo: sus campos y métodos se PROMUEVEN y se usan como propios.
type Taxi struct {
	Vehiculo
	cooperativa string
}

// Un método de Taxi puede usar un campo promovido de Vehiculo.
func (t *Taxi) Ficha() {
	fmt.Println("Taxi", t.placa, "de", t.cooperativa)
}

func main() {
	t := Taxi{Vehiculo: Vehiculo{placa: "PBA-1234", modelo: "Sedán"}, cooperativa: "Loja Express"}

	fmt.Println(t.placa)                // campo promovido: equivale a t.Vehiculo.placa
	fmt.Println(t.Describir())          // método promovido
	fmt.Println(t.Vehiculo.Describir()) // también se puede nombrar el campo incrustado
	t.Ficha()                           // t es variable: Go toma &t para el receptor puntero

	// var v Vehiculo = t // no compila: un Taxi NO es un Vehiculo (no hay herencia)
}
