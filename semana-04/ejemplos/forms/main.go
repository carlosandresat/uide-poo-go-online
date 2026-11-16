// Pregunta del Forms de la semana 4. Ejecutar: go run main.go
package main

import "fmt"

type Contador struct{ n int }

func (c Contador) Sumar()      { c.n++ }
func (c *Contador) SumarBien() { c.n++ }

func main() {
	k := Contador{}
	k.Sumar()
	k.Sumar()
	k.SumarBien()
	fmt.Println(k.n)
}
