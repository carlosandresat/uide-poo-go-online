// Reto 3: ¿qué devuelve buscar("x")? Predice y compruébalo con go run main.go
package main

import (
	"errors"
	"fmt"
)

type Item struct{ codigo string }

func buscar(codigo string) (*Item, error) {
	catalogo := map[string]Item{"a1": {"a1"}}
	if it, ok := catalogo[codigo]; ok {
		return &it, nil
	}
	return nil, errors.New("no existe " + codigo)
}

func main() {
	it, err := buscar("x")
	fmt.Println(it == nil, err)
	it, err = buscar("a1")
	fmt.Println(it.codigo, err)
}
