// Reto 1: predice qué imprime y luego compruébalo con go run main.go
package main

import (
	"errors"
	"fmt"
)

func validarEdad(edad int) error {
	if edad < 18 {
		return errors.New("menor de edad")
	}
	return nil
}

func main() {
	for _, e := range []int{20, 15} {
		if err := validarEdad(e); err != nil {
			fmt.Println(e, "→", err)
		} else {
			fmt.Println(e, "→ ok")
		}
	}
}
