import {
  Controller,
  Request,
  Post,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @ApiOperation({ summary: 'Do login' })
  login(@Request() req, @Body() body: LoginDto) {
    return this.authService.login(req.user);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get the current authenticated user' })
  me(@Request() req) {
    return req.user;
  }

  @Post('/register_member')
  @ApiOperation({ summary: 'Create a new user/member' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerNewUser(createUserDto);
  }
}
