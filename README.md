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

## Curl para la consulta sala de cine
```
curl --location 'http://localhost:3003/dev/sala-cine/75'
```

## Curl para la consultar historial
```
curl --location 'http://localhost:3003/dev/sala-cine/historial?limit=2'
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
