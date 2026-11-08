import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, input, signal } from '@angular/core';

import { Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { FondoVivo } from '../../marca/fondo-vivo';
import { TituloSeccion } from '../../marca/titulo-seccion';

const INTERVALO_MS = 8000;

/**
 * Lo que dicen los clientes: una sola cita a la vez, grande, sobre el azul de la
 * marca. Debajo, una regla de medir donde cada marca es un cliente: tocarla
 * muestra su cita. Pasa sola, salvo mientras alguien la está usando o si la
 * persona pidió menos movimiento.
 */
@Component({
  selector: 'mt-testimonios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Aparecer, FondoVivo, TituloSeccion],
  template: `
    @if (testimonios().testimonios.length; as total) {
      <section
        id="testimonios"
        class="seccion franja"
        data-theme="dark"
        aria-labelledby="testimonios-titulo"
        (mouseenter)="pausado.set(true)"
        (mouseleave)="pausado.set(false)"
        (focusin)="pausado.set(true)"
        (focusout)="pausado.set(false)"
      >
        <mt-fondo-vivo [densidad]="0.8" />
        <div class="contenedor">
          <mt-titulo-seccion
            idTitulo="testimonios-titulo"
            [titulo]="testimonios().titulo"
            [entradilla]="testimonios().entradilla"
            [ejemplo]="!!testimonios().ejemplo"
          />

          @if (actual(); as t) {
            <figure class="cita" mtAparecer aria-live="polite">
              <span class="comilla" aria-hidden="true">“</span>
              <blockquote>{{ t.cita }}</blockquote>
              <figcaption>
                <strong>{{ t.nombre }}</strong>
                @if (t.cargo) {
                  <span>{{ t.cargo }}</span>
                }
              </figcaption>
            </figure>
          }

          @if (total > 1) {
            <div class="regla" role="group" aria-label="Elegir testimonio">
              @for (t of testimonios().testimonios; track $index) {
                <button
                  type="button"
                  class="marca"
                  [class.activa]="indice() === $index"
                  [attr.aria-pressed]="indice() === $index"
                  (click)="indice.set($index)"
                >
                  <span class="punta" aria-hidden="true"></span>
                  <span class="nombre">{{ t.nombre }}</span>
                </button>
              }
            </div>
          }
        </div>
      </section>
    }
  `,
  styles: `
    .franja {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      background: var(--fondo);
      color: var(--texto);
    }

    .franja mt-fondo-vivo {
      z-index: -1;
    }

    .cita {
      position: relative;
      max-width: 62rem;
      margin: 0;
      padding-left: clamp(0px, 5vw, 72px);
    }

    .comilla {
      position: absolute;
      top: -0.32em;
      left: 0;
      font-size: clamp(4rem, 9vw, 8rem);
      font-weight: var(--peso-semibold);
      line-height: 1;
      color: var(--celeste);
    }

    blockquote {
      margin: 0;
      padding-top: var(--e-8);
      font-size: clamp(1.375rem, 2.6vw, 2.125rem);
      font-weight: 300;
      line-height: 1.35;
    }

    @media (min-width: 640px) {
      blockquote {
        padding-top: 0;
      }
    }

    figcaption {
      display: flex;
      flex-wrap: wrap;
      gap: var(--e-1) var(--e-3);
      margin-top: var(--e-6);
      color: var(--texto-2);
    }

    figcaption strong {
      color: var(--texto);
    }

    /* La regla: rayitas cada 8 px y, encima, las marcas que se pueden tocar. */
    .regla {
      display: flex;
      margin-top: var(--e-10);
      padding-top: var(--e-3);
      background:
        repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.28) 0 1px, transparent 1px 8px) top / 100% 8px no-repeat,
        repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0 1px, transparent 1px 40px) top / 100% 14px no-repeat;
    }

    .marca {
      position: relative;
      flex: 1;
      min-width: 0;
      padding: var(--e-3) var(--e-2) var(--e-1) 0;
      border: 0;
      background: none;
      color: var(--texto-2);
      font: inherit;
      font-size: 0.875rem;
      text-align: left;
      cursor: pointer;
    }

    .marca:hover {
      color: var(--texto);
    }

    .marca.activa {
      color: var(--texto);
      font-weight: var(--peso-semibold);
    }

    .punta {
      position: absolute;
      top: calc(-1 * var(--e-3));
      left: 0;
      width: 2px;
      height: 22px;
      background: transparent;
      transition: background-color var(--dur-media) var(--curva);
    }

    .marca.activa .punta {
      background: var(--celeste);
      box-shadow: 0 0 10px var(--celeste);
    }

    .nombre {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `
})
export class Testimonios {
  readonly testimonios = input.required<Contenido['testimonios']>();

  protected readonly indice = signal(0);
  protected readonly pausado = signal(false);
  protected readonly actual = computed(() => this.testimonios().testimonios[this.indice()] ?? this.testimonios().testimonios[0]);

  constructor() {
    const destruir = inject(DestroyRef);
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const reloj = setInterval(() => {
        const total = this.testimonios().testimonios.length;
        if (total > 1 && !this.pausado() && !document.hidden) {
          this.indice.update(i => (i + 1) % total);
        }
      }, INTERVALO_MS);
      destruir.onDestroy(() => clearInterval(reloj));
    });
  }
}
