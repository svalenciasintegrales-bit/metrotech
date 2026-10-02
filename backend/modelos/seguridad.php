<?php

/**
 * Quién puede llamar al backend, y qué se le permite.
 *
 * MetroTech es una página informativa: no hay panel, ni usuarios, ni
 * sesión. Todo lo que el backend expone es público (el formulario de
 * contacto) y se protege con validación en el servidor y límite de
 * peticiones, no con login.
 *
 * Se conserva el esquema de niveles de Tu Móvil para que la arquitectura sea
 * la misma: cada acción declara su nivel, y lo que no se declara queda
 * cerrado. Hoy el único nivel que existe es 'publico'; cualquier otro se
 * niega, así una acción nueva olvidada nunca queda abierta por descuido.
 */

/** Errores que el enrutador sabe convertir en una respuesta HTTP decente. */
class NoAutorizado   extends RuntimeException {}
class DatosInvalidos extends RuntimeException {}

/** De dónde aceptamos llamadas desde el navegador. */
function origenesPermitidos()
{
    // La lista es exacta a propósito, sin comodines.
    // PENDIENTE: agregar el dominio real cuando exista (https://…).
    return [
        'http://localhost:4220',   // la página (ng serve)
        'http://localhost',        // el build servido por Apache
        'http://127.0.0.1:4220',
        'http://127.0.0.1'
    ];
}

/**
 * Lanza si el nivel pedido no se cumple. Un nivel que no reconoce cae al
 * final y se niega: cerrada por defecto, nunca abierta por descuido.
 */
function exigir($nivel)
{
    if ($nivel === 'publico') {
        return;
    }
    throw new NoAutorizado('Esta acción no está disponible.');
}
