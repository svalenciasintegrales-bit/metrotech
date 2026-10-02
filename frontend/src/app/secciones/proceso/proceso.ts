import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { LineaNodos } from '../../marca/linea-nodos';
import { MarcaAgua } from '../../marca/marca-agua';
import { TituloSeccion } from '../../marca/titulo-seccion';

/**
 * Cómo trabajamos, en zona oscura como el sobre de la papelería: los pasos
 * unidos por la línea con nodos —«Sistema que conecta todo»—. En escritorio
 * la línea corre horizontal sobre los pasos; en móvil baja vertical a su
 * izquierda. Se dibuja la primera vez que entra en pantalla.
 */
@Component({
  selector: 'mt-proceso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Aparecer, LineaNodos, MarcaAgua, TituloSeccion],
  templateUrl: './proceso.html',
  styleUrl: './proceso.css'
})
export class Proceso {
  readonly proceso = input.required<Contenido['proceso']>();

  protected numero(i: number) {
    return String(i + 1).padStart(2, '0');
  }
}
