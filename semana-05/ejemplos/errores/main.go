// Formas de crear errores en Go. Ejecutar: go run main.go
package main

import (
	"errors"
	"fmt"
)

// Un error propio: cualquier tipo con el método Error() string implementa la interfaz error.
type ErrorDeStock string

func (e ErrorDeStock) Error() string { return "stock: " + string(e) }

func reservar(cantidad, stock int) error {
	if cantidad <= 0 {
		return errors.New("cantidad inválida") // mensaje fijo
	}
	if cantidad > stock {
		return fmt.Errorf("pediste %d y hay %d", cantidad, stock) // mensaje con datos
	}
	return nil // nil = no hubo error
}

func revisar(codigo string) error {
	if codigo == "" {
		return ErrorDeStock("código vacío")
	}
	return nil
}

func main() {
	fmt.Println(reservar(0, 5))
	fmt.Println(reservar(8, 5))
	fmt.Println(reservar(2, 5))

	err := revisar("")
	fmt.Println(err)
	var e ErrorDeStock
	fmt.Println(errors.As(err, &e)) // ¿el error es de tipo ErrorDeStock?
}
