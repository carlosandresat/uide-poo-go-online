/* Animación · Receptor de valor frente a receptor puntero
   Código representado (ejemplos/receptores/main.go, verificado con go run):
     cuenta := Cuenta{titular: "Ana", saldo: 100}
     cuenta.DepositarCopia(50)   // func (c Cuenta)  DepositarCopia(m float64) { c.saldo += m }
     cuenta.Depositar(50)        // func (c *Cuenta) Depositar(m float64)      { c.saldo += m }
   Salida real: dentro de DepositarCopia 150, después 100; dentro de Depositar 150, después 150.
   Pasos: 1 main · 2 llamada con receptor de valor: se copia el struct · 3 la copia cambia
          4 el método termina: la copia desaparece y main sigue en 100 · 5 llamada con receptor puntero: c guarda la dirección
          6 c.saldo += 50 cambia el original · 7 el método termina: main queda en 150.
   En modo lectura se dibuja el estado final (paso 7) con un resumen de la llamada con copia. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-receptor');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto !== undefined) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const svg = nodo('svg', { viewBox: '0 0 1000 500', role: 'img',
    'aria-label': 'Con receptor de valor, el método recibe una copia de la cuenta: la copia pasa a 150 y desaparece, y la cuenta de main sigue en 100. Con receptor puntero, el método recibe la dirección de la cuenta y el saldo de main pasa a 150.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 64);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const estilo = {
    marco: 'fill:var(--superficie);stroke:var(--regla);stroke-width:2.5',
    cabecera: 'fill:var(--caja-diagrama)',
    titulo: 'fill:var(--texto-caja-diagrama);font-weight:800;font-size:21px;font-family:var(--f-codigo)',
    nombre: 'fill:var(--tinta-suave);font-family:var(--f-codigo);font-size:18px',
    celda: 'fill:var(--fondo);stroke:var(--regla);stroke-width:2',
    celdaCambio: 'fill:var(--fondo);stroke:var(--dorado);stroke-width:5',
    campo: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:22px',
    valor: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:26px;font-weight:700',
    acento: 'fill:var(--acento);font-size:20px;font-weight:800',
    flecha: 'stroke:var(--acento);stroke-width:3.5;fill:none',
  };
  const T = 'opacity 450ms ease';

  const defs = nodo('defs', {}, svg);
  const marca = nodo('marker', { id: 'punta-receptor', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  nodo('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill:var(--acento)' }, marca);

  // Línea de código del paso actual
  nodo('rect', { x: 0, y: 0, width: 1000, height: 50, rx: 8, style: 'fill:var(--codigo-fondo)' }, svg);
  const linea = nodo('text', { x: 20, y: 33, style: 'fill:var(--codigo-texto);font-family:var(--f-codigo);font-size:22px;font-weight:600' }, svg, '');

  // Un struct Cuenta dibujado como dos campos
  function struct(x, y, padre, etiqueta) {
    const g = nodo('g', {}, padre);
    nodo('text', { x, y: y - 10, style: estilo.nombre }, g, etiqueta);
    const caja = nodo('rect', { x, y, width: 300, height: 104, rx: 6, style: estilo.celda }, g);
    nodo('text', { x: x + 16, y: y + 38, style: estilo.campo }, g, 'titular: "Ana"');
    nodo('text', { x: x + 16, y: y + 80, style: estilo.campo }, g, 'saldo:');
    const saldo = nodo('text', { x: x + 130, y: y + 82, style: estilo.valor }, g, '100');
    return { g, caja, saldo };
  }

  // ---- main ----
  nodo('rect', { x: 20, y: 80, width: 400, height: 400, rx: 8, style: estilo.marco }, svg);
  nodo('rect', { x: 20, y: 80, width: 400, height: 46, rx: 8, style: estilo.cabecera }, svg);
  nodo('text', { x: 38, y: 111, style: estilo.titulo }, svg, 'main');
  const original = struct(70, 190, svg, 'cuenta · Cuenta');
  const notaMain = nodo('text', { x: 220, y: 350, 'text-anchor': 'middle', style: estilo.acento }, svg, '');

  // ---- marco del método con receptor de valor ----
  const mValor = nodo('g', {}, svg);
  mValor.style.transition = T;
  nodo('rect', { x: 560, y: 80, width: 420, height: 400, rx: 8, style: estilo.marco }, mValor);
  nodo('rect', { x: 560, y: 80, width: 420, height: 46, rx: 8, style: estilo.cabecera }, mValor);
  nodo('text', { x: 578, y: 111, style: estilo.titulo }, mValor, 'DepositarCopia');
  nodo('text', { x: 578, y: 154, style: estilo.nombre }, mValor, 'receptor de valor: (c Cuenta)');
  const copia = struct(620, 190, mValor, 'c · Cuenta (una copia)');
  const flechaCopia = nodo('path', { d: 'M372,242 C470,200 520,200 612,242', style: estilo.flecha, 'marker-end': 'url(#punta-receptor)' }, svg);
  const rotuloCopia = nodo('text', { x: 492, y: 194, 'text-anchor': 'middle', style: estilo.acento }, svg, 'se copia todo');
  [flechaCopia, rotuloCopia].forEach((e) => { e.style.transition = T; });

  // ---- marco del método con receptor puntero ----
  const mPuntero = nodo('g', {}, svg);
  mPuntero.style.transition = T;
  nodo('rect', { x: 560, y: 80, width: 420, height: 400, rx: 8, style: estilo.marco }, mPuntero);
  nodo('rect', { x: 560, y: 80, width: 420, height: 46, rx: 8, style: estilo.cabecera }, mPuntero);
  nodo('text', { x: 578, y: 111, style: estilo.titulo }, mPuntero, 'Depositar');
  nodo('text', { x: 578, y: 154, style: estilo.nombre }, mPuntero, 'receptor puntero: (c *Cuenta)');
  nodo('text', { x: 620, y: 260, style: estilo.nombre }, mPuntero, 'c · *Cuenta');
  nodo('rect', { x: 620, y: 270, width: 300, height: 60, rx: 6, style: estilo.celda }, mPuntero);
  nodo('text', { x: 770, y: 308, 'text-anchor': 'middle', style: estilo.campo }, mPuntero, 'dirección de cuenta');
  const flechaPuntero = nodo('path', { d: 'M620,300 C520,300 470,262 378,250', style: estilo.flecha, 'marker-end': 'url(#punta-receptor)' }, svg);
  const rotuloPuntero = nodo('text', { x: 500, y: 330, 'text-anchor': 'middle', style: estilo.acento }, svg, 'apunta al original');
  [flechaPuntero, rotuloPuntero].forEach((e) => { e.style.transition = T; });

  const resumen = nodo('text', { x: 980, y: 470, 'text-anchor': 'end', style: estilo.acento }, svg, '');

  const LINEAS = [
    'cuenta := Cuenta{titular: "Ana", saldo: 100}',
    'cuenta := Cuenta{titular: "Ana", saldo: 100}',
    'cuenta.DepositarCopia(50)   // receptor de valor',
    'dentro: c.saldo += 50',
    'DepositarCopia terminó',
    'cuenta.Depositar(50)        // receptor puntero',
    'dentro: c.saldo += 50',
    'Depositar terminó',
  ];

  function ver(e, si) { e.style.opacity = si ? 1 : 0; }

  function dibujar(paso) {
    const p = Math.max(0, Math.min(7, paso));
    linea.textContent = p === 0 ? 'Avanza para ejecutar línea por línea' : LINEAS[p];
    ver(original.g, p >= 1);
    ver(mValor, p >= 2 && p <= 3);
    ver(flechaCopia, p === 2); ver(rotuloCopia, p === 2);
    copia.saldo.textContent = p >= 3 ? '150' : '100';
    copia.caja.setAttribute('style', p === 3 ? estilo.celdaCambio : estilo.celda);
    ver(mPuntero, p >= 5 && p <= 6);
    ver(flechaPuntero, p >= 5 && p <= 6); ver(rotuloPuntero, p >= 5 && p <= 6);
    original.saldo.textContent = p >= 6 ? '150' : '100';
    original.caja.setAttribute('style', p === 6 ? estilo.celdaCambio : estilo.celda);
    notaMain.textContent = p === 4 ? 'sigue en 100: el cambio se perdió' : (p === 7 ? 'quedó en 150: se modificó el original' : '');
    resumen.textContent = p === 7 ? 'Valor: el método trabaja sobre una copia. Puntero: sobre el original.' : '';
  }

  diapositiva.addEventListener('paso', (e) => dibujar(e.detail.paso));
  dibujar(0);
})();
