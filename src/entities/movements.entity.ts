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

export enum OPERATIONS {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

@Entity({
  name: 'movements',
})
export class Movement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', default: new Date() })
  at: Date;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: OPERATIONS,
  })
  operation;

  //Relations
  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Project, (project) => project.movements)
  @JoinColumn()
  project: Project;
}
