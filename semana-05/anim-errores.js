/* Animación · Cómo viaja un error por la cadena de llamadas
   Código representado (ejemplos/propagacion/main.go, verificado con go run):
     main → NewReserva("Lía", 12) → r.SetPersonas(12)
     SetPersonas: 12 > 10 → return fmt.Errorf("%d personas: %w", n, ErrSinCupo)
     NewReserva:  if err != nil { return nil, err }
     main:        if err != nil { fmt.Println("Error:", err) }  → Error: 12 personas: no hay cupo
                  errors.Is(err, ErrSinCupo) → true (desenvuelve el %w)
   Pasos: 1 main llama · 2 NewReserva llama · 3 SetPersonas crea el error envuelto · 4 vuelve a NewReserva, que lo devuelve
          5 llega a main, que lo imprime · 6 errors.Is mira dentro del envoltorio.
   En modo lectura se dibuja el estado final (paso 6). */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const fig = document.getElementById('anim-errores');
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
    'aria-label': 'main llama a NewReserva, que llama a SetPersonas. SetPersonas crea un error que envuelve a ErrSinCupo. El error vuelve a NewReserva, que lo devuelve sin cambios, y llega a main, que lo imprime. errors.Is encuentra ErrSinCupo dentro del envoltorio.' });
  svg.style.cssText = 'width:100%;height:auto;max-height:calc(var(--u) * 64);display:block;font-family:var(--f-texto)';
  fig.prepend(svg);

  const estilo = {
    marco: 'fill:var(--superficie);stroke:var(--regla);stroke-width:2.5',
    marcoActivo: 'fill:var(--superficie);stroke:var(--acento);stroke-width:4',
    cabecera: 'fill:var(--caja-diagrama)',
    titulo: 'fill:var(--texto-caja-diagrama);font-weight:800;font-size:20px;font-family:var(--f-codigo)',
    codigo: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:15px;white-space:pre',
    codigoClave: 'fill:var(--acento);font-family:var(--f-codigo);font-size:15px;font-weight:700;white-space:pre',
    flecha: 'stroke:var(--acento);stroke-width:3.5;fill:none',
    rotulo: 'fill:var(--acento);font-size:18px;font-weight:800',
    externo: 'fill:var(--guinda);stroke:var(--fondo);stroke-width:2',
    interno: 'fill:var(--azul);stroke:#FFFFFF;stroke-width:2',
    internoBrillo: 'fill:var(--azul);stroke:var(--dorado);stroke-width:5',
    textoError: 'fill:#FFFFFF;font-family:var(--f-codigo);font-size:16px;font-weight:600',
  };
  const T = 'opacity 450ms ease, transform 700ms cubic-bezier(.45,.05,.3,1)';

  const defs = nodo('defs', {}, svg);
  const marca = nodo('marker', { id: 'punta-errores', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  nodo('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill:var(--acento)' }, marca);

  // ---- Tres marcos, uno por función ----
  const MARCOS = [
    { x: 20, nombre: 'main', lineas: ['r, err := NewReserva("Lía", 12)', 'if err != nil {', '  fmt.Println("Error:", err)', '}', 'errors.Is(err, ErrSinCupo)'], clave: [2, 4] },
    { x: 350, nombre: 'NewReserva', lineas: ['r := &Reserva{cliente: c}', 'err := r.SetPersonas(n)', 'if err != nil {', '  return nil, err', '}'], clave: [3] },
    { x: 680, nombre: 'SetPersonas', lineas: ['if n < 1 || n > 10 {', '  return fmt.Errorf(', '    "%d personas: %w",', '    n, ErrSinCupo)', '}'], clave: [1, 2, 3] },
  ];
  const marcos = MARCOS.map((m) => {
    const caja = nodo('rect', { x: m.x, y: 20, width: 300, height: 250, rx: 8, style: estilo.marco }, svg);
    nodo('rect', { x: m.x, y: 20, width: 300, height: 42, rx: 8, style: estilo.cabecera }, svg);
    nodo('text', { x: m.x + 16, y: 48, style: estilo.titulo }, svg, m.nombre);
    m.lineas.forEach((l, i) => nodo('text', { x: m.x + 16, y: 92 + i * 34, style: m.clave.includes(i) ? estilo.codigoClave : estilo.codigo }, svg, l));
    return caja;
  });

  // Flechas de llamada (ida) y de retorno (vuelta)
  const capa = (paso, hasta) => {
    const g = nodo('g', { 'data-desde': paso }, svg);
    if (hasta !== undefined) g.dataset.hasta = hasta;
    g.style.transition = T;
    return g;
  };
  const ida1 = capa(1);
  nodo('path', { d: 'M322,120 L346,120', style: estilo.flecha, 'marker-end': 'url(#punta-errores)' }, ida1);
  const ida2 = capa(2);
  nodo('path', { d: 'M652,150 L676,150', style: estilo.flecha, 'marker-end': 'url(#punta-errores)' }, ida2);
  const vuelta1 = capa(4);
  nodo('path', { d: 'M680,300 C640,330 600,330 560,300', style: estilo.flecha, 'marker-end': 'url(#punta-errores)' }, vuelta1);
  nodo('text', { x: 620, y: 350, 'text-anchor': 'middle', style: estilo.rotulo }, vuelta1, 'return err');
  const vuelta2 = capa(5);
  nodo('path', { d: 'M350,300 C310,330 270,330 230,300', style: estilo.flecha, 'marker-end': 'url(#punta-errores)' }, vuelta2);
  nodo('text', { x: 290, y: 350, 'text-anchor': 'middle', style: estilo.rotulo }, vuelta2, 'return nil, err');

  // ---- El error: una caja que envuelve a otra (fmt.Errorf con %w) ----
  const error = nodo('g', {}, svg);
  error.style.transition = T;
  nodo('rect', { x: 0, y: 0, width: 290, height: 92, rx: 8, style: estilo.externo }, error);
  nodo('text', { x: 12, y: 24, style: estilo.textoError }, error, '"12 personas: …"');
  const interno = nodo('rect', { x: 12, y: 36, width: 266, height: 44, rx: 6, style: estilo.interno }, error);
  nodo('text', { x: 24, y: 64, style: estilo.textoError }, error, 'ErrSinCupo: "no hay cupo"');
  const POS = { 3: [685, 380], 4: [355, 380], 5: [25, 380], 6: [25, 380] };

  const salida = capa(5);
  nodo('text', { x: 340, y: 412, style: 'fill:var(--tinta);font-family:var(--f-codigo);font-size:19px;font-weight:700' }, salida, 'imprime: Error: 12 personas: no hay cupo');
  const esIs = capa(6);
  nodo('text', { x: 340, y: 452, style: 'fill:var(--acento);font-family:var(--f-codigo);font-size:19px;font-weight:700' }, esIs, 'errors.Is(err, ErrSinCupo) → true: lo encuentra adentro');

  function dibujar(paso) {
    svg.querySelectorAll('[data-desde]').forEach((e) => {
      const desde = Number(e.dataset.desde);
      const hasta = e.dataset.hasta === undefined ? Infinity : Number(e.dataset.hasta);
      e.style.opacity = paso >= desde && paso <= hasta ? 1 : 0;
    });
    const activo = paso >= 5 ? 0 : paso === 4 ? 1 : paso >= 2 ? 2 : paso === 1 ? 1 : -1;
    marcos.forEach((m, i) => m.setAttribute('style', i === activo ? estilo.marcoActivo : estilo.marco));
    if (paso >= 3) {
      const [x, y] = POS[Math.min(6, paso)];
      error.style.opacity = 1;
      error.style.transform = `translate(${x}px, ${y}px)`;
    } else {
      error.style.opacity = 0;
      error.style.transform = 'translate(685px, 380px)';
    }
    interno.setAttribute('style', paso >= 6 ? estilo.internoBrillo : estilo.interno);
  }

  diapositiva.addEventListener('paso', (e) => dibujar(e.detail.paso));
  dibujar(0);
})();
