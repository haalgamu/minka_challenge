import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';
import { OPERATIONS } from '../entities/movements.entity';

export interface SQSData {
  operation: OPERATIONS;
  projectId: number;
  userId: number;
  amount: number;
  at: string;
}

@Injectable()
export class SQSService {
  constructor(private sqs: SQS) {}

  public sendMessage(queueUrl: string, data: SQSData) {
    return new Promise((resolve, reject) => {
      console.log(queueUrl, data);
      this.sqs.sendMessage(
        {
          QueueUrl: queueUrl,
          MessageGroupId: data.projectId.toString(),
          MessageBody: JSON.stringify(data),
        },
        (err, data) => {
          console.log(err);
          if (err) reject(err);
          resolve(data);
        },
      );
    });
  }
}
