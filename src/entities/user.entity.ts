import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Balance } from './balance.entity';
import { Currency } from './currency.entity';
import { Movement } from './movements.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({
    nullable: true,
  })
  isOwner: boolean;

  //Relations
  @OneToMany(() => Currency, (currency) => currency.user)
  currencies: Currency[];

  @OneToMany(() => Movement, (movement) => movement.user)
  movements: Movement[];

  @OneToMany(() => Balance, (balance) => balance.user)
  balances: Balance[];
}
