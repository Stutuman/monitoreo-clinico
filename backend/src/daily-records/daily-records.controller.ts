import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DailyRecordsService } from './daily-records.service';
import { CreateDailyRecordDto } from './dto/create-daily-record.dto';

@Controller('daily-records')
export class DailyRecordsController {
  constructor(private readonly dailyRecordsService: DailyRecordsService) {}

  @Post()
  create(@Body() createDailyRecordDto: CreateDailyRecordDto) {
    return this.dailyRecordsService.create(createDailyRecordDto);
  }

  @Get()
  findAll() {
    return this.dailyRecordsService.findAll();
  }

  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string) {
    return this.dailyRecordsService.findByPatient(patientId);
  }
}
