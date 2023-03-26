import { EntityRepository } from 'typeorm';

import { BaseRepository } from './BaseRepository';
import { Address } from '../model/Address';

@EntityRepository(Address)
export class AddressRepository extends BaseRepository<Address> {}
