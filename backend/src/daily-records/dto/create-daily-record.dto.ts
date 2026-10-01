import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Turno } from '../entities/daily-record.entity';

class FarmacoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  @Min(0)
  dosisMg: number;

  @IsBoolean()
  esAnticolinergico: boolean;
}

export class CreateDailyRecordDto {
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsDateString()
  fecha: string;

  @IsEnum(Turno)
  turno: Turno;

  @IsString()
  @IsOptional()
  cargadoPor?: string;

  // Evacuaciones
  @IsBoolean()
  tuvoDeposicion: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  frecuenciaDeposiciones?: number;

  @IsInt()
  @Min(1)
  @Max(7)
  @IsOptional()
  escalaBristol?: number;

  // Roma IV
  @IsBoolean()
  @IsOptional()
  esfuerzoEvacuacion?: boolean;

  @IsBoolean()
  @IsOptional()
  sensacionEvacuacionIncompleta?: boolean;

  @IsBoolean()
  @IsOptional()
  sensacionObstruccionBloqueo?: boolean;

  @IsBoolean()
  @IsOptional()
  maniobrasManuales?: boolean;

  @IsBoolean()
  @IsOptional()
  dolorAbdominal?: boolean;

  @IsBoolean()
  @IsOptional()
  distensionAbdominal?: boolean;

  // Farmacología
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FarmacoDto)
  @IsOptional()
  farmacos?: FarmacoDto[];

  // Medidas preventivas
  @IsBoolean()
  @IsOptional()
  recibeLaxantes?: boolean;

  @IsString()
  @IsOptional()
  tipoLaxante?: string;

  @IsBoolean()
  @IsOptional()
  aumentoLiquidos?: boolean;

  @IsBoolean()
  @IsOptional()
  aumentoFibra?: boolean;

  @IsBoolean()
  @IsOptional()
  consultaMedicaPorConstipacion?: boolean;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
