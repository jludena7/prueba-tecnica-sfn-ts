export const REQUEST_API = {
    createMovieTheater200: {
        direccion: "Av. Larco",
        numero_sala: 1,
        tipo_sala: "3D",
        capacidad: "70",
        programacion: [
            {
                pelicula_codigo: 1,
                horarios: [
                    {
                        inicio: "2024-10-11T14:30:00",
                        fin: "2024-10-11T15:30:00",
                    },
                ],
            },
        ],
    },
    createMovieTheater404: {
        direccion: "",
        numero_sala: 1,
        tipo_sala: "3D",
        capacidad: "70",
        programacion: [
            {
                pelicula_codigo: 1,
                horarios: [
                    {
                        inicio: "2024-10-11T14:30:00",
                        fin: "2024-10-11T15:30:00",
                    },
                ],
            },
        ],
    }
}
