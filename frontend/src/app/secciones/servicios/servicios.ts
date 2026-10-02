import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { Franjas } from '../../marca/franjas';
import { icono } from '../../marca/iconos';
import { TituloSeccion } from '../../marca/titulo-seccion';

/**
 * Las soluciones, en tarjetas con número, ícono de línea y la regla celeste
 * arriba. Al pasar el puntero la tarjeta sube, el ícono se invierte a azul
 * oscuro y abajo se dibuja la línea con su rombo. Mientras
 * `"ejemplo": true`, la sección lo dice en pantalla.
 */
@Component({
  selector: 'mt-servicios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, Aparecer, Franjas, TituloSeccion],
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
        <ul class="grilla grilla--3" role="list">
          @for (s of servicios().items; track $index) {
            <li class="servicio" mtAparecer [retraso]="($index % 3) * 100">
              <div class="servicio__cabeza">
                <span class="servicio__icono"><lucide-icon [img]="icono(s.icono)" aria-hidden="true" /></span>
                <span class="servicio__numero" aria-hidden="true">{{ ($index + 1).toString().padStart(2, '0') }}</span>
              </div>
              <h3 class="tarjeta__titulo">{{ s.titulo }}</h3>
              @if (s.texto) {
                <p class="tarjeta__texto">{{ s.texto }}</p>
              }
              <span class="servicio__linea" aria-hidden="true"></span>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .servicio {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--e-3);
      padding: var(--e-8) var(--e-6) var(--e-10);
      background: var(--superficie);
      border: var(--linea-fina) solid var(--borde);
      border-top: var(--linea-gruesa) solid var(--acento);
      border-radius: var(--r-3);
      box-shadow: var(--sombra-1);
      transition:
        transform var(--dur-media) var(--curva),
        box-shadow var(--dur-media) var(--curva);
    }

    .servicio:hover {
      transform: translateY(calc(var(--e-1) * -1));
      box-shadow: var(--sombra-3);
    }

    .servicio__cabeza {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--e-3);
    }

    .servicio__icono {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--e-12);
      height: var(--e-12);
      border-radius: var(--r-2);
      background: var(--celeste-50);
      color: var(--azul-oscuro);
      transition: background-color var(--dur-media) var(--curva), color var(--dur-media) var(--curva);
    }

    .servicio:hover .servicio__icono {
      background: var(--azul-oscuro);
      color: var(--celeste);
    }

    .servicio__numero {
      font-size: var(--t-h2);
      font-weight: var(--peso-semibold);
      line-height: 1;
      color: var(--celeste);
      opacity: 0.3;
      font-variant-numeric: tabular-nums;
    }

    /* La línea con su rombo, que se dibuja al pasar el puntero. */
    .servicio__linea {
      position: absolute;
      left: var(--e-6);
      right: var(--e-6);
      bottom: var(--e-5);
      height: var(--linea-media);
      background: var(--acento);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform var(--dur-lenta) var(--curva);
    }

    .servicio__linea::after {
      content: '';
      position: absolute;
      right: -4px;
      top: 50%;
      width: 9px;
      height: 9px;
      background: var(--acento);
      transform: translateY(-50%) rotate(45deg);
    }

    .servicio:hover .servicio__linea {
      transform: scaleX(1);
    }
  `
})
export class Servicios {
  readonly servicios = input.required<Contenido['servicios']>();

  protected readonly icono = icono;
}
