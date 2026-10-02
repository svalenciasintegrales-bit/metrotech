<?php

/**
 * La conexión a la base.
 *
 * Las credenciales salen de `conexion.local.php` si existe —ese archivo está
 * en .gitignore y es el que se edita al desplegar— y si no, de los valores de
 * XAMPP que sirven en cualquier máquina de desarrollo.
 */

$config = [
    'servidor' => 'localhost',
    'usuario'  => 'root',
    'clave'    => '',
    'bd'       => 'metrotech'
];

if (file_exists(__DIR__ . '/conexion.local.php')) {
    $config = array_merge($config, require(__DIR__ . '/conexion.local.php'));
}

// Las pruebas automáticas (backend/pruebas/) corren por consola contra una
// base propia, `metrotech_pruebas`, para no tocar los datos reales. Desde la
// web esta variable no se lee.
if (PHP_SAPI === 'cli' && getenv('METROTECH_BD') === 'metrotech_pruebas') {
    $config['bd'] = 'metrotech_pruebas';
}

// Que mysqli lance excepciones en vez de devolver false: así un error de base
// sube hasta el enrutador, que lo convierte en un 500 con JSON, en vez de
// seguir de largo y responder «ok».
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$conexion = mysqli_connect(
    $config['servidor'],
    $config['usuario'],
    $config['clave']
);
mysqli_select_db($conexion, $config['bd']);
mysqli_set_charset($conexion, 'utf8mb4');

// Una sola hora para PHP y para la base: el límite de peticiones compara
// NOW() de MariaDB con ventanas de tiempo.
date_default_timezone_set('America/Bogota');
mysqli_query($conexion, "SET time_zone = '-05:00'");
