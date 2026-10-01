import React, { useState } from 'react';
import { X, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import type { Farmaco, Patient, Turno } from '../types/clinical';

interface DailyRecordModalProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
  onRecordCreated: () => void;
}

const BRISTOL_DESCRIPTIONS = [
  { tipo: 1, label: 'Tipo 1', desc: 'Trozos duros separados, como nueces (difícil evacuación)', color: 'bg-red-50 border-red-200 text-red-800' },
  { tipo: 2, label: 'Tipo 2', desc: 'Forma de salchicha apelmazada, con grumos', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  { tipo: 3, label: 'Tipo 3', desc: 'Con forma de salchicha y grietas en la superficie', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { tipo: 4, label: 'Tipo 4', desc: 'Como una salchicha o serpiente, lisa y blanda (ideal)', color: 'bg-green-50 border-green-200 text-green-800' },
  { tipo: 5, label: 'Tipo 5', desc: 'Trozos de masa pastosa con bordes definidos', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { tipo: 6, label: 'Tipo 6', desc: 'Fragmentos blandos y esponjosos con bordes irregulares', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { tipo: 7, label: 'Tipo 7', desc: 'Acuosa, sin pedazos sólidos (líquida por completo)', color: 'bg-red-50 border-red-200 text-red-800' },
];

export const DailyRecordModal: React.FC<DailyRecordModalProps> = ({
  isOpen,
  patient,
  onClose,
  onRecordCreated,
}) => {
  if (!isOpen || !patient) return null;

  const today = new Date().toISOString().split('T')[0];

  const [fecha, setFecha] = useState(today);
  const [turno, setTurno] = useState<Turno>('Mañana');
  const [cargadoPor, setCargadoPor] = useState('Enfermería');
  const [tuvoDeposicion, setTuvoDeposicion] = useState(true);
  const [frecuenciaDeposiciones, setFrecuenciaDeposiciones] = useState(1);
  const [escalaBristol, setEscalaBristol] = useState<number>(4);

  // Criterios Roma IV
  const [esfuerzoEvacuacion, setEsfuerzoEvacuacion] = useState(false);
  const [sensacionEvacuacionIncompleta, setSensacionEvacuacionIncompleta] = useState(false);
  const [sensacionObstruccionBloqueo, setSensacionObstruccionBloqueo] = useState(false);
  const [dolorAbdominal, setDolorAbdominal] = useState(false);
  const [distensionAbdominal, setDistensionAbdominal] = useState(false);

  // Fármacos administrados en el turno
  const [farmacos, setFarmacos] = useState<Farmaco[]>([
    { nombre: 'Clozapina', dosisMg: 100, esAnticolinergico: false },
  ]);

  // Medidas y laxantes
  const [recibeLaxantes, setRecibeLaxantes] = useState(false);
  const [tipoLaxante, setTipoLaxante] = useState('');
  const [aumentoLiquidos, setAumentoLiquidos] = useState(false);
  const [aumentoFibra, setAumentoFibra] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFarmaco = () => {
    setFarmacos([...farmacos, { nombre: '', dosisMg: 0, esAnticolinergico: false }]);
  };

  const handleRemoveFarmaco = (index: number) => {
    setFarmacos(farmacos.filter((_, i) => i !== index));
  };

  const handleFarmacoChange = (index: number, field: keyof Farmaco, value: any) => {
    const updated = [...farmacos];
    updated[index] = { ...updated[index], [field]: value };
    setFarmacos(updated);
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: any = {
      patientId: patient.id,
      fecha,
      turno,
      cargadoPor,
      tuvoDeposicion,
      frecuenciaDeposiciones: tuvoDeposicion ? Number(frecuenciaDeposiciones) : 0,
      esfuerzoEvacuacion,
      sensacionEvacuacionIncompleta,
      sensacionObstruccionBloqueo,
      maniobrasManuales: false,
      dolorAbdominal,
      distensionAbdominal,
      farmacos: farmacos.filter((f) => f.nombre.trim() !== ''),
      recibeLaxantes,
      tipoLaxante: recibeLaxantes ? tipoLaxante : undefined,
      aumentoLiquidos,
      aumentoFibra,
      consultaMedicaPorConstipacion: false,
      observaciones,
    };

    // Solo adjuntar escalaBristol si realmente hubo deposición
    if (tuvoDeposicion) {
      payload.escalaBristol = Number(escalaBristol);
    }

    try {
      await api.post('/daily-records', payload);
      onRecordCreated();
      onClose();
    } catch (err: any) {
      console.error('Error completo backend:', err.response?.data);
      const backendMsg = err.response?.data?.message;
      if (Array.isArray(backendMsg)) {
        setError(backendMsg.join(' — '));
      } else {
        setError(backendMsg || 'Error al guardar el registro diario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900">Carga de Turno Diario</h2>
              <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700 border border-teal-200">
                {patient.codigo}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Paciente: {patient.edad} años | {patient.diagnosticoPrincipal || 'Sin diagnóstico'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Fila 1: Fecha, Turno y Rol */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">Fecha</label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">Turno</label>
              <select
                value={turno}
                onChange={(e) => setTurno(e.target.value as Turno)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">Responsable</label>
              <input
                type="text"
                value={cargadoPor}
                onChange={(e) => setCargadoPor(e.target.value)}
                placeholder="Ej: Enfermería Sala 2"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Fila 2: Deposición Sí / No */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-800">¿Tuvo deposiciones en el turno?</span>
                <p className="text-xs text-slate-500">Marque "No" si no evacuó en las horas del turno</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTuvoDeposicion(true)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                    tuvoDeposicion
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  SÍ
                </button>
                <button
                  type="button"
                  onClick={() => setTuvoDeposicion(false)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                    !tuvoDeposicion
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            {/* Escala de Bristol si tuvo deposición */}
            {tuvoDeposicion && (
              <div className="mt-4 border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase text-slate-600">
                    Escala de Bristol (Forma de las heces)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Cantidad de veces:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={frecuenciaDeposiciones}
                      onChange={(e) => setFrecuenciaDeposiciones(Number(e.target.value))}
                      className="w-16 rounded border border-slate-300 px-2 py-0.5 text-xs font-bold text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {BRISTOL_DESCRIPTIONS.map((item) => (
                    <button
                      key={item.tipo}
                      type="button"
                      onClick={() => setEscalaBristol(item.tipo)}
                      className={`flex flex-col text-left p-2.5 rounded-lg border text-xs transition ${
                        escalaBristol === item.tipo
                          ? `${item.color} ring-2 ring-teal-500 font-medium`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold">{item.label}</span>
                      <span className="text-[11px] leading-snug">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Criterios Roma IV */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">
              Signos y Criterios Roma IV
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs text-slate-700">
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esfuerzoEvacuacion}
                  onChange={(e) => setEsfuerzoEvacuacion(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Esfuerzo excesivo para defecar
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sensacionEvacuacionIncompleta}
                  onChange={(e) => setSensacionEvacuacionIncompleta(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Sensación de evacuación incompleta
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sensacionObstruccionBloqueo}
                  onChange={(e) => setSensacionObstruccionBloqueo(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Sensación de bloqueo u obstrucción anorrectal
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={distensionAbdominal}
                  onChange={(e) => setDistensionAbdominal(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Distensión o hinchazón abdominal
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dolorAbdominal}
                  onChange={(e) => setDolorAbdominal(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Dolor abdominal manifestado
              </label>
            </div>
          </div>

          {/* Fármacos en el Turno */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase text-slate-600">
                Fármacos Suministrados en el Turno
              </label>
              <button
                type="button"
                onClick={handleAddFarmaco}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                + Agregar Fármaco
              </button>
            </div>

            <div className="space-y-2">
              {farmacos.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nombre (ej: Clozapina)"
                    value={f.nombre}
                    onChange={(e) => handleFarmacoChange(i, 'nombre', e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-teal-500 focus:outline-none"
                  />
                  <div className="flex items-center gap-1 w-28">
                    <input
                      type="number"
                      placeholder="Dosis"
                      value={f.dosisMg || ''}
                      onChange={(e) => handleFarmacoChange(i, 'dosisMg', Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-right focus:border-teal-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-500">mg</span>
                  </div>
                  <label className="flex items-center gap-1 text-[11px] text-slate-600 px-2">
                    <input
                      type="checkbox"
                      checked={f.esAnticolinergico}
                      onChange={(e) => handleFarmacoChange(i, 'esAnticolinergico', e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    Anticolinérgico
                  </label>
                  {farmacos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFarmaco(i)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Intervenciones y Laxantes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={recibeLaxantes}
                  onChange={(e) => setRecibeLaxantes(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Administración de Laxante
              </label>
              {recibeLaxantes && (
                <input
                  type="text"
                  placeholder="Tipo/Dosis de laxante (ej: Lactulosa 15ml)"
                  value={tipoLaxante}
                  onChange={(e) => setTipoLaxante(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-teal-500 focus:outline-none"
                />
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aumentoLiquidos}
                  onChange={(e) => setAumentoLiquidos(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Indicación de aumento de líquidos
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aumentoFibra}
                  onChange={(e) => setAumentoFibra(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Indicación de aumento de fibra
              </label>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600">Observaciones del turno</label>
            <textarea
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Conducta clínica, negativa del paciente a ingerir líquidos, etc..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Registrar Turno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};