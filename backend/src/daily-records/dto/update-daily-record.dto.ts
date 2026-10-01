import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyRecordDto } from './create-daily-record.dto';

export class UpdateDailyRecordDto extends PartialType(CreateDailyRecordDto) {}
