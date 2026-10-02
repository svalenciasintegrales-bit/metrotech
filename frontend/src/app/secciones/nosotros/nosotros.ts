import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Contenido, Imagen } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { MarcaAgua } from '../../marca/marca-agua';
import { Regla } from '../../marca/regla';
import { TituloSeccion } from '../../marca/titulo-seccion';

/**
 * Quiénes somos: a la izquierda la imagen de identidad (uniformes del
 * manual, marcada como ilustrativa) con un bloque azul oscuro montado
 * encima que dice el concepto; a la derecha el propósito y la pertenencia a
 * Salazar Arias Company.
 */
@Component({
  selector: 'mt-nosotros',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Aparecer, MarcaAgua, Regla, TituloSeccion],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.css'
})
export class Nosotros {
  readonly nosotros = input.required<Contenido['nosotros']>();
  readonly marca = input.required<Contenido['marca']>();
  readonly imagen = input<Imagen | null>(null);
}
