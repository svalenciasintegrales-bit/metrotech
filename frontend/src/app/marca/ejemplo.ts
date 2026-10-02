import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Info, LucideAngularModule } from 'lucide-angular';

/**
 * La marca de CONTENIDO DE EJEMPLO. Se ve a propósito: mientras una sección
 * tenga `"ejemplo": true` en `contenido.json`, nadie la confunde con
 * información real de la empresa.
 */
@Component({
  selector: 'mt-ejemplo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <span class="ejemplo">
      <lucide-icon [img]="Info" [size]="14" aria-hidden="true" />
      CONTENIDO DE EJEMPLO
    </span>
  `
})
export class Ejemplo {
  protected readonly Info = Info;
}
