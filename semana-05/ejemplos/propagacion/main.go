// Cómo viaja un error por la cadena de llamadas (animación de la semana 5). Ejecutar: go run main.go
package main

import (
	"errors"
	"fmt"
)

var ErrSinCupo = errors.New("no hay cupo")

type Reserva struct {
	cliente  string
	personas int
}

func NewReserva(cliente string, personas int) (*Reserva, error) {
	if cliente == "" {
		return nil, errors.New("falta el cliente")
	}
	r := &Reserva{cliente: cliente}
	if err := r.SetPersonas(personas); err != nil {
		return nil, err
	}
	return r, nil
}

func (r *Reserva) SetPersonas(n int) error {
	if n < 1 || n > 10 {
		return fmt.Errorf("%d personas: %w", n, ErrSinCupo)
	}
	r.personas = n
	return nil
}

func main() {
	r, err := NewReserva("Lía", 12)
	if err != nil {
		fmt.Println("Error:", err)
		fmt.Println(r == nil, errors.Is(err, ErrSinCupo), errors.Unwrap(err) == ErrSinCupo)
	}
}
