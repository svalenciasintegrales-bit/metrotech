import {
  ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, input, signal
} from '@angular/core';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

import { Enlace } from '../../../../comun/contenido';
import { Logo } from '../../marca/logo';

/**
 * La cabecera: fija arriba, blanca, con el logo, el menú de anclas y el
 * botón de contacto. En móvil el logo pasa al monograma (manual, lámina 7)
 * y el menú se abre en un panel debajo.
 *
 * La sección que se está leyendo queda marcada en el menú
 * (`aria-current`), para saber dónde va uno en una página larga.
 */
@Component({
  selector: 'mt-cabecera',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, Logo],
  templateUrl: './cabecera.html',
  styleUrl: './cabecera.css',
  host: {
    '(document:keydown.escape)': 'cerrar()'
  }
})
export class Cabecera {
  readonly navegacion = input.required<Enlace[]>();
  readonly accion = input.required<Enlace>();

  protected readonly abierto = signal(false);
  protected readonly activa = signal<string | null>(null);
  protected readonly conSombra = signal(false);

  protected readonly Menu = Menu;
  protected readonly X = X;

  private readonly destruir = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.vigilarSecciones();
      const alDesplazar = () => this.conSombra.set(window.scrollY > 8);
      alDesplazar();
      window.addEventListener('scroll', alDesplazar, { passive: true });
      this.destruir.onDestroy(() => window.removeEventListener('scroll', alDesplazar));
    });
  }

  protected alternar() {
    this.abierto.update(a => !a);
  }

  protected cerrar() {
    this.abierto.set(false);
  }

  /** Marca en el menú la sección que ocupa la franja central de la pantalla. */
  private vigilarSecciones() {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    const observador = new IntersectionObserver(
      entradas => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            this.activa.set(e.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    for (const n of this.navegacion()) {
      const el = document.getElementById(n.ancla);
      if (el) {
        observador.observe(el);
      }
    }
    this.destruir.onDestroy(() => observador.disconnect());
  }
}
