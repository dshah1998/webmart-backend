import {
  Index,
  Column,
  Entity,
  ManyToOne,
  RelationId,
  BaseEntity,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Orders } from "./Orders";
import { Products } from "./Products";

@Entity("order_details", { schema: "public" })
export class OrderDetails extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("double precision", { nullable: true })
  quantity!: number | null;

  @Column("double precision", { nullable: true })
  price!: number | null;

  @Column("double precision", { nullable: true })
  discount!: number | null;

  @Column("double precision", { nullable: true })
  subTotal!: number | null;

  @Column("double precision", { nullable: true })
  grandTotal!: number | null;

  @Index()
  @ManyToOne(() => Orders, (order) => order.orderDetails)
  order!: Orders;

  @RelationId((orderDetails: OrderDetails) => orderDetails.order)
  orderId!: string;

  @ManyToOne(() => Products, (product) => product.cart)
  @JoinColumn()
  product!: Products;
}
