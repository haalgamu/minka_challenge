import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Currency, Project, User } from '../entities';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  ResourceOptions,
  ResourceService,
} from '../helpers/generic_resource.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class ProjectsService extends ResourceService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly currencyService: CurrenciesService,
  ) {
    super(projectRepository, 'Project');
  }

  async create(
    data: CreateProjectDto,
    options: ResourceOptions,
  ): Promise<Project> {
    let project = this.buildEntityInstance({
      ...data,
      user: options.authUser.id,
    });

    try {
      await this.dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          let currency = this.currencyService.buildEntityInstance({
            cod: data.currencyCod,
            user: options.authUser.id,
          });
          project = await transactionalEntityManager.save(project);
          currency.project = project.id;
          currency = await transactionalEntityManager.save(currency);

          project = await transactionalEntityManager.findOne(Project, {
            relations: {
              currency: true,
            },
            where: { id: project.id },
          });
        },
      );
      return project;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e.detail,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* async findAll(options?: ResourceOptions): Promise<Project[]> {
    const findOptions: any = {};
    if (options && options.authUser! && !options.authUser.isOwner) {
      findOptions.relations = {
        user: true,
      };
      findOptions.where = {
        user: options.authUser,
      };
    }

    return super.findAll(findOptions);
  } */

  async remove(id: number): Promise<any> {
    try {
      let project: Project;

      await this.dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          project = await transactionalEntityManager.findOneBy(Project, { id });

          if (!project)
            throw new HttpException(
              {
                status: HttpStatus.NOT_FOUND,
                error: `${this.entityLabel} not found`,
              },
              HttpStatus.NOT_FOUND,
            );

          await transactionalEntityManager.delete(Currency, {
            project: project.id,
          });
          await transactionalEntityManager.remove(project);
        },
      );
      return project;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e.detail,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByCod(cod: string): Promise<Project> {
    try {
      const result = await this.projectRepository.findOneBy({ cod });
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
}
