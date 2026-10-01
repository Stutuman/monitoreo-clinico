import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';
import { DailyRecordsModule } from './daily-records/daily-records.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // Crea y actualiza las tablas automáticamente en desarrollo
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    PatientsModule,
    DailyRecordsModule,
  ],
})
export class AppModule {}