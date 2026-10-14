// Caso en vivo de la semana 1: el programa que le pedimos a la IA.
// Menú de consola para un sistema de gestión de libros electrónicos.
// Ejecutar: go run main.go
package main

import "fmt"

func main() {
	const limite = 3 // máximo de libros en esta primera versión
	cantidad := 0
	ultimo := ""

	for {
		fmt.Println("1) Agregar libro  2) Ver resumen  3) Salir")
		fmt.Print("Opción: ")
		var opcion int
		fmt.Scan(&opcion) // Scan necesita la dirección de opcion para escribir en ella

		switch opcion {
		case 1:
			if cantidad == limite {
				fmt.Println("Catálogo lleno")
			} else {
				var titulo string
				fmt.Print("Título (una palabra): ")
				fmt.Scan(&titulo)
				ultimo = titulo
				cantidad++
				fmt.Println("Agregado: " + titulo)
			}
		case 2:
			fmt.Println("Libros:", cantidad, "| último:", ultimo)
		case 3:
			fmt.Println("Hasta luego")
			return // con break solo saldríamos del switch, no del for
		default:
			fmt.Println("Opción no válida")
		}
	}
}
