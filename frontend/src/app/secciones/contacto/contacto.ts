import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CircleAlert, CircleCheck, LucideAngularModule, Send } from 'lucide-angular';

import { Contenido, enlaceWhatsapp, esDato } from '../../../../comun/contenido';
import { Aparecer } from '../../marca/aparecer';
import { Franjas } from '../../marca/franjas';
import { Icono } from '../../marca/icono';
import { TituloSeccion } from '../../marca/titulo-seccion';

type Campo = 'nombre' | 'empresa' | 'correo' | 'telefono' | 'mensaje';

/**
 * Contacto. Los mensajes van por WhatsApp: el formulario valida los datos y
 * abre WhatsApp con el mensaje ya escrito, listo para enviar. No pasa por
 * ningún servidor ni se guarda en ninguna parte.
 *
 * Al lado, los datos de contacto que estén configurados en
 * `contenido.json`. Lo que diga PENDIENTE se muestra como pendiente y no se
 * vuelve enlace.
 */
@Component({
  selector: 'mt-contacto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LucideAngularModule, Aparecer, Franjas, Icono, TituloSeccion],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto {
  readonly contacto = input.required<Contenido['contacto']>();
  readonly marca = input.required<Contenido['marca']>();

  protected readonly Send = Send;
  protected readonly CircleAlert = CircleAlert;
  protected readonly CircleCheck = CircleCheck;

  protected readonly esDato = esDato;

  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    empresa: ['', [Validators.maxLength(100)]],
    correo: ['', [Validators.required, Validators.maxLength(120), Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
    telefono: ['', [Validators.pattern(/^[\d\s+()-]{7,20}$/)]],
    mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
  });

  /** Se pone en true al intentar enviar: desde ahí se muestran los errores. */
  protected readonly intentado = signal(false);
  protected readonly enviado = signal(false);

  /** El enlace base de WhatsApp (sin el mensaje del formulario), o null si no hay número. */
  protected readonly whatsapp = computed(() =>
    enlaceWhatsapp(this.contacto().whatsapp, this.contacto().mensajeWhatsapp)
  );

  protected readonly correo = computed(() => {
    const c = this.contacto().correo;
    return esDato(c) && c.includes('@') ? c : null;
  });

  protected readonly telefono = computed(() => {
    const t = (this.contacto().telefono || '').replace(/[^\d+]/g, '');
    return t.length >= 7 ? t : null;
  });

  /** El error de un campo, en palabras, o null. Solo después de tocarlo o de intentar enviar. */
  protected error(campo: Campo): string | null {
    const c = this.formulario.controls[campo];
    if (c.valid || (!c.touched && !this.intentado())) {
      return null;
    }
    const e = c.errors ?? {};
    const textos: Record<Campo, Record<string, string>> = {
      nombre: {
        required: 'Escribe tu nombre.',
        minlength: 'El nombre es muy corto.',
        maxlength: 'El nombre es muy largo: máximo 80 caracteres.'
      },
      empresa: { maxlength: 'El nombre de la empresa es muy largo: máximo 100 caracteres.' },
      correo: {
        required: 'Escribe tu correo para poder responderte.',
        pattern: 'Revisa el correo: debe verse como nombre@empresa.com.',
        maxlength: 'El correo es muy largo.'
      },
      telefono: { pattern: 'Revisa el teléfono: solo números, espacios y el signo +.' },
      mensaje: {
        required: 'Cuéntanos en qué te podemos ayudar.',
        minlength: 'Cuéntanos un poco más: mínimo 10 caracteres.',
        maxlength: 'El mensaje es muy largo: máximo 1.000 caracteres.'
      }
    };
    const clave = Object.keys(e)[0];
    return textos[campo][clave] ?? 'Revisa este campo.';
  }

  protected enviar() {
    this.intentado.set(true);
    this.enviado.set(false);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      // El foco va al primer campo con error: el lector de pantalla lo anuncia.
      const primero = (['nombre', 'empresa', 'correo', 'telefono', 'mensaje'] as Campo[])
        .find(c => this.formulario.controls[c].invalid);
      if (primero) {
        document.getElementById(`contacto-${primero}`)?.focus();
      }
      return;
    }

    const v = this.formulario.getRawValue();
    const lineas = [
      `Hola, ${this.marca().nombre}. Les escribo desde la página web.`,
      '',
      `Nombre: ${v.nombre.trim()}`,
      v.empresa.trim() ? `Empresa: ${v.empresa.trim()}` : null,
      `Correo: ${v.correo.trim()}`,
      v.telefono.trim() ? `Teléfono: ${v.telefono.trim()}` : null,
      '',
      v.mensaje.trim()
    ].filter(l => l !== null) as string[];

    const enlace = enlaceWhatsapp(this.contacto().whatsapp, lineas.join('\n'));
    if (!enlace) {
      return;
    }
    window.open(enlace, '_blank', 'noopener');
    this.enviado.set(true);
  }
}
