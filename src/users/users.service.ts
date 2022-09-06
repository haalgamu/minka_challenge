import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities';
import { Encrypter } from '../helpers/encrypt.service';
import { ResourceService } from '../helpers/generic_resource.service';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

interface UserFilters {
  id?: number;
  email?: string;
}

@Injectable()
export class UsersService extends ResourceService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private encrypter: Encrypter,
  ) {
    super(usersRepository, 'User');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.encrypter.encrypt(
      createUserDto.password,
    );
    return super.create(createUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.hasOwnProperty('password')) {
      (updateUserDto as any).password = await this.encrypter.encrypt(
        (updateUserDto as any).password,
      );
    }
    return super.update(id, updateUserDto);
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const result = await this.usersRepository.findOneBy({ email });
      if (!result)
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `${this.entityLabel} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      return result;
    } catch (e) {
      throw new HttpException(
        {
          status: e.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: e.response?.error || e.message || e.detail,
        },
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
