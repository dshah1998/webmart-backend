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
import { Users } from "./Users";
@Entity("order", { schema: "public" })
export class Orders extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("timestamp")
  createdAt!: Date;

  @Column("double precision", { nullable: true })
  subTotal!: number | null;

  @Column("double precision", { nullable: true })
  grandTotal!: number | null;

  @Column("varchar", { length: 255, nullable: true })
  stripePaymentIntentId!: string;

  @OneToMany(() => OrderDetails, (ODetails) => ODetails.order)
  orderDetails!: OrderDetails[];

  @Index()
  @ManyToOne(() => Address, (address) => address.orders)
  address!: Address;

  @RelationId((order: Orders) => order.address)
  addressId!: string;

  @Index()
  @ManyToOne(() => Users, (user) => user.orders)
  user!: Users;

  @RelationId((order: Orders) => order.address)
  userId!: string;
}
