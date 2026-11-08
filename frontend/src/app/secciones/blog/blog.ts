import { ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

import { Articulo, Contenido } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { TituloSeccion } from '../../marca/titulo-seccion';

/**
 * El blog, armado como una revista: el artículo más reciente en grande, con su
 * foto de fondo, y los demás en una columna de filas. La página es plana, así
 * que cada artículo se lee en una ventana sin salir de ella.
 */
@Component({
  selector: 'mt-blog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Aparecer, LucideAngularModule, TituloSeccion],
  template: `
    @if (primero(); as p) {
      <section id="blog" class="seccion" data-theme="light" aria-labelledby="blog-titulo">
        <div class="contenedor">
          <mt-titulo-seccion
            idTitulo="blog-titulo"
            [titulo]="blog().titulo"
            [entradilla]="blog().entradilla"
            [ejemplo]="!!blog().ejemplo"
          />

          <div class="revista" [class.solo]="!resto().length">
            <article class="portada" mtAparecer data-theme="dark">
              <img [src]="p.imagen + '-960.webp'" alt="" loading="lazy" decoding="async" width="960" height="540" />
              <span class="velo" aria-hidden="true"></span>
              <div class="portada__texto">
                <p class="t-etiqueta categoria">{{ p.categoria }}</p>
                <h3 class="t-h3">
                  <button type="button" class="abrir" (click)="abrir(p)">{{ p.titulo }}</button>
                </h3>
                <p class="t-cuerpo resumen">{{ p.resumen }}</p>
                <p class="datos">{{ p.fecha }} · {{ p.lectura }}</p>
              </div>
            </article>

            @if (resto().length) {
              <ul class="lista" role="list">
                @for (a of resto(); track a.titulo) {
                  <li class="entrada" mtAparecer [retraso]="$index * 100">
                    <img [src]="a.imagen + '-960.webp'" alt="" loading="lazy" decoding="async" width="160" height="120" />
                    <div class="entrada__texto">
                      <p class="t-etiqueta categoria">{{ a.categoria }}</p>
                      <h3 class="t-h5">
                        <button type="button" class="abrir" (click)="abrir(a)">{{ a.titulo }}</button>
                      </h3>
                      <p class="datos">{{ a.fecha }} · {{ a.lectura }}</p>
                    </div>
                  </li>
                }
              </ul>
            }
          </div>
        </div>

        <!-- El clic en el fondo es un atajo de ratón: con teclado se cierra con Escape o con el botón. -->
        <dialog #lector class="lector" aria-labelledby="lector-titulo" (click)="clicFuera($event)" (close)="abierto.set(null)">
          @if (abierto(); as a) {
            <button type="button" class="cerrar" (click)="cerrar()" aria-label="Cerrar el artículo">
              <lucide-icon [img]="X" [size]="20" aria-hidden="true" />
            </button>
            <img class="lector__foto" [src]="a.imagen + '-960.webp'" alt="" />
            <div class="lector__texto">
              <p class="t-etiqueta categoria">{{ a.categoria }}</p>
              <h3 id="lector-titulo" class="t-h3">{{ a.titulo }}</h3>
              <p class="datos">{{ a.fecha }} · {{ a.lectura }}</p>
              @for (parrafo of a.parrafos; track $index) {
                <p class="t-cuerpo">{{ parrafo }}</p>
              }
            </div>
          }
        </dialog>
      </section>
    }
  `,
  styles: `
    .revista {
      display: grid;
      gap: var(--e-6);
    }

    @media (min-width: 900px) {
      .revista:not(.solo) {
        grid-template-columns: 7fr 5fr;
        gap: var(--e-10);
      }
    }

    .categoria {
      margin: 0;
      color: var(--acento);
    }

    .datos {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--texto-2);
    }

    /* El botón del título cubre toda la pieza: se puede tocar en cualquier parte. */
    .abrir {
      padding: 0;
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .abrir::after {
      content: '';
      position: absolute;
      inset: 0;
    }

    .abrir:focus-visible {
      outline: none;
    }

    .abrir:focus-visible::after {
      outline: 2px solid var(--celeste);
      outline-offset: -2px;
    }

    .portada {
      position: relative;
      display: flex;
      min-height: clamp(320px, 42vw, 480px);
      align-items: flex-end;
      overflow: hidden;
      border-radius: var(--r-3);
      background: var(--fondo);
      color: var(--texto);
    }

    .portada img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--dur-lenta) var(--curva);
    }

    .portada:hover img {
      transform: scale(1.04);
    }

    .velo {
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(14, 34, 51, 0.92), rgba(14, 34, 51, 0.15) 70%);
    }

    .portada__texto {
      position: relative;
      display: grid;
      gap: var(--e-3);
      padding: clamp(var(--e-6), 3vw, var(--e-10));
    }

    .portada__texto h3,
    .resumen {
      margin: 0;
    }

    .resumen {
      color: var(--texto-2);
    }

    .lista {
      display: grid;
      align-content: start;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .entrada {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--e-4);
      padding: var(--e-4) 0;
      border-bottom: var(--linea-fina) solid var(--borde-control);
    }

    .entrada:first-child {
      padding-top: 0;
    }

    .entrada img {
      width: clamp(88px, 12vw, 128px);
      height: clamp(72px, 9vw, 96px);
      flex: none;
      border-radius: var(--r-2);
      object-fit: cover;
    }

    .entrada__texto {
      display: grid;
      min-width: 0;
      gap: var(--e-1);
    }

    .entrada__texto h3 {
      margin: 0;
    }

    .entrada:hover h3 {
      color: var(--acento);
    }

    .lector {
      width: min(720px, calc(100% - 2 * var(--e-4)));
      max-height: calc(100dvh - 2 * var(--e-4));
      margin: auto;
      padding: 0;
      overflow-y: auto;
      border: 0;
      border-radius: var(--r-3);
      background: var(--fondo);
      color: var(--texto);
      box-shadow: var(--sombra-3);
    }

    .lector::backdrop {
      background: rgba(14, 34, 51, 0.7);
    }

    .lector__foto {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 7;
      object-fit: cover;
    }

    .lector__texto {
      display: grid;
      gap: var(--e-4);
      padding: clamp(var(--e-5), 4vw, var(--e-10));
    }

    .lector__texto h3,
    .lector__texto p {
      margin: 0;
    }

    .cerrar {
      position: sticky;
      top: var(--e-3);
      z-index: 1;
      display: flex;
      width: var(--alto-control);
      height: var(--alto-control);
      align-items: center;
      justify-content: center;
      margin: var(--e-3) var(--e-3) calc(-1 * var(--alto-control) - var(--e-3)) auto;
      padding: 0;
      border: 0;
      border-radius: var(--r-redondo);
      background: var(--azul-oscuro);
      color: #fff;
      cursor: pointer;
    }
  `
})
export class Blog {
  readonly blog = input.required<Contenido['blog']>();

  protected readonly X = X;
  protected readonly primero = computed(() => this.blog().articulos[0] ?? null);
  protected readonly resto = computed(() => this.blog().articulos.slice(1));
  protected readonly abierto = signal<Articulo | null>(null);
  private readonly lector = viewChild<ElementRef<HTMLDialogElement>>('lector');

  protected abrir(a: Articulo): void {
    this.abierto.set(a);
    this.lector()?.nativeElement.showModal();
  }

  protected cerrar(): void {
    this.lector()?.nativeElement.close();
  }

  /** Clic en el fondo oscuro: lo único que tiene al <dialog> como destino. */
  protected clicFuera(e: MouseEvent): void {
    if (e.target === this.lector()?.nativeElement) this.cerrar();
  }
}
