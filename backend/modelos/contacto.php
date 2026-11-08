<?php

require_once(__DIR__ . '/base.php');

/**
 * Los mensajes del formulario de contacto. Quedan en `mensaje_contacto`, donde
 * el CRM los atiende; la persona igual sigue por WhatsApp con su mensaje escrito.
 */
class Contacto extends Base
{
    public function enviar($d)
    {
        $nombre   = $this->campo($d, 'nombre', 120);
        $empresa  = $this->campo($d, 'empresa', 100);
        $correo   = mb_strtolower($this->campo($d, 'correo', 120));
        $telefono = preg_replace('/\D+/', '', $this->campo($d, 'telefono', 30));
        $mensaje  = $this->campo($d, 'mensaje', 3000);

        if (mb_strlen($nombre) < 2) {
            throw new DatosInvalidos('Escribe tu nombre.');
        }
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            throw new DatosInvalidos('Revisa tu correo electrónico.');
        }
        if (mb_strlen($mensaje) < 10) {
            throw new DatosInvalidos('Cuéntanos un poco más (mínimo 10 caracteres).');
        }
        if ($telefono !== '' && (strlen($telefono) < 7 || strlen($telefono) > 15)) {
            throw new DatosInvalidos('Revisa el teléfono.');
        }
        if ($empresa !== '') {
            $mensaje = "Empresa: {$empresa}\n\n{$mensaje}";
        }

        $this->ejecutar(
            "INSERT INTO mensaje_contacto (motivo, segmento, nombre, correo, telefono, mensaje, ip)
             VALUES ('contacto', ?, ?, ?, ?, ?, ?)",
            'ssssss',
            [$empresa !== '' ? 'empresa' : null, $nombre, $correo, $telefono ?: null, $mensaje, $_SERVER['REMOTE_ADDR'] ?? null],
            'no se pudo guardar el mensaje'
        );
        return ['resultado' => 'ok'];
    }

    private function campo($d, $nombre, $max)
    {
        $v = is_object($d) && isset($d->$nombre) && is_scalar($d->$nombre) ? trim((string) $d->$nombre) : '';
        return mb_substr($v, 0, $max);
    }
}
