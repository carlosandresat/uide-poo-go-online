// Paquete cuenta: lo que generó la IA en el caso en vivo de la semana 5.
package cuenta

import (
	"errors"
	"fmt"
)

// ErrSaldoInsuficiente es un error con nombre: quien llama puede compararlo con errors.Is.
var ErrSaldoInsuficiente = errors.New("saldo insuficiente")

// Cuenta tiene sus campos en minúscula: no se ven fuera del paquete cuenta.
type Cuenta struct {
	titular string
	saldo   float64
}

// NewCuenta valida los datos y devuelve un error si no son válidos.
func NewCuenta(titular string, inicial float64) (*Cuenta, error) {
	if titular == "" {
		return nil, errors.New("el titular no puede estar vacío")
	}
	if inicial < 0 {
		return nil, fmt.Errorf("saldo inicial inválido: %.2f", inicial)
	}
	return &Cuenta{titular: titular, saldo: inicial}, nil
}

// Titular es el getter de titular. En Go se recomienda no anteponer Get.
func (c Cuenta) Titular() string { return c.titular }

// Saldo es el getter de saldo.
func (c Cuenta) Saldo() float64 { return c.saldo }

// SetTitular es un setter: receptor puntero, valida y devuelve error.
func (c *Cuenta) SetTitular(nuevo string) error {
	if nuevo == "" {
		return errors.New("el titular no puede estar vacío")
	}
	c.titular = nuevo
	return nil
}

// Retirar devuelve un error envuelto con %w: conserva ErrSaldoInsuficiente y agrega datos.
func (c *Cuenta) Retirar(monto float64) error {
	if monto > c.saldo {
		return fmt.Errorf("retiro de %.2f: %w", monto, ErrSaldoInsuficiente)
	}
	c.saldo -= monto
	return nil
}
