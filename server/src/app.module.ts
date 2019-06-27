import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './models/user.entity';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';

// seleccionamos el tipo de base de datos que se desea usar
// en este apartado se usa base de datos local y se nombra dicha.

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'my.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: 'secret123',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule { }
