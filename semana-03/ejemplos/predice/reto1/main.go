// Reto 1: predice qué imprime y luego compruébalo con go run main.go
package main

import "fmt"

func main() {
	semana := [7]string{"lun", "mar", "mié", "jue", "vie", "sáb", "dom"}
	laborables := semana[:5]
	finde := semana[5:]
	laborables[4] = "VIE"
	fmt.Println(len(laborables), cap(laborables), len(finde))
	fmt.Println(semana[4])
}
