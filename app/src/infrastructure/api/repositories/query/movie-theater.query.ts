const movieTheaterQuery = {
  get: `SELECT
              sc.id AS sala_cine_id, sc.direccion, sc.numero_sala, sc.tipo_sala, sc.capacidad,
              p.pelicula_codigo, p.fecha_hora_inicio, p.fecha_hora_fin
        FROM sala_cine sc
        INNER JOIN programacion p ON sc.id = p.sala_cine_id
        WHERE sc.id = ?`,
  all: `SELECT
            sc.id AS sala_cine_id, 
            sc.direccion, 
            sc.numero_sala, 
            sc.tipo_sala, 
            sc.capacidad,
            p.fecha_hora_inicio, 
            p.fecha_hora_fin
            FROM sala_cine sc
      INNER JOIN programacion p ON sc.id = p.sala_cine_id
      ORDER BY sc.id DESC, p.fecha_hora_inicio ASC
      LIMIT ? OFFSET ?`,
  createMovieTheater: `INSERT INTO sala_cine (direccion, numero_sala, tipo_sala, capacidad, fecha_creacion) VALUES (?, ?, ?, ?, ?)`,
  createSchedule: `INSERT INTO programacion (sala_cine_id, pelicula_codigo, fecha_hora_inicio, fecha_hora_fin, fecha_creacion) VALUES (?, ?, ?, ?, ?)`,
};

export default movieTheaterQuery;
