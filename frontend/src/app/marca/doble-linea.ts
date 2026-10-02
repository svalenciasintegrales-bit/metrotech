import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * La doble línea vertical de las láminas del manual: una azul oscuro y, a su
 * derecha, una celeste corrida hacia abajo. Acento de encabezados.
 *
 * En el manual la de afuera es #002060, que no es corporativo: aquí va el
 * azul oscuro de la paleta (en zona oscura, blanca).
 *
 * Toma el alto de su contenedor. Uso: dentro de un flex junto al texto,
 * `<mt-doble-linea />`.
 */
@Component({
  selector: 'mt-doble-linea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `<span class="l1"></span><span class="l2"></span>`,
  styles: `
    :host {
      display: flex;
      gap: var(--e-2);
      align-self: stretch;
      flex-shrink: 0;
      min-height: var(--e-12);
    }

    span {
      width: var(--linea-gruesa);
    }

    /* La de afuera arranca arriba; la de adentro, más abajo y pasa de largo. */
    .l1 {
      align-self: flex-start;
      height: 86%;
      background: var(--linea-1);
    }

    .l2 {
      align-self: flex-end;
      height: 86%;
      background: var(--linea-2);
    }
  `
})
export class DobleLinea {}
