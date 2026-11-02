/* Animación · Un closure recuerda su variable
   Código representado (ejemplos/funciones/main.go, verificado con go run: imprime 1 2 3 y luego 1):
     func generadorDeTurnos() func() int {
         siguiente := 0
         return func() int { siguiente++; return siguiente }
     }
     turno := generadorDeTurnos()   // la función devuelta se lleva su propia variable siguiente
     turno(); turno(); turno()      // 1, 2, 3
     otro := generadorDeTurnos()    // otra llamada: otra variable siguiente, independiente
     otro()                         // 1
   En modo lectura se dibuja el estado final (paso 6). */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-closure');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto !== undefined) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const svg = nodo('svg', { viewBox: '0 0 1000 420', role: 'img',
    'aria-label': 'turno guarda una función que recuerda su propia variable siguiente: tres llamadas devuelven 1, 2 y 3. otro es una segunda función con otra variable siguiente, que empieza en 0 y devuelve 1.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 56);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const estilo = {
    var: 'fill:var(--caja-diagrama)',
    textoVar: 'fill:var(--texto-caja-diagrama);font-family:var(--f-codigo);font-size:22px;font-weight:700',
    entorno: 'fill:var(--superficie);stroke:var(--regla);stroke-width:2.5',
    entornoActivo: 'fill:var(--superficie);stroke:var(--dorado);stroke-width:5',
    nombre: 'fill:var(--tinta-suave);font-size:18px',
    mono: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:24px;font-weight:700',
    flecha: 'stroke:var(--acento);stroke-width:3.5;fill:none',
    acento: 'fill:var(--acento);font-size:20px;font-weight:800',
  };
  const T = 'opacity 450ms ease';
  const defs = nodo('defs', {}, svg);
  const marca = nodo('marker', { id: 'punta-closure', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  nodo('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill:var(--acento)' }, marca);

  nodo('rect', { x: 0, y: 0, width: 1000, height: 50, rx: 8, style: 'fill:var(--codigo-fondo)' }, svg);
  const linea = nodo('text', { x: 20, y: 33, style: 'fill:var(--codigo-texto);font-family:var(--f-codigo);font-size:22px;font-weight:600' }, svg, '');

  function par(y, nombreVar) {
    const g = nodo('g', {}, svg);
    g.style.transition = T;
    nodo('rect', { x: 30, y, width: 230, height: 64, rx: 8, style: estilo.var }, g);
    nodo('text', { x: 145, y: y + 30, 'text-anchor': 'middle', style: estilo.textoVar }, g, nombreVar);
    nodo('text', { x: 145, y: y + 52, 'text-anchor': 'middle', style: 'fill:var(--texto-caja-diagrama);font-size:15px' }, g, 'func() int');
    nodo('path', { d: `M262,${y + 32} L478,${y + 32}`, style: estilo.flecha, 'marker-end': 'url(#punta-closure)' }, g);
    nodo('text', { x: 370, y: y + 22, 'text-anchor': 'middle', style: estilo.nombre }, g, 'recuerda');
    const caja = nodo('rect', { x: 485, y: y - 6, width: 300, height: 76, rx: 8, style: estilo.entorno }, g);
    nodo('text', { x: 500, y: y + 16, style: estilo.nombre }, g, 'variable capturada');
    const valor = nodo('text', { x: 500, y: y + 52, style: estilo.mono }, g, 'siguiente = 0');
    const salida = nodo('text', { x: 810, y: y + 40, style: estilo.acento }, g, '');
    return { g, caja, valor, salida };
  }
  const turno = par(110, 'turno');
  const otro = par(250, 'otro');
  const nota = nodo('text', { x: 500, y: 395, 'text-anchor': 'middle', style: 'fill:var(--tinta);font-size:20px;font-weight:700' }, svg, '');

  const ESTADOS = [
    { l: 'Avanza para ejecutar línea por línea', t: null, o: null },
    { l: 'turno := generadorDeTurnos()', t: [0, ''], o: null, act: 't', n: 'generadorDeTurnos terminó, pero su variable siguiente sigue viva: turno la recuerda.' },
    { l: 'turno()', t: [1, 'devuelve 1'], o: null, act: 't', n: 'Cada llamada suma sobre la misma variable.' },
    { l: 'turno()', t: [2, 'devuelve 2'], o: null, act: 't', n: 'Cada llamada suma sobre la misma variable.' },
    { l: 'turno()', t: [3, 'devuelve 3'], o: null, act: 't', n: 'Por eso imprime 1 2 3.' },
    { l: 'otro := generadorDeTurnos()', t: [3, ''], o: [0, ''], act: 'o', n: 'Otra llamada crea otra variable siguiente, independiente.' },
    { l: 'otro()', t: [3, ''], o: [1, 'devuelve 1'], act: 'o', n: 'otro empieza en 1; turno sigue en 3.' },
  ];

  function pintar(p, estado, activo) {
    p.g.style.opacity = estado ? 1 : 0;
    if (!estado) return;
    p.valor.textContent = `siguiente = ${estado[0]}`;
    p.salida.textContent = estado[1];
    p.caja.setAttribute('style', activo ? estilo.entornoActivo : estilo.entorno);
  }

  function dibujar(paso) {
    const e = ESTADOS[Math.max(0, Math.min(6, paso))];
    linea.textContent = e.l;
    pintar(turno, e.t, e.act === 't');
    pintar(otro, e.o, e.act === 'o');
    nota.textContent = e.n || '';
  }

  diapositiva.addEventListener('paso', (ev) => dibujar(ev.detail.paso));
  dibujar(0);
})();
