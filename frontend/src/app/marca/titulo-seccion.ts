import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DobleLinea } from './doble-linea';
import { Ejemplo } from './ejemplo';

/**
 * El encabezado de cada sección: doble línea a la izquierda, título y una
 * entradilla opcional.
 *
 * `idTitulo` va en el <h2> para que la sección lo use en `aria-labelledby`:
 * así un lector de pantalla anuncia cada región por su nombre.
 *
 * Uso: `<mt-titulo-seccion idTitulo="servicios-titulo" titulo="Soluciones" entradilla="…" />`
 */
@Component({
  selector: 'mt-titulo-seccion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DobleLinea, Ejemplo],
  host: { '[class.centrado]': 'centrado()' },
  template: `
    <mt-doble-linea />
    <div class="textos">
      @if (ejemplo()) {
        <mt-ejemplo />
      }
      @if (etiqueta()) {
        <p class="t-etiqueta">{{ etiqueta() }}</p>
      }
      @switch (nivel()) {
        @case (1) { <h1 [id]="idTitulo()">{{ titulo() }}</h1> }
        @case (3) { <h3 [id]="idTitulo()">{{ titulo() }}</h3> }
        @default { <h2 [id]="idTitulo()">{{ titulo() }}</h2> }
      }
      @if (entradilla()) {
        <p class="t-cuerpo-l t-secundario medida">{{ entradilla() }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      gap: var(--e-6);
      margin-bottom: var(--e-10);
    }

    @media (min-width: 900px) {
      :host {
        margin-bottom: var(--e-12);
      }
    }

    .textos {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--e-4);
      padding-block: var(--e-1);
    }

    :host(.centrado) .textos {
      align-items: center;
      text-align: center;
    }
  `
})
export class TituloSeccion {
  readonly titulo = input.required<string>();
  readonly idTitulo = input<string | null>(null);
  readonly entradilla = input<string | null | undefined>(null);
  readonly etiqueta = input<string | null>(null);
  readonly nivel = input<1 | 2 | 3>(2);
  readonly centrado = input(false);

  /** Muestra la marca CONTENIDO DE EJEMPLO sobre el título. */
  readonly ejemplo = input<boolean | undefined>(false);
}
