/* Animación · Qué pasa en una llamada con dos valores de retorno
   Código representado (verificado con go run):
     duracion := 200
     h, m := convertir(duracion)        // func convertir(minutos int) (int, int) { return minutos / 60, minutos % 60 }
   Pasos: 1 el argumento se copia en el parámetro · 2 la función calcula 200/60 = 3 y 200%60 = 20
          3 los dos valores vuelven en orden: el 1.º a h y el 2.º a m · 4 la llamada termina: las variables de convertir desaparecen
   En modo lectura se dibuja el estado final (paso 4). */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-llamada');
  if (!fig) return;
  const diapositiva = fig.closest('.diapositiva');

  function nodo(etiqueta, atributos, padre, texto) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (texto !== undefined) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }

  const svg = nodo('svg', { viewBox: '0 0 1000 470', role: 'img',
    'aria-label': 'main llama a convertir con duracion igual a 200. El valor 200 se copia en el parámetro minutos. convertir calcula 3 y 20 y los devuelve en orden: 3 va a h y 20 va a m. Al terminar, las variables de convertir desaparecen.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 74);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const estilo = {
    marco: 'fill:var(--superficie);stroke:var(--regla);stroke-width:2.5',
    titulo: 'fill:var(--texto-caja-diagrama);font-weight:800;font-size:26px;font-family:var(--f-codigo)',
    cabecera: 'fill:var(--caja-diagrama)',
    codigo: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:20px;font-weight:600',
    nombre: 'fill:var(--tinta-suave);font-family:var(--f-codigo);font-size:19px',
    celda: 'fill:var(--fondo);stroke:var(--regla);stroke-width:2',
    valor: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:30px;font-weight:700',
    ficha: 'fill:var(--guinda)',
    textoFicha: 'fill:#FFFFFF;font-family:var(--f-codigo);font-size:28px;font-weight:700',
    acento: 'fill:var(--acento);font-size:20px;font-weight:800',
    flecha: 'stroke:var(--acento);stroke-width:3.5;fill:none',
  };
  const T = 'opacity 450ms ease, transform 700ms cubic-bezier(.45,.05,.3,1)';
  const capa = (desde, hasta, padre) => {
    const g = nodo('g', { 'data-desde': desde }, padre || svg);
    if (hasta !== undefined) g.dataset.hasta = hasta;
    g.style.transition = T;
    return g;
  };

  // Marcador de flecha
  const defs = nodo('defs', {}, svg);
  const marca = nodo('marker', { id: 'punta-llamada', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
  nodo('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill:var(--acento)' }, marca);

  // ---- main ----
  nodo('rect', { x: 20, y: 20, width: 420, height: 430, rx: 8, style: estilo.marco }, svg);
  nodo('rect', { x: 20, y: 20, width: 420, height: 50, rx: 8, style: estilo.cabecera }, svg);
  nodo('text', { x: 40, y: 54, style: estilo.titulo }, svg, 'main');
  nodo('text', { x: 40, y: 104, style: estilo.codigo }, svg, 'h, m := convertir(duracion)');

  const celda = (x, y, nombre, padre) => {
    nodo('text', { x, y: y - 10, style: estilo.nombre }, padre, nombre);
    nodo('rect', { x, y, width: 170, height: 58, rx: 6, style: estilo.celda }, padre);
  };
  celda(40, 150, 'duracion · int', svg);
  nodo('text', { x: 125, y: 190, 'text-anchor': 'middle', style: estilo.valor }, svg, '200');
  celda(40, 268, 'h · int', svg);
  celda(40, 368, 'm · int', svg);

  // ---- convertir ----
  const funcion = nodo('g', {}, svg);
  funcion.style.transition = T;
  nodo('rect', { x: 560, y: 20, width: 420, height: 430, rx: 8, style: estilo.marco }, funcion);
  nodo('rect', { x: 560, y: 20, width: 420, height: 50, rx: 8, style: estilo.cabecera }, funcion);
  nodo('text', { x: 580, y: 54, style: estilo.titulo }, funcion, 'convertir');
  nodo('text', { x: 580, y: 104, style: estilo.codigo }, funcion, 'return minutos/60, minutos%60');
  celda(580, 150, 'minutos · int (parámetro)', funcion);
  nodo('text', { x: 580, y: 258, style: estilo.nombre }, funcion, '1.º retorno');
  nodo('rect', { x: 580, y: 268, width: 170, height: 58, rx: 6, style: estilo.celda }, funcion);
  nodo('text', { x: 580, y: 358, style: estilo.nombre }, funcion, '2.º retorno');
  nodo('rect', { x: 580, y: 368, width: 170, height: 58, rx: 6, style: estilo.celda }, funcion);

  const calculo1 = capa(2, 2, funcion);
  nodo('text', { x: 770, y: 306, style: estilo.codigo }, calculo1, '200 / 60 = 3');
  const calculo2 = capa(2, 2, funcion);
  nodo('text', { x: 770, y: 406, style: estilo.codigo }, calculo2, '200 % 60 = 20');

  const terminada = capa(4);
  nodo('text', { x: 865, y: 172, 'text-anchor': 'middle', style: estilo.acento }, terminada, 'la llamada terminó:');
  nodo('text', { x: 865, y: 198, 'text-anchor': 'middle', style: estilo.acento }, terminada, 'minutos ya no existe');

  // ---- Fichas que viajan ----
  // Cada ficha: posición de origen, destino y el paso en que viaja.
  const ficha = (texto, x0, y0, x1, y1, apareceEn, viajaEn) => {
    const g = nodo('g', { 'data-desde': apareceEn }, svg);
    g.style.transition = T;
    nodo('rect', { x: x0, y: y0, width: 150, height: 46, rx: 23, style: estilo.ficha }, g);
    nodo('text', { x: x0 + 75, y: y0 + 33, 'text-anchor': 'middle', style: estilo.textoFicha }, g, texto);
    g.dataset.dx = x1 - x0;
    g.dataset.dy = y1 - y0;
    g.dataset.viaja = viajaEn;
    return g;
  };
  // La copia de 200: sale de duracion y se queda en minutos (duracion conserva su 200)
  const copia = ficha('200', 50, 156, 590, 156, 1, 1);
  const r1 = ficha('3', 590, 274, 50, 274, 2, 3);
  const r2 = ficha('20', 590, 374, 50, 374, 2, 3);

  // Flechas de ida y vuelta
  const ida = capa(1, 1);
  nodo('path', { d: 'M215,179 C330,130 450,130 575,179', style: estilo.flecha, 'marker-end': 'url(#punta-llamada)' }, ida);
  nodo('text', { x: 395, y: 132, 'text-anchor': 'middle', style: estilo.acento }, ida, 'se copia');
  const vuelta = capa(3, 3);
  nodo('path', { d: 'M575,297 L218,297', style: estilo.flecha, 'marker-end': 'url(#punta-llamada)' }, vuelta);
  nodo('path', { d: 'M575,397 L218,397', style: estilo.flecha, 'marker-end': 'url(#punta-llamada)' }, vuelta);
  nodo('text', { x: 500, y: 287, 'text-anchor': 'middle', style: estilo.acento }, vuelta, '1.º → h');
  nodo('text', { x: 500, y: 387, 'text-anchor': 'middle', style: estilo.acento }, vuelta, '2.º → m');

  function dibujar(paso) {
    svg.querySelectorAll('[data-desde]').forEach((e) => {
      const desde = Number(e.dataset.desde);
      const hasta = e.dataset.hasta === undefined ? Infinity : Number(e.dataset.hasta);
      e.style.opacity = paso >= desde && paso <= hasta ? 1 : 0;
    });
    [copia, r1, r2].forEach((g) => {
      const llego = paso >= Number(g.dataset.viaja);
      g.style.transform = llego ? `translate(${g.dataset.dx}px, ${g.dataset.dy}px)` : 'translate(0px, 0px)';
    });
    // La copia viaja en el paso 1; antes de eso no se ve. Al terminar la llamada, desaparece con convertir.
    copia.style.opacity = paso >= 1 && paso < 4 ? 1 : 0;
    funcion.style.opacity = paso >= 4 ? 0.3 : 1;
  }

  diapositiva.addEventListener('paso', (e) => dibujar(e.detail.paso));
  dibujar(0);
})();
