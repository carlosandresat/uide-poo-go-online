/* Animación · El arreglo detrás de un slice
   Código representado (ejemplos/slices/main.go, verificado con go run, Go 1.25):
     1 precios := [5]int{10, 20, 30, 40, 50}
     2 oferta := precios[1:3]            → [20 30] len 2 cap 4
     3 oferta[0] = 99                    → precios = [10 99 30 40 50]
     4 oferta = append(oferta, 77)       → cabe: precios = [10 99 30 77 50], len 3 cap 4
     5 oferta = append(oferta, 1, 2, 3)  → no cabe: arreglo nuevo de capacidad 8; oferta[0] = 0 ya no toca precios
   Un slice es un descriptor de tres campos: puntero al primer elemento, longitud y capacidad.
   En modo lectura se dibuja el estado final (paso 5). */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-slice');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto !== undefined) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const svg = nodo('svg', { viewBox: '0 0 1000 545', role: 'img',
    'aria-label': 'El array precios tiene 5 celdas. El slice oferta guarda un puntero a la celda 1, longitud 2 y capacidad 4. Al cambiar oferta[0] cambia precios[1]. Un append que cabe escribe en precios[3]. Un append que no cabe crea un arreglo nuevo de capacidad 8 y oferta deja de compartir memoria con precios.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 60);display:block;font-family:var(--f-texto)';
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
    llaveLen: 'stroke:var(--guinda);stroke-width:8;stroke-linecap:round',
    llaveCap: 'stroke:var(--acento);stroke-width:3;stroke-dasharray:8 7',
    cambio: 'fill:var(--dorado);opacity:.35',
  };
  const T = 'opacity 450ms ease';

  const defs = nodo('defs', {}, svg);
  const marca = nodo('marker', { id: 'punta-slice', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  nodo('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill:var(--acento)' }, marca);

  // ---- Línea de código del paso actual ----
  const LINEAS = ['', 'precios := [5]int{10, 20, 30, 40, 50}', 'oferta := precios[1:3]', 'oferta[0] = 99',
    'oferta = append(oferta, 77)', 'oferta = append(oferta, 1, 2, 3); oferta[0] = 0'];
  nodo('rect', { x: 0, y: 0, width: 1000, height: 52, rx: 8, style: 'fill:var(--codigo-fondo)' }, svg);
  const linea = nodo('text', { x: 20, y: 35, style: 'fill:var(--codigo-texto);font-family:var(--f-codigo);font-size:24px;font-weight:600' }, svg, '');
  const numLinea = nodo('text', { x: 980, y: 35, 'text-anchor': 'end', style: 'fill:var(--dorado);font-family:var(--f-codigo);font-size:20px;font-weight:600' }, svg, '');

  // ---- Array precios (5 celdas) ----
  const A = { x: 230, y: 110, w: 130, h: 76, paso: 140 };
  const xA = (i) => A.x + i * A.paso;
  const grupoA = nodo('g', {}, svg);
  grupoA.style.transition = T;
  nodo('text', { x: 20, y: A.y + 34, style: estilo.nombre }, grupoA, 'precios');
  nodo('text', { x: 20, y: A.y + 62, style: estilo.suave }, grupoA, '[5]int · array');
  const resaltesA = [], celdasA = [], valoresA = [];
  for (let i = 0; i < 5; i++) {
    nodo('text', { x: xA(i) + A.w / 2, y: A.y - 12, 'text-anchor': 'middle', style: estilo.indice }, grupoA, `[${i}]`);
    celdasA.push(nodo('rect', { x: xA(i), y: A.y, width: A.w, height: A.h, rx: 6, style: estilo.celda }, grupoA));
    const r = nodo('rect', { x: xA(i), y: A.y, width: A.w, height: A.h, rx: 6, style: estilo.cambio }, grupoA);
    r.style.transition = T;
    resaltesA.push(r);
    valoresA.push(nodo('text', { x: xA(i) + A.w / 2, y: A.y + 50, 'text-anchor': 'middle', style: estilo.valor }, grupoA, ''));
  }

  // Llaves de longitud y capacidad bajo el array
  const llaveLen = nodo('line', { style: estilo.llaveLen }, svg);
  const llaveCap = nodo('line', { style: estilo.llaveCap }, svg);
  const rotuloLen = nodo('text', { style: estilo.acento }, svg);
  const rotuloCap = nodo('text', { style: estilo.suave }, svg);
  [llaveLen, llaveCap, rotuloLen, rotuloCap].forEach((e) => { e.style.transition = T; });

  // ---- Descriptor del slice oferta ----
  const D = { x: 20, y: 330 };
  const desc = nodo('g', {}, svg);
  desc.style.transition = T;
  nodo('text', { x: D.x + 400, y: D.y + 44, style: estilo.nombre }, desc, '← oferta · []int (slice)');
  const campos = ['puntero', 'len', 'cap'].map((c, k) => {
    nodo('rect', { x: D.x + k * 130, y: D.y, width: 124, height: 70, rx: 6, style: estilo.caja }, desc);
    nodo('text', { x: D.x + k * 130 + 62, y: D.y + 26, 'text-anchor': 'middle', style: 'fill:var(--texto-caja-diagrama);font-size:16px;opacity:.85' }, desc, c);
    return nodo('text', { x: D.x + k * 130 + 62, y: D.y + 56, 'text-anchor': 'middle', style: estilo.textoCaja }, desc, '');
  });
  campos[0].textContent = '●';
  const flecha = nodo('path', { style: estilo.flecha, 'marker-end': 'url(#punta-slice)' }, svg);
  flecha.style.transition = T;

  // ---- Arreglo nuevo (paso 5): capacidad 8 ----
  const B = { x: 470, y: 446, w: 58, h: 60, paso: 64 };
  const xB = (i) => B.x + i * B.paso;
  const grupoB = nodo('g', {}, svg);
  grupoB.style.transition = T;
  nodo('text', { x: B.x, y: B.y + B.h + 30, style: estilo.nombre }, grupoB, 'arreglo nuevo · capacidad 8');
  const nuevos = [0, 30, 77, 1, 2, 3, 0, 0];
  nuevos.forEach((v, i) => {
    const libre = i >= 6;
    nodo('text', { x: xB(i) + B.w / 2, y: B.y - 10, 'text-anchor': 'middle', style: estilo.indice }, grupoB, `[${i}]`);
    nodo('rect', { x: xB(i), y: B.y, width: B.w, height: B.h, rx: 6, style: libre ? estilo.celda : estilo.celdaVentana }, grupoB);
    nodo('text', { x: xB(i) + B.w / 2, y: B.y + 42, 'text-anchor': 'middle', style: estilo.valor + ';font-size:26px' + (libre ? ';opacity:.35' : '') }, grupoB, String(v));
  });
  const notaFinal = nodo('text', { x: 980, y: 300, 'text-anchor': 'end', style: estilo.acento }, svg, 'precios ya no cambia: oferta usa otro arreglo');
  notaFinal.style.transition = T;

  // Estado de cada paso: valores del array, longitud y capacidad de oferta, celdas resaltadas
  const ESTADOS = [
    { a: [10, 20, 30, 40, 50] },
    { a: [10, 20, 30, 40, 50] },
    { a: [10, 20, 30, 40, 50], len: 2, cap: 4 },
    { a: [10, 99, 30, 40, 50], len: 2, cap: 4, cambio: [1] },
    { a: [10, 99, 30, 77, 50], len: 3, cap: 4, cambio: [3] },
    { a: [10, 99, 30, 77, 50], len: 6, cap: 8, nuevo: true },
  ];

  function dibujar(paso) {
    const e = ESTADOS[Math.max(0, Math.min(5, paso))];
    linea.textContent = LINEAS[Math.max(0, Math.min(5, paso))] || 'Avanza para ejecutar línea por línea';
    numLinea.textContent = paso >= 1 ? `línea ${Math.min(5, paso)} de 5` : '';
    grupoA.style.opacity = paso >= 1 ? 1 : 0;
    e.a.forEach((v, i) => { valoresA[i].textContent = String(v); });
    resaltesA.forEach((r, i) => { r.style.opacity = e.cambio && e.cambio.includes(i) ? 1 : 0; });

    const hayDesc = e.len !== undefined;
    desc.style.opacity = hayDesc ? 1 : 0;
    flecha.style.opacity = hayDesc ? 1 : 0;
    grupoB.style.opacity = e.nuevo ? 1 : 0;
    notaFinal.style.opacity = e.nuevo ? 1 : 0;
    if (!hayDesc) {
      [llaveLen, llaveCap, rotuloLen, rotuloCap].forEach((x) => { x.style.opacity = 0; });
      celdasA.forEach((c) => c.setAttribute('style', estilo.celda));
      return;
    }
    campos[1].textContent = String(e.len);
    campos[2].textContent = String(e.cap);

    // Ventana visible (len) sobre el array original, mientras oferta lo comparte
    celdasA.forEach((c, i) => c.setAttribute('style', !e.nuevo && i >= 1 && i < 1 + e.len ? estilo.celdaVentana : estilo.celda));
    const origen = { x: D.x + 62, y: D.y + 4 };
    if (!e.nuevo) {
      const xs = xA(1), yBajo = A.y + A.h + 22;
      llaveLen.setAttribute('x1', xs + 6); llaveLen.setAttribute('x2', xA(e.len) + A.w - 6);
      llaveLen.setAttribute('y1', yBajo); llaveLen.setAttribute('y2', yBajo);
      llaveCap.setAttribute('x1', xs + 6); llaveCap.setAttribute('x2', xA(4) + A.w - 6);
      llaveCap.setAttribute('y1', yBajo + 22); llaveCap.setAttribute('y2', yBajo + 22);
      rotuloLen.setAttribute('x', xs + 6); rotuloLen.setAttribute('y', yBajo + 62);
      rotuloLen.textContent = `len ${e.len}: lo que oferta ve`;
      rotuloCap.setAttribute('x', xA(4) + A.w); rotuloCap.setAttribute('y', yBajo + 90);
      rotuloCap.setAttribute('text-anchor', 'end');
      rotuloCap.textContent = `cap ${e.cap}: hasta el final del arreglo`;
      [llaveLen, llaveCap, rotuloLen, rotuloCap].forEach((x) => { x.style.opacity = 1; });
      const destino = { x: xA(1) + A.w / 2, y: A.y + A.h + 6 };
      flecha.setAttribute('d', `M${origen.x},${origen.y} C${origen.x},${origen.y - 60} ${destino.x - 40},${destino.y + 70} ${destino.x},${destino.y + 4}`);
    } else {
      [llaveLen, llaveCap, rotuloLen, rotuloCap].forEach((x) => { x.style.opacity = 0; });
      const destino = { x: xB(0) + B.w / 2, y: B.y - 30 };
      flecha.setAttribute('d', `M${origen.x},${D.y + 70} C${origen.x},${D.y + 150} ${destino.x - 60},${destino.y - 40} ${destino.x},${destino.y}`);
    }
  }

  diapositiva.addEventListener('paso', (ev) => dibujar(ev.detail.paso));
  dibujar(0);
})();
