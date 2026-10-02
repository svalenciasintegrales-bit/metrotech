import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { Icono } from '../../marca/icono';
import { Regla } from '../../marca/regla';
import { TituloSeccion } from '../../marca/titulo-seccion';

/**
 * Por qué MetroTech: los valores del manual (lámina 16). La familia va
 * destacada, como valor central, en un bloque azul oscuro; los demás, en
 * una grilla de líneas finas.
 */
@Component({
  selector: 'mt-valores',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Aparecer, Icono, Regla, TituloSeccion],
  template: `
    <section id="valores" class="seccion" data-theme="light" aria-labelledby="valores-titulo">
      <div class="contenedor">
        <mt-titulo-seccion idTitulo="valores-titulo" [titulo]="valores().titulo" [entradilla]="valores().entradilla" />

        <div class="valores">
          <div class="central" data-theme="dark" mtAparecer>
            <mt-regla class="central__regla" orientacion="vertical" [largo]="14" />
            <span class="icono-marca central__icono"><mt-icono [nombre]="valores().central.icono" [tamano]="32" /></span>
            <p class="t-etiqueta central__etiqueta">VALOR CENTRAL</p>
            <h3 class="t-h2">{{ valores().central.titulo }}</h3>
          </div>

          <ul class="lista" role="list">
            @for (v of valores().items; track v.titulo) {
              <li class="valor" mtAparecer [retraso]="($index % 2) * 100">
                <span class="icono-marca icono-marca--chico"><mt-icono [nombre]="v.icono" [tamano]="24" /></span>
                <h3 class="t-h5">{{ v.titulo }}</h3>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: `
    .valores {
      display: grid;
      gap: var(--e-6);
    }

    @media (min-width: 900px) {
      .valores {
        grid-template-columns: 5fr 7fr;
        gap: var(--e-10);
      }
    }

    .central {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: var(--e-4);
      min-height: 280px;
      padding: var(--e-8) var(--e-8) var(--e-8) var(--e-12);
      border-radius: var(--r-3);
      overflow: hidden;
    }

    .central .central__regla {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      height: auto;
    }

    .central__icono {
      margin-bottom: auto;
    }

    .central__etiqueta {
      color: var(--texto-2);
    }

    .lista {
      display: grid;
      grid-template-columns: 1fr;
      margin: 0;
      padding: 0;
      border-top: var(--linea-fina) solid var(--borde);
    }

    @media (min-width: 600px) {
      .lista { grid-template-columns: repeat(2, 1fr); column-gap: var(--e-8); }
    }

    .valor {
      display: flex;
      align-items: center;
      gap: var(--e-4);
      padding-block: var(--e-5);
      border-bottom: var(--linea-fina) solid var(--borde);
    }

  `
})
export class Valores {
  readonly valores = input.required<Contenido['valores']>();
}
