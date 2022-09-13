import { Module } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { BalancesService } from './balances.service';
import { MovementsService } from './movements.service';
import { ProjectsModule } from '../projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance, Movement } from '../entities';
import { AWSModule } from '../aws/aws.module';

@Module({
  imports: [
    ProjectsModule,
    TypeOrmModule.forFeature([Balance, Movement]),
    AWSModule.register(),
  ],
  controllers: [InvestmentsController],
  providers: [InvestmentsService, BalancesService, MovementsService],
  exports: [InvestmentsService, BalancesService, MovementsService],
})
export class InvestmentsModule {}
