// Manufactured
// User_Id

import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  RelationId,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";

import { Inventory } from "./Inventory";
import { Category } from "./Category";
import { Brand } from "./Brand";
import { Carts } from "./Cart";
import { ModificationRequests } from "./ModificationRequests";

@Entity("products", { schema: "public" })
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 255 })
  name!: string;

  @Column("varchar", { length: 255, nullable: true })
  description!: string | null;

  @Column("varchar", { length: 255, nullable: true })
  thumbnailImage!: string | null;

  @Column("varchar", { array: true, default: null })
  images: string[] | null;

  @Column("double precision", { nullable: true })
  discount!: number | null;

  @Column("double precision", { nullable: true })
  price!: number | null;

  @Column("boolean", { default: () => "false" })
  isUsed!: boolean | null;

  @Column("int", { nullable: false })
  completedStep!: number;

  @Column("simple-json", { nullable: true })
  properties: {
    weight: number | null;
    color: string | null; 
  } | null;

  @OneToOne(() => Inventory, (inventory) => inventory.product, { onDelete: 'CASCADE' })
  inventory!: Inventory;

  @ManyToOne(() => Brand, (brand) => brand.product)
  brand!: Brand | null;

  @RelationId((product: Products) => product.brand)
  brandId!: string | null;

  @ManyToOne(() => Category, (category) => category.products)
  category!: Category | null;

  @RelationId((product: Products) => product.category)
  categoryId!: string | null;

  @OneToMany(() => Carts, (cart) => cart.product)
  cart!: Carts[];

  @OneToMany(() => ModificationRequests, (modificationRequests) => modificationRequests.user)
  modificationRequests!: ModificationRequests[];

}
