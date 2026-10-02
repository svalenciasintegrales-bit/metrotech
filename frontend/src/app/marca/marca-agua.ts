import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type Esquina = 'superior-derecha' | 'superior-izquierda' | 'inferior-derecha' | 'inferior-izquierda';

/**
 * El monograma MT gigante en marca de agua, cortado por el borde de la
 * sección, como en la hoja membrete y el sobre de la papelería.
 *
 * Usa el monograma oficial a baja opacidad: no se recolorea ni se
 * deforma. En zona clara va la versión a color; en zona oscura, la versión
 * sobre negro (M gris, T blanca).
 *
 * El contenedor tiene que tener `position: relative` y `overflow: hidden`
 * (la clase `.seccion` ya los trae).
 *
 * Uso: `<mt-marca-agua esquina="inferior-derecha" zona="claro" />`
 */
@Component({
  selector: 'mt-marca-agua',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class]': 'esquina()',
    '[style.--marca-agua-ancho]': 'ancho()',
    '[style.--marca-agua-opacidad]': 'opacidad()'
  },
  template: `<img [src]="archivo()" alt="" decoding="async" loading="lazy" width="232" height="119" />`,
  styles: `
    :host {
      position: absolute;
      z-index: var(--z-decoracion);
      width: var(--marca-agua-ancho);
      opacity: var(--marca-agua-opacidad);
      pointer-events: none;
      user-select: none;
    }

    img {
      display: block;
      width: 100%;
      height: auto;
    }

    /* Un tercio del monograma queda fuera de la sección. */
    :host(.superior-derecha)   { top: 0;    right: 0; transform: translate(28%, -24%); }
    :host(.superior-izquierda) { top: 0;    left: 0;  transform: translate(-28%, -24%); }
    :host(.inferior-derecha)   { bottom: 0; right: 0; transform: translate(28%, 24%); }
    :host(.inferior-izquierda) { bottom: 0; left: 0;  transform: translate(-28%, 24%); }
  `
})
export class MarcaAgua {
  readonly esquina = input<Esquina>('inferior-derecha');
  readonly zona = input<'claro' | 'oscuro'>('claro');

  /** Ancho del monograma: grande, para que se lea como textura y no como logo. */
  readonly ancho = input('clamp(280px, 55vw, 720px)');

  readonly opacidad = computed(() => (this.zona() === 'claro' ? 0.07 : 0.08));

  readonly archivo = computed(() =>
    this.zona() === 'claro' ? 'img/marca/monograma-color.svg' : 'img/marca/monograma-sobre-negro.svg'
  );
}
