import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

export enum Turno {
  MANANA = 'Mañana',
  TARDE = 'Tarde',
  NOCHE = 'Noche',
}

@Entity('daily_records')
export class DailyRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient, (patient) => patient.dailyRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'enum', enum: Turno })
  turno: Turno;

  @Column({ type: 'varchar', length: 50, default: 'Enfermería' })
  cargadoPor: string;

  // 1. Evaluación Evacuatoria (Bristol y deposición)
  @Column({ type: 'boolean' })
  tuvoDeposicion: boolean;

  @Column({ type: 'int', default: 0 })
  frecuenciaDeposiciones: number;

  @Column({ type: 'int', nullable: true })
  escalaBristol: number;

  // 2. Síntomas Roma IV (Binarios Sí/No)
  @Column({ type: 'boolean', default: false })
  esfuerzoEvacuacion: boolean;

  @Column({ type: 'boolean', default: false })
  sensacionEvacuacionIncompleta: boolean;

  @Column({ type: 'boolean', default: false })
  sensacionObstruccionBloqueo: boolean;

  @Column({ type: 'boolean', default: false })
  maniobrasManuales: boolean;

  @Column({ type: 'boolean', default: false })
  dolorAbdominal: boolean;

  @Column({ type: 'boolean', default: false })
  distensionAbdominal: boolean;

  // 3. Fármacos del día
  @Column({ type: 'jsonb', default: [] })
  farmacos: Array<{
    nombre: string;
    dosisMg: number;
    esAnticolinergico: boolean;
  }>;

  // 4. Medidas preventivas y evacuatorias
  @Column({ type: 'boolean', default: false })
  recibeLaxantes: boolean;

  @Column({ type: 'text', nullable: true })
  tipoLaxante: string;

  @Column({ type: 'boolean', default: false })
  aumentoLiquidos: boolean;

  @Column({ type: 'boolean', default: false })
  aumentoFibra: boolean;

  @Column({ type: 'boolean', default: false })
  consultaMedicaPorConstipacion: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  createdAt: Date;
}