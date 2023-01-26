import { ApiResponseProperty } from '@nestjs/swagger';

export class ItemResponseDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  quantity: number;

  @ApiResponseProperty()
  updated_at: Date;

  constructor(
    id: number,
    name: string,
    description: string,
    quantity: number,
    updated_at: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.updated_at = updated_at;
  }
}
