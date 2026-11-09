// Respuesta al ticket de la semana 3: usar slices sin desperdiciar memoria
// y sin compartir datos por accidente. Ejecutar: go run main.go
package main

import "fmt"

// cuentaArreglos agrega n elementos y cuenta cuántas veces append
// tuvo que crear un arreglo nuevo (la capacidad cambió).
func cuentaArreglos(s []int, n int) int {
	nuevos := 0
	for i := 0; i < n; i++ {
		antes := cap(s)
		s = append(s, i)
		if cap(s) != antes {
			nuevos++
		}
	}
	return nuevos
}

func main() {
	// 1) Reservar capacidad cuando sabes cuántos vendrán
	fmt.Println("1) sin reservar:", cuentaArreglos(nil, 1000), "arreglos nuevos")
	fmt.Println("1) reservando:  ", cuentaArreglos(make([]int, 0, 1000), 1000), "arreglos nuevos")

	// 2) Copia independiente con copy
	pedidos := []int{101, 102, 103}
	respaldo := make([]int, len(pedidos))
	copy(respaldo, pedidos)
	respaldo[0] = 999
	fmt.Println("2)", pedidos, respaldo)

	// 3) Entregar una parte sin que su append pise lo tuyo: s[i:j:j]
	turnos := []string{"lun", "mar", "mie", "jue"}
	compartida := turnos[0:2] // cap 4: el append escribe en turnos[2]
	compartida = append(compartida, "X")
	fmt.Println("3) compartida:", turnos, compartida)
	turnos[2] = "mie"
	limitada := turnos[0:2:2] // cap 2: el append crea un arreglo nuevo
	limitada = append(limitada, "X")
	fmt.Println("3) limitada:  ", turnos, limitada)

	// 4) Quedarte con un pedazo pequeño de algo grande: cópialo
	registro := make([]byte, 1_000_000)
	encabezado := registro[:10] // ve 10 bytes, pero mantiene vivo el millón
	propio := make([]byte, 10)
	copy(propio, registro[:10]) // 10 bytes propios; el millón se puede liberar
	fmt.Println("4) cap encabezado:", cap(encabezado), "· cap propio:", cap(propio))

	// 5) Un array se copia entero al asignarlo; un slice no
	a := [3]int{1, 2, 3}
	b := a
	b[0] = 0
	s := []int{1, 2, 3}
	t := s
	t[0] = 0
	fmt.Println("5) array:", a, "· slice:", s)
}
