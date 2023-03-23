import {
  Column,
  Entity,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Address } from "./Address";
import { WebMartUserType } from "../constants";

@Entity("seller_information", { schema: "public" })
export class SellerInformation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { nullable: false })
  companyRegistrationNumber!: string;

  @Column("varchar", { nullable: false })
  storeName!: string;

  @Column("varchar", { nullable: false })
  streetAddress!: string;

  @Column("varchar", { nullable: true })
  addressLine2!: string | null;

  @Column("varchar", { nullable: false })
  city!: string;

  @Column("varchar", { nullable: false })
  state!: string;

  @Column("varchar", { nullable: false })
  zip!: string;

  @Column("varchar", { nullable: false })
  accountNumber!: string;

  @Column("varchar", { nullable: false })
  accountName!: string;

  @Column("varchar", { nullable: true })
  routingNumber: string;
}
