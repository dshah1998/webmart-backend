import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    RelationId,
    BaseEntity,
    PrimaryGeneratedColumn,
    JoinColumn,
  } from "typeorm";

import { Products } from "./Products";
import { Users } from "./Users";
  
  @Entity("modificationrequests", { schema: "public" })
  export class ModificationRequests extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column("varchar", { length: 255 })
    comments!: string;
  
    @Column("varchar", { length: 255, nullable: true })
    status!: string | null;

    @Column("varchar", { length: 255 , nullable: true})
    type!: string;

    @Index()
    @ManyToOne(() => Users, (users) => users.modificationRequests)
    user!: Users;

    @RelationId((modificationRequests: ModificationRequests) => modificationRequests.user)
    userId!: string;

    @ManyToOne(() => Products, (product) => product.modificationRequests)
    @JoinColumn()
    product!: Products;
  }
  