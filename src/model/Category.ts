import {
  Column,
  Entity,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Products } from "./Products";
@Entity("category", { schema: "public" })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 255 })
  type!: string;

  @Column("text", { array: true ,nullable: true })
  properties: string | null;

  @OneToMany(() => Products, (product) => product.category)
  products!: Products;
}
