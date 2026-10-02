<?php
require_once('enrutador.php');
require_once('../modelos/conexion.php');
require_once('../modelos/base.php');

/**
 * Chequeo de estado: ¿responde PHP y responde la base? Sirve para la lista
 * de despliegue. No devuelve nada más que sí o no.
 *
 *   GET estado.php?control=ping
 */
despachar(new Base($conexion), [
    'ping' => fn($m) => $m->estado()
], [
    'ping' => 'publico'
]);
