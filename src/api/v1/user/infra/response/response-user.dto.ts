import { ApiResponseProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  username: string;

  @ApiResponseProperty()
  cpf: string;

  @ApiResponseProperty()
  telefone: number;

  @ApiResponseProperty()
  created_at: Date;

  @ApiResponseProperty()
  updated_at: Date;

  constructor(
    id: number,
    name: string,
    username: string,
    cpf: string,
    telefone: number,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.cpf = cpf;
    this.telefone = telefone;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
