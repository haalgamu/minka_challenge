import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { ResourceOptions } from '../helpers/generic_resource.service';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  FindOneOptions,
  ObjectType,
} from 'typeorm';
import { CreateMovementDto } from './dto/create-movement.dto';
import { MovementsService } from './movements.service';
import { Movement, Project, Balance as BalanceEntity, User } from '../entities';
import { ZEFProjectConfig } from '../config/configuration';
import { OPERATIONS } from 'src/entities/movements.entity';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { BalancesService } from './balances.service';
import { ProjectsService } from 'src/projects/projects.service';

export interface InvestmentMessage {
  message: string;
  success: boolean;
}

@Injectable()
export class InvestmentsService {
  private ZEFProject: ZEFProjectConfig;

  constructor(
    private configService: ConfigService,
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly projectService: ProjectsService,
    private readonly movementService: MovementsService,
    private readonly balanceService: BalancesService,
  ) {
    this.ZEFProject = this.configService.get('ZEF_PROJECT');
  }

  private async getBalance(
    findOptions: FindOneOptions,
    entityManager: EntityManager,
  ): Promise<BalanceEntity> {
    const balance = await entityManager.findOne(BalanceEntity, {
      ...findOptions,
      relations: ['project', 'user'],
    });
    return balance;
  }

  private async createBalance(
    createBalanceDto: CreateBalanceDto,
    entityManager: EntityManager,
  ) {
    return await entityManager.save(
      this.balanceService.buildEntityInstance(createBalanceDto),
    );
  }

  /*
  Flow:
    1. Verify if you have sufficient funds in the initial currency.
    2. Withdraw currency amount (Create motion of type WITHDRAWAL)
    3. Deposit the amount in the project.(Create motion of type DEPOSIT)
  */
  private async moveTo(
    fromProject: Project,
    toProject: Project,
    amount: number,
    user: User,
  ): Promise<InvestmentMessage> {
    const NotEnoughFundsException = new HttpException(
      {
        status: HttpStatus.PRECONDITION_FAILED,
        error: 'Insufficient funds.',
      },
      HttpStatus.PRECONDITION_FAILED,
    );
    let investResult: InvestmentMessage = {
      message: 'Insufficient funds.',
      success: false,
    };
    try {
      await this.dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          const fromBalance = await this.getBalance(
            {
              where: {
                project: { id: fromProject.id },
                user: { id: user.id },
              },
            },
            transactionalEntityManager,
          );

          let toBalance = await this.getBalance(
            {
              where: {
                project: { id: toProject.id },
                user: { id: user.id },
              },
            },
            transactionalEntityManager,
          );

          if (!fromBalance) throw NotEnoughFundsException;

          if (!toBalance)
            toBalance = await this.createBalance(
              {
                project: toProject.id,
                user: user.id,
                amount: 0,
              },
              transactionalEntityManager,
            );

          //2. Withdraw currency amount (Create motion of type WITHDRAWAL)
          fromBalance.withdraw(amount);

          await transactionalEntityManager.save(
            Movement,
            this.movementService.buildEntityInstance({
              operation: OPERATIONS.WITHDRAWAL,
              at: new Date(),
              project: fromProject.id,
              user: user.id,
              amount,
            }),
          );

          await transactionalEntityManager.save(BalanceEntity, fromBalance);

          //3. Deposit the amount in the project.(Create motion of type DEPOSIT)
          toBalance.deposit(amount);
          await transactionalEntityManager.save(
            Movement,
            this.movementService.buildEntityInstance({
              operation: OPERATIONS.DEPOSIT,
              at: new Date(),
              project: toProject.id,
              user: user.id,
              amount,
            }),
          );

          await transactionalEntityManager.save(BalanceEntity, toBalance);

          (investResult.message = `${fromProject.cod} => ${toProject} : ${amount}`),
            (investResult.success = true);
        },
      );

      return investResult;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: e.detail || e.message,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async invest(
    projectId: number,
    createMovementDto: CreateMovementDto,
    options: ResourceOptions,
  ): Promise<InvestmentMessage> {
    try {
      const fromProject = await this.projectService.findByCod(
        this.ZEFProject.COD,
      );
      const toProject = await this.projectService.findOne(projectId);

      return this.moveTo(
        fromProject,
        toProject,
        createMovementDto.amount,
        options.authUser,
      );
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: e.detail || e.message,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async withdraw(
    projectId: number,
    createMovementDto: CreateMovementDto,
    options: ResourceOptions,
  ): Promise<InvestmentMessage> {
    try {
      const fromProject = await this.projectService.findOne(projectId);
      const toProject = await this.projectService.findByCod(
        this.ZEFProject.COD,
      );

      return this.moveTo(
        fromProject,
        toProject,
        createMovementDto.amount,
        options.authUser,
      );
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: e.detail || e.message,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async depositZKN(
    createMovementDto: CreateMovementDto,
    options: ResourceOptions,
  ): Promise<BalanceEntity> {
    try {
      const zefProject = await this.projectService.findByCod(
        this.ZEFProject.COD,
      );
      let zefBalance: BalanceEntity;
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        zefBalance = await this.getBalance(
          {
            where: {
              project: { id: zefProject.id },
              user: { id: options.authUser.id },
            },
          },
          transactionalEntityManager,
        );
        console.log(zefBalance);
        if (!zefBalance)
          zefBalance = await this.createBalance(
            {
              project: zefProject.id,
              user: options.authUser.id,
              amount: 0,
            },
            transactionalEntityManager,
          );

        zefBalance.amount += createMovementDto.amount;
        await transactionalEntityManager.save(zefBalance);
        await transactionalEntityManager.save(
          Movement,
          this.movementService.buildEntityInstance({
            operation: OPERATIONS.DEPOSIT,
            at: new Date(),
            project: zefProject.id,
            user: options.authUser.id,
            amount: createMovementDto.amount,
          }),
        );
      });

      return zefBalance;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: e.detail || e.message,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  findAll(user: User) {}
}
