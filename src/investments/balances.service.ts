import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Balance, Movement, Project, User } from '../entities';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  ResourceOptions,
  ResourceService,
} from '../helpers/generic_resource.service';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class BalancesService extends ResourceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
  ) {
    super(balanceRepository, 'Balance');
  }

  async findByUserAndProject(
    userId: number,
    projectId: number,
  ): Promise<Balance> {
    try {
      const result = await this.balanceRepository.findOneBy({
        user: { id: userId },
        project: { id: projectId },
      });
      if (!result)
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `${this.entityLabel} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      return result;
    } catch (e) {
      throw new HttpException(
        {
          status: e.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: e.response?.error || e.message || e.detail,
        },
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(options?: ResourceOptions): Promise<Balance[]> {
    const params: any = {
      relations: {
        user: true,
        project: true,
      },
      where: {},
    };

    if (options && options.authUser! && !options.authUser.isOwner) {
      params.where.user = options.authUser;
    }

    return super.findAll(params);
  }
}
