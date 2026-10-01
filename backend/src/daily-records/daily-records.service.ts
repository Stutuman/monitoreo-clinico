import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyRecord } from './entities/daily-record.entity';
import { CreateDailyRecordDto } from './dto/create-daily-record.dto';

@Injectable()
export class DailyRecordsService {
  constructor(
    @InjectRepository(DailyRecord)
    private readonly dailyRecordRepository: Repository<DailyRecord>,
  ) {}

  async create(createDailyRecordDto: CreateDailyRecordDto): Promise<DailyRecord> {
    const record = this.dailyRecordRepository.create(createDailyRecordDto);
    return await this.dailyRecordRepository.save(record);
  }

  async findAll(): Promise<DailyRecord[]> {
    return await this.dailyRecordRepository.find({
      relations: {
        patient: true,
      },
      order: { fecha: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByPatient(patientId: string): Promise<DailyRecord[]> {
    return await this.dailyRecordRepository.find({
      where: { patientId },
      order: { fecha: 'DESC' },
    });
  }
}
