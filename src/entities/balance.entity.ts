import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity({
  name: 'balances',
})
export class Balance {
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
}
