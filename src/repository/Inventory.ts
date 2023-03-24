import { EntityRepository } from 'typeorm';

import { BaseRepository } from './BaseRepository';
import { Inventory } from '../model/Inventory';

@EntityRepository(Inventory)
export class InventoryRepository extends BaseRepository<Inventory> {}
