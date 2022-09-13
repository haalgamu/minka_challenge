import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import { ConfigService } from '@nestjs/config';

import dataSource from '../datasource.config';
import Entities, {
  Balance,
  Currency,
  Movement,
  Project,
  User,
} from '../entities';

import Configuration from '../config/configuration';

import { Encrypter } from '../helpers/encrypt.service';
import { UsersService } from '../users/users.service';
import { InvestmentsService } from '../investments/investments.service';
import { ProjectsService } from '../projects/projects.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { MovementsService } from '../investments/movements.service';
import { BalancesService } from '../investments/balances.service';
import { SQSData } from './sqs.service';
import { OPERATIONS } from 'src/entities/movements.entity';

export async function createSQSConsumer() {
  AWS.config.region = process.env.AWS_REGION;

  AWS.config.update({
    credentials: new AWS.Credentials({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }),
  });

  const SQS = new AWS.SQS();

  await dataSource.initialize();

  const configService = new ConfigService(Configuration());
  const encrypter = new Encrypter();

  const usersService = new UsersService(
    dataSource.getRepository(User),
    encrypter,
  );
  const currenciesService = new CurrenciesService(
    dataSource.getRepository(Currency),
  );
  const projectsService = new ProjectsService(
    dataSource,
    dataSource.getRepository(Project),
    currenciesService,
  );
  const movementsService = new MovementsService(
    dataSource.getRepository(Movement),
  );
  const balancesService = new BalancesService(
    dataSource.getRepository(Balance),
  );

  const investmentsService = new InvestmentsService(
    configService,
    dataSource,
    projectsService,
    movementsService,
    balancesService,
  );

  const app = Consumer.create({
    queueUrl: process.env.AWS_SQS_URL,
    handleMessage: async (message: AWS.SQS.Message) => {
      if (message) {
        const msgData: SQSData = JSON.parse(message.Body);

        console.log('Message is comming ', msgData);

        const authUser: User = await usersService.findOne(msgData.userId);

        if (msgData.operation == OPERATIONS.DEPOSIT) {
          investmentsService.invest(
            msgData.projectId,
            { amount: msgData.amount },
            { authUser },
          );
        } else if (msgData.operation == OPERATIONS.WITHDRAWAL) {
          investmentsService.withdraw(
            msgData.projectId,
            { amount: msgData.amount },
            { authUser },
          );
        }
      }
    },
    sqs: SQS,
  });

  app.on('error', (err) => console.error(err));
  app.on('processing_error', (processingError) =>
    console.error(processingError),
  );
  app.on('timeout_error', (timeoutError) => console.error(timeoutError));

  return app;
}
