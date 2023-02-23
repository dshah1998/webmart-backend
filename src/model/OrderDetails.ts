import {
  Index,
  Column,
  Entity,
  ManyToOne,
  RelationId,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Orders } from "./Orders";

@Entity("order_details", { schema: "public" })
export class OrderDetails extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("double precision", { nullable: true })
  quantity!: number | null;

  @Column("double precision", { nullable: true })
  price!: number | null;

  @Index()
  @ManyToOne(() => Orders, (order) => order.orderDetails)
  order!: Orders;

  @RelationId((orderDetails: OrderDetails) => orderDetails.order)
  orderId!: string;
}
