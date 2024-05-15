import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.findAll();

    return UserDto.mapper(users);
  }

  @Get(':uuid')
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<UserDto> {
    const user = await this.userService.findOne(uuid);

    return UserDto.mapper(user);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const createdUser = await this.userService.create(createUserDto);

    return UserDto.mapper(createdUser);
  }

  @Put(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.update(uuid, updateUserDto);

    return UserDto.mapper(updatedUser);
  }

  @Delete(':uuid')
  async delete(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<UserDto> {
    const deletedUser = await this.userService.delete(uuid);

    return UserDto.mapper(deletedUser);
  }
}
