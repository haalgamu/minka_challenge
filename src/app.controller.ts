import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  index() {
    return 'Ok';
  }
}
