import { EntityRepository } from 'typeorm';

import { BaseRepository } from './BaseRepository';
import { Brand } from '../model/Brand';

@EntityRepository(Brand)
export class BrandRepository extends BaseRepository<Brand> {}
