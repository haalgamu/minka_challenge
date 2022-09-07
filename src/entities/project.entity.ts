import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Balance } from './balance.entity';
import { Currency } from './currency.entity';
import { Movement } from './movements.entity';
import { User } from './user.entity';

@Entity({
  name: 'projects',
})
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cod: string;

  @Column()
  description: string;

  //Relations
  @ManyToOne(() => User, (user) => user.currencies)
  user: User;

  @OneToOne(() => Currency, (currency) => currency.project) // specify inverse side as a second parameter
  currency: Currency;

  @OneToMany(() => Movement, (movement) => movement.project)
  movements: Movement[];

  @OneToMany(() => Balance, (balance) => balance.project)
  balances: Balance[];
}
