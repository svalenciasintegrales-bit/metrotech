import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

let siguiente = 0;

/**
 * Las marcas de regla de la M: medición y precisión.
 *
 * Como en el logo, cada quinta marca es larga y las otras cuatro cortas
 * (la corta mide dos tercios de la larga). Las marcas salen del borde y
 * apuntan hacia adentro. Toma el color del texto que la rodea; por defecto,
 * el acento de su zona.
 *
 * Uso: en el borde de una sección, como separador o en el héroe.
 *   `<mt-regla />`                              horizontal, ancho completo
 *   `<mt-regla orientacion="vertical" />`       vertical, alto completo
 */
@Component({
  selector: 'mt-regla',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class.vertical]': "orientacion() === 'vertical'",
    '[style.--regla-largo.px]': 'largo()'
  },
  template: `
    <svg width="100%" height="100%" focusable="false">
      <defs>
        @if (orientacion() === 'horizontal') {
          <pattern [attr.id]="id" [attr.width]="paso() * 5" [attr.height]="largo()" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" [attr.width]="grosor()" [attr.height]="largo()" fill="currentColor" />
            @for (i of cortas(); track i) {
              <rect [attr.x]="paso() * i" y="0" [attr.width]="grosorCorta()" [attr.height]="largo() * 2 / 3" fill="currentColor" />
            }
          </pattern>
        } @else {
          <pattern [attr.id]="id" [attr.width]="largo()" [attr.height]="paso() * 5" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" [attr.width]="largo()" [attr.height]="grosor()" fill="currentColor" />
            @for (i of cortas(); track i) {
              <rect x="0" [attr.y]="paso() * i" [attr.width]="largo() * 2 / 3" [attr.height]="grosorCorta()" fill="currentColor" />
            }
          </pattern>
        }
      </defs>
      <rect width="100%" height="100%" [attr.fill]="'url(#' + id + ')'" />
    </svg>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: var(--regla-largo);
      color: var(--acento);
      pointer-events: none;
    }

    :host(.vertical) {
      width: var(--regla-largo);
      height: 100%;
    }

    svg {
      display: block;
      overflow: visible;
    }
  `
})
export class Regla {
  readonly orientacion = input<'horizontal' | 'vertical'>('horizontal');

  /** Separación entre marcas, en px. */
  readonly paso = input(8);

  /** Largo de la marca larga, en px. */
  readonly largo = input(16);

  /** Grosor de la marca larga, en px. */
  readonly grosor = input(2);

  readonly grosorCorta = computed(() => Math.max(1, this.grosor() * 2 / 3));
  readonly cortas = computed(() => [1, 2, 3, 4]);

  /** Cada regla necesita su propio patrón: dos con el mismo id se pisan. */
  readonly id = `mt-regla-${siguiente++}`;
}
