// El arreglo detrás de un slice (animación de la semana 3). Ejecutar: go run main.go
package main

import "fmt"

func main() {
	precios := [5]int{10, 20, 30, 40, 50} // array: el tamaño es parte del tipo
	fmt.Println("1)", precios)

	oferta := precios[1:3] // slice: ventana desde el índice 1 hasta antes del 3
	fmt.Println("2)", oferta, "len:", len(oferta), "cap:", cap(oferta))

	oferta[0] = 99 // cambia el arreglo que comparten
	fmt.Println("3)", oferta, precios)

	oferta = append(oferta, 77) // hay capacidad: escribe en precios[3]
	fmt.Println("4)", oferta, precios, "len:", len(oferta), "cap:", cap(oferta))

	oferta = append(oferta, 1, 2, 3) // no cabe: Go crea un arreglo nuevo y copia
	oferta[0] = 0                    // ya no afecta a precios
	fmt.Println("5)", oferta, precios, "len:", len(oferta), "cap:", cap(oferta))
}
