import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Las franjas diagonales celestes de la esquina inferior, como en la hoja
 * membrete y la tarjeta de presentación: un triángulo en tinte, una franja
 * sólida y, si se pide, la línea fina con su rombo.
 *
 * El contenedor tiene que tener `position: relative` y `overflow: hidden`
 * (la clase `.seccion` ya los trae).
 *
 * Uso: `<mt-franjas esquina="inferior-derecha" [nodo]="true" />`
 */
@Component({
  selector: 'mt-franjas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class]': 'esquina()',
    '[style.--franjas-ancho]': 'ancho()'
  },
  template: `
    <svg viewBox="0 0 400 120" preserveAspectRatio="xMaxYMax meet" focusable="false">
      <polygon class="tinte" points="236,120 400,72 400,120" />
      <polygon class="solida" points="112,120 400,36 400,54 174,120" />
      @if (nodo()) {
        <line class="fina" x1="18" y1="120" x2="318" y2="31" />
        <rect class="fina-nodo" x="313" y="25" width="10" height="10" transform="rotate(45 318 30)" />
      }
    </svg>
  `,
  styles: `
    :host {
      position: absolute;
      bottom: 0;
      z-index: var(--z-decoracion);
      width: var(--franjas-ancho);
      line-height: 0;
      pointer-events: none;
    }

    :host(.inferior-derecha) { right: 0; }

    /* El espejo de la misma figura. */
    :host(.inferior-izquierda) { left: 0; transform: scaleX(-1); }

    svg {
      display: block;
      width: 100%;
      height: auto;
    }

    .tinte { fill: var(--celeste-100); }
    .solida { fill: var(--celeste); }
    .fina { stroke: var(--celeste); stroke-width: 1.5; }
    .fina-nodo { fill: var(--celeste); }

    :host-context([data-theme="dark"]) .tinte { fill: var(--azul-600); }
  `
})
export class Franjas {
  readonly esquina = input<'inferior-derecha' | 'inferior-izquierda'>('inferior-derecha');
  readonly ancho = input('clamp(220px, 42vw, 560px)');

  /** La línea fina con rombo de la tarjeta de presentación. */
  readonly nodo = input(false);
}
