-- 🔹 Eliminar todas las tablas existentes (respetando el orden de dependencias)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `ml_prediction`;
DROP TABLE IF EXISTS `ml_training_data`;
DROP TABLE IF EXISTS `connection`;
DROP TABLE IF EXISTS `user_shift`;
DROP TABLE IF EXISTS `shift`;
DROP TABLE IF EXISTS `maintenance_log`;
DROP TABLE IF EXISTS `incident_report`;
DROP TABLE IF EXISTS `alert`;
DROP TABLE IF EXISTS `reading`;
DROP TABLE IF EXISTS `sensor`;
DROP TABLE IF EXISTS `device`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `position`;
DROP TABLE IF EXISTS `area`;
DROP TABLE IF EXISTS `role`;

SET FOREIGN_KEY_CHECKS = 1;

-- 🔹 Tablas principales

CREATE TABLE `role` (
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
    `name` VARCHAR(15) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) COMMENT='Define los roles de usuario';

CREATE TABLE `area` (
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255),
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) COMMENT='Áreas o departamentos dentro de la mina';

CREATE TABLE `position` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL, -- Ej: Minero, Capataz, Supervisor
    `description` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) COMMENT='Define los puestos o jerarquía de los usuarios';

CREATE TABLE `user` (
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
    `employee_number` VARCHAR(20) NOT NULL UNIQUE,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role_id` INT NOT NULL,
    `area_id` INT NULL,
    `position_id` INT NULL,
    `supervisor_id` INT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`role_id`) REFERENCES role(`id`),
    FOREIGN KEY (`area_id`) REFERENCES area(`id`),
    FOREIGN KEY (`position_id`) REFERENCES `position`(`id`),
    FOREIGN KEY (`supervisor_id`) REFERENCES user(`id`)
) COMMENT='Usuarios del sistema con jerarquía y puesto';

CREATE TABLE `device` (
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
    `model` VARCHAR(100) NOT NULL,
    `user_id` INT NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `assigned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`user_id`) REFERENCES user(`id`)
) COMMENT='Cascos inteligentes asignados a usuarios';

CREATE TABLE `sensor` (
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `device_id` INT NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`device_id`) REFERENCES device(`id`)
) COMMENT='Sensores de cada dispositivo';

CREATE TABLE `reading` (
    `id` BIGINT NOT NULL AUTO_INCREMENT UNIQUE,
    `value` DOUBLE NOT NULL,
    `sensor_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`sensor_id`) REFERENCES sensor(`id`),
    FOREIGN KEY (`user_id`) REFERENCES user(`id`)
) COMMENT='Lecturas en tiempo real de los sensores';

CREATE TABLE `alert` (
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
    `alert_type` VARCHAR(50) NOT NULL,
    `severity` ENUM('low','medium','high') NOT NULL,
    `reading_id` BIGINT NOT NULL,
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`reading_id`) REFERENCES reading(`id`)
) COMMENT='Alertas generadas automáticamente de lecturas críticas';

CREATE TABLE `incident_report` (
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
    `description` VARCHAR(255) NOT NULL,
    `severity` ENUM('low','medium','high','critical') NOT NULL,
    `user_id` INT NOT NULL,
    `device_id` INT NOT NULL,
    `reading_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`user_id`) REFERENCES user(`id`),
    FOREIGN KEY (`device_id`) REFERENCES device(`id`),
    FOREIGN KEY (`reading_id`) REFERENCES reading(`id`)
) COMMENT='Incidentes relacionados con lecturas críticas';

CREATE TABLE `maintenance_log` (
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
    `description` VARCHAR(255) NOT NULL,
    `device_id` INT NOT NULL,
    `performed_by` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`device_id`) REFERENCES device(`id`),
    FOREIGN KEY (`performed_by`) REFERENCES user(`id`)
) COMMENT='Historial de mantenimiento de dispositivos';

CREATE TABLE `shift` (
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) COMMENT='Turnos disponibles en la mina';

CREATE TABLE `user_shift` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `shift_id` INT NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`user_id`) REFERENCES user(`id`),
    FOREIGN KEY (`shift_id`) REFERENCES shift(`id`)
) COMMENT='Asignación de usuarios a turnos';

CREATE TABLE `connection` (
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
    `device_id` INT NOT NULL,
    `status` ENUM('online','offline') NOT NULL DEFAULT 'offline',
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`device_id`) REFERENCES device(`id`)
) COMMENT='Registro de conexión de dispositivos';

CREATE TABLE `ml_training_data` (
    `id` BIGINT NOT NULL AUTO_INCREMENT UNIQUE,
    `reading_id` BIGINT NOT NULL,
    `label` ENUM('normal','danger','fatigue','toxic gas') NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`reading_id`) REFERENCES reading(`id`)
) COMMENT='Datos etiquetados para entrenamiento ML';

CREATE TABLE `ml_prediction` (
    `id` BIGINT NOT NULL AUTO_INCREMENT UNIQUE,
    `reading_id` BIGINT NOT NULL,
    `prediction` VARCHAR(50) NOT NULL,
    `probability` FLOAT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`reading_id`) REFERENCES reading(`id`)
) COMMENT='Resultados de predicciones ML';

INSERT INTO `role` VALUES (1,'Admin','Tiene todos los permisos, puede gestionar usuarios, dispositivos, turnos, alertas, reportes, ML, etc.',1,'2025-09-22 01:41:27','2025-09-22 01:41:27'),(2,'User','Acceso normal a la plataforma según su puesto, sin permisos administrativos.',1,'2025-09-22 01:41:28','2025-09-22 01:41:28');
