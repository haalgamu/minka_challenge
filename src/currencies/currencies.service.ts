import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from '../entities';
import { Repository } from 'typeorm';
import { ResourceService } from '../helpers/generic_resource.service';

@Injectable()
export class CurrenciesService extends ResourceService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {
    super(currencyRepository, 'Currency');
  }
}
