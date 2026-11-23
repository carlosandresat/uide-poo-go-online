// Caso en vivo de la semana 5: encapsulación y errores. Ejecutar desde esta carpeta: go run .
package main

import (
	"errors"
	"fmt"

	"banco/cuenta"
)

func main() {
	if _, err := cuenta.NewCuenta("", 10); err != nil {
		fmt.Println("No se creó:", err)
	}

	c, err := cuenta.NewCuenta("Ana", 100)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(c.Titular(), c.Saldo())

	// c.saldo = 1000000 // no compila: saldo no está exportado

	if err := c.Retirar(250); err != nil {
		fmt.Println("Error:", err)
		if errors.Is(err, cuenta.ErrSaldoInsuficiente) {
			fmt.Println("→ sugerir un monto menor")
		}
	}

	if err := c.SetTitular("Ana María"); err == nil {
		fmt.Println("Nuevo titular:", c.Titular())
	}
}
