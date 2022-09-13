import { IsNotEmpty, IsPositive, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OPERATIONS } from '../../entities/movements.entity';

export class CreateMovementDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
