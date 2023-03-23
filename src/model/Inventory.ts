import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
  } from 'typeorm';
  
  @Entity('inventory', { schema: 'public' })
  export class Inventory extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: number;
  
    @Column('double precision', { nullable: true })
    quantity!: number | null;
  
    @Column('double precision', { nullable: true })
    price!: number | null;
  
    @Column('double precision', { nullable: true })
    discount!: number | null;
  }
  