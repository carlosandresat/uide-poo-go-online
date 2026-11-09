/* Animación · Quitar el elemento de la posición i de un slice
   Código representado (verificado con go run, Go 1.25):
     1 cola := []int{11, 22, 33, 44, 55}            → len 5 cap 5
     2 sin := append(cola[:1], cola[2:]...)
       · cola[:1] tiene len 1 y cap 5: el append cabe y escribe en el mismo arreglo
       · copia 33, 44 y 55 una posición a la izquierda (el 22 se pierde)
       · sin = [11 33 44 55] len 4 cap 5 · cola = [11 33 44 55 55] len 5 cap 5
   En modo lectura se dibuja el estado final (paso 4). */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-borrar');
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
    'aria-label': 'El slice cola tiene 11, 22, 33, 44 y 55. append(cola[:1], cola[2:]...) escribe en el mismo arreglo: copia 33, 44 y 55 una posición a la izquierda. El resultado sin es [11 33 44 55] y cola queda [11 33 44 55 55].' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 58);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const estilo = {
    celda: 'fill:var(--fondo);stroke:var(--regla);stroke-width:2.5',
    celdaVentana: 'fill:var(--superficie);stroke:var(--acento);stroke-width:3',
    valor: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:32px;font-weight:700',
    indice: 'fill:var(--tinta-suave);font-family:var(--f-codigo);font-size:18px',
    nombre: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:22px;font-weight:700',
    suave: 'fill:var(--tinta-suave);font-size:19px',
    caja: 'fill:var(--caja-diagrama)',
    textoCaja: 'fill:var(--texto-caja-diagrama);font-family:var(--f-codigo);font-size:21px;font-weight:700',
    acento: 'fill:var(--acento);font-size:21px;font-weight:800',
    flecha: 'stroke:var(--acento);stroke-width:4;fill:none',
    llaveDestino: 'stroke:var(--guinda);stroke-width:8;stroke-linecap:round',
    llaveOrigen: 'stroke:var(--acento);stroke-width:3;stroke-dasharray:8 7',
    cambio: 'fill:var(--acento);fill-opacity:.22',
  };
  const T = 'opacity 450ms ease, transform 700ms ease';

  const defs = nodo('defs', {}, svg);
  const marca = nodo('marker', { id: 'punta-borrar', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  nodo('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill:var(--acento)' }, marca);

  // ---- Línea de código ----
  const LINEA2 = 'sin := append(cola[:1], cola[2:]...)';
  const LINEAS = ['', 'cola := []int{11, 22, 33, 44, 55}', LINEA2, LINEA2, LINEA2];
  const ETAPAS = ['', 'línea 1 de 2', 'línea 2 · argumentos', 'línea 2 · copia', 'línea 2 · resultado'];
  nodo('rect', { x: 0, y: 0, width: 1000, height: 52, rx: 8, style: 'fill:var(--codigo-fondo)' }, svg);
  const linea = nodo('text', { x: 20, y: 35, style: 'fill:var(--codigo-texto);font-family:var(--f-codigo);font-size:24px;font-weight:600' }, svg, '');
  const etapa = nodo('text', { x: 980, y: 35, 'text-anchor': 'end', style: 'fill:var(--dorado);font-family:var(--f-codigo);font-size:20px;font-weight:600' }, svg, '');

  // ---- Arreglo de cola (5 celdas) ----
  const A = { x: 230, y: 110, w: 130, h: 76, paso: 140 };
  const xA = (i) => A.x + i * A.paso;
  const grupoA = nodo('g', {}, svg);
  grupoA.style.transition = T;
  nodo('text', { x: 20, y: A.y + 34, style: estilo.nombre }, grupoA, 'arreglo');
  nodo('text', { x: 20, y: A.y + 62, style: estilo.suave }, grupoA, 'de cola');
  const celdas = [], resaltes = [], valores = [];
  const INICIAL = [11, 22, 33, 44, 55];
  for (let i = 0; i < 5; i++) {
    nodo('text', { x: xA(i) + A.w / 2, y: A.y - 12, 'text-anchor': 'middle', style: estilo.indice }, grupoA, `[${i}]`);
    celdas.push(nodo('rect', { x: xA(i), y: A.y, width: A.w, height: A.h, rx: 6, style: estilo.celda }, grupoA));
    const r = nodo('rect', { x: xA(i), y: A.y, width: A.w, height: A.h, rx: 6, style: estilo.cambio }, grupoA);
    r.style.transition = T;
    resaltes.push(r);
    const v = nodo('text', { x: xA(i) + A.w / 2, y: A.y + 50, 'text-anchor': 'middle', style: estilo.valor }, grupoA, String(INICIAL[i]));
    v.style.transition = T;
    valores.push(v);
  }
  // Copias que se desplazan una celda a la izquierda (33, 44, 55)
  const moviles = [2, 3, 4].map((i) => {
    const t = nodo('text', { x: xA(i) + A.w / 2, y: A.y + 50, 'text-anchor': 'middle', style: estilo.valor }, grupoA, String(INICIAL[i]));
    t.style.transition = T;
    return t;
  });

  // ---- Llaves de los argumentos: destino cola[:1] y origen cola[2:] ----
  const yLlave = A.y + A.h + 22;
  const argumentos = nodo('g', {}, svg);
  argumentos.style.transition = T;
  nodo('line', { x1: xA(0) + 6, x2: xA(0) + A.w - 6, y1: yLlave, y2: yLlave, style: estilo.llaveDestino }, argumentos);
  nodo('text', { x: xA(0), y: yLlave + 36, style: estilo.acento }, argumentos, 'cola[:1]');
  nodo('text', { x: xA(0), y: yLlave + 62, style: estilo.suave }, argumentos, 'len 1 · cap 5');
  nodo('line', { x1: xA(2) + 6, x2: xA(4) + A.w - 6, y1: yLlave, y2: yLlave, style: estilo.llaveOrigen }, argumentos);
  nodo('text', { x: xA(2), y: yLlave + 36, style: estilo.acento }, argumentos, 'cola[2:] → se copia desde aquí');
  nodo('text', { x: xA(2), y: yLlave + 62, style: estilo.suave }, argumentos, 'y se escribe a partir de [1]');

  // ---- Descriptores de cola y sin ----
  function descriptor(x, y, nombre) {
    const g = nodo('g', {}, svg);
    g.style.transition = T;
    const valoresCaja = ['puntero', 'len', 'cap'].map((c, k) => {
      nodo('rect', { x: x + k * 110, y, width: 104, height: 66, rx: 6, style: estilo.caja }, g);
      nodo('text', { x: x + k * 110 + 52, y: y + 24, 'text-anchor': 'middle', style: 'fill:var(--texto-caja-diagrama);font-size:16px;opacity:.85' }, g, c);
      return nodo('text', { x: x + k * 110 + 52, y: y + 53, 'text-anchor': 'middle', style: estilo.textoCaja }, g, k === 0 ? '●' : '');
    });
    nodo('text', { x: x + 340, y: y + 42, style: estilo.nombre }, g, nombre);
    return { g, len: valoresCaja[1], cap: valoresCaja[2] };
  }
  const D = { y: 330 };
  const dCola = descriptor(20, D.y, '← cola');
  const dSin = descriptor(520, D.y, '← sin');
  const flechaCola = nodo('path', { style: estilo.flecha, 'marker-end': 'url(#punta-borrar)',
    d: `M72,${D.y} C72,${D.y - 70} ${xA(0) + 20},${A.y + A.h + 90} ${xA(0) + 40},${A.y + A.h + 6}` }, svg);
  const flechaSin = nodo('path', { style: estilo.flecha, 'marker-end': 'url(#punta-borrar)',
    d: `M572,${D.y} C572,${D.y - 90} ${xA(0) + 110},${A.y + A.h + 110} ${xA(0) + 80},${A.y + A.h + 6}` }, svg);
  [flechaCola, flechaSin].forEach((f) => { f.style.transition = T; });

  // ---- Nota inferior ----
  const NOTAS = ['', 'cola ve las 5 celdas: len 5, cap 5.',
    'cola[:1] tiene capacidad 5: el append cabe y escribe en el mismo arreglo.',
    'Copia 33, 44 y 55 una celda a la izquierda. El 22 se pierde.',
    'sin = [11 33 44 55] · cola = [11 33 44 55 55]: cola cambió y repite el último.'];
  const nota = nodo('text', { x: 20, y: 470, style: estilo.acento }, svg, '');

  function dibujar(paso) {
    const p = Math.max(0, Math.min(4, paso));
    linea.textContent = LINEAS[p] || 'Avanza para ejecutar línea por línea';
    etapa.textContent = ETAPAS[p];
    nota.textContent = NOTAS[p];
    grupoA.style.opacity = p >= 1 ? 1 : 0;
    dCola.g.style.opacity = p >= 1 ? 1 : 0;
    flechaCola.style.opacity = p >= 1 && p !== 2 ? 1 : 0;
    dCola.len.textContent = '5';
    dCola.cap.textContent = '5';
    argumentos.style.opacity = p === 2 ? 1 : 0;

    const copiado = p >= 3;
    // 22, 33 y 44 se sobrescriben; 11 y el 55 de la última celda quedan
    [1, 2, 3].forEach((i) => { valores[i].style.opacity = copiado ? 0 : 1; });
    moviles.forEach((t) => {
      t.style.opacity = copiado ? 1 : 0;
      t.style.transform = copiado ? `translateX(-${A.paso}px)` : 'translateX(0)';
    });
    resaltes.forEach((r, i) => {
      const enCopia = copiado && i >= 1 && i <= 3;
      const repetido = p === 4 && i === 4;
      r.style.opacity = enCopia || repetido ? 1 : 0;
    });
    celdas.forEach((c, i) => {
      let ventana = false;
      if (p === 2) ventana = i === 0;
      else if (p === 4) ventana = i <= 3; // lo que ve sin
      c.setAttribute('style', ventana ? estilo.celdaVentana : estilo.celda);
    });

    const hayResultado = p === 4;
    dSin.g.style.opacity = hayResultado ? 1 : 0;
    flechaSin.style.opacity = hayResultado ? 1 : 0;
    dSin.len.textContent = '4';
    dSin.cap.textContent = '5';
  }

  diapositiva.addEventListener('paso', (ev) => dibujar(ev.detail.paso));
  dibujar(0);
})();
