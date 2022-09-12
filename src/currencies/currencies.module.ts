import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
