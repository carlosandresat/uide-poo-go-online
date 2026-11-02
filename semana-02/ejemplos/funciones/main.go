// Otros tipos de funciones (semana 2). Ejecutar: go run main.go
package main

import "fmt"

// Variádica: recibe cualquier cantidad de float64; dentro, montos se recorre como una lista.
func sumarMontos(montos ...float64) float64 {
	total := 0.0
	for _, m := range montos {
		total += m
	}
	return total
}

// Función como parámetro: aplicar recibe otra función y la usa.
func aplicar(valor int, operacion func(int) int) int {
	return operacion(valor)
}

// Closure: la función que devuelve recuerda la variable siguiente.
func generadorDeTurnos() func() int {
	siguiente := 0
	return func() int {
		siguiente++
		return siguiente
	}
}

func main() {
	fmt.Println(sumarMontos(4.5, 3, 2.5)) // 10
	fmt.Println(sumarMontos())            // 0

	triple := func(x int) int { return x * 3 } // anónima guardada en una variable
	fmt.Println(aplicar(7, triple))            // 21

	turno := generadorDeTurnos()
	fmt.Println(turno(), turno(), turno()) // 1 2 3

	otro := generadorDeTurnos() // cada closure tiene su propia variable
	fmt.Println(otro())         // 1
}
