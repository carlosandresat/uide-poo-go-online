// Ejecutar desde esta carpeta: go run .
package main

import (
	"fmt"

	"misistema/entidad"
)

func main() {
	var e entidad.Entidad
	fmt.Printf("%q\n", e.Nombre())
	// 6. Crea entidades con tu constructor y maneja cada error con if err != nil.
	// 7. Intenta escribir un campo en minúscula desde aquí y lee el error del compilador.
}
