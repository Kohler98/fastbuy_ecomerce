<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  

## Description

[Nest](https://github.com/H-ROD-10/fastbuy-backend) FastBuy Api.

## Installation

```bash
$ npm install
```
## Install Database Postgres

```bash
$ docker-compose up -d
```
```bash
En la raiz del proyecto se encuentra el archivo fatsbuy.sql 
una vez se inicie el contenedor de postgres restaure este archvo.

Login
{
  email: hector@gmail.com,
  password: Root03
}

Role: SUPER_ADMIN
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentacion Api
```bash
http://localhost:8000/api/
```
## Como Crear Un Producto
```
1. Registrarse como user, y actualizar el rol a Roles.ADMIN o Roles.SUPER_ADMIN
2. Verificar si existe la categoria
3. Crear el Producto

```
## Como subir imagenes
```
Utilizar postman, Body-> form-data agregar los campos requerido para producto, elegir en dropDown del field file
```
```bash
ruta: POTS http://Localhost:8000/api/v1/products/create-product
```
## Request
```
En la raiz del proyecto ubique el archivo request-collection que contiene la
mayoria de las request utilizadas
```

## Documento Tecnico
```
el archivo Documento-Tecnico ubicado en la Raiz del proyecto contiene 
un desgloce de las tecnologias a emplear para continuar con este desarrollo.
```
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Hector Rodriguez](https://h-rod-10.github.io/hector.rodriguez.github.io)
- Website - [https://nestjs.com](https://nestjs.com/)


## License

Nest is [MIT licensed](LICENSE).
