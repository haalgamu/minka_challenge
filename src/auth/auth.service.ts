import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities';
import { UsersService } from 'src/users/users.service';
import { Encrypter } from '../helpers/encrypt.service';

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
    const user = await this.userService.findByEmail(email);
    if (await this.encrypter.compare(password, user.password)) {
      return user;
    }
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
}
