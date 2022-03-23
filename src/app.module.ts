import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      include: [UsersModule],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'],
      database: process.env['DB_NAME'],
      username: process.env['DB_USER'],
      port: parseInt(process.env['DB_PORT']),
      password: process.env['DB_PASS'],
      ssl: { rejectUnauthorized: false },
      entities: ['dist/**/*.model{.ts,.js}'],
      //synchronize: true, // dev option
    }),
    UsersModule,
    AuthModule,
  ],

  controllers: [AuthController, AppController],
  providers: [AppService],
})
export class AppModule {}
