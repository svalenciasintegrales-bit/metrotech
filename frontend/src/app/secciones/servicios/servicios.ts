import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, input, signal
} from '@angular/core';

import { Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { FondoVivo } from '../../marca/fondo-vivo';
import { Franjas } from '../../marca/franjas';
import { Icono } from '../../marca/icono';
import { TituloSeccion } from '../../marca/titulo-seccion';

/**
 * Servicios de metrología, como los pidió el cliente (reunión del 24 de
 * octubre de 2026, con Celsius y CONAMET de referencia): primero los tres
 * tipos de servicio (acreditados, con trazabilidad, validaciones y
 * calificaciones) y luego las magnitudes que se miden, en una galería de
 * paneles: franjas con su ícono que se abren para mostrar la magnitud
 * elegida con sus equipos. Si una magnitud trae `imagen`, se usa de fondo. Mientras `"ejemplo": true`, la sección lo dice.
 */
@Component({
  selector: 'mt-servicios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Aparecer, FondoVivo, Franjas, Icono, TituloSeccion],
  template: `
    <section id="servicios" class="seccion" data-theme="tint" aria-labelledby="servicios-titulo">
      <mt-franjas esquina="inferior-izquierda" ancho="clamp(180px, 28vw, 380px)" />
      <div class="contenedor">
        <mt-titulo-seccion
          idTitulo="servicios-titulo"
          [titulo]="servicios().titulo"
          [entradilla]="servicios().entradilla"
          [ejemplo]="servicios().ejemplo"
        />

        <!-- Tipos de servicio -->
        <ul class="categorias" role="list">
          @for (c of servicios().categorias; track c.titulo; let i = $index) {
            <li class="categoria" [class.categoria--destacada]="i === 0" mtAparecer [retraso]="i * 100">
              @if (c.imagen; as img) {
                <div class="categoria__foto">
                  <img [src]="img + '-960.webp'" alt="" loading="lazy" decoding="async" width="960" height="540" />
                </div>
              }
              <span class="icono-marca categoria__icono"><mt-icono [nombre]="c.icono" /></span>
              <div class="categoria__cuerpo">
                <h3 class="categoria__titulo">{{ c.titulo }}</h3>
                @if (c.texto) {
                  <p class="categoria__texto">{{ c.texto }}</p>
                }
              </div>
            </li>
          }
        </ul>

        <!-- Magnitudes: galería de paneles. Cada magnitud es una franja azul
             con su ícono y el nombre en vertical; la elegida se abre con su
             ícono en grande, los equipos que se calibran y la invitación a
             cotizar. Pasa sola mientras nadie la toca. -->
        <div class="magnitudes__cabeza" mtAparecer>
          <h3 class="t-h3">{{ servicios().tituloMagnitudes }}</h3>
          <span class="magnitudes__regla" aria-hidden="true"></span>
        </div>

        <div class="rail" [class.rail--auto]="corriendo()" mtAparecer (pointerleave)="reanudar()">
          @for (m of servicios().magnitudes; track m.titulo; let i = $index) {
            <article
              class="franja"
              data-theme="dark"
              [class.abierta]="i === activa()"
              (pointerenter)="elegir(i)"
              (focusin)="elegir(i)"
              (click)="elegir(i)"
            >
              @if (m.imagen; as img) {
                <img class="franja__foto" [src]="img + '-960.webp'" alt="" loading="lazy" decoding="async" />
              }
              <span class="franja__velo" aria-hidden="true"></span>
              @if (i === activa()) {
                <mt-fondo-vivo [densidad]="0.5" />
              }
              <span class="franja__dibujo" aria-hidden="true"><mt-icono [nombre]="m.icono" [tamano]="300" /></span>

              <!-- Cerrada: ícono arriba, nombre en vertical, número abajo. -->
              <div class="franja__cerrada" aria-hidden="true">
                <span class="franja__icono"><mt-icono [nombre]="m.icono" [tamano]="24" /></span>
                <span class="franja__vertical">{{ m.titulo }}</span>
                <span class="franja__numero">{{ numero(i) }}</span>
              </div>

              <!-- Abierta -->
              <div class="franja__abierta">
                <div class="franja__meta">
                  <span class="franja__icono franja__icono--grande"><mt-icono [nombre]="m.icono" [tamano]="30" /></span>
                  <span class="franja__chip">Magnitud</span>
                  <span class="franja__cuenta">{{ numero(i) }} / {{ numero(servicios().magnitudes.length - 1) }}</span>
                </div>
                <h4 class="franja__titulo">{{ m.titulo }}</h4>
                @if (m.texto) {
                  <p class="franja__subtitulo">Equipos que calibramos</p>
                  <p class="franja__texto">{{ m.texto }}</p>
                }
                <a class="franja__boton" href="#contacto" (click)="$event.stopPropagation()">
                  Cotizar calibración
                  <span class="franja__flecha" aria-hidden="true"></span>
                </a>
              </div>

              <span class="franja__progreso" aria-hidden="true"></span>
            </article>
          }
        </div>

        <p class="magnitudes__otra" mtAparecer>
          ¿Necesitas otra magnitud o un equipo especial? <a href="#contacto">Consúltanos</a>
        </p>
      </div>
    </section>
  `,
  styles: `
    /* ------------------------------------------------------------ tipos de servicio */

    .categorias {
      display: grid;
      gap: var(--e-4);
      margin: 0 0 var(--e-16);
      padding: 0;
    }

    @media (min-width: 900px) {
      .categorias { grid-template-columns: repeat(3, 1fr); }
    }

    .categoria {
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--superficie);
      border: var(--linea-fina) solid var(--borde);
      border-bottom: var(--linea-gruesa) solid var(--acento);
      border-radius: var(--r-3);
      box-shadow: var(--sombra-1);
      transition: transform var(--dur-media) var(--curva), box-shadow var(--dur-media) var(--curva);
    }

    .categoria:hover {
      transform: translateY(calc(var(--e-1) * -1));
      box-shadow: var(--sombra-3);
    }

    .categoria__foto {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;
    }

    .categoria__foto img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1.2s var(--curva);
    }

    .categoria:hover .categoria__foto img { transform: scale(1.06); }

    .categoria__foto::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 50%, rgba(14, 34, 51, 0.55));
    }

    /* El ícono se monta sobre el borde de la foto. */
    .categoria__icono {
      position: relative;
      z-index: var(--z-contenido);
      margin: calc(var(--e-6) * -1) var(--e-6) 0;
      box-shadow: var(--sombra-2);
    }

    .categoria__cuerpo { padding: var(--e-4) var(--e-6) var(--e-6); }

    .categoria--destacada {
      background: var(--azul-oscuro);
      border-color: var(--azul-oscuro);
      border-left-color: var(--celeste);
      color: var(--blanco);
    }

    .categoria--destacada .categoria__icono {
      --icono-acento: var(--blanco);
      background: var(--celeste);
      color: var(--azul-oscuro);
    }

    .categoria__titulo {
      margin: 0 0 var(--e-2);
      font-size: var(--t-h5);
      font-weight: var(--peso-semibold);
    }

    .categoria__texto {
      margin: 0;
      font-size: var(--t-pequeno);
      color: var(--texto-2);
    }

    .categoria--destacada .categoria__titulo { color: var(--blanco); }
    .categoria--destacada .categoria__texto { color: rgba(255, 255, 255, 0.8); }

    /* ------------------------------------------------------------ magnitudes */

    .magnitudes__cabeza {
      display: flex;
      align-items: center;
      gap: var(--e-6);
      margin-bottom: var(--e-8);
    }

    .magnitudes__cabeza h3 { margin: 0; white-space: nowrap; }

    /* La regla de la M como filete junto al subtítulo. */
    .magnitudes__regla {
      flex: 1;
      height: var(--e-3);
      border-bottom: var(--linea-media) solid var(--acento);
      background: repeating-linear-gradient(90deg, var(--acento) 0 var(--linea-media), transparent var(--linea-media) var(--e-4));
      background-size: 100% 50%;
      background-repeat: no-repeat;
      background-position: bottom;
      opacity: 0.6;
    }

    /* ---------- galería de paneles */

    .rail {
      display: flex;
      gap: var(--e-3);
      height: clamp(460px, 42vw, 540px);
    }

    .franja {
      position: relative;
      flex: 1 1 0;
      min-width: 0;
      overflow: hidden;
      isolation: isolate;
      color: var(--texto);
      background: linear-gradient(180deg, var(--azul-600) 0%, var(--azul-oscuro) 100%);
      border-radius: var(--r-3);
      cursor: pointer;
      transition: flex-grow 0.8s var(--curva), box-shadow 0.6s var(--curva);
    }

    .franja:nth-child(even) {
      background: linear-gradient(180deg, var(--azul-oscuro) 0%, var(--azul-600) 100%);
    }

    .franja.abierta {
      flex-grow: 5;
      cursor: default;
      box-shadow: var(--sombra-3);
    }

    .franja__foto {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(0.9) brightness(0.6);
      transition: filter 0.8s var(--curva);
    }

    .franja.abierta .franja__foto { filter: none; }

    .franja__velo {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 70% 60% at 80% 25%, rgba(21, 141, 180, 0.35), transparent 70%);
      opacity: 0;
      transition: opacity 0.8s var(--curva);
    }

    .franja.abierta .franja__velo { opacity: 1; }

    /* El ícono de la magnitud como ilustración grande, en celeste tenue. */
    .franja__dibujo {
      position: absolute;
      right: -40px;
      top: -30px;
      color: var(--celeste);
      opacity: 0;
      transform: scale(0.85) rotate(-6deg);
      transition: opacity 0.8s var(--curva), transform 1.2s var(--curva);
      pointer-events: none;
    }

    .franja.abierta .franja__dibujo {
      --icono-acento: var(--blanco);
      opacity: 0.22;
      transform: none;
    }

    /* Cerrada */
    .franja__cerrada {
      position: absolute;
      inset: 0;
      z-index: var(--z-contenido);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: var(--e-5) 0;
      transition: opacity 0.35s var(--curva);
    }

    .franja.abierta .franja__cerrada { opacity: 0; pointer-events: none; }

    .franja__vertical {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-size: var(--t-cuerpo);
      font-weight: var(--peso-semibold);
      white-space: nowrap;
    }

    .franja__numero {
      font-size: var(--t-pequeno);
      letter-spacing: 0.1em;
      color: var(--celeste);
      font-variant-numeric: tabular-nums;
    }

    .franja__icono {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 48px;
      height: 48px;
      color: var(--blanco);
      background: rgba(255, 255, 255, 0.08);
      border: var(--linea-fina) solid rgba(255, 255, 255, 0.18);
      border-radius: var(--r-2);
    }

    .franja__icono--grande {
      --icono-acento: var(--blanco);
      width: 60px;
      height: 60px;
      color: var(--azul-oscuro);
      background: var(--celeste);
      border-color: var(--celeste);
    }

    /* Abierta */
    .franja__abierta {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: var(--z-contenido);
      min-width: 400px;
      padding: var(--e-10);
      opacity: 0;
      transform: translateY(var(--e-6));
      transition: opacity 0.3s var(--curva), transform 0.6s var(--curva);
      pointer-events: none;
    }

    .franja.abierta .franja__abierta {
      opacity: 1;
      transform: none;
      transition-delay: 0.35s;
      pointer-events: auto;
    }

    .franja__meta {
      display: flex;
      align-items: center;
      gap: var(--e-4);
      margin-bottom: var(--e-6);
    }

    .franja__chip {
      padding: var(--e-1) var(--e-4);
      font-size: var(--t-pequeno);
      font-weight: var(--peso-semibold);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      border: var(--linea-fina) solid rgba(255, 255, 255, 0.25);
      border-radius: var(--r-redondo);
      background: rgba(255, 255, 255, 0.08);
    }

    .franja__cuenta {
      margin-left: auto;
      font-size: var(--t-pequeno);
      letter-spacing: 0.1em;
      color: var(--texto-2);
      font-variant-numeric: tabular-nums;
    }

    .franja__titulo {
      margin: 0 0 var(--e-3);
      font-size: var(--t-h2);
      font-weight: var(--peso-semibold);
      line-height: 1.05;
    }

    .franja__subtitulo {
      margin: 0 0 var(--e-1);
      font-size: var(--t-pequeno);
      font-weight: var(--peso-semibold);
      color: var(--celeste);
    }

    .franja__texto {
      margin: 0 0 var(--e-6);
      max-width: 44ch;
      color: var(--texto-2);
    }

    .franja__boton {
      display: inline-flex;
      align-items: center;
      gap: var(--e-3);
      padding: var(--e-2) var(--e-2) var(--e-2) var(--e-5);
      font-weight: var(--peso-semibold);
      color: var(--azul-oscuro);
      background: var(--blanco);
      border-radius: var(--r-2);
      text-decoration: none;
    }

    /* La flecha es la línea con el rombo de la T. */
    .franja__flecha {
      position: relative;
      width: 40px;
      height: 36px;
      background: var(--celeste);
      border-radius: var(--r-1, 4px);
    }

    .franja__flecha::before {
      content: '';
      position: absolute;
      left: 10px;
      right: 14px;
      top: 50%;
      height: 2px;
      background: var(--blanco);
      transform: translateY(-50%);
    }

    .franja__flecha::after {
      content: '';
      position: absolute;
      right: 10px;
      top: 50%;
      width: 8px;
      height: 8px;
      background: var(--blanco);
      transform: translateY(-50%) rotate(45deg);
    }

    /* La barra que se llena mientras la galería pasa sola. */
    .franja__progreso {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 2;
      width: 100%;
      height: var(--linea-gruesa);
      background: var(--celeste);
      transform: scaleX(0);
      transform-origin: left center;
    }

    .rail--auto .franja.abierta .franja__progreso { animation: llenar 4.5s linear forwards; }

    @keyframes llenar { to { transform: scaleX(1); } }

    .magnitudes__otra {
      margin: var(--e-6) 0 0;
      text-align: center;
      color: var(--texto-2);
    }

    .magnitudes__otra a {
      font-weight: var(--peso-semibold);
      color: var(--azul-oscuro);
      text-decoration: underline;
      text-decoration-color: var(--celeste);
      text-underline-offset: 4px;
    }

    /* Móvil y tableta: las franjas se apilan y la abierta crece hacia abajo. */
    @media (max-width: 899px) {
      .rail { flex-direction: column; height: auto; gap: var(--e-2); }
      .franja { flex: none; height: 72px; transition: height 0.7s var(--curva); }
      .franja.abierta { height: 420px; }
      .franja__cerrada { flex-direction: row; justify-content: flex-start; gap: var(--e-4); padding: 0 var(--e-4); }
      .franja__vertical { flex: 1; writing-mode: horizontal-tb; transform: none; white-space: normal; }
      .franja__icono { width: 44px; height: 44px; }
      .franja__abierta { min-width: 0; padding: var(--e-6); }
      .franja__dibujo { right: -70px; top: -40px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .franja, .franja__abierta, .franja__dibujo, .franja__cerrada { transition: none; }
      .rail--auto .franja.abierta .franja__progreso { animation: none; }
    }
  `
})
export class Servicios {
  readonly servicios = input.required<Contenido['servicios']>();

  /** La magnitud abierta. */
  protected readonly activa = signal(0);

  /** Pasa sola mientras está en pantalla y nadie la toca. */
  private readonly automatica = signal(true);
  private readonly enPantalla = signal(false);
  protected readonly corriendo = computed(() => this.automatica() && this.enPantalla());

  private readonly el = inject(ElementRef).nativeElement as HTMLElement;
  private readonly quieto = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    const destruir = inject(DestroyRef);

    effect(onCleanup => {
      if (!this.corriendo()) return;
      this.activa();
      const t = setTimeout(() => this.activa.update(i => (i + 1) % this.servicios().magnitudes.length), 4500);
      onCleanup(() => clearTimeout(t));
    });

    afterNextRender(() => {
      if (this.quieto) {
        this.automatica.set(false);
        return;
      }
      const rail = this.el.querySelector('.rail');
      if (!rail) return;
      const vista = new IntersectionObserver(([e]) => this.enPantalla.set(e.isIntersecting), { threshold: 0.3 });
      vista.observe(rail);
      destruir.onDestroy(() => vista.disconnect());
    });
  }

  protected numero(i: number) {
    return String(i + 1).padStart(2, '0');
  }

  protected elegir(i: number) {
    this.automatica.set(false);
    this.activa.set(i);
  }

  /** Al salir el puntero de la galería, vuelve a pasar sola. */
  protected reanudar() {
    if (!this.quieto) this.automatica.set(true);
  }
}
