import { EntityRepository } from 'typeorm';

import { BaseRepository } from './BaseRepository';
import { Category } from '../model/Category';

@EntityRepository(Category)
export class CategoryRepository extends BaseRepository<Category> {}
