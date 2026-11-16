// Receptor de valor frente a receptor puntero (animación de la semana 4). Ejecutar: go run main.go
package main

import "fmt"

type Cuenta struct {
	titular string
	saldo   float64
}

// Receptor de valor: el método recibe una COPIA de la cuenta.
func (c Cuenta) DepositarCopia(monto float64) {
	c.saldo += monto
	fmt.Println("  dentro de DepositarCopia:", c.saldo)
}

// Receptor puntero: el método recibe la DIRECCIÓN de la cuenta.
func (c *Cuenta) Depositar(monto float64) {
	c.saldo += monto
	fmt.Println("  dentro de Depositar:", c.saldo)
}

func main() {
	cuenta := Cuenta{titular: "Ana", saldo: 100}

	cuenta.DepositarCopia(50)
	fmt.Println("después de DepositarCopia:", cuenta.saldo)

	cuenta.Depositar(50)
	fmt.Println("después de Depositar:", cuenta.saldo)
}
