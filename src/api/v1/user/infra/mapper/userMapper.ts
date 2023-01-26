import { User } from 'src/infra/database/entity/user.entity';
import { UserResponseDto } from '../response/response-user.dto';

export class UserMapper {
  static async allUserToResponse(entities: User[]): Promise<UserResponseDto[]> {
    return entities.map((user) => {
      return new UserResponseDto(
        user.id,
        user.name,
        user.username,
        user.cpf,
        user.telefone,
        user.created_at,
        user.updated_at,
      );
    });
  }

  static async userEntityToUserResponse(user: User): Promise<UserResponseDto> {
    return new UserResponseDto(
      user.id,
      user.name,
      user.username,
      user.cpf,
      user.telefone,
      user.created_at,
      user.updated_at,
    );
  }
}
