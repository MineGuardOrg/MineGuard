-- MineGuard Database Backup
-- Database: mineguard_db
-- Date: 2025-11-23
-- Host: mysql-mineguard.mysql.database.azure.com
--

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- ----------------------------
-- Table structure for alert
-- ----------------------------
DROP TABLE IF EXISTS `alert`;
CREATE TABLE `alert` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alert_type` varchar(50) NOT NULL,
  `severity` enum('low','medium','high') NOT NULL,
  `reading_id` bigint NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `reading_id` (`reading_id`),
  CONSTRAINT `alert_ibfk_1` FOREIGN KEY (`reading_id`) REFERENCES `reading` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Alertas generadas automáticamente de lecturas críticas';

-- ----------------------------
-- Records of alert
-- ----------------------------
INSERT INTO `alert` (`id`, `alert_type`, `severity`, `reading_id`, `timestamp`) VALUES
(1, 'ritmo_irregular', 'medium', 1, '2025-10-02 09:31:15'),
(2, 'ritmo_irregular', 'high', 2, '2025-10-11 12:47:22'),
(3, 'ritmo_bajo', 'low', 3, '2025-10-25 15:20:44'),
(4, 'ritmo_alto', 'medium', 4, '2025-11-01 10:12:55'),
(5, 'ritmo_irregular', 'high', 5, '2025-11-16 08:05:39'),
(6, 'temperatura_alta', 'medium', 6, '2025-10-05 09:43:20'),
(7, 'temperatura_alta', 'high', 7, '2025-10-15 12:19:10'),
(8, 'temperatura_baja', 'low', 8, '2025-10-28 16:03:12'),
(9, 'temperatura_alta', 'high', 9, '2025-11-03 11:22:01'),
(10, 'temperatura_alta', 'medium', 10, '2025-11-18 07:50:22'),
(11, 'impacto_leve', 'low', 11, '2025-10-06 10:04:40'),
(12, 'impacto_leve', 'medium', 12, '2025-10-17 17:23:01'),
(13, 'impacto_moderado', 'medium', 13, '2025-11-01 14:27:33'),
(14, 'impacto_leve', 'low', 14, '2025-11-12 09:14:36'),
(15, 'posible_caida', 'high', 15, '2025-11-28 18:12:01'),
(16, 'gas_alto', 'medium', 16, '2025-10-08 15:42:13'),
(17, 'gas_medio', 'low', 17, '2025-10-21 16:29:39'),
(18, 'gas_alto', 'high', 18, '2025-11-05 08:56:12'),
(19, 'gas_peligroso', 'high', 19, '2025-11-22 21:18:10'),
(20, 'gas_medio', 'low', 20, '2025-12-02 08:00:12'),
(21, 'gas_alto', 'medium', 21, '2025-12-02 12:31:02');


-- ----------------------------
-- Table structure for area
-- ----------------------------
DROP TABLE IF EXISTS `area`;
CREATE TABLE `area` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Áreas o departamentos dentro de la mina';

-- ----------------------------
-- Records of area
-- ----------------------------
INSERT INTO `area` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Zona de Extracción A', 'Área principal de extracción', 1, '2025-10-01 08:12:45', '2025-10-01 08:12:45'),
(2, 'Zona de Extracción B', 'Segunda área operativa de extracción', 1, '2025-10-03 10:25:19', '2025-10-03 10:25:19'),
(3, 'Zona de Extracción C', 'Área de extracción con maquinaria pesada', 1, '2025-10-06 13:14:30', '2025-10-06 13:14:30'),
(4, 'Planta de Procesamiento A', 'Procesamiento de material extraído', 1, '2025-10-09 09:32:18', '2025-10-09 09:32:18'),
(5, 'Planta de Procesamiento B', 'Procesamiento secundario de minerales', 1, '2025-10-12 11:48:55', '2025-10-12 11:48:55'),
(6, 'Zona de Ventilación Norte', 'Control de ventilación del sector norte', 1, '2025-10-15 16:03:27', '2025-10-15 16:03:27'),
(7, 'Zona de Ventilación Sur', 'Supervisión del flujo de aire del sur', 1, '2025-10-18 07:55:41', '2025-10-18 07:55:41'),
(8, 'Área de Seguridad A', 'Punto estratégico de monitoreo', 1, '2025-10-21 12:17:59', '2025-10-21 12:17:59'),
(9, 'Área de Seguridad B', 'Supervisión de riesgos en zona crítica', 1, '2025-10-24 15:29:44', '2025-10-24 15:29:44'),
(10, 'Túnel Principal 1', 'Túnel habilitado para transporte', 1, '2025-10-27 09:13:20', '2025-10-27 09:13:20'),
(11, 'Túnel Principal 2', 'Ruta de tránsito para operadores', 1, '2025-10-30 11:41:02', '2025-10-30 11:41:02'),
(12, 'Zona de Perforación A', 'Perforación inicial del terreno', 1, '2025-11-02 08:26:33', '2025-11-02 08:26:33'),
(13, 'Zona de Perforación B', 'Perforación de soporte estructural', 1, '2025-11-05 14:55:50', '2025-11-05 14:55:50'),
(14, 'Área de Control A', 'Monitoreo de sensores ambientales', 1, '2025-11-09 10:18:12', '2025-11-09 10:18:12'),
(15, 'Área de Control B', 'Zona de supervisión de equipos', 1, '2025-11-12 17:40:29', '2025-11-12 17:40:29'),
(16, 'Zona Operativa A', 'Operaciones continuas de extracción', 1, '2025-11-16 07:55:01', '2025-11-16 07:55:01'),
(17, 'Zona Operativa B', 'Actividades de soporte minero', 1, '2025-11-19 13:22:37', '2025-11-19 13:22:37'),
(18, 'Área de Equipos A', 'Manejo y mantenimiento de maquinaria', 1, '2025-11-23 09:41:50', '2025-11-23 09:41:50'),
(19, 'Área de Equipos B', 'Zona para resguardo de herramientas', 1, '2025-11-26 12:57:18', '2025-11-26 12:57:18'),
(20, 'Zona de Monitoreo General', 'Monitoreo global de toda la mina', 1, '2025-12-01 08:33:27', '2025-12-01 08:33:27'),
(21, 'Zona de Emergencia A', 'Punto de evacuación y seguridad', 1, '2025-12-02 14:11:58', '2025-12-02 14:11:58');


-- ----------------------------
-- Table structure for connection
-- ----------------------------
DROP TABLE IF EXISTS `connection`;
CREATE TABLE `connection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_id` int NOT NULL,
  `status` enum('online','offline') NOT NULL DEFAULT 'offline',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `connection_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Registro de conexión de dispositivos';

-- ----------------------------
-- Records of connection
-- ----------------------------
INSERT INTO `connection` (`id`, `device_id`, `status`, `timestamp`) VALUES
(1, 1, 'online', '2025-10-01 08:02:14'),
(2, 2, 'offline', '2025-10-03 11:15:55'),
(3, 3, 'online', '2025-10-06 14:32:27'),
(4, 4, 'offline', '2025-10-09 09:44:19'),
(5, 5, 'online', '2025-10-12 16:21:33'),
(6, 6, 'offline', '2025-10-15 10:29:47'),
(7, 7, 'online', '2025-10-18 07:55:12'),
(8, 8, 'offline', '2025-10-21 13:14:59'),
(9, 9, 'online', '2025-10-24 18:10:41'),
(10, 10, 'offline', '2025-10-27 12:37:05'),
(11, 11, 'online', '2025-10-30 09:55:26'),
(12, 12, 'offline', '2025-11-02 15:43:12'),
(13, 13, 'online', '2025-11-05 10:21:44'),
(14, 14, 'offline', '2025-11-08 17:18:33'),
(15, 15, 'online', '2025-11-11 08:49:57'),
(16, 16, 'offline', '2025-11-14 14:27:18'),
(17, 17, 'online', '2025-11-17 11:06:52'),
(18, 18, 'offline', '2025-11-20 07:33:29'),
(19, 19, 'online', '2025-11-23 16:41:55'),
(20, 20, 'offline', '2025-11-29 09:52:11'),
(21, 21, 'online', '2025-12-02 13:18:44');


-- ----------------------------
-- Table structure for device
-- ----------------------------
DROP TABLE IF EXISTS `device`;
CREATE TABLE `device` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model` varchar(100) NOT NULL,
  `user_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `device_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Cascos inteligentes asignados a usuarios';

-- ----------------------------
-- Records of device
-- ----------------------------
INSERT INTO `device` (`id`, `model`, `user_id`, `is_active`, `assigned_at`, `created_at`, `updated_at`) VALUES
(1, 'Casco Inteligente X PRO', 1, 1, '2025-10-01 08:15:22', '2025-10-01 08:15:22', '2025-10-01 08:15:22'),
(2, 'Casco Inteligente X PRO', 2, 1, '2025-10-04 10:41:30', '2025-10-04 10:41:30', '2025-10-04 10:41:30'),
(3, 'Casco Inteligente X PRO', 3, 1, '2025-10-07 14:12:11', '2025-10-07 14:12:11', '2025-10-07 14:12:11'),
(4, 'Casco Inteligente X PRO', 4, 1, '2025-10-10 09:51:44', '2025-10-10 09:51:44', '2025-10-10 09:51:44'),
(5, 'Casco Inteligente X PRO', 5, 1, '2025-10-13 16:31:55', '2025-10-13 16:31:55', '2025-10-13 16:31:55'),
(6, 'Casco Inteligente X PRO', 6, 1, '2025-10-17 11:39:10', '2025-10-17 11:39:10', '2025-10-17 11:39:10'),
(7, 'Casco Inteligente X PRO', 7, 1, '2025-10-20 08:01:20', '2025-10-20 08:01:20', '2025-10-20 08:01:20'),
(8, 'Casco Inteligente X PRO', 8, 1, '2025-10-23 13:56:18', '2025-10-23 13:56:18', '2025-10-23 13:56:18'),
(9, 'Casco Inteligente X PRO', 9, 1, '2025-10-26 17:35:00', '2025-10-26 17:35:00', '2025-10-26 17:35:00'),
(10, 'Casco Inteligente X PRO', 10, 1, '2025-10-29 12:21:40', '2025-10-29 12:21:40', '2025-10-29 12:21:40'),
(11, 'Casco Inteligente X PRO', 11, 1, '2025-11-01 09:05:10', '2025-11-01 09:05:10', '2025-11-01 09:05:10'),
(12, 'Casco Inteligente X PRO', 12, 1, '2025-11-05 15:41:25', '2025-11-05 15:41:25', '2025-11-05 15:41:25'),
(13, 'Casco Inteligente X PRO', 13, 1, '2025-11-09 10:33:59', '2025-11-09 10:33:59', '2025-11-09 10:33:59'),
(14, 'Casco Inteligente X PRO', 14, 1, '2025-11-13 18:14:12', '2025-11-13 18:14:12', '2025-11-13 18:14:12'),
(15, 'Casco Inteligente X PRO', 15, 1, '2025-11-17 08:48:30', '2025-11-17 08:48:30', '2025-11-17 08:48:30'),
(16, 'Casco Inteligente X PRO', 16, 1, '2025-11-20 14:59:40', '2025-11-20 14:59:40', '2025-11-20 14:59:40'),
(17, 'Casco Inteligente X PRO', 17, 1, '2025-11-23 11:15:50', '2025-11-23 11:15:50', '2025-11-23 11:15:50'),
(18, 'Casco Inteligente X PRO', 18, 1, '2025-11-26 07:54:30', '2025-11-26 07:54:30', '2025-11-26 07:54:30'),
(19, 'Casco Inteligente X PRO', 19, 1, '2025-11-29 16:47:10', '2025-11-29 16:47:10', '2025-11-29 16:47:10'),
(20, 'Casco Inteligente X PRO', 20, 1, '2025-12-01 09:34:00', '2025-12-01 09:34:00', '2025-12-01 09:34:00'),
(21, 'Casco Inteligente X PRO', 21, 1, '2025-12-02 13:22:45', '2025-12-02 13:22:45', '2025-12-02 13:22:45');


-- ----------------------------
-- Table structure for incident_report
-- ----------------------------
DROP TABLE IF EXISTS `incident_report`;
CREATE TABLE `incident_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `severity` enum('low','medium','high','critical') NOT NULL,
  `user_id` int NOT NULL,
  `device_id` int NOT NULL,
  `reading_id` bigint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  KEY `device_id` (`device_id`),
  KEY `reading_id` (`reading_id`),
  CONSTRAINT `incident_report_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `incident_report_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`),
  CONSTRAINT `incident_report_ibfk_3` FOREIGN KEY (`reading_id`) REFERENCES `reading` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Incidentes relacionados con lecturas críticas';

-- ----------------------------
-- Records of incident_report
-- ----------------------------
INSERT INTO `incident_report` (`id`, `description`, `severity`, `user_id`, `device_id`, `reading_id`, `created_at`, `updated_at`) VALUES
(1, 'Ritmo cardíaco irregular detectado', 'medium', 1, 1, 1, '2025-10-02 09:31:20', '2025-10-02 09:31:20'),
(2, 'Ritmo cardíaco elevado', 'high', 1, 1, 2, '2025-10-11 12:47:40', '2025-10-11 12:47:40'),
(3, 'Ritmo cardíaco bajo detectado', 'low', 1, 1, 3, '2025-10-25 15:21:01', '2025-10-25 15:21:01'),
(4, 'Aumento inusual de ritmo cardíaco', 'medium', 1, 1, 4, '2025-11-01 10:13:10', '2025-11-01 10:13:10'),
(5, 'Ritmo cardíaco irregular severo', 'high', 1, 1, 5, '2025-11-16 08:06:01', '2025-11-16 08:06:01'),
(6, 'Temperatura corporal elevada', 'medium', 1, 1, 6, '2025-10-05 09:43:30', '2025-10-05 09:43:30'),
(7, 'Fiebre detectada en el trabajador', 'high', 1, 1, 7, '2025-10-15 12:19:21', '2025-10-15 12:19:21'),
(8, 'Temperatura corporal baja', 'low', 1, 1, 8, '2025-10-28 16:03:25', '2025-10-28 16:03:25'),
(9, 'Temperatura corporal peligrosa', 'high', 1, 1, 9, '2025-11-03 11:22:18', '2025-11-03 11:22:18'),
(10, 'Temperatura corporal elevada', 'medium', 1, 1, 10, '2025-11-18 07:50:35', '2025-11-18 07:50:35'),
(11, 'Impacto leve detectado', 'low', 1, 1, 11, '2025-10-06 10:04:50', '2025-10-06 10:04:50'),
(12, 'Movimiento brusco detectado', 'medium', 1, 1, 12, '2025-10-17 17:23:15', '2025-10-17 17:23:15'),
(13, 'Impacto moderado registrado', 'medium', 1, 1, 13, '2025-11-01 14:27:48', '2025-11-01 14:27:48'),
(14, 'Movimiento irregular menor', 'low', 1, 1, 14, '2025-11-12 09:14:50', '2025-11-12 09:14:50'),
(15, 'Posible caída del trabajador', 'high', 1, 1, 15, '2025-11-28 18:12:15', '2025-11-28 18:12:15'),
(16, 'Nivel de gas superior al normal', 'medium', 1, 1, 16, '2025-10-08 15:42:20', '2025-10-08 15:42:20'),
(17, 'Concentración moderada de gas', 'low', 1, 1, 17, '2025-10-21 16:29:50', '2025-10-21 16:29:50'),
(18, 'Alto nivel de gas detectado', 'high', 1, 1, 18, '2025-11-05 08:56:25', '2025-11-05 08:56:25'),
(19, 'Concentración peligrosa de gas', 'high', 1, 1, 19, '2025-11-22 21:18:22', '2025-11-22 21:18:22'),
(20, 'Nivel moderado de gas', 'low', 1, 1, 20, '2025-12-02 08:00:24', '2025-12-02 08:00:24'),
(21, 'Nivel elevado de gas detectado', 'medium', 1, 1, 21, '2025-12-02 12:31:20', '2025-12-02 12:31:20');


-- ----------------------------
-- Table structure for maintenance_log
-- ----------------------------
DROP TABLE IF EXISTS `maintenance_log`;
CREATE TABLE `maintenance_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `device_id` int NOT NULL,
  `performed_by` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `device_id` (`device_id`),
  KEY `performed_by` (`performed_by`),
  CONSTRAINT `maintenance_log_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`),
  CONSTRAINT `maintenance_log_ibfk_2` FOREIGN KEY (`performed_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Historial de mantenimiento de dispositivos';

-- ----------------------------
-- Records of maintenance_log
-- ----------------------------
INSERT INTO `maintenance_log` (`id`, `description`, `device_id`, `performed_by`, `created_at`, `updated_at`) VALUES
(1, 'Mantenimiento preventivo general', 1, 1, '2025-10-01 09:12:44', '2025-10-01 09:12:44'),
(2, 'Limpieza de sensores', 1, 1, '2025-10-05 11:23:51', '2025-10-05 11:23:51'),
(3, 'Revisión de batería', 1, 1, '2025-10-10 14:45:20', '2025-10-10 14:45:20'),
(4, 'Calibración de sensor de temperatura', 1, 1, '2025-10-14 15:33:02', '2025-10-14 15:33:02'),
(5, 'Ajuste del módulo de ritmo cardíaco', 1, 1, '2025-10-19 10:51:09', '2025-10-19 10:51:09'),
(6, 'Revisión del acelerómetro', 1, 1, '2025-10-23 13:27:35', '2025-10-23 13:27:35'),
(7, 'Limpieza de carcasa interna', 1, 1, '2025-10-27 09:16:11', '2025-10-27 09:16:11'),
(8, 'Reemplazo de cables internos', 1, 1, '2025-11-01 10:49:22', '2025-11-01 10:49:22'),
(9, 'Revisión de conexión inalámbrica', 1, 1, '2025-11-05 08:55:42', '2025-11-05 08:55:42'),
(10, 'Actualización de firmware', 1, 1, '2025-11-09 16:14:37', '2025-11-09 16:14:37'),
(11, 'Calibración del sensor de gases', 1, 1, '2025-11-12 11:33:20', '2025-11-12 11:33:20'),
(12, 'Ajuste de sensibilidad del MPU6050', 1, 1, '2025-11-15 14:09:55', '2025-11-15 14:09:55'),
(13, 'Limpieza profunda interna', 1, 1, '2025-11-18 09:45:42', '2025-11-18 09:45:42'),
(14, 'Revisión del módulo Bluetooth', 1, 1, '2025-11-21 17:32:11', '2025-11-21 17:32:11'),
(15, 'Mantenimiento correctivo', 1, 1, '2025-11-24 08:59:10', '2025-11-24 08:59:10'),
(16, 'Inspección general de seguridad', 1, 1, '2025-11-27 13:21:30', '2025-11-27 13:21:30'),
(17, 'Revisión de puertos y conectores', 1, 1, '2025-11-29 10:15:44', '2025-11-29 10:15:44'),
(18, 'Calibración final de sensores', 1, 1, '2025-12-01 07:49:15', '2025-12-01 07:49:15'),
(19, 'Revisión de seguridad del armazón', 1, 1, '2025-12-01 12:33:54', '2025-12-01 12:33:54'),
(20, 'Limpieza ligera de rutina', 1, 1, '2025-12-02 09:10:22', '2025-12-02 09:10:22'),
(21, 'Prueba final de funcionamiento', 1, 1, '2025-12-02 12:48:30', '2025-12-02 12:48:30');


-- ----------------------------
-- Table structure for ml_prediction
-- ----------------------------
DROP TABLE IF EXISTS `ml_prediction`;
CREATE TABLE `ml_prediction` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reading_id` bigint NOT NULL,
  `prediction` varchar(50) NOT NULL,
  `probability` float NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `reading_id` (`reading_id`),
  CONSTRAINT `ml_prediction_ibfk_1` FOREIGN KEY (`reading_id`) REFERENCES `reading` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Resultados de predicciones ML';

-- ----------------------------
-- Records of ml_prediction
-- ----------------------------


-- ----------------------------
-- Table structure for ml_training_data
-- ----------------------------
DROP TABLE IF EXISTS `ml_training_data`;
CREATE TABLE `ml_training_data` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reading_id` bigint NOT NULL,
  `label` enum('normal','danger','fatigue','toxic gas') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `reading_id` (`reading_id`),
  CONSTRAINT `ml_training_data_ibfk_1` FOREIGN KEY (`reading_id`) REFERENCES `reading` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Datos etiquetados para entrenamiento ML';

-- ----------------------------
-- Records of ml_training_data
-- ----------------------------


-- ----------------------------
-- Table structure for position
-- ----------------------------
DROP TABLE IF EXISTS `position`;
CREATE TABLE `position` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Define los puestos o jerarquía de los usuarios';

-- ----------------------------
-- Records of position
-- ----------------------------
INSERT INTO `position` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'supervisor', 'Supervisor de mina planta A', 1, '2025-10-01 08:12:45', '2025-10-01 08:12:45'),
(2, 'supervisor', 'Supervisor de mina planta B', 1, '2025-10-04 10:33:12', '2025-10-04 10:33:12'),
(3, 'supervisor', 'Supervisor de mina planta C', 1, '2025-10-07 14:05:21', '2025-10-07 14:05:21'),
(4, 'supervisor', 'Supervisor de mina planta D', 1, '2025-10-10 09:44:58', '2025-10-10 09:44:58'),
(5, 'supervisor', 'Supervisor de mina planta A', 1, '2025-10-13 16:22:40', '2025-10-13 16:22:40'),
(6, 'supervisor', 'Supervisor de mina planta B', 1, '2025-10-17 11:31:07', '2025-10-17 11:31:07'),
(7, 'supervisor', 'Supervisor de mina planta C', 1, '2025-10-20 07:55:33', '2025-10-20 07:55:33'),
(8, 'supervisor', 'Supervisor de mina planta D', 1, '2025-10-23 13:49:22', '2025-10-23 13:49:22'),
(9, 'supervisor', 'Supervisor de mina planta A', 1, '2025-10-26 17:28:10', '2025-10-26 17:28:10'),
(10, 'usuario', 'Usuario planta A', 1, '2025-10-29 12:17:55', '2025-10-29 12:17:55'),
(11, 'usuario', 'Usuario planta B', 1, '2025-11-01 09:02:13', '2025-11-01 09:02:13'),
(12, 'usuario', 'Usuario planta C', 1, '2025-11-05 15:37:50', '2025-11-05 15:37:50'),
(13, 'usuario', 'Usuario planta D', 1, '2025-11-09 10:29:44', '2025-11-09 10:29:44'),
(14, 'usuario', 'Usuario planta A', 1, '2025-11-13 18:11:22', '2025-11-13 18:11:22'),
(15, 'usuario', 'Usuario planta B', 1, '2025-11-17 08:45:31', '2025-11-17 08:45:31'),
(16, 'usuario', 'Usuario planta C', 1, '2025-11-20 14:56:09', '2025-11-20 14:56:09'),
(17, 'usuario', 'Usuario planta D', 1, '2025-11-23 11:12:57', '2025-11-23 11:12:57'),
(18, 'usuario', 'Usuario planta A', 1, '2025-11-26 07:51:40', '2025-11-26 07:51:40'),
(19, 'usuario', 'Usuario planta B', 1, '2025-11-29 16:43:28', '2025-11-29 16:43:28'),
(20, 'usuario', 'Usuario planta C', 1, '2025-12-01 09:30:17', '2025-12-01 09:30:17'),
(21, 'usuario', 'Usuario planta D', 1, '2025-12-02 13:18:55', '2025-12-02 13:18:55');


-- ----------------------------
-- Table structure for reading
-- ----------------------------
DROP TABLE IF EXISTS `reading`;
CREATE TABLE `reading` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `value` double NOT NULL,
  `sensor_id` int NOT NULL,
  `user_id` int NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `sensor_id` (`sensor_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reading_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensor` (`id`),
  CONSTRAINT `reading_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Lecturas en tiempo real de los sensores';

-- ----------------------------
-- Records of reading
-- ----------------------------
INSERT INTO `reading` (`id`, `value`, `sensor_id`, `user_id`, `timestamp`) VALUES
(1, 82.0, 1, 1, '2025-10-05 09:41:10'),
(2, 91.0, 1, 1, '2025-10-12 10:15:22'),
(3, 76.0, 1, 1, '2025-10-20 14:33:48'),
(4, 88.0, 1, 1, '2025-11-01 08:55:04'),
(5, 95.0, 1, 1, '2025-11-10 13:29:17'),
(6, 36.7, 2, 1, '2025-10-05 09:42:55'),
(7, 37.1, 2, 1, '2025-10-15 12:18:33'),
(8, 36.4, 2, 1, '2025-10-28 16:02:41'),
(9, 37.5, 2, 1, '2025-11-03 11:21:19'),
(10, 36.9, 2, 1, '2025-11-18 07:49:58'),
(11, 0.98, 3, 1, '2025-10-06 10:04:18'),
(12, 1.15, 3, 1, '2025-10-17 17:22:40'),
(13, 2.87, 3, 1, '2025-11-01 14:26:59'),
(14, 0.67, 3, 1, '2025-11-12 09:14:03'),
(15, 3.42, 3, 1, '2025-11-28 18:11:33'),
(16, 215.0, 4, 1, '2025-10-08 15:41:50'),
(17, 189.0, 4, 1, '2025-10-21 16:29:11'),
(18, 310.0, 4, 1, '2025-11-05 08:55:55'),
(19, 402.0, 4, 1, '2025-11-22 21:17:27'),
(20, 145.0, 4, 1, '2025-12-02 07:59:04'),
(21, 198.0, 4, 1, '2025-12-02 12:30:45');


-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  `description` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Define los roles de usuario';

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Tiene todos los permisos, puede gestionar usuarios, dispositivos, turnos, alertas, reportes, ML, etc.', 1, '2025-09-22 01:41:27', '2025-09-22 01:41:27'),
(2, 'User', 'Acceso normal a la plataforma según su puesto, sin permisos administrativos.', 1, '2025-09-22 01:41:28', '2025-09-22 01:41:28');


-- ----------------------------
-- Table structure for sensor
-- ----------------------------
DROP TABLE IF EXISTS `sensor`;
CREATE TABLE `sensor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `type` varchar(50) NOT NULL,
  `device_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `sensor_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Sensores de cada dispositivo';

-- ----------------------------
-- Records of sensor
-- ----------------------------
INSERT INTO `sensor` (`id`, `name`, `description`, `unit`, `type`, `device_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Sensor de Ritmo Cardíaco', 'Sensor MAX30100/MAX30102 para medir ritmo cardíaco del minero', 'bpm', 'ritmo_cardiaco', 1, 1, '2025-10-05 09:31:22', '2025-10-05 09:31:22'),
(2, 'Sensor de Temperatura Corporal', 'Sensor MLX90614/DS18B20 para medir temperatura corporal', '°C', 'temperatura_corporal', 1, 1, '2025-10-12 11:15:47', '2025-10-12 11:15:47'),
(3, 'Sensor de Caídas e Impactos', 'Acelerómetro y Giroscopio MPU6050 para detectar caídas o golpes', 'm/s²', 'caidas_impactos', 1, 1, '2025-11-01 14:22:59', '2025-11-01 14:22:59'),
(4, 'Sensor de Gases Tóxicos', 'Sensor MQ-2/MQ-135/MQ-9 para detectar gases peligrosos en la mina', 'ppm', 'gases_toxicos', 1, 1, '2025-12-02 08:40:11', '2025-12-02 08:40:11');


-- ----------------------------
-- Table structure for shift
-- ----------------------------
DROP TABLE IF EXISTS `shift`;
CREATE TABLE `shift` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Turnos disponibles en la mina';

-- ----------------------------
-- Records of shift
-- ----------------------------
INSERT INTO `shift` (`id`, `start_time`, `end_time`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL),
(2, '16:00:00', '0:00:00', 1, '2025-11-14 04:06:14', NULL),
(3, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL),
(4, '16:00:00', '0:00:00', 1, '2025-11-14 04:06:14', NULL),
(5, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL),
(6, '16:00:00', '0:00:00', 1, '2025-11-14 04:06:14', NULL),
(7, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL),
(8, '16:00:00', '0:00:00', 1, '2025-11-14 04:06:14', NULL),
(9, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL),
(10, '16:00:00', '0:00:00', 1, '2025-11-14 04:06:14', NULL),
(11, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL),
(12, '16:00:00', '0:00:00', 1, '2025-11-14 04:06:14', NULL),
(13, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL),
(14, '16:00:00', '0:00:00', 1, '2025-11-14 04:06:14', NULL),
(15, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL),
(16, '16:00:00', '0:00:00', 1, '2025-11-14 04:06:14', NULL),
(17, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL),
(18, '16:00:00', '0:00:00', 1, '2025-11-14 04:06:14', NULL),
(19, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL),
(20, '16:00:00', '0:00:00', 1, '2025-11-14 04:06:14', NULL),
(21, '8:00:00', '16:00:00', 1, '2025-11-14 04:06:14', NULL);


-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_number` varchar(20) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `area_id` int DEFAULT NULL,
  `position_id` int DEFAULT NULL,
  `supervisor_id` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `employee_number` (`employee_number`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  KEY `area_id` (`area_id`),
  KEY `position_id` (`position_id`),
  KEY `supervisor_id` (`supervisor_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `user_ibfk_2` FOREIGN KEY (`area_id`) REFERENCES `area` (`id`),
  CONSTRAINT `user_ibfk_3` FOREIGN KEY (`position_id`) REFERENCES `position` (`id`),
  CONSTRAINT `user_ibfk_4` FOREIGN KEY (`supervisor_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Usuarios del sistema con jerarquía y puesto';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` (`id`, `employee_number`, `first_name`, `last_name`, `email`, `password`, `role_id`, `area_id`, `position_id`, `supervisor_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '0322103782', 'Alexander', 'Parra', 'alex@gmail.com', '$2b$12$BL4AX1EM6dxJpXwzLq13reYxpfGSbl2o.ZhrHIFQS3jM9OyeQWSC6', 1, NULL, NULL, NULL, 1, '2025-11-14 03:34:54', NULL),
(2, '0322103693', 'Angel', 'Chavez', 'elchavez54321@hmail.com', '$2b$12$tzmHsvqK.JRbCxeooK26UOcvVH/bb3og/mZCshk9qpQLpbYzIp5wy', 1, NULL, NULL, NULL, 0, '2025-11-14 03:43:35', '2025-11-21 05:16:01'),
(3, '0322103715', 'Miguel', 'Lopez', 'miguel.lopez21@gmail.com', '$2b$12$y1FQADGqy0ik4MYXPhTZaOVzpphsBDsjJMSNYjG4dEo3F0pLg1CPy', 2, NULL, NULL, NULL, 1, '2025-11-14 03:48:54', NULL),
(4, '0322103722', 'Carlos', 'Ramirez', 'carlos.ramirez07@yahoo.com', '$2b$12$o46kxNMggVj159UOEsvNFuEwqFMJx8YrM8rAAWlOcUDo3R3MRuByu', 1, NULL, NULL, NULL, 1, '2025-11-14 03:49:06', NULL),
(5, '0322103749', 'Juan', 'Hernandez', 'juan.hdz554@gmail.com', '$2b$12$h4fti3lH7itJ8gMcEDzKd.Pz3EmeSD/ViTfl6DuSpIxVC8Me6Bdua', 2, NULL, NULL, NULL, 1, '2025-11-14 03:51:05', NULL),
(6, '0322103781', 'Luis', 'Castillo', 'luis.castillo102@gmail.com', '$2b$12$ROScye/ic1t.ir25kUjodu3im6shu5QwpUmqAKIsnTA47sSe.WyRu', 1, NULL, NULL, NULL, 1, '2025-11-14 03:51:26', NULL),
(7, '0322103804', 'Sergio', 'Paredes', 'sergio.paredes33@gmail.com', '$2b$12$F7tb375.b5AakdGDxSBEju722rR0RJHmRsb3CWUt7UBX8IiVPHM9u', 2, NULL, NULL, NULL, 1, '2025-11-14 03:51:36', NULL),
(8, '0322103820', 'Daniel', 'Mendez', 'daniel.mendez88@gmail.com', '$2b$12$fe1Bqc2RW5thT5JXuPXcD.EmW.uobxvuoEI6rHCxX/qlxWoloJaU6', 1, NULL, NULL, NULL, 1, '2025-11-14 03:51:50', NULL),
(9, '0322103833', 'Roberto', 'Acosta', 'roberto.acosta55@gmail.com', '$2b$12$V7WYKTPeV.mkIOFysYDqVeqpXR8S.bHERrUAB9bhn6ruDmrKgUno2', 2, NULL, NULL, NULL, 1, '2025-11-14 03:52:06', NULL),
(10, '0322103858', 'Jorge', 'Esquivel', 'jorge.esquivel19@gmail.com', '$2b$12$mNFDZpXBdT7JNffRT1GVqO1G6.5N7Jy4N4NScNsaE9h1weC6npytG', 1, NULL, NULL, NULL, 0, '2025-11-14 03:52:22', '2025-11-21 05:15:29'),
(11, '0322103872', 'Oscar', 'Vargas', 'oscar.vargas913@gmail.com', '$2b$12$fAFSkw.J9yPgnvteeHSDS.MaNkdu3C6ze39PbWksKsWNVVdJm3ar2', 2, NULL, NULL, NULL, 1, '2025-11-14 03:52:36', NULL),
(12, '0322103889', 'Kevin', 'Santos', 'kevin.santos441@gmail.com', '$2b$12$ZyxndgglrzUD/kfny7m21exbxgkLUH8z4BeXwL4ivae/IvuoPG0M.', 2, NULL, NULL, NULL, 1, '2025-11-14 03:53:03', NULL),
(13, '0322103905', 'Diego', 'Rojas', 'diego.rojas02@gmail.com', '$2b$12$6Asgfoii4CJnI2CdY1PzbeKfFdHHkVjOZ1X01yHaGHU8Pq0osRq8m', 1, NULL, NULL, NULL, 1, '2025-11-14 03:53:20', NULL),
(14, '0322103921', 'Ricardo', 'Morales', 'ricardo.morales88@gmail.com', '$2b$12$a0YoOqVC9LnBz0GQcdrF0OYJWq6HRO9BErEZc016oNYu/oOK/rSt.', 2, NULL, NULL, NULL, 1, '2025-11-14 03:53:38', NULL),
(15, '0322103944', 'Edgar', 'Serrano', 'edgar.serrano73@gmail.com', '$2b$12$zyGn7ZVx4Lrr2j6x/LMl4uM2uI.C4S4dxjoIm5Jb8L68miGb8jSkC', 1, NULL, NULL, NULL, 1, '2025-11-14 03:53:53', NULL),
(16, '0322103957', 'Marco', 'Flores', 'marco.flores521@gmail.com', '$2b$12$ARohSoPFHLP/n/5WMLwLdO6OugoP2f8nu9NB7sGOg5vqNwwGXMTGO', 2, NULL, NULL, NULL, 1, '2025-11-14 03:54:04', NULL),
(17, '0322103973', 'Adrian', 'Lara', 'adrian.lara44@gmail.com', '$2b$12$MZ.HYXhNaXOMfKPc8qfn9utL9vsQktEbRabtkcH1M2O/224s0s.om', 1, NULL, NULL, NULL, 1, '2025-11-14 03:54:21', NULL),
(18, '0322103988', 'Francisco', 'Camacho', 'fran.camacho100@gmail.com', '$2b$12$HfkKPth5r3lom0nZCBVS2.pua2PMYtyZ5mNMzEvJTBg1VOtPuWWg.', 2, NULL, NULL, NULL, 1, '2025-11-14 03:54:33', NULL),
(19, '0322103994', 'Ivan', 'Peña', 'ivan.pena999@gmail.com', '$2b$12$fi3dJJQVKQRdbLDD40MDYembxHCi4L5IeVtwRwfoppbS33sTowlpq', 1, NULL, NULL, NULL, 1, '2025-11-14 03:54:46', NULL),
(20, '0322104007', 'Eduardo', 'Cortez', 'eduardo.cortez13@gmail.com', '$2b$12$NhYrXuXObpaphC3osn5xCertvYjdXWIfETK8Jf2sG.9/dRrHXWjRm', 2, NULL, NULL, NULL, 1, '2025-11-14 03:55:00', NULL),
(21, '0322104019', 'Hector', 'Reyes', 'hector.reyes09@gmail.com', '$2b$12$aiBK65AxDwRyL.mvqVcdiOEhTlGJF/CX5r/0/gfNHkNDdmQgvSu9m', 2, NULL, NULL, NULL, 1, '2025-11-14 03:55:16', NULL);


-- ----------------------------
-- Table structure for user_shift
-- ----------------------------
DROP TABLE IF EXISTS `user_shift`;
CREATE TABLE `user_shift` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `shift_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `shift_id` (`shift_id`),
  CONSTRAINT `user_shift_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_shift_ibfk_2` FOREIGN KEY (`shift_id`) REFERENCES `shift` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Asignación de usuarios a turnos';

-- ----------------------------
-- Records of user_shift
-- ----------------------------
INSERT INTO `user_shift` (`id`, `user_id`, `shift_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6),
(7, 7, 7),
(8, 8, 8),
(9, 9, 9),
(10, 10, 10),
(11, 11, 11),
(12, 12, 12),
(13, 13, 13),
(14, 14, 14),
(15, 15, 15),
(16, 16, 16),
(17, 17, 17),
(18, 18, 18),
(19, 19, 19),
(20, 20, 20),
(21, 21, 21);


SET FOREIGN_KEY_CHECKS = 1;
