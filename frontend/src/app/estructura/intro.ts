import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';

import { Logo } from '../marca/logo';

const CLAVE = 'mt-intro-vista';

/**
 * Intro de marca al entrar, una vez por visita. Se dibujan los dos rasgos del
 * monograma (la regla de la M y la línea con el rombo de la T) y aparece el
 * logo con el slogan. Con movimiento reducido no se muestra.
 */
@Component({
  selector: 'mt-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo],
  template: `
    @if (visible()) {
      <div class="intro" data-theme="dark" [class.sale]="saliendo()" aria-hidden="true">
        <!-- Arriba la regla con sus marcas, como en la M; abajo la línea con
             nodos y el rombo de la T. Van en el flujo, encima y debajo del
             logo, para que en ninguna pantalla lo crucen. -->
        <svg class="trazos" viewBox="30 30 540 40">
          <line class="regla" x1="40" y1="40" x2="560" y2="40" />
          @for (x of marcas; track x; let i = $index) {
            <line class="marca" [attr.x1]="x" y1="40" [attr.x2]="x" [attr.y2]="i % 5 === 0 ? 64 : 52"
              [style.animation-delay.ms]="300 + i * 22" />
          }
        </svg>

        <div class="marca-logo">
          <mt-logo variante="sobre-negro" [alto]="120" [reserva]="false" />
          <p class="slogan">Tecnología que impulsa tu operación</p>
          <p class="matriz">Una marca de Salazar Arias Company</p>
        </div>

        <svg class="trazos" viewBox="30 360 540 24">
          <line class="nodos" x1="40" y1="372" x2="560" y2="372" />
          <circle class="nodo n1" cx="40" cy="372" r="6" />
          <rect class="rombo" x="553" y="365" width="14" height="14" transform="rotate(45 560 372)" />
        </svg>

        <span class="barra"><span></span></span>
      </div>
    }
  `,
  styles: `
    .intro {
      position: fixed;
      inset: 0;
      z-index: calc(var(--z-menu) + 10);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: clamp(var(--e-6), 5vh, var(--e-12));
      padding-inline: var(--e-6);
      background: var(--fondo);
      color: var(--texto);
      clip-path: inset(0 0 0 0);
      transition: clip-path 0.9s var(--curva);
    }

    .intro.sale { clip-path: inset(0 0 100% 0); }

    .trazos {
      width: min(640px, 86vw);
      height: auto;
      overflow: visible;
      opacity: 0.6;
    }

    .trazos line { stroke: var(--celeste); stroke-width: 2; stroke-linecap: square; }
    .regla, .nodos { stroke-dasharray: 520; stroke-dashoffset: 520; animation: dibujar 0.9s var(--curva) forwards; }
    .nodos { animation-delay: 0.35s; }
    .marca { opacity: 0; animation: aparecer 0.2s linear forwards; }
    .nodo { fill: var(--celeste); transform-box: fill-box; transform-origin: center; transform: scale(0); animation: brotar 0.4s var(--curva) 0.5s forwards; }
    .rombo { fill: var(--celeste); opacity: 0; animation: aparecer 0.3s linear 1.1s forwards; }

    .marca-logo {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--e-3);
      text-align: center;
      opacity: 0;
      transform: translateY(var(--e-3));
      animation: subir 0.8s var(--curva) 0.7s forwards;
    }

    .marca-logo mt-logo {
      max-width: 100%;
    }

    .slogan {
      margin: var(--e-3) 0 0;
      text-wrap: balance;
      font-size: var(--t-cuerpo-l);
      font-weight: var(--peso-semibold);
      color: var(--texto);
    }

    .matriz {
      margin: 0;
      font-size: var(--t-pequeno);
      letter-spacing: 0.08em;
      text-wrap: balance;
      text-transform: uppercase;
      color: var(--texto-2);
    }

    .barra {
      position: absolute;
      bottom: 12%;
      width: 160px;
      height: var(--linea-media);
      background: rgba(255, 255, 255, 0.14);
      overflow: hidden;
    }

    .barra span {
      display: block;
      height: 100%;
      background: var(--celeste);
      transform-origin: left center;
      transform: scaleX(0);
      animation: llenar 1.8s var(--curva) forwards;
    }

    @keyframes dibujar { to { stroke-dashoffset: 0; } }
    @keyframes aparecer { to { opacity: 1; } }
    @keyframes brotar { 60% { transform: scale(1.5); } to { transform: scale(1); } }
    @keyframes subir { to { opacity: 1; transform: none; } }
    @keyframes llenar { to { transform: scaleX(1); } }
  `
})
export class Intro implements OnInit {
  /** Posiciones de las marcas de la regla. */
  protected readonly marcas = Array.from({ length: 27 }, (_, i) => 40 + i * 20);
  protected readonly visible = signal(false);
  protected readonly saliendo = signal(false);

  ngOnInit(): void {
    let vista = false;
    try {
      vista = sessionStorage.getItem(CLAVE) === '1';
      sessionStorage.setItem(CLAVE, '1');
    } catch {
      /* sin almacenamiento: se muestra igual */
    }
    if (vista || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.visible.set(true);
    document.documentElement.style.overflow = 'hidden';
    setTimeout(() => {
      this.saliendo.set(true);
      document.documentElement.style.overflow = '';
    }, 2100);
    setTimeout(() => this.visible.set(false), 3100);
  }
}
