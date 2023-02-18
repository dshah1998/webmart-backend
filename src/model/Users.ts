import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { WebMartUserType } from '../constants';

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

  @Column("text", { array: true, nullable: true })
  userType: string[];

  @Column('boolean', { default: () => 'true' })
  isActive!: boolean;
}
