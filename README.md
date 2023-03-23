## Sobre o projeto.

Esse projeto foi construido com a finalidade de aprofundamento de tecnicas com NestJs, utilizaremos tecnicas do Docker Compose para criar nosso banco de dados padrão e documentação via Swagger. O projeto trata-se de um CRUD para cadastro de itens, consulta e atualização. Algo bem simples apenas exemplificar a construção e as tecnicas do NestJs.

A versão Node utilizada foi a Node.js (18.7.0).

## Inicialização do projeto

O primeiro passo foi a inicialização de um novo projeto com a CLI do proprio NestJs, executando o comando:

```bash
$ nest new nestjs-api
```

Caso não deseje instalar a CLI globalmente podemos executar o comando:

```bash
$ npx nest new nestjs-api
```

Ao executar um dos comandos acima teremos a lista de arquivos criados e o gerenciador de pacotes de sua preferencia (npm ou yarn). Por escolha pessoal utilizei o npm neste projeto.

Após inicializar o projeto podemos ver no terminal os logs de inicialização.

## Adicionando dependências

Antes que comecemos de fato a modificação de codigo vamos instalar algumas dependências como o [TypeORM](https://typeorm.io/) e o [PostgreSQL](https://www.postgresql.org/) para gerenciar o nosso banco de dados.

```bash
$ npm install --save @nestjs/typeorm typeorm pg
```

Vamos adicionar também a dependencia de ModuleConfig, responsável por carregar as declarações do arquivo .env nas variaveis de ambiente.

```bash
$ npm install --save @nestjs/config
```

Internamente o NestJs utiliza o dotnev, por isso não precisaremos instalar manualmente a dependência.

~_Por se tratar de um sistema desenvolvido apenas para estudo, vamos manter o arquivo .env no repositório, mas por praticas de segurança não esqueça de adicionar o .env em seu .gitignore para não expor seus acessos a pessoas má intencionadas._~

```bash
$ npm install --save class-validator class-transformer
```

A dependência acima será utilizada para garantir que os valores recebidos por nossos DTOs (veremos a frente) estejam de acordo com o que esperamos. Podemos verificar a lista completa de validações na [documentação oficial](https://github.com/typestack/class-validator#validation-decorators)

Vamos também realizar a documentação dessa api via [Swager](https://docs.nestjs.com/openapi/introduction).

```bash
$ npm install --save @nestjs/swagger swagger-ui-express
```

## Banco de dados

Como vimos acima vamos utilizar o banco de dados [PostgreSQL](https://www.postgresql.org/) + [Docker Compose](https://www.docker.com/) para esse projeto.

~_Não adentraremos por enquanto na teoria do Docker Compose pois o foco é o NestJs, mais informações temos a documentação oficial._~

Iniciaremos criando um container para o PostgreSQL, que vai rodar em um container próprio. Para isso, criamos um arquivo chamado **docker-compose.yml** na pasta raiz do projeto.

No arquivo YAML vamos declarar:

```yml
version: '3.9'
services:
  #[.... composição da api]
  db:
    container_name: db
    image: postgres:14.7
    networks:
      - nest-js-network
    tty: true
    environment:
      - POSTGRES_DB=nest-js
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=root
    volumes:
      - ./database:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    expose:
      - 5432
networks:
  nest-js-network:
    driver: bridge
volumes:
  database:
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

Utilizando o NestCLI's CRUD para criar automaticamente a entidade, módulo, controlador REST, services e DTO's asssim como os arquivos .spec para os testes.

```bash
$ nest g resource item
```

Ao executar, devemos escolher a camada de transporte para o nosso recurso, no caso deste prjeto vamos utilizar a API REST, em seguida, **você gostaria de gerar pontos de entrada CRUD? (Y / n)?**, entramos com Y e Enter.

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

Observe que no arquivo **item.entity.ts** temos as definições de mapeamento feitas todas por Notations do TypeOrm.
No exemplo da coluna de descrição, só precisariamos declarar como @Column({ nulo: true }) pois se trata de um dado opcional, mas preenchemos todas as informações para obter mais detalhes.
Para o updateAt, foi utilizado o decorator @UpdateDateColumn, que atualiza o valor automaticamente, sempre que uma atualização é feita no registro.

Se inicializarmos o aplicativo a tabela será criada automaticamente em nosso banco de dados, com a estrutura definida acima, devido a sincronização ativada no AppModule (process.env.TYPEORM_SYNCHRONIZE).

```ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    }),
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Difinindo o DTO (Data Transfere Object)

**Data Transfer Object** (DTO) ou simplesmente **Transfer Object** é um padrão de projetos bastante usado em Java para o transporte de dados entre diferentes componentes de um sistema, diferentes instâncias ou processos de um sistema distribuído ou diferentes sistemas via serialização.

Não podemos expor diretamente nosso modelo interno ( do banco de dados ) àqueles que consomem a API, mas sim uma representação dos dados com os atributos relevantes ( ou permitidos ) para uso externo. Ter maior controle sobre os dados e a possibilidade de um melhor desempenho ( consultando apenas as colunas necessárias da tabela ) são algumas das vantagens do uso de DTOs. Então, vamos defini-los no arquivo **create-item.dto.ts**:

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

O arquivo de updateItemDto não será preciso nenhuma alteração pois o mesmo utilizará como base nosso **CreateItemDto** através da notation **PartialType(CreateItemDto)** que observará as propriedades e as transformará em opcionais.

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

Por fim, com as novas alterações devemos modificar o arquivo **item.controller.ts** substituindo o `+id` apenas por `id`.

```ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(id);
  }
}
```

Agora nossa api está finalmente implementada.

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

Para visualizar nossa documentação feita pelo swagger devemos inicializar a aplicação com:

```
$ npm run start:dev
```

e em nosso navegador acessamos pelo endereço: [http://localhost:3000/api](http://localhost:3000/api). Para saber mais como utilizar a documentação e testar nossas requisições podemos consultar a documentação do próprio [modulo Swagger dentro do NestJs](https://docs.nestjs.com/openapi/introduction)

## Referencias e Agradecimentos

O projeto de estudo foi montado seguindo as documentações oficiais e tutoriais a baixo, o credito é todo deles, sou apenas um Dev em desenvolvimento e devo tudo a eles. ;D

Este é apenas um ponto de partida pequeno dentro do NestJs, nele podemos ver quão simples e facil é a criação de apis com boas praticas de escrita, organização e agilidade de processo com ajuda da [NestCLI](https://docs.nestjs.com/cli/overview).

- [Data Transfer Object](https://martinfowler.com/eaaCatalog/dataTransferObject.html)
- [Creating an API with NestJS - SideChannel](https://www.sidechannel.blog/en/creating-an-api-with-nestjs/)
- [Brincando com o PostgreSQL - jtemporal](https://jtemporal.com/brincando-com-postgresql/)
- [Postgres + Docker Compose](https://www.linkedin.com/pulse/rodando-postgres-sql-em-um-container-docker-ruben-lins-silva/?trk=pulse-article_more-articles_related-content-card&originalSubdomain=pt)
- [Swager](https://docs.nestjs.com/openapi/introduction)

Obrigado por chegarem até aqui, eu sou [Tiago Landim](https://www.linkedin.com/in/landim-tiago/) e esse é o primeiro de muitos !!
