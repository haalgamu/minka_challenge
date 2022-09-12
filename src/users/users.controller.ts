import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsOwnerGuard } from '../auth/is-owner.guard';
@ApiBearerAuth()
@ApiTags('user')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(IsOwnerGuard)
  @ApiOperation({ summary: 'Create a new user/member' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(IsOwnerGuard)
  @ApiOperation({ summary: 'Get a list of users/members' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user/member' })
  findOne(@Request() request, @Param('id') id: string): Promise<User> {
    if (request.user.id != id) throw new ForbiddenException();
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user/member' })
  update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (request.user.id != id) throw new ForbiddenException();
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user/member' })
  remove(@Request() request, @Param('id') id: string): Promise<any> {
    if (request.user.id != id) throw new ForbiddenException();
    return this.usersService.remove(+id);
  }
}
