-- MetroTech — página plana · Salazar Arias Company · Pereira, Risaralda
-- MariaDB 10.4+ (XAMPP)
--
-- Ejecutar SIEMPRE forzando el charset, o los acentos entran doble-codificados
-- porque la consola de Windows los lee como CP850 antes de mandarlos:
--
--   C:\xampp\mysql\bin\mysql -u root --default-character-set=utf8mb4 < backend/sql/metrotech.sql
--
-- OJO: este archivo BORRA y recrea las tablas de la lista de abajo. Es para
-- desarrollo. Nunca se hace DROP DATABASE.
--
-- Fase 1: solo la infraestructura común. La tabla de mensajes de contacto
-- se agrega en la fase 2, cuando esté decidido cómo se envían.

CREATE DATABASE IF NOT EXISTS metrotech
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE metrotech;

SET NAMES utf8mb4;
SET time_zone = '-05:00';

DROP TABLE IF EXISTS limite_peticion;

-- Límite de peticiones (formulario de contacto). Ventana fija por clave.
CREATE TABLE limite_peticion (
  clave          VARCHAR(160) PRIMARY KEY,          -- «contacto:190.1.2.3»
  conteo         INT          NOT NULL DEFAULT 0,
  ventana_inicio DATETIME     NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lo administrado desde el CRM. No se borra al recrear: sale de su migración
-- (crm-salazar-arias/backend/migraciones/metrotech/).
-- Lo que el CRM administra de la página de MetroTech: su contenido, sus
-- anuncios y los mensajes que llegan por su formulario.

-- El documento de la página. Sin fila, la página usa su contenido.json.
CREATE TABLE IF NOT EXISTS sitio_contenido (
  clave           VARCHAR(40)  PRIMARY KEY,
  datos           LONGTEXT     NOT NULL,
  actualizado     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  actualizado_por VARCHAR(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Las versiones anteriores, para poder volver a una.
CREATE TABLE IF NOT EXISTS sitio_contenido_version (
  id_version INT AUTO_INCREMENT PRIMARY KEY,
  clave      VARCHAR(40)  NOT NULL,
  datos      LONGTEXT     NOT NULL,
  quien      VARCHAR(120) DEFAULT NULL,
  cuando     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (clave, cuando)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS anuncio (
  id_anuncio   INT AUTO_INCREMENT PRIMARY KEY,
  titulo       VARCHAR(120) NOT NULL,
  texto        VARCHAR(600) DEFAULT NULL,
  imagen       VARCHAR(500) DEFAULT NULL,
  texto_enlace VARCHAR(60)  DEFAULT NULL,
  enlace       VARCHAR(500) DEFAULT NULL,
  activo       TINYINT(1)   NOT NULL DEFAULT 0,
  desde        DATETIME     DEFAULT NULL,
  hasta        DATETIME     DEFAULT NULL,
  frecuencia   ENUM('sesion','dia','siempre') NOT NULL DEFAULT 'sesion',
  orden        INT          NOT NULL DEFAULT 0,
  creado       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (activo, desde, hasta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Los mensajes del formulario (la misma forma que en HomeClean).
CREATE TABLE IF NOT EXISTS mensaje_contacto (
  id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
  motivo     ENUM('contacto','cotizacion') NOT NULL DEFAULT 'contacto',
  segmento   ENUM('hogar','empresa','clinica','industria') DEFAULT NULL,
  nombre     VARCHAR(120) NOT NULL,
  correo     VARCHAR(120) NOT NULL,
  telefono   VARCHAR(20)  DEFAULT NULL,
  mensaje    TEXT         NOT NULL,
  atendido   TINYINT(1)   NOT NULL DEFAULT 0,
  ip         VARCHAR(45)  DEFAULT NULL,
  creado     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (atendido, creado),
  INDEX (motivo, creado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS crm_mensaje_seguimiento (
  id_mensaje          INT         PRIMARY KEY,
  estado              ENUM('nuevo','en_gestion','respondido','cerrado') NOT NULL DEFAULT 'nuevo',
  id_usuario_asignado INT         DEFAULT NULL,
  asignado_nombre     VARCHAR(120) DEFAULT NULL,
  actualizado         DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (estado),
  INDEX (id_usuario_asignado),
  CONSTRAINT fk_crm_ms_mensaje FOREIGN KEY (id_mensaje) REFERENCES mensaje_contacto (id_mensaje)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS crm_mensaje_evento (
  id_evento      INT AUTO_INCREMENT PRIMARY KEY,
  id_mensaje     INT          NOT NULL,
  tipo           ENUM('estado','asignacion','nota') NOT NULL,
  detalle        VARCHAR(1000) NOT NULL,
  id_usuario     INT          NOT NULL,
  usuario_nombre VARCHAR(120) NOT NULL,
  cuando         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (id_mensaje, cuando),
  CONSTRAINT fk_crm_me_mensaje FOREIGN KEY (id_mensaje) REFERENCES mensaje_contacto (id_mensaje)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS crm_cliente (
  identidad   VARCHAR(140) PRIMARY KEY,
  tipo        ENUM('hogar','empresa','clinica','industria') DEFAULT NULL,
  notas       TEXT         DEFAULT NULL,
  actualizado DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS crm_cliente_etiqueta (
  identidad VARCHAR(140) NOT NULL,
  etiqueta  VARCHAR(40)  NOT NULL,
  PRIMARY KEY (identidad, etiqueta),
  INDEX (etiqueta),
  CONSTRAINT fk_crm_ce_cliente FOREIGN KEY (identidad) REFERENCES crm_cliente (identidad) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
