<?php

/**
 * Copia este archivo a `conexion.local.php` (está en .gitignore) con los
 * datos de la base del hosting. Sin él se usan los de XAMPP: localhost,
 * root sin clave, base `metrotech`.
 *
 * En cPanel la base y el usuario suelen llevar el prefijo de la cuenta:
 * «cuenta_metrotech». Dale al usuario solo los permisos SELECT, INSERT,
 * UPDATE y DELETE sobre esa base.
 */
return [
    'servidor' => 'localhost',
    'usuario'  => 'cuenta_metrotech',
    'clave'    => 'PONLA_AQUI',
    'bd'       => 'cuenta_metrotech'
];
