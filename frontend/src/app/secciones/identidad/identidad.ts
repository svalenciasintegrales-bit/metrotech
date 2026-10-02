import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { TituloSeccion } from '../../marca/titulo-seccion';

/**
 * Nuestra identidad: las aplicaciones de marca del manual (uniformes y
 * papelería). Son imágenes ilustrativas, no fotos del equipo real, y así lo
 * dicen su texto alternativo y su pie. Se oculta con `"visible": false`.
 *
 * WebP a 640 y 1200 px con `srcset`: el navegador baja el que necesita.
 */
@Component({
  selector: 'mt-identidad',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Aparecer, TituloSeccion],
  template: `
    <section id="identidad" class="seccion" data-theme="tint" aria-labelledby="identidad-titulo">
      <div class="contenedor identidad">
        <div class="identidad__texto">
          <mt-titulo-seccion idTitulo="identidad-titulo" [titulo]="identidad().titulo" [entradilla]="identidad().texto" />
          <ul class="tonos" role="list">
            <li><span class="tono tono--azul" aria-hidden="true"></span> Azul oscuro · estructura</li>
            <li><span class="tono tono--celeste" aria-hidden="true"></span> Celeste · tecnología</li>
          </ul>
        </div>
        <div class="imagenes">
          @for (img of identidad().imagenes; track img.src) {
            <figure mtAparecer [retraso]="$index * 120">
              <img
                [src]="img.src + '-1200.webp'"
                [attr.srcset]="img.src + '-640.webp 640w, ' + img.src + '-1200.webp 1200w'"
                sizes="(min-width: 900px) 58vw, 100vw"
                [width]="img.ancho"
                [height]="img.alto"
                [alt]="img.alt"
                loading="lazy"
                decoding="async"
              />
              <figcaption class="t-micro t-secundario">Imagen ilustrativa del manual de marca.</figcaption>
            </figure>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .identidad {
      display: grid;
      gap: var(--e-8);
      align-items: center;
    }

    @media (min-width: 900px) {
      .identidad { grid-template-columns: 5fr 7fr; gap: var(--e-16); }
    }

    .tonos {
      display: flex;
      flex-direction: column;
      gap: var(--e-3);
      margin: 0;
      padding: 0;
      font-weight: var(--peso-semibold);
    }

    .tonos li {
      display: flex;
      align-items: center;
      gap: var(--e-3);
    }

    .tono {
      width: var(--e-8);
      height: var(--e-8);
      border-radius: var(--r-2);
    }

    .tono--azul { background: var(--azul-oscuro); }
    .tono--celeste { background: var(--celeste); }

    .imagenes {
      display: grid;
      gap: var(--e-6);
    }

    figure {
      display: flex;
      flex-direction: column;
      gap: var(--e-2);
      margin: 0;
    }

    img {
      width: 100%;
      height: auto;
      border-radius: var(--r-3);
      border: var(--linea-fina) solid var(--borde);
      background: var(--superficie);
    }
  `
})
export class Identidad {
  readonly identidad = input.required<Contenido['identidad']>();
}
