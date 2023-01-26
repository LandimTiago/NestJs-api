import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemDto } from './infra/request/create-item.dto';
import { UpdateItemDto } from './infra/request/update-item.dto';
import { Item } from '../../../infra/database/entity/item.entity';
import { ItemResponseDto } from './infra/response/response-item.dto';
import { ItemMapper } from './infra/mapper/ItemMapper';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly repository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    try {
      const item = this.repository.create(createItemDto);
      const result = await this.repository.save(item);

      return ItemMapper.itemEntityToItemResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to create item');
    }
  }

  async findAll(): Promise<ItemResponseDto[]> {
    try {
      const result = await this.repository.find();

      return ItemMapper.allItemsToResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to find items');
    }
  }

  async findOne(id: number): Promise<ItemResponseDto> {
    try {
      const result = await this.repository.findOneBy({ id });

      return ItemMapper.itemEntityToItemResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to find item');
    }
  }

  async update(
    id: number,
    updateItemDto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    try {
      const item = await this.repository.preload({
        id: id,
        ...updateItemDto,
      });
      if (!item) {
        throw new NotFoundException(`Item ${id} not found`);
      }
      await this.repository.save(item);

      return ItemMapper.itemEntityToItemResponse(item);
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to update item');
    }
  }

  async remove(id: number) {
    try {
      const item = await this.repository.findOneBy({ id });
      return this.repository.remove(item);
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to delete item');
    }
  }
}
