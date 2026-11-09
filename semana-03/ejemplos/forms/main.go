// Pregunta del Forms de la semana 3. Ejecutar: go run main.go
package main

import "fmt"

func main() {
	notas := make([]int, 2, 5)
	notas = append(notas, 7)
	fmt.Println(len(notas), cap(notas), notas)
}
