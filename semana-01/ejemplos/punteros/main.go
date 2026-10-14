// Punteros en tres líneas: dirección (&), desreferencia (*) y valor cero (nil).
// Ejecutar: go run main.go
package main

import "fmt"

func main() {
	stock := 42
	p := &stock // p guarda la dirección de stock; su tipo es *int

	fmt.Println("stock =", stock)
	fmt.Println("p =", p, "(una dirección de memoria)")
	fmt.Println("*p =", *p, "(el valor que hay en esa dirección)")

	*p = 50 // cambiar el valor a través del puntero cambia stock
	fmt.Println("stock ahora vale", stock)

	var q *int // un puntero sin asignar vale nil
	fmt.Println("q == nil:", q == nil)
}
