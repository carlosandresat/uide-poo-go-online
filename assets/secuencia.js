/* Diagrama de secuencia animado.
   Uso:
   <figure class="secuencia" data-actores="UE, P-CSCF, S-CSCF" data-paso-inicio="1">
     <ol>
       <li data-de="UE" data-a="P-CSCF">INVITE</li>
       <li data-de="P-CSCF" data-a="UE" data-tipo="respuesta">100 Trying</li>
       <li data-de="S-CSCF" data-a="S-CSCF" data-nota="consulta al HSS">Procesa</li>
     </ol>
     <figcaption>Qué muestra el diagrama</figcaption>
   </figure>
   Cada mensaje es un paso de la diapositiva (data-paso-inicio, data-paso-inicio + 1, ...).
   data-tipo="respuesta" dibuja línea discontinua (convención UML). Un mensaje con data-de igual a data-a es un proceso interno.
   Etiquetas cortas: el diagrama mide 1000 unidades de ancho. */

window.Secuencia = (function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';

  function nodo(etiqueta, atributos, padre) {
    const e = document.createElementNS(NS, etiqueta);
    for (const k in atributos) e.setAttribute(k, atributos[k]);
    if (padre) padre.appendChild(e);
    return e;
  }

  function render(fig) {
    if (fig.dataset.renderizado) return;
    const actores = fig.dataset.actores.split(',').map((s) => s.trim());
    const mensajes = Array.from(fig.querySelectorAll('ol > li'));
    const inicio = Number(fig.dataset.pasoInicio || 1);
    const espacio = Number(fig.dataset.espacio || 62);
    const ancho = 1000, margenX = 100, arriba = 6, cabecera = 58;
    const y0 = arriba + cabecera + 28;
    const alto = y0 + mensajes.length * espacio + 10;
    const xs = actores.map((_, k) =>
      actores.length === 1 ? ancho / 2 : margenX + (k * (ancho - 2 * margenX)) / (actores.length - 1));
    const anchoCaja = Math.min(190, (ancho - 40) / actores.length - 18);

    const titulo = fig.querySelector('figcaption');
    const svg = nodo('svg', {
      viewBox: `0 0 ${ancho} ${alto}`,
      role: 'img',
      'aria-label': titulo ? titulo.textContent.trim() : 'Diagrama de secuencia',
    });

    actores.forEach((a, k) => {
      nodo('line', { x1: xs[k], y1: arriba + cabecera, x2: xs[k], y2: alto, class: 'vida' }, svg);
      const g = nodo('g', { class: 'actor' }, svg);
      nodo('rect', { x: xs[k] - anchoCaja / 2, y: arriba, width: anchoCaja, height: cabecera, rx: 10 }, g);
      const t = nodo('text', { x: xs[k], y: arriba + cabecera / 2, 'dominant-baseline': 'central', 'text-anchor': 'middle' }, g);
      t.textContent = a;
    });

    mensajes.forEach((li, i) => {
      const de = actores.indexOf((li.dataset.de || '').trim());
      const a = actores.indexOf((li.dataset.a || '').trim());
      if (de < 0 || a < 0) {
        console.warn('Secuencia: actor desconocido en', li.outerHTML);
        return;
      }
      const y = y0 + i * espacio + espacio * 0.55;
      const g = nodo('g', { class: 'mensaje', 'data-paso': String(inicio + i) }, svg);
      if (li.dataset.tipo === 'respuesta') g.classList.add('respuesta');

      let d, largo, punta, lx, ly, anclaje;
      if (de === a) {
        const x = xs[de];
        d = `M${x + 4},${y - 16} h56 v30 h-50`;
        largo = 56 + 30 + 50;
        punta = `M${x + 4},${y + 14} l12,-7 l0,14 z`;
        lx = x + 72; ly = y + 4; anclaje = 'start';
      } else {
        const dir = Math.sign(xs[a] - xs[de]);
        const x1 = xs[de] + dir * 4, x2 = xs[a] - dir * 16;
        d = `M${x1},${y} L${x2},${y}`;
        largo = Math.abs(x2 - x1);
        punta = `M${xs[a] - dir * 3},${y} l${-dir * 16},-8 l0,16 z`;
        lx = (xs[de] + xs[a]) / 2; ly = y - 12; anclaje = 'middle';
      }
      const trazo = nodo('path', { d, class: 'trazo' }, g);
      trazo.style.setProperty('--largo', largo);
      nodo('path', { d: punta, class: 'punta' }, g);
      const t = nodo('text', { x: lx, y: ly, 'text-anchor': anclaje, class: 'etiqueta' }, g);
      t.textContent = li.textContent.trim();
      if (li.dataset.nota) {
        const n = nodo('text', { x: lx, y: de === a ? ly + 24 : y + 26, 'text-anchor': anclaje, class: 'nota-mensaje' }, g);
        n.textContent = li.dataset.nota;
      }
    });

    fig.querySelector('ol').classList.add('solo-lector');
    fig.insertBefore(svg, fig.firstChild);
    agregarControles(fig, svg);
    fig.dataset.renderizado = '1';
  }

  /* En modo lectura cada diagrama tiene sus propios botones para recorrerlo paso a paso. */
  function agregarControles(fig, svg) {
    const grupos = Array.from(svg.querySelectorAll('.mensaje'));
    let actual = grupos.length;
    const caja = document.createElement('div');
    caja.className = 'controles-secuencia';
    const boton = (texto, accion) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = texto;
      b.addEventListener('click', accion);
      caja.appendChild(b);
    };
    const pintar = () => grupos.forEach((g, i) => g.classList.toggle('oculto', i >= actual));
    boton('Desde el inicio', () => { actual = 1; pintar(); });
    boton('Siguiente mensaje', () => { actual = Math.min(grupos.length, actual + 1); pintar(); });
    boton('Ver todo', () => { actual = grupos.length; pintar(); });
    svg.after(caja);
  }

  function renderTodas(raiz) {
    (raiz || document).querySelectorAll('figure.secuencia').forEach(render);
  }

  return { render, renderTodas };
})();
