// Ejercicio de la semana 3 (salas y grabación): las colecciones de TU sistema.
// Ejecutar: go run main.go
package main

import "fmt"

func main() {
	// 1. Un slice con elementos de tu sistema (títulos, productos, rutas...). Agrega dos con append.
	elementos := []string{"ejemplo 1"}
	elementos = append(elementos, "ejemplo 2")

	// 2. Un map que asocie cada elemento con un dato (stock, precio, cupos...).
	datos := map[string]int{"ejemplo 1": 3}

	// 3. Busca una clave con la forma «coma ok» y avisa si no existe.
	if valor, ok := datos["ejemplo 2"]; ok {
		fmt.Println("Encontrado:", valor)
	} else {
		fmt.Println("No existe")
	}

	// 4. Elimina una clave con delete y elimina el último elemento del slice.
	// 5. Copia el slice en otro con copy y comprueba que cambiar la copia no cambia el original.

	fmt.Println(elementos, len(elementos), datos, len(datos))
}
