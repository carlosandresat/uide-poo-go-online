package combate

// CalcularDano es una función pura: el mismo resultado para los mismos datos,
// sin tocar nada de afuera. Así es fácil de probar (en la semana 7, con go test).
// Semana 2: función con parámetros y un retorno.
//
//	daño = (poder × variación − defensa / 2) × multiplicador     (mínimo 1)
//
// Si el multiplicador es 0 (inmune), el daño es 0.
func CalcularDano(poder, defensa int, multiplicador, variacion float64) int {
	if multiplicador == 0 {
		return 0
	}
	bruto := float64(poder)*variacion - float64(defensa)/2
	dano := int(bruto * multiplicador) // semana 1: conversión explícita de tipos
	if dano < 1 {
		dano = 1
	}
	return dano
}

// Efectividad traduce el multiplicador a un mensaje para el jugador.
// Semana 1: switch sin expresión, como una cadena de if / else if.
func Efectividad(multiplicador float64) string {
	switch {
	case multiplicador == 0:
		return " ¡No le afecta!"
	case multiplicador > 1:
		return " ¡Es muy efectivo!"
	case multiplicador < 1:
		return " No es muy efectivo..."
	default:
		return ""
	}
}
