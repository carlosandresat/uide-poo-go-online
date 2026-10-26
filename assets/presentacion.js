/* Motor de presentaciones de sesión · Cursos UIDE · diseño «Señalética»
   Teclas: → / Espacio / AvPág avanza · ← / RePág retrocede · Inicio / Fin · F pantalla completa
           D modo claro/oscuro · P puntero rojo (en tema.js) · L modo lectura · T inicia o pausa el temporizador de la diapositiva
   Atributos:
     <body data-curso="poo-go" data-formato="taller|clinica|debate" data-bloque4="Ejercicio aplicado">
       (clínica: data-bloque4 nombra el bloque 4; debate: data-trabajo pone la explicación del trabajo en lugar de la pausa)
     <section class="diapositiva" data-bloque="3"> o data-bloque="salas1": número o id del bloque
       (si falta, hereda el de la anterior). En las portadas de bloque, .numero, h2 y .minutos vacíos se completan solos.
     data-paso="n" en cualquier elemento: aparece en el paso n de esa diapositiva
     <div class="recorrido-completo"></div> en la portada: el motor dibuja el recorrido de la sesión
   Animaciones propias: escuchar el evento "paso" en la diapositiva:
     diapositiva.addEventListener('paso', (e) => dibujar(e.detail.paso, e.detail.lectura)); */

(function () {
  'use strict';

  const body = document.body;
  const escenario = document.querySelector('.escenario');
  let diapositivas = Array.from(document.querySelectorAll('.diapositiva'));
  if (!escenario || diapositivas.length === 0) return;

  if (window.Secuencia) window.Secuencia.renderTodas(escenario);

  // Cada bloque: id (para data-bloque), nombre, corto (etiqueta en la línea de metro, opcional),
  // minutos y noGraba (salas de Teams). Los números se asignan en orden, sin contar la pausa.
  const conTrabajo = body.hasAttribute('data-trabajo');
  const BLOQUES = {
    taller: [
      { id: 'puente', nombre: 'Puente', ini: 0, fin: 10 },
      { id: 'caso', nombre: 'Caso en vivo', ini: 10, fin: 25 },
      { id: 'salas', nombre: 'Salas', ini: 25, fin: 55, noGraba: true },
      { pausa: true, ini: 55, fin: 60 },
      { id: 'plenaria', nombre: 'Plenaria', ini: 60, fin: 100 },
      { id: 'cierre', nombre: 'Cierre', ini: 100, fin: 120 },
    ],
    clinica: [
      { id: 'puente', nombre: 'Puente', ini: 0, fin: 10 },
      { id: 'caso', nombre: 'Caso en vivo', ini: 10, fin: 30 },
      { id: 'clinica', nombre: 'Clínica', ini: 30, fin: 70 },
      { pausa: true, ini: 70, fin: 75 },
      { id: 'aplicado', nombre: body.dataset.bloque4 || 'Ejercicio aplicado', ini: 75, fin: 105 },
      { id: 'cierre', nombre: 'Cierre', ini: 105, fin: 120 },
    ],
    // Debate en dos rondas. Con data-trabajo, la explicación del trabajo calificado reemplaza la pausa.
    debate: [
      { id: 'puente', nombre: 'Puente', ini: 0, fin: 10 },
      { id: 'caso', nombre: 'Caso en vivo', ini: 10, fin: 25 },
      { id: 'salas1', nombre: 'Salas: investigar', corto: 'Investigar', ini: 25, fin: 40, noGraba: true },
      { id: 'plenaria1', nombre: 'Plenaria: evidencias', corto: 'Evidencias', ini: 40, fin: 55 },
      conTrabajo
        ? { id: 'trabajo', nombre: 'Trabajo calificado', corto: 'Trabajo', ini: 55, fin: 75 }
        : { pausa: true, ini: 55, fin: 60 },
      { id: 'salas2', nombre: 'Salas: argumentar', corto: 'Argumentar', ini: conTrabajo ? 75 : 60, fin: conTrabajo ? 90 : 75, noGraba: true },
      { id: 'plenaria2', nombre: 'Plenaria: debate', corto: 'Debate', ini: conTrabajo ? 90 : 75, fin: conTrabajo ? 105 : 100 },
      { id: 'cierre', nombre: 'Cierre', ini: conTrabajo ? 105 : 100, fin: 120 },
    ],
  };
  const bloques = BLOQUES[body.dataset.formato] || BLOQUES.taller;
  let numero = 0;
  bloques.forEach((b) => { if (!b.pausa) b.n = ++numero; });
  // data-bloque acepta el número ("3") o el id ("salas1")
  const resolverBloque = (valor) => (valor == null ? undefined
    : bloques.find((b) => !b.pausa && (b.id === valor || String(b.n) === String(valor))));
  const proximoDe = (b) => bloques.slice(bloques.indexOf(b) + 1).find((x) => !x.pausa);

  // Un bloque que el formato no tiene (p. ej., «trabajo» sin data-trabajo) se quita con sus diapositivas
  let fuera = false;
  diapositivas = diapositivas.filter((d) => {
    if (d.dataset.bloque) fuera = !resolverBloque(d.dataset.bloque);
    if (fuera) d.remove();
    return !fuera;
  });
  const crear = (etiqueta, clase, texto) => {
    const e = document.createElement(etiqueta);
    if (clase) e.className = clase;
    if (texto != null) e.textContent = texto;
    return e;
  };

  /* ---------- Contenido generado desde el formato ---------- */

  // Plan de la sesión: minutos y nombre de cada bloque
  document.querySelectorAll('.plan li[data-bloque]').forEach((li) => {
    const b = resolverBloque(li.dataset.bloque);
    if (!b) { li.remove(); return; } // p. ej., «trabajo» en una semana sin trabajo calificado
    const texto = crear('span');
    texto.append(crear('strong', null, b.nombre + '. '), ...li.childNodes);
    li.replaceChildren(crear('span', 'min', `${b.ini}–${b.fin}`), texto);
  });

  // Portadas de bloque: nombre, minutos y letrero de lo que sigue
  diapositivas.filter((d) => d.classList.contains('bloque')).forEach((d) => {
    const b = resolverBloque(d.dataset.bloque);
    if (!b) return;
    const num = d.querySelector('.numero');
    if (num && !num.textContent.trim()) num.textContent = b.n;
    const h2 = d.querySelector('h2');
    if (h2 && !h2.textContent.trim()) h2.textContent = b.nombre;
    const nota = d.dataset.nota || (b.noGraba ? 'esta parte no se graba' : '');
    const min = d.querySelector('.minutos');
    if (min && !min.textContent.trim()) min.textContent = `Minutos ${b.ini} a ${b.fin}` + (nota ? ` · ${nota}` : '');
    const proximo = proximoDe(b);
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
    const r = crear('div', 'recorrido' + (numero > 5 ? ' muchas' : ''));
    const total = bloques[bloques.length - 1].fin;
    const paradas = bloques.map((b, k) => {
      const p = crear('div', 'parada' + (b.pausa ? ' pausa' : '') + (k === bloques.length - 1 ? ' ultima' : ''));
      // Como en un mapa de metro, las estaciones van equidistantes; los minutos están en la etiqueta.
      p.style.flexGrow = b.pausa ? '0.35' : (k === bloques.length - 1 ? '0.7' : '1');
      p.style.flexBasis = '0';
      if (!b.pausa) {
        p.append(crear('span', 'estacion'));
        p.append(crear('span', 'nombre', `${b.n} ${b.corto || b.nombre}`));
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

  // Posición (en el arreglo de bloques) del bloque de cada diapositiva; -1 antes del primero
  const bloqueDe = [];
  diapositivas.forEach((d, i) => {
    const b = resolverBloque(d.dataset.bloque);
    bloqueDe[i] = b ? bloques.indexOf(b) : (i > 0 ? bloqueDe[i - 1] : -1);
  });

  let indice = 0;
  let paso = 0;

  function actualizarRecorrido() {
    const actual = bloqueDe[indice];
    fijo.paradas.forEach(({ p }, k) => {
      p.classList.toggle('actual', k === actual);
      p.classList.toggle('pasada', actual >= 0 && k < actual);
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
  // Los scripts de animación (anim-*.js) se cargan después de este: al terminar la carga se repite el aviso
  // de paso para que dibujen el estado correcto (en modo lectura, el final).
  window.addEventListener('load', aplicarModo);

  window.Presentacion = { ir: (n) => mostrar(n - 1, 0), avanzar, retroceder };
})();
