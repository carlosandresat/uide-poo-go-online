package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
)

// Un solo lector del teclado para todo el programa.
var teclado = bufio.NewScanner(os.Stdin)

// leerOpcion pide un número entre min y max y repite hasta que sea válido.
// Si se acaba la entrada (Ctrl+Z / Ctrl+D, o un archivo redirigido),
// devuelve io.EOF para que main termine con orden.
// Semana 1: for sin condición (el «while true» de Go) y continue.
// Semana 2: dos valores de retorno (valor, error).
func leerOpcion(mensaje string, min, max int) (int, error) {
	for {
		fmt.Print(mensaje)
		if !teclado.Scan() {
			if err := teclado.Err(); err != nil {
				return 0, err
			}
			fmt.Println()
			return 0, io.EOF
		}
		n, err := strconv.Atoi(strings.TrimSpace(teclado.Text()))
		if err != nil || n < min || n > max {
			fmt.Printf("  Escribe un número entre %d y %d.\n", min, max)
			continue
		}
		return n, nil
	}
}

// barra dibuja una barra de vida o MP: [#######---].
// Semana 1: for clásico y concatenación de strings.
func barra(actual, maximo, ancho int) string {
	if maximo <= 0 {
		return "[" + strings.Repeat(" ", ancho) + "]"
	}
	llenos := actual * ancho / maximo
	if actual > 0 && llenos == 0 {
		llenos = 1 // si queda algo de vida, que se vea
	}
	b := "["
	for i := 0; i < ancho; i++ {
		if i < llenos {
			b += "#"
		} else {
			b += "-"
		}
	}
	return b + "]"
}

func titulo(texto string) {
	linea := strings.Repeat("=", 44)
	fmt.Printf("\n%s\n  %s\n%s\n", linea, texto, linea)
}
