<?php

/**
 * Despacho común de los controladores de MetroTech (el mismo de Tu Móvil).
 *
 * Cada controlador arma su modelo y llama a `despachar()` con dos mapas: las
 * acciones propias de la entidad y el nivel que exige cada una.
 *
 *   despachar(new Contacto($conexion),
 *       ['enviar' => fn($m) => $m->enviar(cuerpo())],
 *       ['enviar' => 'publico']
 *   );
 *
 * Lo que no aparece en el mapa de permisos queda cerrado (ver
 * `modelos/seguridad.php`). A diferencia de Tu Móvil no hay CRUD por
 * defecto: una página informativa no expone tablas, solo acciones.
 */

require_once(__DIR__ . '/../modelos/seguridad.php');

// ---------------------------------------------------------------- CORS
// Se devuelve el origen que llamó, solo si está en la lista.
$origen = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origen, origenesPermitidos(), true)) {
    header('Access-Control-Allow-Origin: ' . $origen);
}
header('Vary: Origin');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// ---------------------------------------------------------------- seguridad
// La API solo responde JSON: no carga nada, no se enmarca y no se indexa.
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
header('X-Robots-Tag: noindex, nofollow');
if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------------------------------------------------------------- utilidades

function cuerpo()
{
    $json = file_get_contents('php://input');
    $datos = json_decode($json);

    if ($json !== '' && $datos === null && json_last_error() !== JSON_ERROR_NONE) {
        throw new DatosInvalidos('El cuerpo de la petición no es JSON válido.');
    }
    return $datos;
}

/** Un parámetro de la URL, ya recortado. Nunca se concatena a un SQL. */
function texto($nombre, $porDefecto = '')
{
    return isset($_GET[$nombre]) ? trim((string) $_GET[$nombre]) : $porDefecto;
}

function responder($vec, $codigo = 200)
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($vec, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * El error viaja como JSON y con el código HTTP que le corresponde, nunca
 * como texto plano con 200: el formulario tiene que distinguir «te faltó un
 * dato» de «se cayó el servidor».
 */
function responderError($mensaje, $codigo)
{
    responder(['resultado' => 'error', 'mensaje' => $mensaje], $codigo);
}

function despachar($modelo, $acciones = [], $permisos = [])
{
    $control = isset($_GET['control']) ? (string) $_GET['control'] : '';

    try {
        $regla = isset($permisos[$control]) ? $permisos[$control]
               : (isset($permisos['*']) ? $permisos['*'] : 'cerrado');
        exigir($regla);

        if (!isset($acciones[$control])) {
            responderError('Acción desconocida.', 404);
        }
        responder($acciones[$control]($modelo));

    } catch (NoAutorizado $e) {
        responderError($e->getMessage(), 403);
    } catch (DatosInvalidos $e) {
        // 400 y el mensaje tal cual: están escritos para que los lea la
        // persona que llena el formulario, no para un log.
        responderError($e->getMessage(), 400);
    } catch (Throwable $e) {
        // El detalle va al log de PHP, no a la respuesta: un mensaje de MySQL
        // en pantalla le cuenta al atacante cómo está hecha la base.
        error_log('[MetroTech] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
        responderError('No se pudo completar la operación. Intenta de nuevo en un momento.', 500);
    }
}
