import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Los íconos propios de MetroTech.
 *
 * Dibujados en el lenguaje del logo, no tomados de un paquete genérico:
 * trazo geométrico de esquina viva (como la M y la T), y los dos remates de
 * la línea del monograma —el cuadro pequeño y el rombo— como acento en
 * celeste. Cuadrícula de 32 × 32 y trazo de 1,75.
 *
 * El trazo toma el color del texto (`currentColor`); el acento, la variable
 * `--icono-acento` (celeste por defecto). Para usarlos en contenido.json,
 * el nombre va en `icono`; los válidos están en `NOMBRES_ICONO`.
 *
 * Uso: `<mt-icono nombre="integracion" [tamano]="32" />`
 */
export const NOMBRES_ICONO = [
  // pilares
  'integracion', 'precision', 'estructura',
  // soluciones
  'red', 'analitica', 'datos', 'servidor', 'seguridad', 'rendimiento',
  // valores
  'familia', 'perseverancia', 'responsabilidad', 'lealtad', 'integralidad', 'educacion', 'empatia',
  // contacto
  'whatsapp', 'correo', 'telefono', 'direccion', 'horario'
] as const;

export type NombreIcono = (typeof NOMBRES_ICONO)[number];

@Component({
  selector: 'mt-icono',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg
      viewBox="0 0 32 32"
      [attr.width]="tamano()"
      [attr.height]="tamano()"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="square"
      stroke-linejoin="miter"
      focusable="false"
    >
      @switch (nombre()) {
        @case ('integracion') {
          <!-- Dos fuentes que se unen y siguen como una sola hacia el rombo. -->
          <path d="M8 8H16V24H8M16 16H22" />
          <rect class="n" x="5" y="5" width="6" height="6" />
          <rect class="n" x="5" y="21" width="6" height="6" />
          <path class="a" d="M26 11.5L30.5 16L26 20.5L21.5 16Z" />
        }
        @case ('precision') {
          <!-- La regla de la M con una cota medida encima. -->
          <path d="M3 18H29V27H3Z" />
          <path d="M7 18V23M11 18V21M15 18V23M19 18V21M23 18V23M27 18V21" />
          <path d="M5 10H27M5 7V13M27 7V13" />
          <path class="a" d="M16 6.5L19.5 10L16 13.5L12.5 10Z" />
        }
        @case ('estructura') {
          <!-- Capas apiladas: la de arriba, celeste. -->
          <path class="a" d="M16 3L28 8.5L16 14L4 8.5Z" />
          <path d="M4 15L16 20.5L28 15" />
          <path d="M4 21.5L16 27L28 21.5" />
        }
        @case ('red') {
          <path d="M8 8L13 13M24 8L19 13M8 24L13 19M24 24L19 19" />
          <rect class="n" x="4" y="4" width="6" height="6" />
          <rect class="n" x="22" y="4" width="6" height="6" />
          <rect class="n" x="4" y="22" width="6" height="6" />
          <rect class="n" x="22" y="22" width="6" height="6" />
          <path class="a" d="M16 11L21 16L16 21L11 16Z" />
        }
        @case ('analitica') {
          <!-- Ejes con marcas de regla y una línea que sube hasta el rombo. -->
          <path d="M5 4V27H29" />
          <path d="M5 9H8M5 15H8M5 21H8" />
          <path d="M10 23L15 16L19 19L24 11" />
          <rect class="n" x="13.5" y="14.5" width="3" height="3" />
          <rect class="n" x="17.5" y="17.5" width="3" height="3" />
          <path class="a" d="M25 7L29 11L25 15L21 11Z" />
        }
        @case ('datos') {
          <path d="M5 4H27V11H5ZM5 13H27V20H5ZM5 22H27V29H5Z" />
          <path d="M9 7.5H16M9 16.5H16M9 25.5H16" />
          <rect class="a" x="21" y="6" width="3" height="3" />
          <rect class="a" x="21" y="15" width="3" height="3" />
          <rect class="a" x="21" y="24" width="3" height="3" />
        }
        @case ('servidor') {
          <path d="M4 4H28V14H4ZM4 18H28V28H4Z" />
          <path d="M14 9H24M14 23H24" />
          <rect class="a" x="7" y="7.5" width="3.5" height="3.5" />
          <rect class="a" x="7" y="21.5" width="3.5" height="3.5" />
        }
        @case ('seguridad') {
          <path d="M16 3L27 7V15C27 21 22 26 16 29C10 26 5 21 5 15V7Z" />
          <path d="M10 16L14 20L19 14" />
          <path class="a" d="M21.5 9L25 12.5L21.5 16L18 12.5Z" />
        }
        @case ('rendimiento') {
          <!-- Un instrumento: arco con marcas y aguja que termina en rombo. -->
          <path d="M5 22A11 11 0 0 1 27 22" />
          <path d="M5 22H8M8.2 14.2L10.3 16.3M16 11V14M23.8 14.2L21.7 16.3M27 22H24" />
          <path d="M16 22L21 16.5" />
          <path d="M3 27H29" />
          <rect class="n" x="14" y="20" width="4" height="4" />
          <path class="a" d="M22.5 12.5L25.5 15.5L22.5 18.5L19.5 15.5Z" />
        }
        @case ('familia') {
          <!-- Una casa y adentro tres nodos unidos. -->
          <path d="M3 15L16 4L29 15" />
          <path d="M7 12V28H25V12" />
          <path d="M11.5 23L16 18.5L20.5 23" />
          <rect class="n" x="9.5" y="21.5" width="4" height="4" />
          <rect class="n" x="18.5" y="21.5" width="4" height="4" />
          <path class="a" d="M16 14.5L19 17.5L16 20.5L13 17.5Z" />
        }
        @case ('perseverancia') {
          <!-- La montaña y el banderín celeste en la cima. -->
          <path d="M2 28L12 12L17 19.5L21 14L30 28Z" />
          <path d="M12 12V4" />
          <path class="a" d="M12 4L19 6.5L12 9Z" />
        }
        @case ('responsabilidad') {
          <path d="M7 6H25V29H7Z" />
          <path d="M12 3H20V8H12Z" />
          <path d="M16 13.5H21.5M16 18.5H21.5M16 23.5H21.5" />
          <rect class="a" x="10" y="12" width="3.5" height="3.5" />
          <rect class="a" x="10" y="17" width="3.5" height="3.5" />
          <rect class="a" x="10" y="22" width="3.5" height="3.5" />
        }
        @case ('lealtad') {
          <!-- Dos rombos entrelazados: un vínculo que no se suelta. -->
          <path d="M11 7L20 16L11 25L2 16Z" />
          <path class="at" d="M21 7L30 16L21 25L12 16Z" />
          <rect class="n" x="14.5" y="14.5" width="3" height="3" />
        }
        @case ('integralidad') {
          <!-- Las partes de una solución completa. -->
          <path d="M4 4H14V14H4ZM18 4H28V14H18ZM4 18H14V28H4Z" />
          <rect class="a" x="18" y="18" width="10" height="10" />
        }
        @case ('educacion') {
          <path d="M16 5L29 11L16 17L3 11Z" />
          <path d="M8 13.5V21C11 24 21 24 24 21V13.5" />
          <path d="M29 11V19" />
          <path class="a" d="M29 18L31.5 20.5L29 23L26.5 20.5Z" />
        }
        @case ('empatia') {
          <!-- Un corazón trazado con rectas, con el rombo al centro. -->
          <path d="M16 28L4 16V10L9.5 4.5L16 10L22.5 4.5L28 10V16Z" />
          <path class="a" d="M16 13L19.5 16.5L16 20L12.5 16.5Z" />
        }
        @case ('whatsapp') {
          <path d="M4 5H28V22H14L8 28V22H4Z" />
          <rect class="a" x="8.5" y="12" width="3" height="3" />
          <rect class="a" x="14.5" y="12" width="3" height="3" />
          <rect class="a" x="20.5" y="12" width="3" height="3" />
        }
        @case ('correo') {
          <path d="M3 7H29V26H3Z" />
          <path d="M3 7L16 17L29 7" />
          <path class="a" d="M16 14L19 17L16 20L13 17Z" />
        }
        @case ('telefono') {
          <!-- El celular y las barras de señal subiendo, como marcas de regla. -->
          <path d="M5 3H18V29H5Z" />
          <path d="M9.5 25H13.5" />
          <rect class="a" x="21" y="19" width="2.5" height="6" />
          <rect class="a" x="25" y="14" width="2.5" height="11" />
          <rect class="a" x="29" y="9" width="2.5" height="16" />
        }
        @case ('direccion') {
          <path d="M16 29.5C16 29.5 6.5 20 6.5 12.5A9.5 9.5 0 0 1 25.5 12.5C25.5 20 16 29.5 16 29.5Z" />
          <path class="a" d="M16 8.5L20 12.5L16 16.5L12 12.5Z" />
        }
        @case ('horario') {
          <circle cx="16" cy="16" r="12.5" />
          <path d="M16 3.5V7M28.5 16H25M16 28.5V25M3.5 16H7" />
          <path d="M16 16V9.5M16 16H21" />
          <rect class="n" x="14.5" y="14.5" width="3" height="3" />
          <path class="a" d="M22.5 13.5L25 16L22.5 18.5L20 16Z" />
        }
        @default {
          <path class="a" d="M16 8L24 16L16 24L8 16Z" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
      line-height: 0;
    }

    svg {
      display: block;
      overflow: visible;
    }

    .n { fill: currentColor; stroke: none; }
    .a { fill: var(--icono-acento, var(--celeste)); stroke: none; }
    .at { stroke: var(--icono-acento, var(--celeste)); }
  `
})
export class Icono {
  readonly nombre = input.required<string>();
  readonly tamano = input(32);
}
