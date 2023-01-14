<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## About Project

Esse projeto foi construido com a finalidade de aprofundamento de tecnicas com NestJs com conexão a banco de dados e segurança. O projeto foi construido aos poucos aplicando boas praticas de escrita, testes e documentação.

A versão Node utilizada foi a Node.js (>= 18.7.0)

## Steps

### Inicialização do projeto

O primeiro passo foi a inicialização de um novo projeto com a CLI do proprio NestJs, executando o comando

```bash
$ nest new nestjs-api
```

Caso não deseje instalar a CLI globalmente podemos executar o comando:

```bash
$ npx nest new nestjs-api
```

Ao executar um dos comandos acima teremos a lista de arquivos criados e o gerenciador de pacotes de sua preferencia (npm ou yarn). Por escolha pessoal vamos utilizar o npm neste projeto.

Após inicializar o projeto podemos ver no terminal os logs de inicialização.

### Criando a estrutura de entidades

O framework do NestJs fornece uma serie de scripts prontos para a criação de estruturas completas de CRUDs, microserviços e etc.

Utilizando o NestCLI's CRUD para criar automaticamente a entidade, modulo, controlador REST, service e DTO's asssim como os arquivos .spec para os testes.

```bash
$ nest g resource item
```

Ao executar, devemos escolher a camada de transporte para o nosso recurso, no caso deste prjeto vamos utilizar a API REST, em seguida, **voce gostaria de gerar pontos de entrada CRUD? (Y / n)?**, entramos com Y e Enter.

Após isso vemos que a pasta item foi criada no nosso diretorio src.

### Adicionando persistência.

Antes que comecemos de fato a modificação de codigo vamos instalar algumas dependencias como o [TypeORM](https://typeorm.io/) e o [PostgreSQL](https://www.postgresql.org/) para gerenciar o nosso banco de dados.

```bash
$ npm install --save @nestjs/typeorm typeorm pg
```

Vamos adicionar também a dependencia de ModuleConfig, responsável por carregar as declarações do arquivo .env nas variaveis de ambiente.

```bash
$ npm install --save @nestjs/config
```

Internamente o NestJs utiliza o dotnev, por isso não precisaremos instalar manualmente a dependencia.

Por se tratar de um sistema desenvolvido apenas para estudo, vamos manter o arquivo .env no repositorio, mas por praticas de segurança não esqueça de adicionar o .env em seu .gitignore para que não exponha seus acessos a pessoas má intencionadas.

### Banco de dados

Como vimos acima vamos utilizar o banco de dados [PostgreSQL](https://www.postgresql.org/) + [Docker](https://www.docker.com/) Compose para esse projeto.

Como dito, vamos utilizar o docker compose, que é uma ferramenta de definição e runtime de aplicações multi-container.

Iniciaremos criando um container para o PostgreSQL, que vai rodar em um container próprio. Para isso, criamos um arquivo chamado **docker-compose.yaml** na pasta raiz do projeto.

No arquivo YAML vamos declarar:

```yaml
version: '3.8'
services:
  db:
    image: postgres
    container_name: nest-js-db
    tty: true
    environment:
      - POSTGRES_DB=nest-js
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=root
    volumes:
      - nest-js-pgdata:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    expose:
      - 5432
    networks:
      - portal-network
networks:
  portal-network:
    driver: bridge
    external: true
volumes:
  nest-js-pgdata:
    external: true
```

- **version**: a versão do formato do arquivo Docker Compose. Segue uma especificação definida pela própria Docker e depende da versão do Docker Runtime. Para mais informações, consulte a [documentação oficial](https://docs.docker.com/compose/compose-file/compose-versioning/).
- **services**: aqui segue a lista de containers da nossa aplicação. Para cada container, uma série de parâmetros deverão ser informados. Os parâmetros vão variar conforme o container que está sendo criado.
- **image**: todo container criado com Docker tem uma imagem de base. Imagens são como templates para a construção de containers. Utilizamos uma imagem oficial do Postgres, na versão 14, com uma tag alpine. Imagens alpine são bastante enxutas e de tamanho reduzido, sendo, portanto, adequadas para deploy de aplicações, principalmente em produção.
- **container_name**: nome do container a ser criado e a partir do qual poderemos referenciá-lo nos comandos de cli do Docker.
- **ports**: as portas do container listadas aqui serão compartilhadas com os serviços descritos no arquivo docker-compose.yml e com o host. É possível especificar uma porta do host para fazer binding. Caso não seja especificada uma porta do host, uma randômica será utilizada. No nosso exemplo, a porta 5432 do container estárá ligada à porta 5432 do host.
- **volumes**: containers, por concepção, não devem conter dados persistentes. Containers que precisem persistir dados devem especificar volumes, que são áreas de armazenamento do host mapeadas e montadas no container. Arquivos dessas pastas não serão alterados ou removidos depois que os containers forem desligados (exceção para o comando docker-compose down --volumes)

Agora com as configurações prontas, rodamos o comando para subir o container:

```bash
$ docker compose up -d
```

### Referencias e Agradecimentos

O projeto foi montado seguindo as documentações oficiais e os tutoriais de:

[SideChannel](https://www.sidechannel.blog/en/creating-an-api-with-nestjs/)
[jtemporal](https://jtemporal.com/brincando-com-postgresql/)
[Postgres + Docker Compose](https://www.linkedin.com/pulse/rodando-postgres-sql-em-um-container-docker-ruben-lins-silva/?trk=pulse-article_more-articles_related-content-card&originalSubdomain=pt)
