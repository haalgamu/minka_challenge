import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities';
import { UsersService } from '../users/users.service';
import { Encrypter } from '../helpers/encrypt.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export interface LoginResponse {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private encrypter: Encrypter,
    private jwtService: JwtService,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    try {
      const user = await this.userService.findByEmail(email);
      if (await this.encrypter.compare(password, user.password)) {
        return user;
      }
    } catch (e) {}
    return null;
  }

  async createToken(user: User): Promise<string> {
    return this.jwtService.sign({
      id: user.id,
      username: user.email,
    });
  }

  async login(user: User): Promise<any> {
    return {
      token: await this.createToken(user),
    };
  }

  async registerNewUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
