import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Project } from '../entities';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Request() request, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto, {
      authUser: request.user,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of projects' })
  findAll(@Request() request): Promise<Project[]> {
    return this.projectsService.findAll({
      authUser: request.user,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project' })
  findOne(@Param('id') id: string): Promise<Project> {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
