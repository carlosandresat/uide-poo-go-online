/* Tema claro/oscuro compartido por presentaciones, portal y visor.
   Se carga en <head> para evitar el destello. Orden: elección guardada > preferencia del sistema.
   Cualquier botón con [data-alternar-tema] alterna el tema; la tecla D también (en presentaciones). */
(function () {
  'use strict';
  const raiz = document.documentElement;
  let guardado = null;
  try { guardado = localStorage.getItem('uide-tema'); } catch (e) { /* almacenamiento bloqueado */ }
  const sistema = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
  raiz.dataset.tema = guardado === 'oscuro' || guardado === 'claro' ? guardado : sistema;

  function alternar() {
    raiz.dataset.tema = raiz.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
    try { localStorage.setItem('uide-tema', raiz.dataset.tema); } catch (e) { /* sin persistencia */ }
    actualizarBotones();
  }

  function actualizarBotones() {
    document.querySelectorAll('[data-alternar-tema]').forEach((b) => {
      const oscuro = raiz.dataset.tema === 'oscuro';
      b.textContent = oscuro ? 'Modo claro' : 'Modo oscuro';
      b.setAttribute('aria-pressed', String(oscuro));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-alternar-tema]').forEach((b) => b.addEventListener('click', alternar));
    actualizarBotones();
  });

  window.Tema = { alternar, actualizarBotones };

  /* ---------- Puntero rojo (tecla P) ----------
     Cambia el cursor por un punto rojo grande para señalar en clase. Funciona en presentaciones, portal y visor.
     P lo activa o desactiva; Esc lo desactiva. Al hacer clic el punto se encoge un instante. */
  let punto = null;
  let activo = false;

  function crearPunto() {
    const estilo = document.createElement('style');
    estilo.textContent =
      'html.puntero-rojo, html.puntero-rojo * { cursor: none !important; }' +
      '.puntero-rojo-punto { position: fixed; left: 0; top: 0; width: 26px; height: 26px; margin: -13px 0 0 -13px;' +
      ' border-radius: 50%; background: #e00000; border: 1px solid rgba(255,255,255,.85); box-shadow: 0 0 14px 4px rgba(224,0,0,.45);' +
      ' pointer-events: none; z-index: 2147483647; display: none; transition: transform .12s ease; }' +
      '.puntero-rojo-punto.visible { display: block; }' +
      '.puntero-rojo-punto.clic { transform: scale(.6); }';
    document.head.appendChild(estilo);
    punto = document.createElement('div');
    punto.className = 'puntero-rojo-punto';
    punto.setAttribute('aria-hidden', 'true');
    document.body.appendChild(punto);
    document.addEventListener('mousemove', (e) => {
      if (!activo) return;
      punto.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)' + (punto.classList.contains('clic') ? ' scale(.6)' : '');
      punto.classList.add('visible');
    }, { passive: true });
    document.addEventListener('mousedown', () => { if (activo) punto.classList.add('clic'); });
    document.addEventListener('mouseup', () => { if (punto) punto.classList.remove('clic'); });
    document.documentElement.addEventListener('mouseleave', () => { if (punto) punto.classList.remove('visible'); });
  }

  function fijarPuntero(valor) {
    if (!punto) crearPunto();
    activo = valor;
    raiz.classList.toggle('puntero-rojo', activo);
    if (!activo) punto.classList.remove('visible', 'clic');
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (e.key === 'p' || e.key === 'P') fijarPuntero(!activo);
    else if (e.key === 'Escape' && activo) fijarPuntero(false);
  });
})();
