export type SexoBiologico = 'M' | 'F';
export type ModalidadAtencion = 'Internación' | 'Hospital de Día' | 'Ambulatorio';
export type Turno = 'Mañana' | 'Tarde' | 'Noche';

export interface Farmaco {
  nombre: string;
  dosisMg: number;
  esAnticolinergico: boolean;
}

export interface Patient {
  id: string;
  codigo: string;
  edad: number;
  sexo: SexoBiologico;
  modalidad?: ModalidadAtencion;
  diagnosticoPrincipal?: string;
  otrosDiagnosticos?: string;
  antecedenteConstipacionPrevia?: boolean;
  nivelDiscapacidadIntelectual?: string;
  createdAt: string;
}

export interface CreatePatientInput {
  codigo: string;
  edad: number;
  sexo: SexoBiologico;
  modalidad?: ModalidadAtencion;
  diagnosticoPrincipal?: string;
  otrosDiagnosticos?: string;
  antecedenteConstipacionPrevia?: boolean;
  nivelDiscapacidadIntelectual?: string;
}

export interface CreateDailyRecordInput {
  patientId: string;
  fecha: string;
  turno: Turno;
  cargadoPor?: string;
  tuvoDeposicion: boolean;
  frecuenciaDeposiciones?: number;
  escalaBristol?: number;
  esfuerzoEvacuacion?: boolean;
  sensacionEvacuacionIncompleta?: boolean;
  sensacionObstruccionBloqueo?: boolean;
  maniobrasManuales?: boolean;
  dolorAbdominal?: boolean;
  distensionAbdominal?: boolean;
  farmacos?: Farmaco[];
  recibeLaxantes?: boolean;
  tipoLaxante?: string;
  aumentoLiquidos?: boolean;
  aumentoFibra?: boolean;
  consultaMedicaPorConstipacion?: boolean;
  observaciones?: string;
}