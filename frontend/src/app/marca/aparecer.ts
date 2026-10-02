import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Hace que un bloque suba un poco y aparezca la primera vez que entra en
 * pantalla. Una sola vez: no vuelve a esconderse al salir.
 *
 * El estilo vive en `componentes.css` (`.aparecer`) y solo se aplica con
 * movimiento permitido. Sin IntersectionObserver, todo se ve de una vez.
 *
 * Uso: `<article mtAparecer [retraso]="$index * 80">…</article>`
 */
@Directive({
  selector: '[mtAparecer]',
  host: {
    class: 'aparecer',
    '[style.--aparecer-retraso.ms]': 'retraso()'
  }
})
export class Aparecer {
  /** Retraso en ms, para escalonar los elementos de una grilla. */
  readonly retraso = input(0);

  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destruir = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const el = this.elemento.nativeElement;
      if (typeof IntersectionObserver === 'undefined') {
        el.classList.add('visible');
        return;
      }
      const observador = new IntersectionObserver(
        entradas => {
          for (const e of entradas) {
            if (e.isIntersecting) {
              el.classList.add('visible');
              observador.disconnect();
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );
      observador.observe(el);
      this.destruir.onDestroy(() => observador.disconnect());
    });
  }
}
