import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@services/prisma';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async findOne(uuid: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { uuid } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const checkUser: User | null = await this.prismaService.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (checkUser) {
      throw new ConflictException('Username already exists');
    }

    return await this.prismaService.user.create({ data: createUserDto });
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(uuid);

    return await this.prismaService.user.update({
      where: { uuid },
      data: updateUserDto,
    });
  }

  async delete(uuid: string): Promise<User> {
    await this.findOne(uuid);

    return await this.prismaService.user.delete({ where: { uuid } });
  }
}
