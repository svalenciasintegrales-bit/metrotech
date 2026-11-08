<?php

require_once(__DIR__ . '/base.php');

/**
 * Lo que la página lee de lo que se administra en el CRM: su contenido y sus
 * anuncios vigentes. Solo lectura; el CRM escribe directo en esta base.
 */
class Sitio extends Base
{
    /** El documento de la página, o null si nunca se ha guardado (usa su contenido.json). */
    public function contenido()
    {
        $f = $this->fila("SELECT datos FROM sitio_contenido WHERE clave = 'principal'");
        return ['resultado' => 'ok', 'contenido' => $f ? json_decode($f['datos']) : null];
    }

    /** Los anuncios prendidos y dentro de sus fechas. `version` cambia si se editan: vuelven a salir. */
    public function anuncios()
    {
        $filas = $this->filas(
            "SELECT id_anuncio, titulo, texto, imagen, texto_enlace, enlace, frecuencia,
                    UNIX_TIMESTAMP(actualizado) AS version
               FROM anuncio
              WHERE activo = 1
                AND (desde IS NULL OR desde <= NOW())
                AND (hasta IS NULL OR hasta >= NOW())
              ORDER BY orden, id_anuncio DESC
              LIMIT 5"
        );
        foreach ($filas as &$a) {
            $a['id_anuncio'] = (int) $a['id_anuncio'];
            $a['version'] = (int) $a['version'];
        }
        unset($a);
        return ['resultado' => 'ok', 'anuncios' => $filas];
    }
}
