// Reto 2: predice qué imprime y luego compruébalo con go run main.go
package main

import "fmt"

type Contacto struct {
	nombre string
	correo string
}

type Cliente struct {
	Contacto
	puntos int
}

func (c Contacto) Firma() string { return c.nombre + " <" + c.correo + ">" }

func main() {
	cl := Cliente{Contacto: Contacto{nombre: "Rita", correo: "rita@mail.ec"}, puntos: 80}
	p := &cl
	p.puntos += 20
	fmt.Println(cl.nombre, cl.puntos)
	fmt.Println(p.Firma())
}
