import { Provider } from '@angular/core';
import { LucideIconConfig } from 'lucide-angular';

/**
 * Los íconos: Lucide, de línea, como los trazos finos del monograma. Trazo
 * 1,75, 24 px y el color del texto que los rodea. Se registra una vez.
 *
 * Uso: importar `LucideAngularModule` en el componente y
 * `<lucide-icon [img]="Menu" aria-hidden="true" />`.
 */
export function proveerIconos(): Provider {
  return {
    provide: LucideIconConfig,
    useFactory: () => {
      const c = new LucideIconConfig();
      c.strokeWidth = 1.75;
      c.size = 24;
      c.color = 'currentColor';
      return c;
    }
  };
}
