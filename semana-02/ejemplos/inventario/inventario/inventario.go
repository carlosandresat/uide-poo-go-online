// Paquete inventario: lo que generó la IA en el caso en vivo de la semana 2.
// Todo archivo de esta carpeta dice "package inventario".
package inventario

// Stock guarda las unidades de un producto. Empieza con mayúscula: se exporta.
var Stock = 10

// Agregar suma unidades al stock y devuelve el nuevo total.
func Agregar(unidades int) int {
	if validar(unidades) {
		Stock += unidades
	}
	return Stock
}

// Disponible dice si alcanza para un pedido y, si no, cuántas unidades faltan.
// Dos valores de retorno: se reciben en el mismo orden.
func Disponible(pedido int) (bool, int) {
	if pedido <= Stock {
		return true, 0
	}
	return false, pedido - Stock
}

// validar empieza con minúscula: solo se puede usar dentro de este paquete.
func validar(unidades int) bool {
	return unidades > 0
}
