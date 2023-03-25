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

import { Users } from "./Users";
import { Orders } from "./Orders";

@Entity("address", { schema: "public" })
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 255, nullable: true })
  city!: string;

  @Column("varchar", { length: 255, nullable: true })
  county!: string;

  @Column("varchar", { length: 255, nullable: true })
  country!: string;

  @Column("varchar")
  pincode!: string;

  @Column("integer", { nullable: true })
  houseNumber!: number | null;

  @Column("boolean", { default: () => "true" })
  isDefault!: boolean;

  @Index()
  @ManyToOne(() => Users, (users) => users.address)
  user!: Users;

  @RelationId((address: Address) => address.user)
  userId!: string;

  @OneToMany(() => Orders, (order) => order.address)
  orders!: Orders[];
}
