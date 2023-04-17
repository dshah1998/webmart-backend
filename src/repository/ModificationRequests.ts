import { EntityRepository } from 'typeorm';

import { BaseRepository } from './BaseRepository';
import { ModificationRequests } from '../model/ModificationRequests';

@EntityRepository(ModificationRequests)
export class ModificationRequestsRepository extends BaseRepository<ModificationRequests> {}
