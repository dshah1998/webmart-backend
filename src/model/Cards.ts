import {
    Index,
    Column,
    Entity,
    ManyToOne,
    RelationId,
    BaseEntity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

import { Users } from "./Users";

  @Entity('cards', { schema: 'public' })
  export class Cards extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    
    @Column('varchar', { length: 255, nullable: true })
    name!: string;

    @Column('bigint')
    number!: number;

    @Column('bigint')
    expMonth!: number;

    @Column('bigint')
    expYear!: number;

    @Column('bigint')
    cvv!: number;

    @Column('varchar', { length: 255, nullable: true })
    stripeCustomerId!: string;

    @Column('boolean', { default: () => 'false' })
    isDefaut!: boolean;

    @Index()
    @ManyToOne(() => Users, (users) => users.address)
    user!: Users;

    @RelationId((cards: Cards) => cards.user)
    userId!: string;
  }
  