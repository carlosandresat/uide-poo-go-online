// Ejercicio de la semana 1 (salas y grabación): el menú de TU sistema.
// Usa el sistema de gestión que elegiste para tu proyecto (el tema es libre).
// Ejecutar: go run main.go
package main

import "fmt"

func main() {
	// 1. Declara con const un límite y con := los contadores que necesites.

	for {
		// 2. Muestra al menos 3 opciones propias de tu sistema y una para salir.
		fmt.Println("1) ...  2) ...  3) ...  4) Salir")

		var opcion int
		fmt.Scan(&opcion)

		switch opcion {
		// 3. Un case por opción. En al menos una, usa if / else para validar algo
		//    (por ejemplo: que haya cupo, que un precio sea positivo).
		case 4:
			fmt.Println("Hasta luego")
			return
		default:
			fmt.Println("Opción no válida")
		}
	}
}
