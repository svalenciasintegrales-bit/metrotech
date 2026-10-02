import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

interface Punto {
  x: number;
  y: number;
  forma: 'rombo' | 'cuadro';
  rotulo?: string;
}

/**
 * «Sistema que conecta todo» (manual, lámina 15) dibujado: nodos unidos por
 * líneas finas, con los mismos dos remates del logo —el cuadro pequeño de
 * la M y el rombo de la T— y una regla de medición en el borde.
 *
 * Los tres nodos rotulados son los pilares del concepto: integración,
 * precisión y estructura. Las líneas se dibujan al cargar y los nodos
 * aparecen al final; con `prefers-reduced-motion` todo está quieto.
 *
 * Es decoración: va con `aria-hidden` y el concepto se dice en el texto.
 */
@Component({
  selector: 'mt-red-nodos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 480 420" focusable="false">
      <!-- Regla: borde inferior y borde izquierdo, cada quinta marca larga. -->
      <g class="regla">
        @for (m of marcasH; track m) {
          <line [attr.x1]="m" y1="420" [attr.x2]="m" [attr.y2]="m % 60 === 0 ? 404 : 410" />
        }
        @for (m of marcasV; track m) {
          <line x1="0" [attr.y1]="m" [attr.x2]="m % 60 === 0 ? 16 : 10" [attr.y2]="m" />
        }
      </g>

      <g class="lineas">
        @for (l of lineas(); track $index) {
          <line
            [attr.x1]="l[0].x" [attr.y1]="l[0].y" [attr.x2]="l[1].x" [attr.y2]="l[1].y"
            pathLength="1" [style.animation-delay.ms]="$index * 90"
          />
        }
      </g>

      <!-- El centro: el sistema que conecta todo. -->
      <g class="centro">
        <rect x="285" y="205" width="30" height="30" transform="rotate(45 300 220)" />
        <rect class="centro__anillo" x="275" y="195" width="50" height="50" transform="rotate(45 300 220)" />
      </g>

      <g class="nodos">
        @for (p of puntos; track $index) {
          @if (p.forma === 'rombo') {
            <rect class="rombo" [attr.x]="p.x - 7" [attr.y]="p.y - 7" width="14" height="14"
              [attr.transform]="'rotate(45 ' + p.x + ' ' + p.y + ')'" />
          } @else {
            <rect class="cuadro" [attr.x]="p.x - 6" [attr.y]="p.y - 6" width="12" height="12" />
          }
          @if (p.rotulo) {
            <text [attr.x]="p.x + 18" [attr.y]="p.y + 5">{{ p.rotulo }}</text>
          }
        }
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    svg {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
    }

    .regla line {
      stroke: var(--acento);
      stroke-width: 1.5;
    }

    .lineas line {
      stroke: var(--texto);
      stroke-opacity: 0.35;
      stroke-width: 1.5;
    }

    .rombo { fill: var(--acento); }
    .cuadro { fill: var(--texto); }

    .centro rect { fill: var(--acento); }
    .centro .centro__anillo {
      fill: none;
      stroke: var(--texto);
      stroke-width: 1.5;
    }

    text {
      font-family: var(--fuente);
      font-size: 15px;
      font-weight: var(--peso-semibold);
      fill: var(--texto);
    }

    /* Dibujo de entrada: cada línea crece de punta a punta; los nodos llegan
       cuando las líneas ya están. */
    @media (prefers-reduced-motion: no-preference) {
      .lineas line {
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        animation: dibujar var(--dur-dibujo) var(--curva) forwards;
      }

      .nodos,
      .centro {
        opacity: 0;
        animation: aparecer var(--dur-media) var(--curva) forwards;
        animation-delay: calc(var(--dur-dibujo) + 300ms);
      }
    }

    @keyframes dibujar {
      to { stroke-dashoffset: 0; }
    }

    @keyframes aparecer {
      to { opacity: 1; }
    }
  `
})
export class RedNodos {
  /** Rótulos de los tres pilares: integración, precisión, estructura. */
  readonly pilares = input<string[]>([]);

  protected readonly marcasH = Array.from({ length: 40 }, (_, i) => 12 + i * 12);
  protected readonly marcasV = Array.from({ length: 33 }, (_, i) => 12 + i * 12).filter(y => y < 400);

  private readonly centro = { x: 300, y: 220 };

  protected get puntos(): Punto[] {
    const [a, b, c] = this.pilares();
    return [
      { x: 70, y: 70, forma: 'cuadro' },
      { x: 220, y: 50, forma: 'rombo', rotulo: a ? mayuscula(a) : undefined },
      { x: 420, y: 100, forma: 'cuadro' },
      { x: 120, y: 200, forma: 'rombo', rotulo: b ? mayuscula(b) : undefined },
      { x: 440, y: 290, forma: 'rombo' },
      { x: 70, y: 340, forma: 'cuadro' },
      { x: 250, y: 350, forma: 'rombo', rotulo: c ? mayuscula(c) : undefined }
    ];
  }

  protected readonly lineas = computed(() => {
    const p = this.puntos;
    const c = this.centro;
    return [
      [p[0], p[1]], [p[1], p[2]], [p[0], p[3]], [p[1], c], [p[2], c], [p[3], c],
      [c, p[4]], [p[3], p[5]], [p[5], p[6]], [p[6], c], [p[6], p[4]]
    ];
  });
}

function mayuscula(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
