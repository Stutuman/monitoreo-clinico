import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import {
  ModalidadAtencion,
  SexoBiologico,
} from '../entities/patient.entity';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  codigo: string; // ej: TG-001

  @IsInt()
  @Min(0)
  @Max(120)
  edad: number;

  @IsEnum(SexoBiologico)
  sexo: SexoBiologico;

  @IsEnum(ModalidadAtencion)
  @IsOptional()
  modalidad?: ModalidadAtencion;

  @IsString()
  @IsOptional()
  diagnosticoPrincipal?: string;

  @IsString()
  @IsOptional()
  otrosDiagnosticos?: string;

  @IsBoolean()
  @IsOptional()
  antecedenteConstipacionPrevia?: boolean;

  @IsString()
  @IsOptional()
  nivelDiscapacidadIntelectual?: string;
}
