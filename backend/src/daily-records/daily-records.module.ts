import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyRecordsService } from './daily-records.service';
import { DailyRecordsController } from './daily-records.controller';
import { DailyRecord } from './entities/daily-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyRecord])],
  controllers: [DailyRecordsController],
  providers: [DailyRecordsService],
})
export class DailyRecordsModule {}
