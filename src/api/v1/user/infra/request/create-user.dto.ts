import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Fulano de Tal' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Fulano_Tal',
    description: 'Nome pelo qual será identificado para login',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '999.999.999-99' })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ example: '44999993311' })
  @IsNumber()
  @IsNotEmpty()
  telefone: number;
}
