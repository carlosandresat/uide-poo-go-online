/* Portal del curso: oculta los enlaces de semanas aún no publicadas y copia el tutor al portapapeles. */
(function () {
  'use strict';

  /* Si la presentación o el tutor de una semana todavía no existen, se muestra un aviso en lugar del enlace.
     (Requiere servirse por http/https, como en GitHub Pages; abierto como archivo local se muestran todos los enlaces.) */
  if (location.protocol.startsWith('http')) {
    document.querySelectorAll('[data-semana]').forEach(async (fila) => {
      const carpeta = fila.dataset.semana;
      try {
        const r = await fetch(`${carpeta}/tutor.md`, { method: 'HEAD', cache: 'no-store' });
        const p = await fetch(`${carpeta}/index.html`, { method: 'HEAD', cache: 'no-store' });
        if (!r.ok) fila.querySelectorAll('.si-tutor').forEach((e) => e.replaceWith(pendiente('El tutor se publica al cierre de la sesión anterior.')));
        if (!p.ok) fila.querySelectorAll('.si-presentacion').forEach((e) => e.replaceWith(pendiente('Disponible el día de la sesión.')));
      } catch (e) { /* sin red: se dejan los enlaces */ }
    });
  }

  function pendiente(texto) {
    const s = document.createElement('span');
    s.className = 'pendiente';
    s.textContent = texto;
    return s;
  }

  document.querySelectorAll('button[data-copiar]').forEach((b) => {
    b.addEventListener('click', async () => {
      const contenedor = b.closest('td, li, section, main');
      const aviso = contenedor ? contenedor.querySelector('.aviso-copia') : null;
      try {
        const texto = await (await fetch(b.dataset.copiar, { cache: 'no-store' })).text();
        await navigator.clipboard.writeText(texto);
        if (aviso) aviso.textContent = 'Tutor copiado. Pégalo completo en ChatGPT, Gemini o Claude.';
      } catch (e) {
        if (aviso) aviso.textContent = 'No se pudo copiar. Abre "Ver tutor", selecciona todo y cópialo.';
      }
    });
  });
})();
