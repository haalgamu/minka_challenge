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
  name: 'currencies',
})
export class Currency {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cod: string;

  //Relations
  @ManyToOne(() => User, (user) => user.currencies)
  user: User;

  @OneToOne(() => Project, (project) => project.currency) // specify inverse side as a second parameter
  @JoinColumn()
  project: Project;
}
