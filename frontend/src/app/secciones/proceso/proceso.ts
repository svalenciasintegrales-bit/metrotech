import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, input, signal
} from '@angular/core';

import { Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { FondoVivo } from '../../marca/fondo-vivo';
import { Icono } from '../../marca/icono';
import { TituloSeccion } from '../../marca/titulo-seccion';

/**
 * Cómo trabajamos, en zona oscura con la foto del laboratorio difuminada
 * detrás y el fondo en movimiento. Cada paso es una tarjeta de vidrio con
 * su ícono; arriba corre el riel —la línea con nodos de la T— que se va
 * llenando paso a paso con el rombo en la punta, y el paso activo se
 * enciende. Avanza solo mientras está en pantalla; con el puntero encima de
 * un paso, se queda en ese. Con movimiento reducido no avanza.
 */
@Component({
  selector: 'mt-proceso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Aparecer, FondoVivo, Icono, TituloSeccion],
  templateUrl: './proceso.html',
  styleUrl: './proceso.css'
})
export class Proceso {
  readonly proceso = input.required<Contenido['proceso']>();

  protected readonly activo = signal(0);
  private readonly enPantalla = signal(false);
  private readonly fijo = signal(false);

  constructor() {
    const el = inject(ElementRef).nativeElement as HTMLElement;
    const destruir = inject(DestroyRef);

    effect(onCleanup => {
      if (this.fijo() || !this.enPantalla()) return;
      this.activo();
      const t = setTimeout(() => this.activo.update(i => (i + 1) % this.proceso().pasos.length), 2600);
      onCleanup(() => clearTimeout(t));
    });

    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.fijo.set(true);
        return;
      }
      const vista = new IntersectionObserver(([e]) => this.enPantalla.set(e.isIntersecting), { threshold: 0.35 });
      vista.observe(el);
      destruir.onDestroy(() => vista.disconnect());
    });
  }

  protected numero(i: number) {
    return String(i + 1).padStart(2, '0');
  }

  /** Con el puntero sobre un paso, el recorrido se queda en ese paso. */
  protected senalar(i: number) {
    this.fijo.set(true);
    this.activo.set(i);
  }
}
