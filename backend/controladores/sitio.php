<?php
require_once('enrutador.php');
require_once('../modelos/conexion.php');
require_once('../modelos/sitio.php');

/** El contenido y los anuncios que se administran en el CRM. Públicos y de solo lectura. */
despachar(new Sitio($conexion), [
    'contenido' => fn($m) => $m->contenido(),
    'anuncios'  => fn($m) => $m->anuncios()
], [
    '*' => 'publico'
]);
