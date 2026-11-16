// Caso en vivo de la semana 4: lo que generó la IA para modelar un producto.
// Ejecutar: go run main.go
package main

import "fmt"

// Producto modela un artículo del inventario.
type Producto struct {
	Nombre string
	Precio float64
	Stock  int
}

// NewProducto es un constructor: una función normal que devuelve un *Producto listo para usar.
// Go no tiene constructores especiales; por convención se llaman NewX.
func NewProducto(nombre string, precio float64) *Producto {
	return &Producto{Nombre: nombre, Precio: precio, Stock: 0}
}

// ValorInventario solo lee los campos: receptor de valor.
func (p Producto) ValorInventario() float64 {
	return p.Precio * float64(p.Stock)
}

// AplicarDescuento modifica el precio: receptor puntero.
func (p *Producto) AplicarDescuento(porcentaje float64) {
	p.Precio = p.Precio * (1 - porcentaje/100)
}

// Reponer modifica el stock: receptor puntero.
func (p *Producto) Reponer(unidades int) {
	p.Stock += unidades
}

func main() {
	teclado := NewProducto("Teclado", 40)
	teclado.Reponer(5)
	teclado.AplicarDescuento(25)

	// teclado es un puntero, pero se usa con punto: Go desreferencia solo.
	fmt.Println(teclado.Nombre, teclado.Precio, teclado.Stock)
	fmt.Println("Valor del inventario:", teclado.ValorInventario())

	mouse := Producto{Nombre: "Mouse", Precio: 12} // literal sin constructor: Stock queda en 0
	mouse.Reponer(3)                               // mouse es una variable: Go toma &mouse solo
	fmt.Println(mouse.Nombre, mouse.Stock)
}
