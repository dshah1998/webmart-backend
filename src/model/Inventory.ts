import {
  Index,
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  RelationId,
  BaseEntity,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";

import { Products } from "./Products";
import { Users } from "./Users";

@Entity("inventory", { schema: "public" })
export class Inventory extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column("double precision", { nullable: true })
  quantity!: number | null;

  @OneToOne(() => Products, (product) => product.inventory,  { onDelete: 'CASCADE' })
  @JoinColumn()
  product!: Products | null;

  @ManyToOne(() => Users, (user) => user.inventory)
  user!: Users | null;

  @RelationId((inventory: Inventory) => inventory.user)
  userId!: string | null;
}
