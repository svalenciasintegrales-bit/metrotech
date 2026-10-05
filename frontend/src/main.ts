import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Al recargar, la página empieza siempre arriba: ni el navegador restaura
// la posición anterior ni un #ancla que haya quedado en la dirección salta
// a su sección (quedaba en Contacto, casi al final).
history.scrollRestoration = 'manual';
if (location.hash) {
  history.replaceState(null, '', location.pathname + location.search);
}
window.scrollTo(0, 0);

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));
