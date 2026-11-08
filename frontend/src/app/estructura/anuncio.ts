import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

import { environment } from '../../../comun/environments/environment';

interface Anuncio {
  id_anuncio: number;
  titulo: string;
  texto: string | null;
  imagen: string | null;
  texto_enlace: string | null;
  enlace: string | null;
  frecuencia: 'sesion' | 'dia' | 'siempre';
  version: number;
}

/**
 * El anuncio que aparece al entrar a la página. Se crea, se programa y se
 * apaga en el CRM. Si hay varios vigentes sale el primero que la persona no
 * haya visto; cada uno respeta su frecuencia, y si se edita vuelve a salir.
 */
@Component({
  selector: 'mt-anuncio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  host: { '(document:keydown.escape)': 'cerrar()' },
  template: `
    @if (actual(); as a) {
      <div class="fondo" (click)="cerrar()"></div>
      <div class="aviso" data-theme="dark" role="dialog" aria-modal="true" aria-labelledby="anuncio-titulo">
        <button #cerrarBoton type="button" class="cerrar" (click)="cerrar()" aria-label="Cerrar el anuncio">
          <lucide-icon [img]="X" [size]="22" aria-hidden="true" />
        </button>
        @if (a.imagen) {
          <img class="foto" [src]="a.imagen" alt="" />
        }
        <div class="cuerpo">
          <p id="anuncio-titulo" class="titulo">{{ a.titulo }}</p>
          @if (a.texto) {
            <p class="t-cuerpo texto">{{ a.texto }}</p>
          }
          @if (a.enlace && a.texto_enlace) {
            <a
              class="boton boton--primario"
              [href]="a.enlace"
              [attr.target]="esExterno(a.enlace) ? '_blank' : null"
              [attr.rel]="esExterno(a.enlace) ? 'noopener' : null"
              (click)="cerrar()"
              >{{ a.texto_enlace }}</a
            >
          }
        </div>
      </div>
    }
  `,
  styles: `
    .fondo {
      position: fixed;
      inset: 0;
      z-index: var(--z-menu);
      background: rgba(14, 34, 51, 0.6);
      animation: aparecer var(--dur-media) var(--curva);
    }

    .aviso {
      position: fixed;
      left: 50%;
      top: 50%;
      z-index: calc(var(--z-menu) + 1);
      width: min(500px, calc(100% - 2 * var(--e-4)));
      max-height: calc(100dvh - 2 * var(--e-4));
      overflow-y: auto;
      background: var(--fondo);
      color: var(--texto);
      border: var(--linea-media) solid var(--celeste);
      border-radius: var(--r-3);
      box-shadow: var(--sombra-3);
      transform: translate(-50%, -50%);
      animation: entrar var(--dur-lenta) var(--curva);
    }

    .foto {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }

    .cuerpo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--e-4);
      padding: var(--e-8);
      text-align: center;
    }

    .titulo {
      margin: 0;
      padding-inline: var(--e-6);
      font-size: var(--t-h4);
      font-weight: var(--peso-semibold);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--acento);
    }

    .texto {
      margin: 0;
      color: var(--texto-2);
      white-space: pre-line;
    }

    .cerrar {
      position: absolute;
      top: var(--e-3);
      right: var(--e-3);
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--alto-control);
      height: var(--alto-control);
      padding: 0;
      color: var(--texto);
      background: var(--fondo);
      border: var(--linea-fina) solid var(--borde-control);
      border-radius: var(--r-redondo);
      cursor: pointer;
    }

    .cerrar:hover { border-color: var(--texto); }

    @keyframes aparecer { from { opacity: 0; } }
    @keyframes entrar { from { opacity: 0; transform: translate(-50%, -46%); } }

    @media (prefers-reduced-motion: reduce) {
      .fondo, .aviso { animation: none; }
    }
  `
})
export class AnuncioEmergente {
  private readonly http = inject(HttpClient);

  protected readonly X = X;
  protected readonly actual = signal<Anuncio | null>(null);
  private readonly cerrarBoton = viewChild<ElementRef<HTMLButtonElement>>('cerrarBoton');

  constructor() {
    afterNextRender(() => {
      // Si el servidor no responde, la página sigue sin anuncio.
      this.http.get<{ anuncios: Anuncio[] }>(`${environment.apiUrl}/sitio.php?control=anuncios`).subscribe({
        next: r => {
          const a = r.anuncios.find(x => !this.yaVisto(x));
          if (!a) return;
          this.actual.set(a);
          setTimeout(() => this.cerrarBoton()?.nativeElement.focus(), 0);
        },
        error: () => undefined
      });
    });
  }

  protected esExterno(enlace: string): boolean {
    return /^https?:/i.test(enlace);
  }

  cerrar(): void {
    const a = this.actual();
    if (!a) return;
    this.actual.set(null);
    this.guardar(a);
  }

  private clave(a: Anuncio): string {
    return `mt-anuncio-${a.id_anuncio}-${a.version}`;
  }

  private yaVisto(a: Anuncio): boolean {
    try {
      if (a.frecuencia === 'sesion') return sessionStorage.getItem(this.clave(a)) === '1';
      if (a.frecuencia === 'dia') return localStorage.getItem(this.clave(a)) === this.hoy();
    } catch {
      /* sin almacenamiento: se muestra igual */
    }
    return false;
  }

  private guardar(a: Anuncio): void {
    try {
      if (a.frecuencia === 'sesion') sessionStorage.setItem(this.clave(a), '1');
      if (a.frecuencia === 'dia') localStorage.setItem(this.clave(a), this.hoy());
    } catch {
      /* sin almacenamiento: solo se cierra */
    }
  }

  private hoy(): string {
    return new Date().toDateString();
  }
}
