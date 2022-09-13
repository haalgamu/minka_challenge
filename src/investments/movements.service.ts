import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Movement, Project, User } from '../entities';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  ResourceOptions,
  ResourceService,
} from '../helpers/generic_resource.service';
import { CurrenciesService } from '../currencies/currencies.service';

interface FindOptions {
  projectId?: number;
  userId?: number;
}

@Injectable()
export class MovementsService extends ResourceService {
  constructor(
    @InjectRepository(Movement)
    private movementRepository: Repository<Movement>,
  ) {
    super(movementRepository, 'Movement');
  }

  async findAll(
    findOptions: FindOptions,
    options?: ResourceOptions,
  ): Promise<Movement[]> {
    const params: any = {
      relations: {
        user: true,
        project: true,
      },
      where: {},
    };

    if (findOptions.projectId)
      params.where.project = { id: findOptions.projectId };
    if (findOptions.userId) params.where.user = findOptions.userId;

    if (options && options.authUser! && !options.authUser.isOwner) {
      params.where.user = options.authUser;
    }

    return super.findAll(params);
  }
}
