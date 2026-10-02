import {
  ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, effect, inject, input, signal
} from '@angular/core';
import { ChevronLeft, ChevronRight, LucideAngularModule, Pause, Play } from 'lucide-angular';

import { Contenido } from '../../../../comun/contenido';
import { Franjas } from '../../marca/franjas';

/**
 * El héroe: carrusel de imágenes de fondo a todo el ancho, en zona oscura
 * (azul oscuro, como el sobre de la papelería), con un mensaje por
 * diapositiva y el título en dos tonos como «Metro»/«Tech» en el logo.
 *
 * Avanza solo siempre, también con el puntero encima (el héroe ocupa toda
 * la pantalla: si se detuviera con el puntero, casi nunca se movería).
 *
 * Accesibilidad (patrón de carrusel de WAI-ARIA):
 * - Botón de pausa: lo que se mueve solo más de 5 s tiene que poder parar.
 * - Se detiene mientras alguien lo recorre con el teclado (foco visible),
 *   para que el texto no cambie mientras lo lee, y con la pestaña oculta.
 * - Con `prefers-reduced-motion` sigue pasando, pero sin el acercamiento
 *   lento de la imagen: solo un fundido.
 * - Solo la diapositiva visible existe para el lector de pantalla (las
 *   demás van `inert`), y avisa del cambio cuando el carrusel está quieto.
 * - Flechas del teclado y deslizar con el dedo.
 */
@Component({
  selector: 'mt-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, Franjas],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  readonly hero = input.required<Contenido['hero']>();

  protected readonly Pause = Pause;
  protected readonly Play = Play;
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;

  protected readonly actual = signal(0);
  /** Cuenta los cambios: su paridad reinicia la animación de la barra de progreso. */
  protected readonly cambios = signal(0);
  /** Pausa pedida con el botón: manda sobre todo lo demás. */
  protected readonly pausaUsuario = signal(false);
  /** Foco de teclado dentro del carrusel. */
  private readonly enfocado = signal(false);
  private readonly pestanaVisible = signal(true);
  protected readonly movimientoReducido = signal(false);

  protected readonly total = computed(() => this.hero().diapositivas.length);

  /** ¿Está avanzando solo ahora mismo? */
  protected readonly corriendo = computed(() =>
    this.total() > 1 &&
    !this.pausaUsuario() &&
    !this.enfocado() &&
    this.pestanaVisible()
  );

  private inicioToque: number | null = null;
  private readonly destruir = inject(DestroyRef);

  constructor() {
    // Un temporizador por diapositiva: al cambiar de diapositiva o al pausar,
    // el anterior se cancela y la cuenta vuelve a empezar.
    effect(onCleanup => {
      if (!this.corriendo()) {
        return;
      }
      this.actual();
      const t = setTimeout(() => this.siguiente(), this.hero().intervalo || 7000);
      onCleanup(() => clearTimeout(t));
    });

    afterNextRender(() => {
      const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.movimientoReducido.set(consulta.matches);
      const alCambiar = (e: MediaQueryListEvent) => this.movimientoReducido.set(e.matches);
      consulta.addEventListener('change', alCambiar);

      const alOcultar = () => this.pestanaVisible.set(document.visibilityState === 'visible');
      document.addEventListener('visibilitychange', alOcultar);

      this.destruir.onDestroy(() => {
        consulta.removeEventListener('change', alCambiar);
        document.removeEventListener('visibilitychange', alOcultar);
      });
    });
  }

  protected ir(i: number) {
    const n = this.total();
    this.actual.set(((i % n) + n) % n);
    this.cambios.update(c => c + 1);
  }

  protected siguiente() {
    this.ir(this.actual() + 1);
  }

  protected anterior() {
    this.ir(this.actual() - 1);
  }

  protected alternarPausa() {
    this.pausaUsuario.update(p => !p);
  }

  /** Solo el foco de teclado pausa: un clic en una flecha no detiene el carrusel. */
  protected enfocar(e: FocusEvent) {
    const el = e.target as HTMLElement;
    this.enfocado.set(el.matches(':focus-visible'));
  }

  protected desenfocar(e: FocusEvent) {
    // Al moverse el foco entre controles del mismo carrusel, sigue enfocado.
    const destino = e.relatedTarget as Node | null;
    if (destino && (e.currentTarget as HTMLElement).contains(destino)) {
      return;
    }
    this.enfocado.set(false);
  }

  protected tecla(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      this.siguiente();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      this.anterior();
      e.preventDefault();
    }
  }

  protected tocar(e: PointerEvent) {
    if (e.pointerType !== 'mouse') {
      this.inicioToque = e.clientX;
    }
  }

  protected soltar(e: PointerEvent) {
    if (this.inicioToque === null) {
      return;
    }
    const dx = e.clientX - this.inicioToque;
    this.inicioToque = null;
    if (Math.abs(dx) > 50) {
      dx < 0 ? this.siguiente() : this.anterior();
    }
  }

  protected numero(i: number) {
    return String(i + 1).padStart(2, '0');
  }
}
