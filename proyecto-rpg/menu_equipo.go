package main

import (
	"fmt"

	"rpg/grupo"
)

// menuEquipo cambia el arma de un personaje por una del inventario.
func menuEquipo(g *grupo.Grupo) error {
	titulo("CAMBIAR EQUIPAMIENTO")
	for i, p := range g.Miembros() {
		fmt.Printf("%d. %-8s (%s) · %s\n", i+1, p.Nombre(), p.Clase().Nombre(), p.Arma().Descripcion())
	}
	fmt.Println("0. Volver")
	n, err := leerOpcion("¿Quién? > ", 0, grupo.Tamano)
	if err != nil || n == 0 {
		return err
	}
	p, err := g.Miembro(n - 1)
	if err != nil {
		return err
	}

	inventario := g.Inventario()
	if len(inventario) == 0 {
		fmt.Println("  No hay armas guardadas. Compra alguna en la tienda.")
		return nil
	}
	fmt.Println("Armas guardadas:")
	for i, a := range inventario {
		marca := ""
		if !p.PuedeUsar(a) {
			marca = "  (no es para su clase)"
		}
		fmt.Printf("%d. %s%s\n", i+1, a.Descripcion(), marca)
	}
	fmt.Println("0. Volver")
	k, err := leerOpcion("¿Cuál? > ", 0, len(inventario))
	if err != nil || k == 0 {
		return err
	}

	// Primero se intenta equipar. Si falla (arma de otra clase), el
	// inventario queda igual. Si funciona, el arma sale del inventario y la
	// anterior entra.
	anterior, err := p.Equipar(inventario[k-1])
	if err != nil {
		fmt.Println("  No se pudo:", err)
		return nil
	}
	if _, err := g.SacarArma(k - 1); err != nil {
		return err
	}
	g.AgregarArma(anterior)
	fmt.Printf("  %s ahora usa %s (ataque %d, magia %d). %s quedó guardada.\n",
		p.Nombre(), p.Arma().Nombre(), p.Ataque(), p.Magia(), anterior.Nombre())
	return nil
}
