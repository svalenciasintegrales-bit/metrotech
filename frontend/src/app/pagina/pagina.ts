import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { CONTENIDO, CONTENIDO_FALLO } from '../../../comun/contenido';
import { Cabecera } from '../estructura/cabecera/cabecera';
import { Pie } from '../estructura/pie/pie';
import { WhatsappFlotante } from '../estructura/whatsapp-flotante';
import { Contacto } from '../secciones/contacto/contacto';
import { Hero } from '../secciones/hero/hero';
import { Identidad } from '../secciones/identidad/identidad';
import { Nosotros } from '../secciones/nosotros/nosotros';
import { Proceso } from '../secciones/proceso/proceso';
import { Servicios } from '../secciones/servicios/servicios';
import { Valores } from '../secciones/valores/valores';

/**
 * La página plana: todas las secciones en orden, con navegación por anclas.
 * Cada sección recibe su parte de `contenido.json`.
 */
@Component({
  selector: 'mt-pagina',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Cabecera, Pie, WhatsappFlotante, Contacto, Hero, Identidad, Nosotros, Proceso, Servicios, Valores],
  template: `
    <a class="saltar" href="#contenido">Saltar al contenido</a>

    @if (contenido(); as c) {
      <mt-cabecera [navegacion]="c.navegacion" [accion]="c.hero.accion" />

      <main id="contenido" tabindex="-1">
        <mt-hero [hero]="c.hero" [marca]="c.marca" />
        <mt-nosotros [nosotros]="c.nosotros" [marca]="c.marca" />
        <mt-servicios [servicios]="c.servicios" />
        <mt-proceso [proceso]="c.proceso" />
        <mt-valores [valores]="c.valores" />
        @if (c.identidad.visible && c.identidad.imagenes.length) {
          <mt-identidad [identidad]="c.identidad" />
        }
        <mt-contacto [contacto]="c.contacto" [marca]="c.marca" />
      </main>

      <mt-pie [contenido]="c" />
      <mt-whatsapp-flotante [numero]="c.contacto.whatsapp" [mensaje]="c.contacto.mensajeWhatsapp" />
    } @else if (fallo()) {
      <main id="contenido" class="contenedor fallo">
        <h1 class="t-h3">No pudimos cargar la página</h1>
        <p class="t-secundario">Revisa tu conexión y vuelve a intentarlo en un momento.</p>
      </main>
    }
  `,
  styles: `
    main { flex: 1; }
    main:focus { outline: none; }
    .fallo {
      display: flex;
      flex-direction: column;
      gap: var(--e-4);
      padding-block: var(--e-24);
    }
  `
})
export class Pagina {
  protected readonly contenido = CONTENIDO;
  protected readonly fallo = CONTENIDO_FALLO;

  private readonly titulo = inject(Title);
  private readonly meta = inject(Meta);

  constructor() {
    // El router hace el salto a las anclas con su propio scrollTo, que no
    // lee `scroll-padding-top`: sin este margen, la sección queda tapada por
    // la cabecera fija.
    inject(ViewportScroller).setOffset(() => [
      0,
      (document.querySelector<HTMLElement>('.cabecera')?.offsetHeight ?? 0) + 16
    ]);

    // El título y la descripción salen del contenido. Las etiquetas Open
    // Graph van fijas en index.html: WhatsApp y las redes no ejecutan
    // JavaScript al armar la vista previa.
    effect(() => {
      const c = this.contenido();
      if (c) {
        this.titulo.setTitle(c.seo.titulo);
        this.meta.updateTag({ name: 'description', content: c.seo.descripcion });
      }
    });
  }
}
