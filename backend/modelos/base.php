<?php

require_once(__DIR__ . '/seguridad.php');

/**
 * Lo común de los modelos de MetroTech (el mismo patrón de Tu Móvil).
 *
 * Todo sale por sentencias preparadas: los valores nunca se concatenan al
 * SQL. Si algo falla se lanza, y el enrutador lo convierte en un 500 con
 * JSON.
 */
class Base
{
    protected $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    protected function ejecutar($sql, $tipos, $valores, $error = 'error')
    {
        $stmt = mysqli_prepare($this->conexion, $sql);
        if (!$stmt) {
            throw new RuntimeException($error . ': ' . mysqli_error($this->conexion));
        }
        if ($tipos !== '') {
            mysqli_stmt_bind_param($stmt, $tipos, ...$valores);
        }
        if (!mysqli_stmt_execute($stmt)) {
            throw new RuntimeException($error . ': ' . mysqli_stmt_error($stmt));
        }
        return $stmt;
    }

    protected function filas($sql, $tipos = '', $valores = [])
    {
        if ($tipos === '') {
            $res = mysqli_query($this->conexion, $sql);
            if (!$res) {
                throw new RuntimeException('consulta fallida: ' . mysqli_error($this->conexion));
            }
        } else {
            $stmt = $this->ejecutar($sql, $tipos, $valores, 'consulta fallida');
            $res  = mysqli_stmt_get_result($stmt);
        }

        $vec = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    protected function fila($sql, $tipos = '', $valores = [])
    {
        $vec = $this->filas($sql, $tipos, $valores);
        return $vec ? $vec[0] : null;
    }

    /** Corre `$trabajo` dentro de una transacción; si algo lanza, deshace todo. */
    protected function enTransaccion(callable $trabajo)
    {
        mysqli_begin_transaction($this->conexion);
        try {
            $res = $trabajo();
            mysqli_commit($this->conexion);
            return $res;
        } catch (Throwable $e) {
            mysqli_rollback($this->conexion);
            throw $e;
        }
    }

    /**
     * Límite de peticiones por ventana fija: frena a quien manda el
     * formulario de contacto en bucle. La clave junta la acción y quien
     * llama, p. ej. «contacto:190.1.2.3». Pasado el límite, se responde con
     * palabras.
     */
    public function limitar($accion, $max, $segundos, $quien = null)
    {
        $quien = $quien ?? ($_SERVER['REMOTE_ADDR'] ?? 'cli');
        $clave = mb_substr($accion . ':' . $quien, 0, 160);
        $this->ejecutar(
            "INSERT INTO limite_peticion (clave, conteo, ventana_inicio) VALUES (?, 1, NOW())
             ON DUPLICATE KEY UPDATE
               conteo = IF(ventana_inicio < NOW() - INTERVAL ? SECOND, 1, conteo + 1),
               ventana_inicio = IF(ventana_inicio < NOW() - INTERVAL ? SECOND, NOW(), ventana_inicio)",
            'sii', [$clave, (int) $segundos, (int) $segundos], 'no se pudo contar la petición'
        );
        $f = $this->fila("SELECT conteo FROM limite_peticion WHERE clave = ?", 's', [$clave]);
        if ((int) $f['conteo'] > $max) {
            throw new DatosInvalidos('Vas muy rápido. Espera un momento y vuelve a intentarlo.');
        }
    }

    /** ¿Responde la base? Para el chequeo de estado del despliegue. */
    public function estado()
    {
        $f = $this->fila("SELECT 1 AS ok");
        return ['resultado' => 'ok', 'base' => $f && (int) $f['ok'] === 1];
    }
}
