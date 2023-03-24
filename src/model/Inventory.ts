import {
  Index,
  Column,
  Entity,
  OneToOne,
  RelationId,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Products } from "./Products";

@Entity("inventory", { schema: "public" })
export class Inventory extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column("double precision", { nullable: true })
  quantity!: number | null;

  @OneToOne(() => Products, (product) => product.inventory)
  product!: Products;

  @RelationId((inventory: Inventory) => inventory.product)
  productId!: string | null;
}
