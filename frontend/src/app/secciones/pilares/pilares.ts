import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ItemIcono } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { FondoVivo } from '../../marca/fondo-vivo';
import { Icono } from '../../marca/icono';

/**
 * Los tres pilares como la fórmula de la marca:
 * integración + precisión + estructura = sistema que conecta todo.
 * Una sola pieza bajo el banner del inicio, con la regla de la M arriba;
 * los signos van en el cuadro de nodo del monograma y el resultado, en azul
 * oscuro con el fondo en movimiento. En móvil la fórmula se lee hacia abajo.
 */
@Component({
  selector: 'mt-pilares',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Aparecer, FondoVivo, Icono],
  template: `
    <section class="pilares" aria-label="Integración, precisión y estructura">
      <div class="contenedor">
        <div class="formula" mtAparecer>
          <span class="formula__regla" aria-hidden="true"></span>

          <ol class="formula__terminos" role="list">
            @for (p of pilares(); track p.titulo; let ultimo = $last) {
              <li class="termino">
                <span class="termino__icono"><mt-icono [nombre]="p.icono" [tamano]="34" /></span>
                <div>
                  <h2 class="termino__titulo">{{ p.titulo }}</h2>
                  @if (p.texto) {
                    <p class="termino__texto">{{ p.texto }}</p>
                  }
                </div>
                <span class="signo" [class.signo--igual]="ultimo" aria-hidden="true">{{ ultimo ? '=' : '+' }}</span>
              </li>
            }
          </ol>

          <div class="resultado" data-theme="dark">
            <mt-fondo-vivo [densidad]="0.5" />
            <p class="resultado__etiqueta">El resultado</p>
            <p class="resultado__texto">{{ concepto() }}</p>
            <span class="resultado__linea" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .pilares {
      position: relative;
      z-index: 2;
      padding-top: var(--e-8);
    }

    .formula {
      position: relative;
      display: grid;
      background: var(--blanco);
      border: var(--linea-fina) solid var(--borde);
      border-radius: var(--r-3);
      box-shadow: var(--sombra-2);
      overflow: hidden;
    }

    @media (min-width: 900px) {
      .formula { grid-template-columns: 3fr 1.1fr; }
    }

    /* La regla de la M sobre toda la fórmula: marcas cortas y largas. */
    .formula__regla {
      position: absolute;
      inset: 0 0 auto;
      height: 10px;
      z-index: 3;
      background:
        repeating-linear-gradient(90deg, var(--celeste) 0 2px, transparent 2px 60px) top left / 100% 10px no-repeat,
        repeating-linear-gradient(90deg, var(--celeste) 0 1px, transparent 1px 12px) top left / 100% 5px no-repeat;
      opacity: 0.6;
      transform-origin: left center;
      transform: scaleX(0);
      transition: transform 1.4s var(--curva) 0.2s;
    }

    .formula.visible .formula__regla { transform: scaleX(1); }

    .formula__terminos {
      display: grid;
      margin: 0;
      padding: 0;
    }

    @media (min-width: 600px) {
      .formula__terminos { grid-template-columns: repeat(3, 1fr); }
    }

    .termino {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: var(--e-4);
      padding: var(--e-8) var(--e-6);
    }

    @media (min-width: 600px) {
      .termino {
        flex-direction: column;
        padding: var(--e-10) var(--e-8) var(--e-8);
      }
      .termino + .termino { border-left: var(--linea-fina) solid var(--borde); }
    }

    @media (max-width: 599px) {
      .termino + .termino { border-top: var(--linea-fina) solid var(--borde); }
    }

    .termino__icono {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 64px;
      height: 64px;
      color: var(--azul-oscuro);
      background: var(--superficie-2);
      border-radius: var(--r-2);
      transition: background-color var(--dur-media) var(--curva), color var(--dur-media) var(--curva);
    }

    .termino:hover .termino__icono {
      --icono-acento: var(--celeste);
      color: var(--blanco);
      background: var(--azul-oscuro);
    }

    .termino__titulo {
      margin: 0 0 var(--e-2);
      font-size: var(--t-h3);
      font-weight: var(--peso-semibold);
      line-height: 1.1;
      color: var(--azul-oscuro);
    }

    .termino__texto {
      margin: 0;
      font-size: var(--t-pequeno);
      color: var(--texto-2);
      max-width: 30ch;
    }

    /* El signo, en el cuadro de nodo del monograma, sobre el borde. */
    .signo {
      position: absolute;
      z-index: 2;
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      font-size: 22px;
      font-weight: var(--peso-semibold);
      line-height: 1;
      color: var(--blanco);
      background: var(--celeste);
      box-shadow: 0 0 0 6px var(--blanco);
      left: 50%;
      bottom: -18px;
      transform: translateX(-50%);
    }

    @media (min-width: 600px) {
      .signo {
        left: auto;
        right: -18px;
        bottom: auto;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    /* El = solo se ve donde el resultado sigue al lado (o debajo en móvil). */
    @media (min-width: 600px) and (max-width: 899px) {
      .signo--igual { display: none; }
    }

    /* ------------------------------------------------------------ resultado */

    .resultado {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--e-3);
      padding: var(--e-10) var(--e-8) var(--e-10) var(--e-10);
      background: var(--fondo);
      color: var(--texto);
      overflow: hidden;
    }

    .resultado > p,
    .resultado > span { position: relative; z-index: var(--z-contenido); }

    .resultado__etiqueta {
      margin: 0;
      font-size: var(--t-pequeno);
      font-weight: var(--peso-semibold);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--celeste);
    }

    .resultado__texto {
      margin: 0;
      font-size: var(--t-h3);
      font-weight: var(--peso-semibold);
      line-height: 1.15;
      max-width: 14ch;
    }

    /* La línea con su rombo, que se dibuja al aparecer. */
    .resultado__linea {
      width: 140px;
      height: var(--linea-media);
      margin-top: var(--e-2);
      background: var(--celeste);
      transform-origin: left center;
      transform: scaleX(0);
      transition: transform 1s var(--curva) 0.8s;
    }

    .resultado__linea::after {
      content: '';
      position: absolute;
      right: -5px;
      top: 50%;
      width: 10px;
      height: 10px;
      background: var(--celeste);
      transform: translateY(-50%) rotate(45deg);
    }

    .formula.visible .resultado__linea { transform: scaleX(1); }
  `
})
export class Pilares {
  readonly pilares = input.required<ItemIcono[]>();
  /** El concepto de la marca: «Sistema que conecta todo». */
  readonly concepto = input.required<string>();
}
