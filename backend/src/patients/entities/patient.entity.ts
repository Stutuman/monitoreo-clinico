import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DailyRecord } from '../../daily-records/entities/daily-record.entity';

export enum SexoBiologico {
  M = 'M',
  F = 'F',
  OTRO = 'OTRO',
}

export enum ModalidadAtencion {
  INTERNACION = 'Internación',
  AMBULATORIO = 'Ambulatorio',
}

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigo: string;

  @Column({ type: 'int' })
  edad: number;

  @Column({ type: 'enum', enum: SexoBiologico })
  sexo: SexoBiologico;

  @Column({
    type: 'enum',
    enum: ModalidadAtencion,
    default: ModalidadAtencion.INTERNACION,
  })
  modalidad: ModalidadAtencion;

  @Column({ type: 'text', nullable: true })
  diagnosticoPrincipal: string;

  @Column({ type: 'text', nullable: true })
  otrosDiagnosticos: string;

  @Column({ type: 'boolean', default: false })
  antecedenteConstipacionPrevia: boolean;

  @Column({ type: 'text', nullable: true })
  nivelDiscapacidadIntelectual: string;

  @OneToMany(() => DailyRecord, (record) => record.patient)
  dailyRecords: DailyRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}