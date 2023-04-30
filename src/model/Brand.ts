import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";

import { Products } from "./Products";
@Entity("brand", { schema: "public" })
export class Brand extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column("varchar", { length: 255, nullable: true })
  name!: string;

  @Column("integer", { nullable: true })
  threshold!: number | null;

  @OneToMany(() => Products, (product) => product.brand, {
    onDelete: "SET NULL",
  })
  product!: Products;
}
