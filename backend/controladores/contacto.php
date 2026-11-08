<?php
require_once('enrutador.php');
require_once('../modelos/conexion.php');
require_once('../modelos/contacto.php');

/** El formulario de contacto. Solo escribe; los mensajes se leen en el CRM. */
despachar(new Contacto($conexion), [
    'enviar' => function ($m) {
        $m->limitar('contacto', 5, 600);
        return $m->enviar(cuerpo());
    }
], [
    'enviar' => 'publico'
]);
