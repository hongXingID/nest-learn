import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 鉴权模块
import { AuthModule } from './modules/auth/auth.module'

// 用户模块
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        entities: [
          User,
        ],
        host: configService.get('DB_HOST', '119.91.147.56'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USER', 'hongxing'),
        password: configService.get('DB_PASSWD', 'hx19990125.'),
        database: configService.get('DB_DATABASE', 'blog'),
        charset: 'utf8mb4',
        timezone: '+08:00',
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
