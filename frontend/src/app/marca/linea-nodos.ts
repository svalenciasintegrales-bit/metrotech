import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, signal
} from '@angular/core';

export type Nodo = 'rombo' | 'cuadro' | 'ninguno';

/**
 * La línea con nodos de la T: flujo de información y conexión.
 *
 * En el logo la línea nace en un cuadro pequeño dentro de la M y termina en
 * un rombo en la punta de la T. Aquí se usa como separador, en la línea de
 * tiempo del proceso o para conectar tarjetas.
 *
 * Con `animar`, la línea se dibuja de punta a punta la primera vez que entra
 * en pantalla y el nodo final aparece al llegar. Con
 * `prefers-reduced-motion` se ve completa desde el principio (las
 * duraciones de `tokens.css` valen 0).
 *
 * Uso: `<mt-linea-nodos inicio="cuadro" fin="rombo" [animar]="true" />`
 */
@Component({
  selector: 'mt-linea-nodos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class.vertical]': "orientacion() === 'vertical'",
    '[class.animar]': 'animar()',
    '[class.visible]': 'visible()'
  },
  template: `
    @if (inicio() !== 'ninguno') {
      <span class="nodo nodo--inicio" [class]="'nodo--' + inicio()"></span>
    }
    <span class="linea"></span>
    @if (fin() !== 'ninguno') {
      <span class="nodo nodo--fin" [class]="'nodo--' + fin()"></span>
    }
  `,
  styles: `
    :host {
      --nodo: 10px;
      display: flex;
      align-items: center;
      width: 100%;
      color: var(--acento);
      pointer-events: none;
    }

    :host(.vertical) {
      flex-direction: column;
      width: auto;
      height: 100%;
    }

    .linea {
      flex: 1;
      height: var(--linea-media);
      background: currentColor;
      transform-origin: left center;
    }

    :host(.vertical) .linea {
      width: var(--linea-media);
      height: auto;
      transform-origin: center top;
    }

    .nodo {
      flex-shrink: 0;
      background: currentColor;
    }

    .nodo--rombo {
      width: var(--nodo);
      height: var(--nodo);
      transform: rotate(45deg);
      margin-inline: calc(var(--nodo) * -0.15);
    }

    .nodo--cuadro {
      width: calc(var(--nodo) * 0.7);
      height: calc(var(--nodo) * 0.7);
    }

    :host(.vertical) .nodo--rombo {
      margin-inline: 0;
      margin-block: calc(var(--nodo) * -0.15);
    }

    /* Dibujo: la línea crece desde el inicio y el nodo final llega al terminar. */
    :host(.animar) .linea {
      transform: scaleX(0);
      transition: transform var(--dur-dibujo) var(--curva);
    }

    :host(.animar.vertical) .linea {
      transform: scaleY(0);
    }

    :host(.animar) .nodo--fin {
      opacity: 0;
      transition: opacity var(--dur-media) var(--curva) var(--dur-dibujo);
    }

    :host(.animar.visible) .linea {
      transform: none;
    }

    :host(.animar.visible) .nodo--fin {
      opacity: 1;
    }
  `
})
export class LineaNodos {
  readonly orientacion = input<'horizontal' | 'vertical'>('horizontal');
  readonly inicio = input<Nodo>('cuadro');
  readonly fin = input<Nodo>('rombo');
  readonly animar = input(false);

  readonly visible = signal(false);

  private readonly elemento = inject(ElementRef<HTMLElement>);
  private readonly destruir = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!this.animar()) {
        return;
      }
      if (typeof IntersectionObserver === 'undefined') {
        this.visible.set(true);
        return;
      }
      const observador = new IntersectionObserver(
        entradas => {
          if (entradas.some(e => e.isIntersecting)) {
            this.visible.set(true);
            observador.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      observador.observe(this.elemento.nativeElement);
      this.destruir.onDestroy(() => observador.disconnect());
    });
  }
}
