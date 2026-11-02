// Ejercicio de la semana 2 (salas y grabación): un paquete de TU sistema.
//  1. Cambia el nombre de la carpeta y del paquete por un módulo de tu sistema
//     (por ejemplo: prestamos, pedidos, reservas). Si cambias el nombre, actualiza el import en main.go.
//  2. Escribe al menos dos funciones exportadas (mayúscula inicial):
//     - una que reciba dos o más parámetros y devuelva un valor;
//     - otra que devuelva dos valores (por ejemplo: si se pudo y un mensaje).
//  3. Escribe una función auxiliar no exportada (minúscula) y úsala desde una exportada.
package catalogo

// Ejemplo para que el proyecto compile desde el inicio. Reemplázalo por tus funciones.
func Contar(elementos ...string) int {
	return len(elementos)
}
