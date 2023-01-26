import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ItemService } from './item.service';
import { CreateItemDto } from './infra/request/create-item.dto';
import { UpdateItemDto } from './infra/request/update-item.dto';
import { ItemResponseDto } from './infra/response/response-item.dto';

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar novo item' })
  @ApiResponse({
    status: 201,
    description: 'Item criado com sucesso',
  })
  async create(@Body() createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    return await this.itemService.create(createItemDto);
  }

  @Get()
  async findAll(): Promise<ItemResponseDto[]> {
    return await this.itemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ItemResponseDto> {
    return await this.itemService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    return await this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.itemService.remove(+id);
  }
}
