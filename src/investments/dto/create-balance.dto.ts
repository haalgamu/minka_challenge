import { IsNotEmpty, IsPositive, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OPERATIONS } from '../../entities/movements.entity';

export class CreateBalanceDto {
  amount: number;
  project: number;
  user: number;
}
