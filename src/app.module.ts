import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Entities from "./entities"
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: Entities,
      synchronize: true,
    }),
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
