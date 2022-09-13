import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity({
  name: 'balances',
})
export class Balance {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  //Relations
  @ManyToOne(() => User, (user) => user.balances)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Project, (project) => project.balances)
  @JoinColumn()
  project: Project;

  withdraw(amount: number) {
    if (this.amount < amount) {
      throw new Error('Insufficient funds.');
    }
    this.amount = this.amount - amount;
  }

  deposit(amount: number) {
    this.amount = this.amount + amount;
  }
}
