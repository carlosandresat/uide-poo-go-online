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
})();
