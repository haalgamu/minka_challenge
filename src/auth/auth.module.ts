import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Encrypter } from '../helpers/encrypt.service';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.startegy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.experiesIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Encrypter, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
