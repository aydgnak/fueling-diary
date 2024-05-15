import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@services/prisma';
import { CreateUserDto, UpdateUserDto } from './dto';
import { hashHelper } from './helpers';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findOne(uuid: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { uuid } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkUsername(createUserDto.username);

    createUserDto.password = await hashHelper(createUserDto.password);

    return this.prismaService.user.create({ data: createUserDto });
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(uuid);

    if (updateUserDto.username) {
      await this.checkUsername(updateUserDto.username);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hashHelper(updateUserDto.password);
    }

    return this.prismaService.user.update({
      where: { uuid },
      data: updateUserDto,
    });
  }

  async delete(uuid: string): Promise<User> {
    await this.findOne(uuid);

    return this.prismaService.user.delete({ where: { uuid } });
  }

  async checkUsername(username: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (user) {
      throw new ConflictException('Username already exists');
    }
  }
}
