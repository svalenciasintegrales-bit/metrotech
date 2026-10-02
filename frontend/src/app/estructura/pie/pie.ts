import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Facebook, Instagram, Linkedin, LucideAngularModule, LucideIconData, Mail, MessageCircle } from 'lucide-angular';

import { Contenido, enlaceWhatsapp, esDato } from '../../../../comun/contenido';
import { Franjas } from '../../marca/franjas';
import { Logo } from '../../marca/logo';

const ICONOS_RED: Record<string, LucideIconData> = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook
};

/**
 * El pie, azul oscuro. El logo va en la versión sobre negro del manual (M
 * gris, T blanca), que es la que se lee sobre fondo oscuro. Las redes
 * solo aparecen si tienen dirección en `contenido.json`.
 */
@Component({
  selector: 'mt-pie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, Franjas, Logo],
  templateUrl: './pie.html',
  styleUrl: './pie.css'
})
export class Pie {
  readonly contenido = input.required<Contenido>();

  protected readonly Mail = Mail;
  protected readonly MessageCircle = MessageCircle;
  protected readonly anio = new Date().getFullYear();

  protected readonly redes = computed(() =>
    this.contenido().redes
      .filter(r => esDato(r.url))
      .map(r => ({ ...r, icono: ICONOS_RED[r.red] }))
      .filter(r => !!r.icono)
  );

  protected readonly whatsapp = computed(() => {
    const c = this.contenido().contacto;
    return enlaceWhatsapp(c.whatsapp, c.mensajeWhatsapp);
  });

  protected readonly correo = computed(() => {
    const c = this.contenido().contacto.correo;
    return esDato(c) && c.includes('@') ? c : null;
  });
}
