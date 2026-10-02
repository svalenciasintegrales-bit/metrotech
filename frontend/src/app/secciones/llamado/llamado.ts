import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { LineaNodos } from '../../marca/linea-nodos';
import { Regla } from '../../marca/regla';

/**
 * La banda celeste de llamado a la acción, como la versión del logo sobre
 * celeste (manual, lámina 8). Zona `celeste`: azul oscuro sobre celeste da
 * 4,25:1, así que aquí va solo el título grande y el botón; ningún texto
 * pequeño.
 */
@Component({
  selector: 'mt-llamado',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Aparecer, LineaNodos, Regla],
  template: `
    <section class="llamado" data-theme="celeste" aria-labelledby="llamado-titulo">
      <mt-regla class="llamado__regla" [largo]="14" />
      <img class="llamado__monograma" src="img/marca/monograma-sobre-celeste.svg" alt="" width="124" height="64" loading="lazy" />
      <div class="contenedor llamado__fila" mtAparecer>
        <h2 id="llamado-titulo" class="llamado__titulo">
          {{ llamado().titulo }}
          @if (llamado().tituloAcento) { <span class="llamado__acento">{{ llamado().tituloAcento }}</span> }
        </h2>
        <div class="llamado__accion">
          <mt-linea-nodos class="llamado__linea" [animar]="true" />
          <a class="boton boton--primario" [href]="'#' + llamado().accion.ancla">{{ llamado().accion.texto }}</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .llamado {
      position: relative;
      overflow: hidden;
      padding-block: var(--e-20);
    }

    .llamado .llamado__regla {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      color: var(--azul-oscuro);
      opacity: 0.5;
    }

    /* El monograma oficial en su versión sobre celeste, grande y tenue. */
    .llamado__monograma {
      position: absolute;
      right: -6%;
      bottom: -22%;
      width: clamp(260px, 38vw, 560px);
      height: auto;
      opacity: 0.14;
      pointer-events: none;
    }

    .llamado__fila {
      position: relative;
      z-index: var(--z-contenido);
      display: flex;
      flex-direction: column;
      gap: var(--e-8);
    }

    @media (min-width: 900px) {
      .llamado__fila {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    /* Siempre en tamaño de título: es lo único que admite esta zona. */
    .llamado__titulo {
      font-size: clamp(2rem, 1.4rem + 2.6vw, 3.5rem);
      line-height: 1.08;
      letter-spacing: -0.02em;
      max-width: 16ch;
    }

    .llamado__acento {
      display: block;
      color: var(--blanco);
    }

    .llamado__accion {
      display: flex;
      align-items: center;
      gap: var(--e-6);
      min-width: min(100%, 420px);
    }

    .llamado__accion .llamado__linea {
      flex: 1;
      color: var(--azul-oscuro);
    }

    @media (max-width: 599px) {
      .llamado__accion .llamado__linea { display: none; }
      .llamado__accion .boton { width: 100%; }
    }
  `
})
export class Llamado {
  readonly llamado = input.required<Contenido['llamado']>();
}
