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
import products from "../route/products";
import { Products } from "./Products";
  
  import { Users } from "./Users";
  
  @Entity("carts", { schema: "public" })
  export class Carts extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column("integer", { nullable: true })
    quantity!: number | null;

    @Column("varchar", { nullable: true })
    comment!: string | null;

    @Index()
    @ManyToOne(() => Users, (users) => users.carts)
    user!: Users;

    @RelationId((carts: Carts) => carts.user)
    userId!: string;

    @ManyToOne(() => Products, (product) => product.cart)
    @JoinColumn()
    product!: Products;
  }
  