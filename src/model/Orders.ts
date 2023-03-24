import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  RelationId,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { OrderDetails } from "./OrderDetails";
import { Address } from "./Address";
@Entity("order", { schema: "public" })
export class Orders extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("timestamp")
  timeStamp!: Date;

  @Column("double precision")
  total!: number;

  @OneToMany(() => OrderDetails, (ODetails) => ODetails.order)
  orderDetails!: OrderDetails[];

  @Index()
  @ManyToOne(() => Address, (address) => address.orders)
  address!: Address;

  @RelationId((order: Orders) => order.address)
  addressId!: number;
}
