// Pregunta del Forms de la semana 5. Ejecutar: go run main.go
package main

import "fmt"

func retirar(saldo, monto float64) (float64, error) {
	if monto > saldo {
		return saldo, fmt.Errorf("faltan %.2f", monto-saldo)
	}
	return saldo - monto, nil
}

func main() {
	s, err := retirar(30, 45)
	if err != nil {
		fmt.Println("Error:", err)
	}
	fmt.Println(s)
}
