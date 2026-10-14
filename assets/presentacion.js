/* Motor de presentaciones de sesión · Cursos UIDE · diseño «Señalética»
   Teclas: → / Espacio / AvPág avanza · ← / RePág retrocede · Inicio / Fin · F pantalla completa
           D modo claro/oscuro · L modo lectura · T inicia o pausa el temporizador de la diapositiva
   Atributos:
     <body data-curso="poo-go" data-formato="taller|clinica" data-bloque4="Ejercicio aplicado">
     <section class="diapositiva" data-bloque="1..5"> (si falta, hereda el de la anterior)
     data-paso="n" en cualquier elemento: aparece en el paso n de esa diapositiva
     <div class="recorrido-completo"></div> en la portada: el motor dibuja el recorrido de la sesión
   Animaciones propias: escuchar el evento "paso" en la diapositiva:
     diapositiva.addEventListener('paso', (e) => dibujar(e.detail.paso, e.detail.lectura)); */

(function () {
  'use strict';

  const body = document.body;
  const escenario = document.querySelector('.escenario');
  const diapositivas = Array.from(document.querySelectorAll('.diapositiva'));
  if (!escenario || diapositivas.length === 0) return;

  if (window.Secuencia) window.Secuencia.renderTodas(escenario);

  const BLOQUES = {
    taller: [
      { n: 1, nombre: 'Puente', ini: 0, fin: 10 },
      { n: 2, nombre: 'Caso en vivo', ini: 10, fin: 25 },
      { n: 3, nombre: 'Salas', ini: 25, fin: 55 },
      { pausa: true, ini: 55, fin: 60 },
      { n: 4, nombre: 'Plenaria', ini: 60, fin: 100 },
      { n: 5, nombre: 'Cierre', ini: 100, fin: 120 },
    ],
    clinica: [
      { n: 1, nombre: 'Puente', ini: 0, fin: 10 },
      { n: 2, nombre: 'Caso en vivo', ini: 10, fin: 30 },
      { n: 3, nombre: 'Clínica', ini: 30, fin: 70 },
      { pausa: true, ini: 70, fin: 75 },
      { n: 4, nombre: body.dataset.bloque4 || 'Ejercicio aplicado', ini: 75, fin: 105 },
      { n: 5, nombre: 'Cierre', ini: 105, fin: 120 },
    ],
  };
  const bloques = BLOQUES[body.dataset.formato] || BLOQUES.taller;
  const bloquePorNumero = (n) => bloques.find((b) => b.n === n);
  const crear = (etiqueta, clase, texto) => {
    const e = document.createElement(etiqueta);
    if (clase) e.className = clase;
    if (texto != null) e.textContent = texto;
    return e;
  };

  /* ---------- Contenido generado desde el formato ---------- */

  // Plan de la sesión: minutos y nombre de cada bloque
  document.querySelectorAll('.plan li[data-bloque]').forEach((li) => {
    const b = bloquePorNumero(Number(li.dataset.bloque));
    if (!b) return;
    const texto = crear('span');
    texto.append(crear('strong', null, b.nombre + '. '), ...li.childNodes);
    li.replaceChildren(crear('span', 'min', `${b.ini}–${b.fin}`), texto);
  });

  // Portadas de bloque: nombre, minutos y letrero de lo que sigue
  diapositivas.filter((d) => d.classList.contains('bloque')).forEach((d) => {
    const b = bloquePorNumero(Number(d.dataset.bloque));
    if (!b) return;
    const h2 = d.querySelector('h2');
    if (h2 && !h2.textContent.trim()) h2.textContent = b.nombre;
    const nota = d.dataset.nota || (body.dataset.formato !== 'clinica' && b.n === 3 ? 'esta parte no se graba' : '');
    const min = d.querySelector('.minutos');
    if (min && !min.textContent.trim()) min.textContent = `Minutos ${b.ini} a ${b.fin}` + (nota ? ` · ${nota}` : '');
    const proximo = bloquePorNumero(b.n + 1);
    if (proximo && !d.querySelector('.siguiente')) {
      const letrero = crear('div', 'siguiente');
      const hayPausa = bloques.some((x) => x.pausa && x.ini === b.fin);
      letrero.append(crear('span', null, `Siguiente${hayPausa ? ', tras la pausa' : ''}: ${proximo.n} ${proximo.nombre}`));
      letrero.insertAdjacentHTML('beforeend',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>');
      d.appendChild(letrero);
    }
  });

  // Recorrido de la sesión como línea de metro
  function construirRecorrido(completo) {
    const r = crear('div', 'recorrido');
    const total = bloques[bloques.length - 1].fin;
    const paradas = bloques.map((b, k) => {
      const p = crear('div', 'parada' + (b.pausa ? ' pausa' : '') + (k === bloques.length - 1 ? ' ultima' : ''));
      // Como en un mapa de metro, las estaciones van equidistantes; los minutos están en la etiqueta.
      p.style.flexGrow = b.pausa ? '0.35' : (k === bloques.length - 1 ? '0.7' : '1');
      p.style.flexBasis = '0';
      if (!b.pausa) {
        p.append(crear('span', 'estacion'));
        p.append(crear('span', 'nombre', `${b.n} ${b.nombre}`));
        if (completo) p.append(crear('span', 'inicio', `min ${b.ini}`));
        p.title = `${b.nombre}: minutos ${b.ini}–${b.fin} de ${total}`;
      } else {
        p.title = `Pausa: minutos ${b.ini}–${b.fin}`;
      }
      r.appendChild(p);
      return { p, b };
    });
    return { r, paradas };
  }

  document.querySelectorAll('.recorrido-completo').forEach((caja) => {
    caja.replaceChildren(crear('div', 'recorrido-titulo', 'Recorrido de la sesión'), construirRecorrido(true).r);
  });

  const fijo = construirRecorrido(false);
  const contenedorFijo = crear('nav', 'recorrido-fijo');
  contenedorFijo.setAttribute('aria-label', 'Bloques de la sesión');
  contenedorFijo.appendChild(fijo.r);
  escenario.appendChild(contenedorFijo);

  /* ---------- Controles ---------- */

  const controles = crear('div', 'controles');
  const anterior = crear('button', null, 'Anterior');
  anterior.type = 'button';
  anterior.addEventListener('click', retroceder);
  const contador = crear('span', 'contador');
  const siguiente = crear('button', null, 'Siguiente');
  siguiente.type = 'button';
  siguiente.addEventListener('click', avanzar);
  const tema = crear('button', null, 'Modo oscuro');
  tema.type = 'button';
  tema.setAttribute('data-alternar-tema', '');
  tema.addEventListener('click', () => window.Tema && window.Tema.alternar());
  controles.append(anterior, contador, siguiente, tema);
  escenario.appendChild(controles);
  if (window.Tema) window.Tema.actualizarBotones();

  /* ---------- Estado ---------- */

  const pasosMax = diapositivas.map((d) =>
    Math.max(0, ...Array.from(d.querySelectorAll('[data-paso]')).map((e) => Number(e.dataset.paso) || 0)));

  const bloqueDe = [];
  diapositivas.forEach((d, i) => {
    bloqueDe[i] = d.dataset.bloque ? Number(d.dataset.bloque) : (i > 0 ? bloqueDe[i - 1] : 0);
  });

  let indice = 0;
  let paso = 0;

  function actualizarRecorrido() {
    const actual = bloqueDe[indice];
    fijo.paradas.forEach(({ p, b }) => {
      const n = b.pausa ? (bloques.find((x) => x.ini === b.fin) || {}).n - 0.5 : b.n;
      p.classList.toggle('actual', !b.pausa && b.n === actual);
      p.classList.toggle('pasada', actual > 0 && n < actual);
    });
    contador.textContent = `${indice + 1} / ${diapositivas.length}`;
  }

  /* ---------- Modo: presentación o lectura ---------- */

  const params = new URLSearchParams(location.search);
  let modoForzado = params.get('modo'); // "lectura" | "presentacion" | null
  const pantallaAngosta = matchMedia('(max-width: 900px)');
  const esLectura = () => (modoForzado ? modoForzado === 'lectura' : pantallaAngosta.matches);

  function aplicarModo() {
    const lectura = esLectura();
    body.classList.toggle('lectura', lectura);
    body.classList.toggle('presentacion', !lectura);
    if (lectura) {
      diapositivas.forEach((d, i) => {
        d.querySelectorAll('[data-paso]').forEach((e) => e.classList.add('visible'));
        d.dispatchEvent(new CustomEvent('paso', { detail: { paso: pasosMax[i], lectura: true } }));
      });
    } else {
      mostrar(indice, paso);
    }
  }

  /* ---------- Navegación ---------- */

  function mostrar(i, p) {
    indice = Math.max(0, Math.min(diapositivas.length - 1, i));
    paso = Math.max(0, Math.min(pasosMax[indice], p));
    diapositivas.forEach((d, k) => d.classList.toggle('activa', k === indice));
    const d = diapositivas[indice];
    d.querySelectorAll('[data-paso]').forEach((e) => e.classList.toggle('visible', Number(e.dataset.paso) <= paso));
    actualizarRecorrido();
    history.replaceState(null, '', location.pathname + location.search + '#' + (indice + 1));
    d.dispatchEvent(new CustomEvent('paso', { detail: { paso, lectura: false } }));
  }

  function avanzar() {
    if (paso < pasosMax[indice]) mostrar(indice, paso + 1);
    else if (indice < diapositivas.length - 1) mostrar(indice + 1, 0);
  }

  function retroceder() {
    if (paso > 0) mostrar(indice, paso - 1);
    else if (indice > 0) mostrar(indice - 1, pasosMax[indice - 1]);
  }

  /* ---------- Temporizador (consignas de salas o clínica) ---------- */

  function prepararTemporizadores() {
    document.querySelectorAll('.temporizador').forEach((t) => {
      const total = Math.round(Number(t.dataset.minutos || 10) * 60);
      let restante = total;
      let intervalo = null;
      const valor = crear('span');
      const ayuda = crear('span', 'temporizador-ayuda', 'Clic o tecla T para iniciar o pausar');
      t.replaceChildren(valor, ayuda);
      const pintar = () => {
        const m = Math.floor(restante / 60), s = restante % 60;
        valor.textContent = `${m}:${String(s).padStart(2, '0')}`;
        t.classList.toggle('terminado', restante === 0);
      };
      t.alternar = () => {
        if (intervalo) { clearInterval(intervalo); intervalo = null; return; }
        if (restante === 0) restante = total;
        intervalo = setInterval(() => {
          restante = Math.max(0, restante - 1);
          pintar();
          if (restante === 0) { clearInterval(intervalo); intervalo = null; }
        }, 1000);
      };
      t.addEventListener('click', t.alternar);
      pintar();
    });
  }

  /* ---------- Teclado ---------- */

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (tecla === 'd') { if (window.Tema) window.Tema.alternar(); return; }
    if (tecla === 'l') {
      modoForzado = esLectura() ? 'presentacion' : 'lectura';
      aplicarModo();
      return;
    }
    if (body.classList.contains('lectura')) return;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(tecla)) { e.preventDefault(); avanzar(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(tecla)) { e.preventDefault(); retroceder(); }
    else if (tecla === 'Home') mostrar(0, 0);
    else if (tecla === 'End') mostrar(diapositivas.length - 1, pasosMax[diapositivas.length - 1]);
    else if (tecla === 'f') {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
    } else if (tecla === 't') {
      const t = diapositivas[indice].querySelector('.temporizador');
      if (t && t.alternar) t.alternar();
    }
  });

  /* ---------- Inicio ---------- */

  prepararTemporizadores();
  const desdeHash = parseInt(location.hash.slice(1), 10);
  if (desdeHash > 0) indice = desdeHash - 1;
  pantallaAngosta.addEventListener('change', aplicarModo);
  aplicarModo();

  window.Presentacion = { ir: (n) => mostrar(n - 1, 0), avanzar, retroceder };
})();
