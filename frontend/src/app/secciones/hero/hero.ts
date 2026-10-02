import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Contenido } from '../../../../comun/contenido';
import { Franjas } from '../../marca/franjas';
import { LineaNodos } from '../../marca/linea-nodos';
import { RedNodos } from '../../marca/red-nodos';
import { Regla } from '../../marca/regla';

/**
 * El héroe, en zona clara como la hoja membrete: el slogan en dos tonos
 * —como «Metro» y «Tech» en el logo—, el texto de apoyo, las dos acciones y
 * a la derecha el sistema que conecta todo. Franjas en la esquina y una
 * regla como borde inferior.
 */
@Component({
  selector: 'mt-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Franjas, LineaNodos, RedNodos, Regla],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  readonly hero = input.required<Contenido['hero']>();
  readonly marca = input.required<Contenido['marca']>();
}
