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
