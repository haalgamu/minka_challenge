import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entities';
import { Repository } from 'typeorm';

export interface ResourceOptions {
  authUser?: User;
}
export class ResourceService {
  constructor(
    private entityRepository: Repository<any>,
    protected entityLabel,
  ) {}

  public buildEntityInstance(data: any): any {
    return this.entityRepository.create(data);
  }

  async create(data: any, options?: ResourceOptions): Promise<any> {
    try {
      const result: any = await this.entityRepository.save(data);
      return result;
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

  findAll(findOptions?: any, options?: ResourceOptions): Promise<any[]> {
    return this.entityRepository.find(findOptions);
  }

  async findOne(id: number): Promise<any> {
    try {
      const result = await this.entityRepository.findOneBy({ id });
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

  async update(id: number, data: any): Promise<any> {
    try {
      const result = await this.entityRepository.update({ id }, data);
      if (result.affected === 0)
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `${this.entityLabel} not found`,
          },
          HttpStatus.NOT_FOUND,
        );

      return this.findOne(id);
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

  remove(id: number): Promise<any> {
    return this.entityRepository.delete(id);
  }
}
