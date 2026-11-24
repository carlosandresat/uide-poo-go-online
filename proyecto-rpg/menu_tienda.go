package main

import (
	"errors"
	"fmt"

	"rpg/grupo"
	"rpg/tienda"
)

func menuTienda(g *grupo.Grupo, t *tienda.Tienda) error {
	for {
		titulo(fmt.Sprintf("TIENDA DE ARMAS (monedas: %d)", g.Monedas()))
		fmt.Println("1. Comprar   2. Vender   0. Salir")
		op, err := leerOpcion("> ", 0, 2)
		if err != nil {
			return err
		}
		switch op {
		case 0:
			return nil
		case 1:
			if err := comprar(g, t); err != nil {
				return err
			}
		case 2:
			if err := vender(g, t); err != nil {
				return err
			}
		}
	}
}

func comprar(g *grupo.Grupo, t *tienda.Tienda) error {
	catalogo := t.Catalogo()
	for i, a := range catalogo {
		fmt.Printf("%d. %s  %4d monedas\n", i+1, a.Descripcion(), a.Precio())
	}
	fmt.Println("0. Volver")
	n, err := leerOpcion("> ", 0, len(catalogo))
	if err != nil || n == 0 {
		return err
	}
	a, err := t.Comprar(g, n-1)
	// Semana 5: el error viene de grupo.GastarMonedas, envuelto por tienda.Comprar.
	// errors.Is lo encuentra aunque haya pasado por dos funciones.
	if errors.Is(err, grupo.ErrMonedasInsuficientes) {
		fmt.Println("  " + err.Error())
		fmt.Println("  Consejo: gana monedas en combate o vende un arma.")
		return nil
	}
	if err != nil {
		fmt.Println("  No se pudo comprar:", err)
		return nil
	}
	fmt.Printf("  Compraste %s. Equípala en «Cambiar equipamiento».\n", a.Nombre())
	return nil
}

func vender(g *grupo.Grupo, t *tienda.Tienda) error {
	inventario := g.Inventario()
	if len(inventario) == 0 {
		fmt.Println("  No tienes armas guardadas. (Las equipadas no se venden.)")
		return nil
	}
	for i, a := range inventario {
		fmt.Printf("%d. %s  te pagan %d\n", i+1, a.Descripcion(), tienda.PrecioVenta(a))
	}
	fmt.Println("0. Volver")
	n, err := leerOpcion("> ", 0, len(inventario))
	if err != nil || n == 0 {
		return err
	}
	a, pago, err := t.Vender(g, n-1)
	if err != nil {
		fmt.Println("  " + err.Error())
		return nil
	}
	fmt.Printf("  Vendiste %s por %d monedas.\n", a.Nombre(), pago)
	return nil
}
