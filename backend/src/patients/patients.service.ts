import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const existe = await this.patientRepository.findOne({
      where: { codigo: createPatientDto.codigo },
    });

    if (existe) {
      throw new ConflictException(
        `El paciente con código ${createPatientDto.codigo} ya existe.`,
      );
    }

    const patient = this.patientRepository.create(createPatientDto);
    return await this.patientRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: {
        dailyRecords: true,
      },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado.`);
    }

    return patient;
  }
}
