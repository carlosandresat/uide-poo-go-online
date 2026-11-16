// Reto 1: predice qué imprime y luego compruébalo con go run main.go
package main

import "fmt"

type Termometro struct{ grados float64 }

func (t Termometro) Calentar()     { t.grados += 10 }
func (t *Termometro) Enfriar()     { t.grados -= 5 }
func (t Termometro) Leer() float64 { return t.grados }

func main() {
	a := Termometro{grados: 20}
	a.Calentar()
	a.Enfriar()
	b := a
	b.Enfriar()
	fmt.Println(a.Leer(), b.Leer())
}
