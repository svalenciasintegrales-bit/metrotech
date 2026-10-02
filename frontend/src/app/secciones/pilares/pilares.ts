import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { ItemIcono } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { icono } from '../../marca/iconos';
import { LineaNodos } from '../../marca/linea-nodos';

/**
 * Los tres pilares —integración, precisión, estructura— en tarjetas que se
 * montan sobre el borde inferior del héroe. En escritorio quedan unidas por
 * la línea con nodos: el «sistema que conecta todo».
 */
@Component({
  selector: 'mt-pilares',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, Aparecer, LineaNodos],
  template: `
    <section class="pilares" aria-label="Integración, precisión y estructura">
      <div class="contenedor">
        <ol class="pilares__lista" role="list">
          @for (p of pilares(); track p.titulo; let i = $index) {
            <li class="pilar" mtAparecer [retraso]="i * 120">
              <div class="pilar__cabeza">
                <span class="pilar__icono"><lucide-icon [img]="icono(p.icono)" aria-hidden="true" /></span>
                <span class="pilar__numero" aria-hidden="true">{{ '0' + (i + 1) }}</span>
              </div>
              <h2 class="t-h4">{{ p.titulo }}</h2>
              @if (p.texto) {
                <p class="t-secundario">{{ p.texto }}</p>
              }
              <mt-linea-nodos class="pilar__linea" [animar]="true" />
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .pilares {
      position: relative;
      z-index: 2;
      margin-top: calc((var(--e-24) + var(--e-4)) * -1);
    }

    .pilares__lista {
      display: grid;
      gap: var(--e-4);
    }

    @media (min-width: 900px) {
      .pilares__lista {
        grid-template-columns: repeat(3, 1fr);
        gap: 0;
        box-shadow: var(--sombra-3);
        border-radius: var(--r-3);
        overflow: hidden;
      }
    }

    .pilar {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--e-3);
      padding: var(--e-8) var(--e-6) var(--e-10);
      background: var(--blanco);
      border-top: var(--linea-gruesa) solid var(--celeste);
      border-radius: var(--r-3);
      box-shadow: var(--sombra-2);
    }

    @media (min-width: 900px) {
      .pilar {
        padding: var(--e-10) var(--e-8) var(--e-12);
        border-radius: 0;
        box-shadow: none;
      }

      .pilar + .pilar {
        border-left: var(--linea-fina) solid var(--borde);
      }

      /* El del centro, en azul oscuro: el nodo que conecta los otros dos. */
      .pilar:nth-child(2) {
        background: var(--azul-oscuro);
        color: var(--blanco);
      }

      .pilar:nth-child(2) h2 { color: var(--blanco); }
      .pilar:nth-child(2) .t-secundario { color: var(--gris-300-sobre-oscuro); }
      .pilar:nth-child(2) .pilar__icono {
        background: var(--azul-600);
        color: var(--celeste);
      }
    }

    .pilar__cabeza {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--e-2);
    }

    .pilar__icono {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--e-12);
      height: var(--e-12);
      border-radius: var(--r-2);
      background: var(--celeste-50);
      color: var(--azul-oscuro);
    }

    /* El número en celeste: tamaño de título, solo decorativo. */
    .pilar__numero {
      font-size: var(--t-h2);
      font-weight: var(--peso-semibold);
      line-height: 1;
      color: var(--celeste);
      opacity: 0.35;
      font-variant-numeric: tabular-nums;
    }

    .pilar .pilar__linea {
      position: absolute;
      left: var(--e-6);
      right: var(--e-6);
      bottom: var(--e-5);
      width: auto;
      color: var(--celeste);
    }

    @media (min-width: 900px) {
      .pilar .pilar__linea {
        left: var(--e-8);
        right: var(--e-8);
      }
    }
  `
})
export class Pilares {
  readonly pilares = input.required<ItemIcono[]>();

  protected readonly icono = icono;
}
