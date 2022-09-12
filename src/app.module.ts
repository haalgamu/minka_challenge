import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import Entities from './entities';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { CurrenciesModule } from './currencies/currencies.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'zef',
      entities: Entities,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    CurrenciesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
