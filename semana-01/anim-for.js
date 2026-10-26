/* Animación · Cuántas veces gira un for
   Código representado (el del Forms de la semana 1, verificado con go run: imprime 0, 3, 6 y 9):
     for i := 0; i < 10; i += 3 { fmt.Println(i) }
   Recta numérica de 0 a 12, 60 px por unidad. Cada paso: se evalúa i < 10 y, si es verdadero, se imprime y se suma 3.
   Pasos: 1 i = 0 · 2 i = 3 · 3 i = 6 · 4 i = 9 · 5 i = 12: la condición falla y el ciclo termina · 6 resumen.
   En modo lectura se dibuja el estado final (paso 6). */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-for');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto !== undefined) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const svg = nodo('svg', { viewBox: '0 0 1000 380', role: 'img',
    'aria-label': 'La variable i salta de 3 en 3 sobre una recta numérica: 0, 3, 6 y 9 cumplen i menor que 10 y se imprimen; 12 no la cumple y el ciclo termina. Imprime 4 veces.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 56);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const X0 = 100, U = 60, Y = 170;
  const x = (v) => X0 + v * U;
  const defs = nodo('defs', {}, svg);
  const marca = nodo('marker', { id: 'punta-for', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  nodo('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill:var(--acento)' }, marca);

  // Zona donde i < 10 es verdadero
  nodo('rect', { x: x(0), y: Y - 70, width: x(10) - x(0), height: 70, style: 'fill:var(--dorado);fill-opacity:.14' }, svg);
  nodo('text', { x: x(10) - 8, y: Y - 10, 'text-anchor': 'end', style: 'fill:var(--tinta-suave);font-size:16px' }, svg, 'zona donde i < 10 es verdadero');
  nodo('line', { x1: x(10), y1: Y - 74, x2: x(10), y2: Y + 10, style: 'stroke:var(--acento);stroke-width:4;stroke-dasharray:8 6' }, svg);
  nodo('line', { x1: x(0) - 20, y1: Y, x2: x(12) + 30, y2: Y, style: 'stroke:var(--tinta-suave);stroke-width:3' }, svg);
  for (let v = 0; v <= 12; v++) {
    nodo('line', { x1: x(v), y1: Y - 8, x2: x(v), y2: Y + 8, style: 'stroke:var(--tinta-suave);stroke-width:2' }, svg);
    nodo('text', { x: x(v), y: Y + 32, 'text-anchor': 'middle', style: 'fill:var(--tinta-suave);font-family:var(--f-codigo);font-size:18px' }, svg, String(v));
  }

  const VALORES = [0, 3, 6, 9, 12];
  const saltos = nodo('g', {}, svg);
  const ficha = nodo('g', {}, svg);
  ficha.style.transition = 'transform 600ms cubic-bezier(.45,.05,.3,1), opacity 300ms ease';
  nodo('circle', { cx: 0, cy: 0, r: 22, style: 'fill:var(--guinda);stroke:var(--fondo);stroke-width:3' }, ficha);
  nodo('text', { x: 0, y: 7, 'text-anchor': 'middle', style: 'fill:#FFFFFF;font-family:var(--f-codigo);font-size:20px;font-weight:700' }, ficha, 'i');
  const consola = nodo('text', { x: X0, y: 260, style: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:22px;font-weight:700' }, svg, '');
  const nota = nodo('text', { x: X0, y: 320, style: 'fill:var(--tinta);font-size:21px;font-weight:700' }, svg, '');
  const nota2 = nodo('text', { x: X0, y: 352, style: 'fill:var(--tinta-suave);font-size:18px' }, svg, '');

  function dibujar(paso, lectura) {
    const p = Math.max(0, Math.min(6, paso));
    // En modo lectura no hace falta animar: se dibuja directo el estado final
    ficha.style.transition = lectura ? 'none' : 'transform 600ms cubic-bezier(.45,.05,.3,1), opacity 300ms ease';
    ficha.style.opacity = p >= 1 ? 1 : 0;
    const k = Math.min(p, 5) - 1;
    const v = VALORES[Math.max(0, k)];
    ficha.style.transform = `translate(${x(v)}px, ${Y - 36}px)`;
    saltos.replaceChildren();
    for (let j = 1; j <= Math.min(k, 4); j++) {
      const a = VALORES[j - 1], b = VALORES[j];
      nodo('path', { d: `M${x(a)},${Y - 60} Q${(x(a) + x(b)) / 2},${Y - 130} ${x(b)},${Y - 60}`, style: 'fill:none;stroke:var(--acento);stroke-width:3', 'marker-end': 'url(#punta-for)' }, saltos);
      nodo('text', { x: (x(a) + x(b)) / 2, y: Y - 104, 'text-anchor': 'middle', style: 'fill:var(--acento);font-size:16px;font-weight:700' }, saltos, '+3');
    }
    const impresos = VALORES.slice(0, Math.min(Math.max(k + 1, 0), 4));
    consola.textContent = p >= 1 ? 'imprime: ' + impresos.join('  ') : '';
    const TEXTOS = [
      ['for i := 0; i < 10; i += 3 { fmt.Println(i) }', 'Avanza para seguir a la variable.'],
      ['i = 0: ¿0 < 10? Sí → imprime 0 y suma 3.', 'La inicialización ocurre una sola vez, antes de la primera vuelta.'],
      ['i = 3: ¿3 < 10? Sí → imprime 3 y suma 3.', ''],
      ['i = 6: ¿6 < 10? Sí → imprime 6 y suma 3.', ''],
      ['i = 9: ¿9 < 10? Sí → imprime 9 y suma 3.', 'Ojo: 9 todavía cumple la condición.'],
      ['i = 12: ¿12 < 10? No → el ciclo termina sin imprimir.', 'La condición se revisa antes de cada vuelta.'],
      ['4 vueltas: 0, 3, 6 y 9. El 12 se calcula, pero no se imprime.', 'Para contar vueltas, anota los valores de la variable hasta que la condición sea falsa.'],
    ];
    nota.textContent = TEXTOS[p][0];
    nota2.textContent = TEXTOS[p][1];
  }

  diapositiva.addEventListener('paso', (e) => dibujar(e.detail.paso, e.detail.lectura));
  dibujar(0);
})();
