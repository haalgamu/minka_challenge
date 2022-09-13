import * as AWS from 'aws-sdk';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { SQSService } from './sqs.service';
import configuration from '../config/configuration';

export type AWSCredentials = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

@Module({})
export class AWSModule {
  static register(): DynamicModule {
    return {
      module: AWSModule,
      imports: [],
      providers: [
        {
          provide: SQSService,
          useFactory(): SQSService {
            AWS.config.region = process.env.AWS_REGION;

            AWS.config.update({
              credentials: new AWS.Credentials({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              }),
            });
            const sqs = new AWS.SQS();
            return new SQSService(sqs);
          },
        },
      ],
      exports: [SQSService],
    };
  }
}
