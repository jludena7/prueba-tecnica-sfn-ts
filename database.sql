CREATE DATABASE `prueba_tecnica`;


CREATE TABLE IF NOT EXISTS `prueba_tecnica`.`sala_cine` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `direccion` VARCHAR(100) NOT NULL,
  `numero_sala` INT NOT NULL,
  `tipo_sala` VARCHAR(3) NOT NULL,
  `capacidad` INT NOT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL,
  `fecha_modificacion` TIMESTAMP NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `prueba_tecnica`.`programacion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_hora_inicio` TIMESTAMP NOT NULL,
  `fecha_hora_fin` TIMESTAMP NULL,
  `pelicula_codigo` INT NOT NULL,
  `fecha_creacion` TIMESTAMP NULL,
  `fecha_modificacion` TIMESTAMP NULL,
  `sala_cine_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_programacion_sala_cine_idx` (`sala_cine_id` ASC),
  CONSTRAINT `fk_programacion_sala_cine`
    FOREIGN KEY (`sala_cine_id`)
    REFERENCES `prueba_tecnica`.`sala_cine` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
