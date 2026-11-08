import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Facebook, Instagram, Linkedin, LucideAngularModule, LucideIconData } from 'lucide-angular';

import { Contenido, enlaceWhatsapp, esDato } from '../../../../comun/contenido';
import { Franjas } from '../../marca/franjas';
import { Icono } from '../../marca/icono';
import { FondoVivo } from '../../marca/fondo-vivo';
import { Logo } from '../../marca/logo';

const ICONOS_RED: Record<string, LucideIconData> = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook
};

/**
 * El pie, azul oscuro. El logo va en la versión sobre negro del manual (M
 * gris, T blanca), que es la que se lee sobre fondo oscuro. Las redes se
 * ven siempre, como en la cabecera: con dirección en `contenido.json` abren
 * el perfil; sin ella, llevan a Contacto.
 */
@Component({
  selector: 'mt-pie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, FondoVivo, Franjas, Icono, Logo],
  templateUrl: './pie.html',
  styleUrl: './pie.css'
})
export class Pie {
  readonly contenido = input.required<Contenido>();

  protected readonly anio = new Date().getFullYear();

  protected readonly redes = computed(() =>
    this.contenido().redes
      .filter(r => !!ICONOS_RED[r.red])
      .map(r => ({
        ...r,
        icono: ICONOS_RED[r.red],
        externo: esDato(r.url),
        enlace: esDato(r.url) ? r.url : '#contacto'
      }))
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
