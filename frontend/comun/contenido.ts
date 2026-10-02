import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

/**
 * El contenido de la página.
 *
 * Todo el texto vive en `public/contenido.json`, separado de los
 * componentes: se edita ese archivo, se sube al servidor y la página cambia
 * sin recompilar. Aquí solo están su forma (para que el compilador avise si
 * un componente lee un campo que no existe) y la carga.
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
}

export interface Imagen {
  /** Ruta sin extensión ni ancho: el componente arma `-640.webp` y `-1200.webp`. */
  src: string;
  ancho: number;
  alto: number;
  alt: string;
}

export interface Red {
  red: string;
  nombre: string;
  url: string;
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
  hero: {
    titulo: string;
    texto: string;
    accion: Enlace;
    accionSecundaria?: Enlace;
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
    items: ItemIcono[];
  };
  proceso: {
    ejemplo?: boolean;
    titulo: string;
    lema: string;
    entradilla: string;
    pasos: { titulo: string; texto: string }[];
  };
  valores: {
    titulo: string;
    entradilla: string;
    central: ItemIcono;
    items: ItemIcono[];
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
    correo: string;
    whatsapp: string;
    whatsappVisible: string;
    telefono: string;
    telefonoVisible: string;
    direccion: string;
    ciudad: string;
    horario: string;
    mapaUrl: string;
    mensajeWhatsapp: string;
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
  return new Promise(listo => {
    http.get<Contenido>('contenido.json').subscribe({
      next: c => {
        CONTENIDO.set(c);
        listo();
      },
      error: e => {
        console.error('[MetroTech] No se pudo leer contenido.json', e);
        CONTENIDO_FALLO.set(true);
        listo();
      }
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
