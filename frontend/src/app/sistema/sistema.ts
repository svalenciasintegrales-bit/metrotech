import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { CircleAlert, CircleCheck, LucideAngularModule, Network, Send } from 'lucide-angular';

import { DobleLinea } from '../marca/doble-linea';
import { Ejemplo } from '../marca/ejemplo';
import { Franjas } from '../marca/franjas';
import { LineaNodos } from '../marca/linea-nodos';
import { Logo, VarianteLogo } from '../marca/logo';
import { MarcaAgua } from '../marca/marca-agua';
import { Regla } from '../marca/regla';
import { TituloSeccion } from '../marca/titulo-seccion';

/**
 * Muestrario del sistema de diseño: cada token, componente y elemento de
 * marca en las tres zonas. Sirve para revisar la fase 1 y como referencia
 * al construir la página. No está en el menú y no se indexa.
 */
@Component({
  selector: 'mt-sistema',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideAngularModule, DobleLinea, Ejemplo, Franjas, LineaNodos, Logo, MarcaAgua, Regla, TituloSeccion
  ],
  templateUrl: './sistema.html',
  styleUrl: './sistema.css'
})
export class Sistema {
  protected readonly Network = Network;
  protected readonly Send = Send;
  protected readonly CircleCheck = CircleCheck;
  protected readonly CircleAlert = CircleAlert;

  protected readonly zonas = [
    { tema: 'light', nombre: 'Zona clara', nota: 'Por defecto. Fondo blanco, como la hoja membrete.' },
    { tema: 'tint', nombre: 'Zona de tinte', nota: 'Celeste muy claro para alternar secciones.' },
    { tema: 'dark', nombre: 'Zona oscura', nota: 'Azul oscuro, como el sobre y la tarjeta.' }
  ];

  protected readonly colores = [
    { nombre: 'Azul oscuro', token: '--azul-oscuro', hex: '#0E2233', nota: 'Pantone 282 C · estructura. Texto, botones, enlaces.' },
    { nombre: 'Celeste', token: '--celeste', hex: '#158DB4', nota: 'Pantone 639 C · tecnología. Solo acentos (3,8:1 con blanco).' },
    { nombre: 'Celeste 50', token: '--celeste-50', hex: '#EEF7FA', nota: 'Fondo de zona de tinte.' },
    { nombre: 'Celeste 100', token: '--celeste-100', hex: '#D6ECF3', nota: 'Bordes en tinte, franjas.' },
    { nombre: 'Celeste 200', token: '--celeste-200', hex: '#ADD9E7', nota: 'Decoración.' },
    { nombre: 'Gris 600', token: '--gris-600', hex: '#5B6168', nota: 'Texto secundario (6,3:1).' },
    { nombre: 'Gris 400', token: '--gris-400', hex: '#83888E', nota: 'Borde de campos (3,6:1).' },
    { nombre: 'Gris 200', token: '--gris-200', hex: '#D9DCDF', nota: 'Bordes y separadores.' },
    { nombre: 'Gris 50', token: '--gris-50', hex: '#F6F7F8', nota: 'Superficie secundaria.' },
    { nombre: 'Éxito', token: '--verde-estado', hex: '#1E6B4F', nota: 'Propuesta, pendiente de aprobación.' },
    { nombre: 'Error', token: '--rojo-estado', hex: '#A3242A', nota: 'Propuesta, pendiente de aprobación.' },
    { nombre: 'Éxito en zona oscura', token: '--verde-estado-claro', hex: '#8FD9B6', nota: 'Propuesta, pendiente de aprobación.' },
    { nombre: 'Error en zona oscura', token: '--rojo-estado-claro', hex: '#F5A3A6', nota: 'Propuesta, pendiente de aprobación.' }
  ];

  protected readonly tipos = [
    { clase: 't-h1', nombre: 'H1', medida: '36 → 64 px · 600', texto: 'Tecnología que impulsa tu operación' },
    { clase: 't-h2', nombre: 'H2', medida: '30 → 44 px · 600', texto: 'Sistema que conecta todo' },
    { clase: 't-h3', nombre: 'H3', medida: '22 → 28 px · 600', texto: 'Integración, precisión y estructura' },
    { clase: 't-h4', nombre: 'H4', medida: '20 px · 600', texto: 'Título de tarjeta' },
    { clase: 't-h5', nombre: 'H5', medida: '18 px · 600', texto: 'Subtítulo de bloque' },
    { clase: 't-h6', nombre: 'H6', medida: '16 px · 600', texto: 'Título menor' },
    { clase: 't-cuerpo-l', nombre: 'Cuerpo L', medida: '18 px · 400', texto: 'Entradilla: transformamos datos en decisiones confiables.' },
    { clase: 't-cuerpo', nombre: 'Cuerpo', medida: '16 px · 400', texto: 'Texto por defecto de párrafos, descripciones y formularios.' },
    { clase: 't-pequeno', nombre: 'Pequeño', medida: '14 px · 400', texto: 'Ayudas de campo, rótulos y enlaces del pie.' },
    { clase: 't-micro', nombre: 'Micro', medida: '12 px · 500', texto: 'Notas legales y datos menores.' },
    { clase: 't-etiqueta', nombre: 'Etiqueta', medida: '12 px · 600 · espaciado', texto: 'SALAZAR ARIAS COMPANY' }
  ];

  protected readonly logos: { variante: VarianteLogo; fondo: string; nombre: string }[] = [
    { variante: 'color', fondo: 'blanco', nombre: 'A color sobre blanco (básica)' },
    { variante: 'sobre-celeste', fondo: 'celeste', nombre: 'Sobre celeste' },
    { variante: 'sobre-negro', fondo: 'negro', nombre: 'Sobre negro' },
    { variante: 'sobre-negro', fondo: 'azul', nombre: 'Sobre azul oscuro (pie)' },
    { variante: 'gris-sobre-blanco', fondo: 'blanco', nombre: 'Gris sobre blanco' }
  ];

  protected readonly monogramas: { variante: VarianteLogo; fondo: string }[] = [
    { variante: 'monograma', fondo: 'blanco' },
    { variante: 'monograma-sobre-celeste', fondo: 'celeste' },
    { variante: 'monograma-sobre-negro', fondo: 'azul' }
  ];

  protected readonly espacios = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128];

  constructor() {
    inject(Meta).updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }
}
