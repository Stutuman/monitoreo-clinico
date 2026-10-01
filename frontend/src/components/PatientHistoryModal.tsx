import React, { useEffect, useState } from 'react';
import { X, Calendar, Activity, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '../services/api';
import type { Patient } from '../types/clinical';

interface PatientHistoryModalProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
}

interface DailyRecordItem {
  id: string;
  fecha: string;
  turno: string;
  cargadoPor?: string;
  tuvoDeposicion: boolean;
  frecuenciaDeposiciones?: number;
  escalaBristol?: number;
  esfuerzoEvacuacion?: boolean;
  sensacionEvacuacionIncompleta?: boolean;
  sensacionObstruccionBloqueo?: boolean;
  dolorAbdominal?: boolean;
  distensionAbdominal?: boolean;
  farmacos?: Array<{ nombre: string; dosisMg: number; esAnticolinergico: boolean }>;
  recibeLaxantes?: boolean;
  tipoLaxante?: string;
  observaciones?: string;
  createdAt: string;
}

const getBristolBadge = (tipo?: number) => {
  if (!tipo) return null;
  switch (tipo) {
    case 1:
    case 2:
      return (
        <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800 border border-red-200">
          Bristol Tipo {tipo} (Constipación severa)
        </span>
      );
    case 3:
    case 4:
    case 5:
      return (
        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
          Bristol Tipo {tipo} (Normal / Ideal)
        </span>
      );
    case 6:
    case 7:
      return (
        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
          Bristol Tipo {tipo} (Diarrea / Heces líquidas)
        </span>
      );
    default:
      return <span className="text-xs text-slate-500">Bristol: {tipo}</span>;
  }
};

export const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({
  isOpen,
  patient,
  onClose,
}) => {
  const [records, setRecords] = useState<DailyRecordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && patient) {
      fetchHistory();
    }
  }, [isOpen, patient]);

  const fetchHistory = async () => {
    if (!patient) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<DailyRecordItem[]>(`/daily-records/patient/${patient.id}`);
      setRecords(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el historial clínico');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="my-8 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Historial Clínico</h2>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700 border border-teal-200">
                  {patient.codigo}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {patient.edad} años • {patient.sexo === 'M' ? 'Masculino' : 'Femenino'} • {patient.diagnosticoPrincipal || 'Sin diagnóstico asignado'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido / Cronología */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Cargando registros...</div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          ) : records.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Calendar className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700">Aún no hay turnos registrados</p>
              <p className="text-xs text-slate-400">Usa "Cargar Turno" para añadir la primera evaluación.</p>
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition"
              >
                {/* Encabezado del registro */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-slate-800">{rec.fecha}</span>
                    <span className="text-slate-300">•</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                      Turno: {rec.turno}
                    </span>
                    {rec.cargadoPor && (
                      <span className="text-slate-400">({rec.cargadoPor})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {rec.tuvoDeposicion ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Evacuó ({rec.frecuenciaDeposiciones || 1}x)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                        <XCircle className="h-3.5 w-3.5" /> Sin deposición
                      </span>
                    )}
                  </div>
                </div>

                {/* Detalle del registro */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Bloque Digestivo / Bristol */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Evaluación Gastrointestinal
                    </span>
                    <div>{rec.tuvoDeposicion ? getBristolBadge(rec.escalaBristol) : <span className="text-slate-400 italic">No aplica</span>}</div>

                    {(rec.esfuerzoEvacuacion || rec.sensacionEvacuacionIncompleta || rec.dolorAbdominal || rec.distensionAbdominal) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rec.esfuerzoEvacuacion && (
                          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200">
                            Esfuerzo
                          </span>
                        )}
                        {rec.sensacionEvacuacionIncompleta && (
                          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200">
                            Incompleta
                          </span>
                        )}
                        {rec.dolorAbdominal && (
                          <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 border border-rose-200">
                            Dolor
                          </span>
                        )}
                        {rec.distensionAbdominal && (
                          <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 border border-rose-200">
                            Distensión
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bloque Farmacológico e Intervenciones */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Fármacos e Intervenciones
                    </span>
                    {rec.farmacos && rec.farmacos.length > 0 ? (
                      <div className="space-y-1">
                        {rec.farmacos.map((f, idx) => (
                          <div key={idx} className="flex items-center justify-between text-slate-700">
                            <span className="font-medium">{f.nombre} ({f.dosisMg} mg)</span>
                            {f.esAnticolinergico && (
                              <span className="rounded bg-purple-50 px-1.5 py-0.2 text-[10px] font-medium text-purple-700 border border-purple-200">
                                Anticolinérgico
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">Sin fármacos registrados</p>
                    )}

                    {rec.recibeLaxantes && (
                      <p className="text-teal-700 font-medium">
                        💊 Laxante: {rec.tipoLaxante || 'Administrado'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Observaciones */}
                {rec.observaciones && (
                  <div className="mt-3 rounded-lg bg-slate-50 p-2 text-xs text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-700">Observaciones: </span>
                    {rec.observaciones}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer del Modal */}
        <div className="border-t pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};