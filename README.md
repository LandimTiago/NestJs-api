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

Esse projeto foi construido com a finalidade de aprofundamento de tecnicas com NestJs com conexão a banco de dados via containerização, utilizaremos também tecnicas do Docker Compose para criar nosso banco de dados padrão e documentação via Swagger. O projeto trata-se de um CRUD para cadastro de itens, consulta e atualização. Algo bem simples apenas exemplificar a construção e as tecnicas do NestJs.

A versão Node utilizada foi a Node.js (>= 18.7.0).

## Inicialização do projeto

O primeiro passo foi a inicialização de um novo projeto com a CLI do proprio NestJs, executando o comando:

```bash
$ nest new nestjs-api
```

Caso não deseje instalar a CLI globalmente podemos executar o comando:

```bash
$ npx nest new nestjs-api
```

Ao executar um dos comandos acima teremos a lista de arquivos criados e o gerenciador de pacotes de sua preferencia (npm ou yarn). Por escolha pessoal vamos utilizar o npm neste projeto.

Após inicializar o projeto podemos ver no terminal os logs de inicialização.

## Adicionando dependências

Antes que comecemos de fato a modificação de codigo vamos instalar algumas dependencias como o [TypeORM](https://typeorm.io/) e o [PostgreSQL](https://www.postgresql.org/) para gerenciar o nosso banco de dados.

```bash
$ npm install --save @nestjs/typeorm typeorm pg
```

Vamos adicionar também a dependencia de ModuleConfig, responsável por carregar as declarações do arquivo .env nas variaveis de ambiente.

```bash
$ npm install --save @nestjs/config
```

Internamente o NestJs utiliza o dotnev, por isso não precisaremos instalar manualmente a dependencia.

~_Por se tratar de um sistema desenvolvido apenas para estudo, vamos manter o arquivo .env no repositorio, mas por praticas de segurança não esqueça de adicionar o .env em seu .gitignore para não expor seus acessos a pessoas má intencionadas._~

```bash
$ npm install --save class-validator class-transformer
```

A dependencia acima será utilizada para garantir que os valores recebidos por nossos DTOs (veremos a frente) estejam de acordo com o que esperamos. Podemos verificar a lista completa de validadores na [documentação](https://github.com/typestack/class-validator#validation-decorators)

Vamos também realizar a documentação dessa api via [Swager](https://docs.nestjs.com/openapi/introduction). Com apenas a instalação temos em pleno funcionamento para uso.

```bash
$ npm install --save @nestjs/swagger swagger-ui-express
```

## Banco de dados

Como vimos acima vamos utilizar o banco de dados [PostgreSQL](https://www.postgresql.org/) + [Docker Compose](https://www.docker.com/) para esse projeto.

O docker compose, é uma ferramenta de definição e runtime de aplicações multi-container.

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

## Criando a estrutura de entidades

O framework do NestJs fornece uma serie de scripts prontos para a criação de estruturas completas de CRUDs, microserviços e etc.

Utilizando o NestCLI's CRUD para criar automaticamente a entidade, modulo, controlador REST, service e DTO's asssim como os arquivos .spec para os testes.

```bash
$ nest g resource item
```

Ao executar, devemos escolher a camada de transporte para o nosso recurso, no caso deste prjeto vamos utilizar a API REST, em seguida, **voce gostaria de gerar pontos de entrada CRUD? (Y / n)?**, entramos com Y e Enter.

Após isso vemos que a pasta item foi criada no nosso diretorio src com nossos arquivos padroes do CRUD e também a pasta entities e dto.

Agora podemos finalmente definir nossa entidade item:

```ts
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ name: 'quantity', type: 'int', default: 1 })
  quantity: number;
}
```

Observe que no arquivo **item.entity.ts** temos as definições de mapeamento feitas todas por Notations do TypeOrm. No exemplo da coluna de descrição que declaramos, só poderíamos usar @Column({ nulo: true }), mas preenchemos tudo para obter mais detalhes. Para updateAt, foi utilizado o decorador @UpdateDateColumn, que atualiza o valor automaticamente, sempre que uma atualização é feita no registro.

Se inicializarmos o aplicativo a tabela será criada automativamente em nosso banco de dados, com a estrutura definida acima, devido a sincronização ativada no AppModule.

## Difinindo o DTO (Data Transfere Object)

**Data Transfer Object** (DTO) ou simplesmente **Transfer Object** é um padrão de projetos bastante usado em Java para o transporte de dados entre diferentes componentes de um sistema, diferentes instâncias ou processos de um sistema distribuído ou diferentes sistemas via serialização.

Ao usar DTOs, não podemos expor diretamente nosso modelo interno ( do banco de dados ) àqueles que consomem a API, mas sim uma representação dos dados com os atributos relevantes ( ou permitidos ) para uso externo. Ter maior controle sobre os dados e a possibilidade de um melhor desempenho ( consultando apenas as colunas necessárias da tabela ) são algumas das vantagens do uso de DTOs. Então, vamos defini-los:

```ts
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  quantity: number;
}
```

O arquivo de updateItemDto não será preciso nenhuma alteração pois o mesmo utilizará como base nosso **CreateItemDto** através da notação **PartialType(CreateItemDto)** que observará as propriedades e as transformará em opcionais.

Agora, atualizaremos nosso arquivo **main.ts** para que execute a validação automatica, adicionando a linha `app.useGlobalPipes(new ValidationPipe());`

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
```

## Implementando ItemService

Utilizando o padrão Repository, vamos criar uma abstração para maneira como obtemos os dados para a entidade. Como no caso do item, temos um CRUD simples, vamos usar o Repository fornecido pelo TypeORM:

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly repository: Repository<Item>,
  ) {}

  create(createItemDto: CreateItemDto): Promise<Item> {
    const item = this.repository.create(createItemDto);
    return this.repository.save(item);
  }

  findAll(): Promise<Item[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Item> {
    return this.repository.findOne(id);
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.repository.preload({
      id: id,
      ...updateItemDto,
    });
    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    return this.repository.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    return this.repository.remove(item);
  }
}
```

Como estamos usando um provedor externo, precisamos declarar seu modulo como uma importação de **item.module.ts**, deixando assim:

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
```

Por fim, com as novas alterações devemos modificar o arquivo **item.controller.ts** substituindo o `+id` apenas por `id`. Agora nossa api está finalmente implementada.

## Documentando a Api.

O Swagger é uma maneira simples e pratica para se documentar APIs de acordo com a OpenApi.

Vamos atualizar nosso modulo **main.ts** para ficar assim:

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Lista de itens')
    .setDescription('Minha lista de itens para compras')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
```

Agora, precisamos apenas atualizar nossas entidades e os DTOs com os decoratos para sejam identificados pelo Swagger.

Em nosso DTO **create-item.dto.ts** vamos adicionar as importações de atributos @ApiProperty(). Quando a variavel for opcional podemos usar o @ApiPropertyoptional(). O arquivo ficará assim:

```ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ example: 'Bananas' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'bananas',
    description: 'Optional description of the item',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 5, description: 'Needed quantity' })
  @IsInt()
  @Min(0)
  quantity: number;
}
```

Já para o caso o **update-item.dto.ts** por utilizar as especificações de dentro de nosso **create-item.dto.ts** ja temos a injeção dos decorators dentro dele, apenas precisamos trocar a importação do **ParcialType** para que venha de dentro do modulo do swagger e esta tudo pronto. O arquivo ficará assim:

```ts
import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {}
```

Para visualizar nossa documentação feita pelo swagger devemos inicializar a aplicação com

```
$ npm run start:dev
```

e em nosso navegador acessamos pelo endereço: [http://localhost:3000/api](http://localhost:3000/api). Para saber mais como utilizar a documentação e testar nossas requisições podemos consultar a documentação do próprio [modulo Swagger dentro do NestJs](https://docs.nestjs.com/openapi/introduction)

## Testes Unitários

Os testes unitários é uma fase muito importante do desenvolvimento da nossa aplicação, ela vai garantir a qualidade e a entrega de valores como esperados em tempo de desenvolvimento. por padrão o NestJs tem o [Jest](https://github.com/facebook/jest) integrado ao seu codigo. Vamos instalar apenas o modulo de testes do próprio NestJs.

```bash
$ npm i --save-dev @nestjs/testing
```

Antes de começarmos nossos testes vamos fazer algumas alterações em nossa entidade. Dentro do nosso aquivo **item.entity.ts** vamos declarar um constrututor:

```ts
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Item extends BaseEntity {
  // ...RESTANTE DO CODIGO FEITO ANTERIORMENTE

  constructor(item?: Partial<Item>) {
    super();
    this.id = item?.id;
    this.updated_at = item?.updated_at;
    this.name = item?.name;
    this.description = item?.description;
    this.quantity = item?.quantity;
  }
}
```

Assim como quando realizamos a declaração do nosso Dto de update, o uso do Partial<Item> transforma todas as propriedades existentes dentro do nosso Item como opcionais, evitando assim qualquer tipo de erro pela não inserção desse parâmetro. Esse construtor servirá para quando realizarmos nossos testes eles devolvam aquilo que precisamos.

O teste unitário tem por objetivo testar apenas a nossa implementação

## Referencias e Agradecimentos

O projeto de estudo foi montado seguindo as documentações oficiais e tutoriais a baixo. Este é apenas um ponto de partida pequeno dentro do NestJs, nele podemos ver quão simples e facil é a criação de apis com boas praticas de escrita, organização e agilidade de processo com ajuda da [NestCLI](https://docs.nestjs.com/cli/overview).

- [Data Transfer Object](https://martinfowler.com/eaaCatalog/dataTransferObject.html)
- [Creating an API with NestJS - SideChannel](https://www.sidechannel.blog/en/creating-an-api-with-nestjs/)
- [Brincando com o PostgreSQL - jtemporal](https://jtemporal.com/brincando-com-postgresql/)
- [Postgres + Docker Compose](https://www.linkedin.com/pulse/rodando-postgres-sql-em-um-container-docker-ruben-lins-silva/?trk=pulse-article_more-articles_related-content-card&originalSubdomain=pt)
- [Swager](https://docs.nestjs.com/openapi/introduction)
