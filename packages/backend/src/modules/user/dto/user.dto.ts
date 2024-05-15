import { User } from '@prisma/client';

export class UserDto {
  uuid: string;
  username: string;

  static mapper(user: User | User[]) {
    if (Array.isArray(user)) {
      return user.map((v) => UserDto.mapper(v));
    }

    const userDto = new UserDto();
    userDto.uuid = user.uuid;
    userDto.username = user.username;

    return userDto;
  }
}
