import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Las versiones del logo que permite el manual (lámina 8), exportadas de
 * los vectores del PDF a `public/img/marca/` sin redibujar nada.
 *
 *   color                   sobre blanco: la versión básica, siempre que se pueda
 *   sobre-celeste           M y «Metro» en azul oscuro, T y «Tech» en blanco
 *   sobre-negro             M en gris, T en blanco (también sobre azul oscuro)
 *   gris-sobre-blanco       M en gris, T en negro
 *   monograma-*             solo «MT», para tamaños pequeños
 */
export type VarianteLogo =
  | 'color'
  | 'sobre-celeste'
  | 'sobre-negro'
  | 'gris-sobre-blanco'
  | 'monograma'
  | 'monograma-sobre-celeste'
  | 'monograma-sobre-negro';

interface Archivo {
  archivo: string;
  ancho: number;
  alto: number;
  /** La versión reducida que la reemplaza cuando no cabe la palabra. */
  reducida?: VarianteLogo;
}

const ARCHIVOS: Record<VarianteLogo, Archivo> = {
  'color': { archivo: 'logo-color.svg', ancho: 369.2, alto: 185.4, reducida: 'monograma' },
  'sobre-celeste': { archivo: 'logo-sobre-celeste.svg', ancho: 197, alto: 99.3, reducida: 'monograma-sobre-celeste' },
  'sobre-negro': { archivo: 'logo-sobre-negro.svg', ancho: 197.1, alto: 99.2, reducida: 'monograma-sobre-negro' },
  'gris-sobre-blanco': { archivo: 'logo-gris-sobre-blanco.svg', ancho: 197.1, alto: 99.2 },
  'monograma': { archivo: 'monograma-color.svg', ancho: 231.8, alto: 119 },
  'monograma-sobre-celeste': { archivo: 'monograma-sobre-celeste.svg', ancho: 124.3, alto: 64 },
  'monograma-sobre-negro': { archivo: 'monograma-sobre-negro.svg', ancho: 124.2, alto: 63.8 }
};

/**
 * Debajo de este ancho «MetroTech» no se lee: el manual pide 5 cm mínimo en
 * impresión y el monograma solo para lo pequeño (lámina 7). En pantalla, a
 * 96 px de ancho (48 de alto) las mayúsculas de la palabra miden unos 18 px;
 * por debajo se usa la versión reducida automáticamente.
 */
const ANCHO_MINIMO_PALABRA = 96;

/**
 * El logo de MetroTech.
 *
 * Reglas del manual que este componente hace cumplir solo:
 * - Espacio en blanco alrededor (lámina 6): un relleno de un cuarto de su
 *   alto, que ningún otro elemento puede invadir.
 * - Tamaño mínimo (lámina 7): si la palabra no cabe, pasa al monograma.
 * - Sin efectos (lámina 9): no acepta sombra, filtro ni transformación.
 *   El archivo es una <img>, así que nadie le cambia los colores por CSS.
 *
 * Uso: `<mt-logo variante="color" [alto]="48" />`
 */
@Component({
  selector: 'mt-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.padding.px]': 'reserva() ? altoFinal() / 4 : 0'
  },
  template: `
    <img
      [src]="'img/marca/' + archivo().archivo"
      [width]="anchoFinal()"
      [height]="altoFinal()"
      [alt]="decorativo() ? '' : 'MetroTech'"
      decoding="async"
      [attr.fetchpriority]="prioritario() ? 'high' : null"
    />
  `,
  styles: `
    :host {
      display: inline-block;
      line-height: 0;
      flex-shrink: 0;
    }

    img {
      display: block;
      max-width: none;
      filter: none;
      box-shadow: none;
    }
  `
})
export class Logo {
  readonly variante = input<VarianteLogo>('color');

  /** Alto en px del logo, sin contar el espacio en blanco. */
  readonly alto = input(48);

  /** Respeta el espacio en blanco del manual. Solo se apaga si el contenedor ya lo da. */
  readonly reserva = input(true);

  /** Cuando el texto «MetroTech» ya está al lado (por ejemplo, dentro de un enlace con nombre). */
  readonly decorativo = input(false);

  /** El de la cabecera: se pide antes que el resto de imágenes. */
  readonly prioritario = input(false);

  /** La versión que de verdad se dibuja, con la regla del tamaño mínimo aplicada. */
  readonly archivo = computed(() => {
    const pedida = ARCHIVOS[this.variante()];
    const ancho = (this.alto() * pedida.ancho) / pedida.alto;
    return ancho < ANCHO_MINIMO_PALABRA && pedida.reducida ? ARCHIVOS[pedida.reducida] : pedida;
  });

  readonly altoFinal = computed(() => this.alto());
  readonly anchoFinal = computed(() => Math.round((this.alto() * this.archivo().ancho) / this.archivo().alto));
}
