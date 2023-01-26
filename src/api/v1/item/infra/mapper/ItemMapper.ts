import { Item } from 'src/infra/database/entity/item.entity';
import { ItemResponseDto } from '../response/response-item.dto';

export class ItemMapper {
  static async allItemsToResponse(
    entities: Item[],
  ): Promise<ItemResponseDto[]> {
    return entities.map((item) => {
      return new ItemResponseDto(
        item.id,
        item.name,
        item.description,
        item.quantity,
        item.updated_at,
      );
    });
  }

  static async itemEntityToItemResponse(item: Item): Promise<ItemResponseDto> {
    return new ItemResponseDto(
      item.id,
      item.name,
      item.description,
      item.quantity,
      item.updated_at,
    );
  }
}
