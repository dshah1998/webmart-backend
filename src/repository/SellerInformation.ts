import { EntityRepository } from "typeorm";

import { BaseRepository } from "./BaseRepository";
import { SellerInformation } from "../model/SellerInformation";

@EntityRepository(SellerInformation)
export class SellerInformationRepository extends BaseRepository<SellerInformation> {}
