import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { icono } from '../../marca/iconos';
import { LineaNodos } from '../../marca/linea-nodos';
import { MarcaAgua } from '../../marca/marca-agua';
import { TituloSeccion } from '../../marca/titulo-seccion';

/**
 * Quiénes somos: el propósito (transformar datos en decisiones confiables),
 * la pertenencia a Salazar Arias Company y los tres pilares del concepto,
 * unidos por la línea con nodos como en el monograma.
 */
@Component({
  selector: 'mt-nosotros',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, Aparecer, LineaNodos, MarcaAgua, TituloSeccion],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.css'
})
export class Nosotros {
  readonly nosotros = input.required<Contenido['nosotros']>();
  readonly marca = input.required<Contenido['marca']>();

  protected readonly icono = icono;
}
