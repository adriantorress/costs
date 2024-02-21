CREATE USER IF NOT EXISTS 'project-costs'@'34.42.97.42' IDENTIFIED WITH mysql_native_password BY 'project-costs';
GRANT ALL PRIVILEGES ON *.* TO 'project-costs'@'34.42.97.42';
FLUSH PRIVILEGES;

ALTER USER 'project-costs'@'34.42.97.42' IDENTIFIED WITH mysql_native_password BY 'project-costs';

CREATE DATABASE IF NOT EXISTS `db_costs`;

CREATE TABLE IF NOT EXISTS `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `budget` int NOT NULL,
  `cost` double(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `project_id` int NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `value` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `service_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `db_costs`.`category`
(`name`)
VALUES
('Infra');

INSERT INTO `db_costs`.`category`
(`name`)
VALUES
('Desenvolvimento');

INSERT INTO `db_costs`.`category`
(`name`)
VALUES
('Design');

INSERT INTO `db_costs`.`category`
(`name`)
VALUES
('Planejamento');

