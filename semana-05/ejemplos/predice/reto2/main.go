// Reto 2: predice qué imprime y luego compruébalo con go run main.go
package main

import "fmt"

type Termostato struct{ grados int }

func (t Termostato) Grados() int { return t.grados }

func (t *Termostato) SetGrados(g int) error {
	if g < 10 || g > 30 {
		return fmt.Errorf("%d fuera de rango", g)
	}
	t.grados = g
	return nil
}

func main() {
	t := Termostato{grados: 20}
	err1 := t.SetGrados(35)
	err2 := t.SetGrados(24)
	fmt.Println(t.Grados(), err1, err2)
}
