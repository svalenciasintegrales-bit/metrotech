import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { catchError, forkJoin, of, timeout } from 'rxjs';

import { environment } from './environments/environment';

/**
 * El contenido de la página.
 *
 * Los valores de fábrica viven en `public/contenido.json` y lo que se edite en
 * el CRM (módulo Página web) queda en la base: sus secciones reemplazan a las
 * del archivo, sin recompilar. Si el servidor no responde, la página sale con
 * el archivo. Aquí están su forma (para que el compilador avise si un
 * componente lee un campo que no existe) y la carga.
 *
 * `ejemplo: true` en una sección hace que la página muestre la marca
 * CONTENIDO DE EJEMPLO. Lo que dice PENDIENTE es un dato que la empresa no
 * ha entregado todavía.
 */

export interface Enlace {
  texto: string;
  ancla: string;
}

export interface ItemIcono {
  icono: string;
  titulo: string;
  texto?: string;
  /** Foto opcional: ruta sin medida ni extensión, se arman `-960.webp` y `-1920.webp`. */
  imagen?: string;
}

export interface Imagen {
  /** Ruta sin extensión ni ancho: el componente arma `-640.webp` y `-1200.webp`. */
  src: string;
  ancho: number;
  alto: number;
  alt: string;
}

export interface Diapositiva {
  /** Ruta sin medida ni extensión: se arman `-960.webp` y `-1920.webp`. */
  imagen: string;
  etiqueta?: string;
  titulo: string;
  /** El final del título, en celeste: como «Tech» en el logo. */
  tituloAcento?: string;
  texto: string;
}

export interface Red {
  red: string;
  nombre: string;
  url: string;
}

export interface Testimonio {
  cita: string;
  nombre: string;
  cargo?: string;
}

export interface Articulo {
  titulo: string;
  categoria: string;
  fecha: string;
  lectura: string;
  /** Ruta sin medida ni extensión: se arma `-960.webp`. */
  imagen: string;
  resumen: string;
  parrafos: string[];
}

export interface Contenido {
  marca: {
    nombre: string;
    slogan: string;
    concepto: string;
    pilares: string[];
    empresaMatriz: string;
    ciudad: string;
  };
  navegacion: Enlace[];
  /** Anuncio emergente al entrar. `activo: false` lo apaga sin borrar el texto. */
  hero: {
    /** Milisegundos entre diapositivas. */
    intervalo: number;
    accion: Enlace;
    accionSecundaria?: Enlace;
    diapositivas: Diapositiva[];
  };
  nosotros: {
    titulo: string;
    entradilla: string;
    parrafos: string[];
    pilares: ItemIcono[];
  };
  servicios: {
    ejemplo?: boolean;
    titulo: string;
    entradilla: string;
    /** Tipos de servicio (acreditados, con trazabilidad, calificaciones). */
    categorias: ItemIcono[];
    /** Magnitudes que se miden, con ejemplos de equipos en `texto`. */
    tituloMagnitudes: string;
    magnitudes: ItemIcono[];
  };
  proceso: {
    ejemplo?: boolean;
    titulo: string;
    lema: string;
    entradilla: string;
    /** Foto de fondo, difuminada: ruta sin medida ni extensión. */
    imagen?: string;
    pasos: { icono?: string; titulo: string; texto: string }[];
  };
  valores: {
    titulo: string;
    entradilla: string;
    central: ItemIcono;
    items: ItemIcono[];
  };
  testimonios: {
    ejemplo?: boolean;
    titulo: string;
    entradilla?: string;
    testimonios: Testimonio[];
  };
  blog: {
    ejemplo?: boolean;
    titulo: string;
    entradilla?: string;
    articulos: Articulo[];
  };
  identidad: {
    visible: boolean;
    titulo: string;
    texto: string;
    imagenes: Imagen[];
  };
  contacto: {
    ejemplo?: boolean;
    titulo: string;
    entradilla: string;
    /** Número completo con indicativo, sin espacios ni signos: 573001234567. Vacío = sin WhatsApp. */
    whatsapp: string;
    whatsappVisible: string;
    mensajeWhatsapp: string;
    correo: string;
    correoVisible: string;
    telefono: string;
    telefonoVisible: string;
    direccion: string;
    ciudad: string;
    horario: string;
    mapaUrl: string;
  };
  llamado: {
    titulo: string;
    tituloAcento?: string;
    accion: Enlace;
  };
  redes: Red[];
  pie: {
    texto: string;
    mencion: string;
  };
  seo: {
    titulo: string;
    descripcion: string;
    url: string;
    imagen: string;
  };
}

/** El contenido cargado, o null mientras llega (o si no llegó). */
export const CONTENIDO = signal<Contenido | null>(null);

/** true si el archivo no se pudo leer: la página lo dice en vez de quedar en blanco. */
export const CONTENIDO_FALLO = signal(false);

/**
 * Trae `contenido.json` antes de dibujar la primera pantalla. La ruta es
 * relativa: el navegador la resuelve contra el `<base href>`, así sirve igual
 * en la raíz del dominio que en una subcarpeta.
 *
 * Nunca rechaza: si el archivo falla, la página abre igual y avisa.
 */
export function cargarContenido(http: HttpClient): Promise<void> {
  const archivo = http.get<Contenido>('contenido.json').pipe(
    catchError(e => {
      console.error('[MetroTech] No se pudo leer contenido.json', e);
      return of(null);
    })
  );
  const base = http
    .get<{ contenido: Partial<Contenido> | null }>(`${environment.apiUrl}/sitio.php?control=contenido`)
    .pipe(
      timeout(2500),
      catchError(() => of({ contenido: null }))
    );
  return new Promise(listo => {
    forkJoin([archivo, base]).subscribe(([c, b]) => {
      if (c || b.contenido) {
        CONTENIDO.set({ ...c, ...b.contenido } as Contenido);
      } else {
        CONTENIDO_FALLO.set(true);
      }
      listo();
    });
  });
}

/**
 * Un dato que dice PENDIENTE o está vacío no es un dato: el enlace que lo
 * use no se dibuja.
 */
export function esDato(valor: string | undefined | null): valor is string {
  return !!valor && !valor.startsWith('PENDIENTE');
}

/**
 * El enlace de WhatsApp con el mensaje ya escrito. El número va completo,
 * con indicativo y sin signos (así lo pide wa.me); si trae espacios o un «+»
 * se limpian. Sin número no hay enlace: null.
 */
export function enlaceWhatsapp(numero: string, mensaje: string): string | null {
  const limpio = (numero || '').replace(/\D/g, '');
  if (limpio.length < 10) {
    return null;
  }
  return `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`;
}
