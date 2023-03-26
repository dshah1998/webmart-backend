import {
  Column,
  Entity,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Address } from './Address';
import { Cards } from './Cards';
import { Inventory } from './Inventory';
import { WebMartUserType } from '../constants';
import { Carts } from './Cart';

@Entity('users', { schema: 'public' })
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255, nullable: true })
  firstName!: string;

  @Column('varchar', { length: 255, nullable: true })
  lastName!: string;

  @Column('varchar', { length: 255, nullable: true })
  email!: string;

  @Column('varchar', { nullable: true })
  password!: string;

  @Column('varchar', { nullable: true })
  countryCode!: string | null;

  @Column('varchar', { nullable: true })
  profileImage!: string | null;

  @Column('varchar', { nullable: true })
  mobileNumber!: string | null;

  @Column('varchar', { length: 255, nullable: true })
  token!: string | null;

  @Column('boolean', { default: () => 'false' })
  isEmailVerify!: boolean;

  @Column('varchar', { length: 255, nullable: true })
  stripeCustomerId!: string;

  @Column("text", { array: true, nullable: true })
  userType: string[];

  @Column('boolean', { default: () => 'true' })
  isActive!: boolean;

  @OneToMany(() => Address, (address) => address.user)
  address!: Address[];
  
  @OneToMany(() => Cards, (cards) => cards.user)
  cards!: Cards[];

  @OneToMany(() => Carts, (carts) => carts.user)
  carts!: Carts[];
  
  @OneToMany(() => Inventory, (inventory) => inventory.user)
  inventory!: Cards[];
}
