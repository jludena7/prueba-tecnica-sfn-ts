# POST LAMBDA


## Las tecnologías usadas son las siguientes

- Serverless Framework: Framework para nodejs
- Typescript: lenguaje tipado para javascript
- Logger Winston: Librería para los logs
- Jest: Librería para los unit test

## Levantar Mysql y DynamoDb en docker
```
docker-compose up -d
```

## Crear la base de datos en el motor MySQL
Ejecutar el script database.sql que se encuentra en la raiz del proyecto

## Documentación en swagger 
Se una pequeña documentación en swagger


## Curl para la creación
Payload:
```
curl --location 'http://localhost:3000/dev/sala-cine' \
--header 'Content-Type: application/json' \
--data '{
    "direccion": "Av. Larco",
    "numero_sala": 1,
    "tipo_sala": "3D",
    "capacidad": "70",
    "programacion": [
        {
            "pelicula_codigo": 1,
            "horarios": [
                {
                    "inicio": "2024-10-11T14:30:00",
                    "fin": "2024-10-11T15:30:00"
                }
            ]
        }
    ]
}'
```

Response:
```
{
    "id": 3,
    "direccion": "Av. Larco",
    "numero_sala": 1,
    "tipo_sala": "3D",
    "capacidad": "70",
    "programacion": [
        {
            "pelicula_codigo": 1,
            "horarios": [
                {
                    "inicio": "2024-10-11T14:30:00",
                    "fin": "2024-10-11T15:30:00"
                }
            ]
        }
    ]
}
```

## Curl para la consulta sala de cine
```
curl --location 'http://localhost:3003/dev/sala-cine/75'
```
Response:
```
{
    "sala_cine_id": 3,
    "direccion": "Av. Larco",
    "numero_sala": 1,
    "tipo_sala": "3D",
    "capacidad": 70,
    "pelicula_estreno": [
        {
            "fecha_hora_inicio": "2024-10-11T19:30:00.000Z",
            "fecha_hora_fin": "2024-10-11T20:30:00.000Z",
            "pelicula": {
                "titulo": "A New Hope",
                "episodio_id": 4,
                "resumen": "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
                "director": "George Lucas",
                "productor": "Gary Kurtz, Rick McCallum",
                "fecha_lanzamiento": "1977-05-25"
            }
        }
    ]
}
```

## Curl para la consultar historial
```
curl --location 'http://localhost:3003/dev/sala-cine/historial?limit=2'
```

Response:
```
{
    "items": [
        {
            "sala_cine_id": 3,
            "direccion": "Av. Larco",
            "pelicula_estreno": [
                {
                    "fecha_hora_inicio": {},
                    "fecha_hora_fin": {},
                    "pelicula": {
                        "titulo": "A New Hope",
                        "episodio_id": 4,
                        "resumen": "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
                        "productor": "Gary Kurtz, Rick McCallum",
                        "fecha_lanzamiento": "1977-05-25",
                        "director": "George Lucas"
                    }
                }
            ],
            "tipo_sala": "3D",
            "numero_sala": 1,
            "capacidad": 70
        }
    ],
    "count": 1,
    "hasMore": false
}
```


## Comandos de ayuda para el proyecto
#### Iniciar la app en modo local
```
npm run start
```

#### Ejecutar los Unit Test
```
npm run test
```

#### Ejecutar lint para detectar código con potencial a generar error
```
npm run lint

npm run lint:fix
```

#### Ejecutar format para detectar código con potencial a generar error
```
npm run format

npm run format:fix
```
