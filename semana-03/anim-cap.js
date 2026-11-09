/* Animación · Cómo crece cap al hacer append
   Datos medidos con go run (Go 1.25, windows/amd64), agregando 1000 int uno por uno:
     sin reservar (var s []int): cap cambia al llegar a len 1, 5, 9, 17, 33, 65, 129, 257, 513 y 849,
       con cap 4, 8, 16, 32, 64, 128, 256, 512, 848 y 1280 → 10 arreglos nuevos,
       1868 elementos copiados en total; al final len 1000, cap 1280.
     reservando (make([]int, 0, 1000)): cap 1000 desde el inicio, 0 arreglos nuevos.
   La regla exacta de crecimiento depende de la versión de Go; la idea (crece por saltos y copia) no.
   En modo lectura se dibuja el estado final (paso 4). */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-cap');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto !== undefined) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const svg = nodo('svg', { viewBox: '0 0 1000 520', role: 'img',
    'aria-label': 'Gráfico de cap frente a la cantidad de elementos agregados, de 0 a 1000. Sin reservar, cap crece por saltos: 4, 8, 16, 32, 64, 128, 256, 512, 848 y 1280; son 10 arreglos nuevos y 1868 elementos copiados. Reservando con make([]int, 0, 1000), cap vale 1000 desde el inicio y no hay arreglos nuevos.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 58);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const T = 'opacity 450ms ease';
  const SALTOS = [[1, 4], [5, 8], [9, 16], [17, 32], [33, 64], [65, 128], [129, 256], [257, 512], [513, 848], [849, 1280]];

  // ---- Línea de código ----
  const LINEAS = ['', 'var s []int  // len 0, cap 0', 'for i := 0; i < 1000; i++ { s = append(s, i) }',
    'for i := 0; i < 1000; i++ { s = append(s, i) }', 's := make([]int, 0, 1000)  // y el mismo for'];
  nodo('rect', { x: 0, y: 0, width: 1000, height: 52, rx: 8, style: 'fill:var(--codigo-fondo)' }, svg);
  const linea = nodo('text', { x: 20, y: 35, style: 'fill:var(--codigo-texto);font-family:var(--f-codigo);font-size:22px;font-weight:600' }, svg, '');

  // ---- Ejes: x = elementos agregados (len), y = cap ----
  const P = { x0: 110, x1: 960, y0: 450, y1: 80 };
  const MAXY = 1300;
  const X = (len) => P.x0 + (len / 1000) * (P.x1 - P.x0);
  const Y = (cap) => P.y0 - (cap / MAXY) * (P.y0 - P.y1);
  const ejes = nodo('g', {}, svg);
  ejes.style.transition = T;
  const estiloEje = 'fill:var(--tinta-suave);font-family:var(--f-codigo);font-size:17px';
  [0, 250, 500, 750, 1000, 1250].forEach((v) => {
    nodo('line', { x1: P.x0, x2: P.x1, y1: Y(v), y2: Y(v), style: 'stroke:var(--regla);stroke-width:1.5' }, ejes);
    nodo('text', { x: P.x0 - 12, y: Y(v) + 6, 'text-anchor': 'end', style: estiloEje }, ejes, String(v));
  });
  [0, 250, 500, 750, 1000].forEach((v) => {
    nodo('text', { x: X(v), y: P.y0 + 26, 'text-anchor': 'middle', style: estiloEje }, ejes, String(v));
  });
  nodo('line', { x1: P.x0, x2: P.x1, y1: P.y0, y2: P.y0, style: 'stroke:var(--tinta-suave);stroke-width:2' }, ejes);
  nodo('text', { x: P.x1, y: P.y0 + 56, 'text-anchor': 'end', style: 'fill:var(--tinta-suave);font-size:18px' }, ejes, 'elementos agregados (len)');
  nodo('text', { x: 20, y: 72, style: 'fill:var(--tinta-suave);font-size:18px' }, ejes, 'cap');
  // len, como referencia: la diagonal len = cap
  nodo('line', { x1: X(0), y1: Y(0), x2: X(1000), y2: Y(1000), style: 'stroke:var(--tinta-suave);stroke-width:2;stroke-dasharray:6 8' }, ejes);
  nodo('text', { x: X(560), y: Y(560) + 32, style: 'fill:var(--tinta-suave);font-size:18px', transform: `rotate(-23 ${X(560)} ${Y(560) + 32})` }, ejes, 'len (lo que guardas)');

  // ---- Escalera sin reservar ----
  let d = `M${X(0)},${Y(0)}`;
  SALTOS.forEach(([l, c]) => { d += ` H${X(l)} V${Y(c)}`; });
  d += ` H${X(1000)}`;
  const escalera = nodo('path', { d, style: 'stroke:var(--acento);stroke-width:4;fill:none;stroke-linejoin:round' }, svg);
  const puntos = nodo('g', {}, svg);
  puntos.style.transition = T;
  SALTOS.forEach(([l, c]) => nodo('circle', { cx: X(l), cy: Y(c), r: 7, style: 'fill:var(--acento)' }, puntos));
  const rotuloEscalera = nodo('g', {}, svg);
  rotuloEscalera.style.transition = T;
  nodo('text', { x: X(20), y: Y(1150), style: 'fill:var(--acento);font-size:21px;font-weight:800' }, rotuloEscalera, 'Sin reservar: 10 arreglos nuevos');
  nodo('text', { x: X(20), y: Y(1150) + 28, style: 'fill:var(--tinta);font-size:19px' }, rotuloEscalera, 'Cada punto: Go crea un arreglo más grande y copia todo.');
  const rotuloFinal = nodo('g', {}, svg);
  rotuloFinal.style.transition = T;
  nodo('text', { x: X(1000), y: Y(1280) - 14, 'text-anchor': 'end', style: 'fill:var(--acento);font-size:19px;font-weight:700' }, rotuloFinal, 'Al final: cap 1280, 280 sin usar · 1868 elementos copiados');

  // ---- Línea reservando ----
  const reservada = nodo('g', {}, svg);
  reservada.style.transition = T;
  nodo('line', { x1: X(0), x2: X(1000), y1: Y(1000), y2: Y(1000), style: 'stroke:var(--caja-diagrama);stroke-width:6;stroke-linecap:round' }, reservada);
  nodo('text', { x: X(20), y: Y(1000) - 14, style: 'fill:var(--tinta);font-size:20px;font-weight:800' }, reservada, 'Reservando: cap 1000 desde el inicio · 0 arreglos nuevos');

  const pie = nodo('text', { x: 20, y: 512, style: 'fill:var(--tinta-suave);font-size:15px' }, svg,
    'Medido con Go 1.25 en 64 bits. Los tamaños exactos cambian entre versiones; los saltos y las copias no.');

  let largo = 0;
  function dibujar(paso, lectura) {
    const p = Math.max(0, Math.min(4, paso));
    linea.textContent = LINEAS[p] || 'Avanza para ver cómo crece cap';
    ejes.style.opacity = p >= 1 ? 1 : 0;
    pie.style.opacity = p >= 1 ? 1 : 0;
    if (!largo) largo = escalera.getTotalLength() || 3000;
    escalera.style.strokeDasharray = `${largo}`;
    // La escalera se dibuja de izquierda a derecha en el paso 2
    escalera.style.transition = lectura ? 'none' : 'stroke-dashoffset 2200ms linear, opacity 450ms ease';
    escalera.style.strokeDashoffset = p >= 2 ? '0' : `${largo}`;
    escalera.style.opacity = p >= 2 ? (p === 4 ? 0.45 : 1) : 0;
    puntos.style.opacity = p >= 2 ? (p === 4 ? 0.45 : 1) : 0;
    rotuloEscalera.style.opacity = p === 2 || p === 3 ? 1 : 0;
    rotuloFinal.style.opacity = p >= 3 ? 1 : 0;
    reservada.style.opacity = p === 4 ? 1 : 0;
  }

  diapositiva.addEventListener('paso', (ev) => dibujar(ev.detail.paso, ev.detail.lectura));
  dibujar(0, false);
})();
