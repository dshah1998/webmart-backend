import {
  Column,
  Entity,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { OrderDetails } from "./OrderDetails";
@Entity("order", { schema: "public" })
export class Orders extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("timestamp")
  timeStamp!: Date;

  @OneToMany(() => OrderDetails, (ODetails) => ODetails.order)
  orderDetails!: OrderDetails[];
}
