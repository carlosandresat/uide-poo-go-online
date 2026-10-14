// Operadores y tipos que suelen confundir. Predice cada línea antes de ejecutar.
// Ejecutar: go run main.go
package main

import "fmt"

func main() {
	fmt.Println(2 + 3*4)     // la multiplicación va primero
	fmt.Println((2 + 3) * 4) // los paréntesis cambian el orden
	fmt.Println(17 / 5)      // entre enteros, la división descarta los decimales
	fmt.Println(17 % 5)      // % es el residuo
	fmt.Println(17.0 / 5)    // con un decimal, el resultado es float64

	n := 7
	if n%2 == 0 {
		fmt.Println(n, "es par")
	} else {
		fmt.Println(n, "es impar")
	}

	saludo := "Hola, " + "Go"
	fmt.Println(saludo, saludo == "Hola, Go")

	// Valores cero: lo que vale una variable declarada sin asignarle nada
	var entero int
	var decimal float64
	var texto string
	var activo bool
	var puntero *int
	fmt.Println(entero, decimal, texto == "", activo, puntero)

	// Enteros con tamaño
	var pequeno int8 = 127 // int8 va de -128 a 127
	var b byte = 255       // byte es uint8: de 0 a 255, sin signo
	fmt.Println(pequeno, b)

	pi := 3.14
	fmt.Printf("%T\n", pi) // el tipo por defecto de un decimal
}
