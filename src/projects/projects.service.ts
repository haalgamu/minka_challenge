import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities';
import { Repository } from 'typeorm';
import { ResourceService } from '../helpers/generic_resource.service';

@Injectable()
export class ProjectsService extends ResourceService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {
    super(projectRepository, 'Project');
  }
}
