import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { Franjas } from '../../marca/franjas';
import { icono } from '../../marca/iconos';
import { TituloSeccion } from '../../marca/titulo-seccion';

/**
 * Las soluciones, en tarjetas con ícono de línea y la línea celeste de la
 * regla arriba. Mientras `"ejemplo": true`, la sección lo dice en pantalla.
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
            <li class="tarjeta tarjeta--acento" mtAparecer [retraso]="($index % 3) * 100">
              <span class="tarjeta__icono"><lucide-icon [img]="icono(s.icono)" aria-hidden="true" /></span>
              <h3 class="tarjeta__titulo">{{ s.titulo }}</h3>
              @if (s.texto) {
                <p class="tarjeta__texto">{{ s.texto }}</p>
              }
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    ul {
      margin: 0;
      padding: 0;
    }
  `
})
export class Servicios {
  readonly servicios = input.required<Contenido['servicios']>();

  protected readonly icono = icono;
}
