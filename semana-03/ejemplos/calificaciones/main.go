// Caso en vivo de la semana 3: lo que generó la IA para un registro de calificaciones.
// Ejecutar: go run main.go
package main

import "fmt"

func main() {
	notas := make(map[string][]float64) // clave: estudiante · valor: slice de notas

	agregar := func(nombre string, nota float64) {
		// Si la clave no existe, notas[nombre] devuelve el valor cero de []float64 (nil),
		// y append sobre nil funciona: crea el slice.
		notas[nombre] = append(notas[nombre], nota)
	}
	agregar("Ana", 9.5)
	agregar("Ana", 8)
	agregar("Luis", 7)
	agregar("Sofía", 10)

	promedio := func(nombre string) (float64, bool) {
		lista, ok := notas[nombre] // forma «coma ok»: ok dice si la clave existe
		if !ok || len(lista) == 0 {
			return 0, false
		}
		suma := 0.0
		for _, n := range lista {
			suma += n
		}
		return suma / float64(len(lista)), true
	}

	if p, ok := promedio("Ana"); ok {
		fmt.Println("Promedio de Ana:", p)
	}
	if _, ok := promedio("Pedro"); !ok {
		fmt.Println("Pedro no está registrado")
	}

	delete(notas, "Luis") // función integrada: delete(mapa, clave)
	fmt.Println("Estudiantes:", len(notas))

	// El orden al recorrer un map no está garantizado: puede cambiar entre ejecuciones.
	for nombre, lista := range notas {
		fmt.Println(nombre, lista)
	}
}
