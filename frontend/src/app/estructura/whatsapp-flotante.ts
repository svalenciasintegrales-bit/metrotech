import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule, MessageCircle } from 'lucide-angular';

import { enlaceWhatsapp } from '../../../comun/contenido';

/**
 * El botón de WhatsApp fijo abajo a la derecha. Solo aparece cuando hay
 * número configurado. Azul oscuro con ícono blanco (16,2:1): el celeste no
 * da contraste como fondo.
 */
@Component({
  selector: 'mt-whatsapp-flotante',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    @if (enlace(); as e) {
      <a class="flotante" [href]="e" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
        <lucide-icon [img]="MessageCircle" [size]="26" aria-hidden="true" />
      </a>
    }
  `,
  styles: `
    .flotante {
      position: fixed;
      right: var(--e-4);
      bottom: var(--e-4);
      z-index: var(--z-cabecera);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: var(--r-redondo);
      background: var(--azul-oscuro);
      color: var(--blanco);
      border: var(--linea-media) solid var(--celeste);
      box-shadow: var(--sombra-3);
      transition: transform var(--dur-rapida) var(--curva);
    }

    .flotante:hover {
      transform: translateY(-2px);
    }

    @media (min-width: 900px) {
      .flotante {
        right: var(--e-8);
        bottom: var(--e-8);
      }
    }
  `
})
export class WhatsappFlotante {
  readonly numero = input('');
  readonly mensaje = input('');

  protected readonly MessageCircle = MessageCircle;
  protected readonly enlace = computed(() => enlaceWhatsapp(this.numero(), this.mensaje()));
}
