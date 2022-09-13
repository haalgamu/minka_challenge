import { MigrationInterface, QueryRunner } from 'typeorm';
import { Currency, Project, User } from '../entities';
import { Encrypter } from '../helpers/encrypt.service';
import configuration from '../config/configuration';

export class InitRecords1662575536282 implements MigrationInterface {
  private readonly email = 'owner@zef.com';
  private readonly zefProject: any = {
    description: 'Owner project',
  };
  private readonly zknCurrency: any = {};

  constructor() {
    const conf = configuration();
    this.zefProject.cod = conf.ZEF_PROJECT.COD;
    this.zknCurrency.cod = conf.ZEF_PROJECT.CURRRENCY.COD;
  }

  private async createOwner(queryRunner: QueryRunner): Promise<User> {
    let user = await queryRunner.manager.findOneBy(User, { email: this.email });

    if (!user) {
      user = new User();
      user.email = 'owner@zef.com';
      user.password = await new Encrypter().encrypt('password');
      user.fullName = 'Owner zef';
      user.isOwner = true;

      user = await queryRunner.manager.save(user);
    }

    return user;
  }

  private async createInitProject(
    queryRunner: QueryRunner,
    user: User,
  ): Promise<Project> {
    let project = await queryRunner.manager.findOneBy(Project, {
      cod: this.zefProject.cod,
    });

    if (!project) {
      project = new Project();

      project.cod = this.zefProject.cod;
      project.description = this.zefProject.description;
      project.user = user;

      project = await queryRunner.manager.save(project);
    }

    return project;
  }

  private async createInitCurrency(
    queryRunner: QueryRunner,
    user: User,
    project: Project,
  ): Promise<Currency> {
    let currency = await queryRunner.manager.findOneBy(Currency, {
      cod: this.zknCurrency.cod,
    });

    if (!currency) {
      currency = new Currency();

      currency.cod = this.zknCurrency.cod;
      currency.user = user;
      currency.project = project;

      currency = await queryRunner.manager.save(currency);
    }

    return currency;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await this.createOwner(queryRunner);
    const project = await this.createInitProject(queryRunner, user);
    await this.createInitCurrency(queryRunner, user, project);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, { email: 'owner@zef.com' });
  }
}
