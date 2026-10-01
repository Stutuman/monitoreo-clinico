import { useEffect, useState } from 'react';
import { Activity, Plus, Search, User } from 'lucide-react';
import { api } from './services/api';
import type{ Patient } from './types/clinical';
import { PatientModal } from './components/PatientModal';
import { DailyRecordModal } from './components/DailyRecordModal';
import { PatientHistoryModal } from './components/PatientHistoryModal';
export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPatientForRecord, setSelectedPatientForRecord] = useState<Patient | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<Patient | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get<Patient[]>('/patients');
      setPatients(res.data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header Institucional */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Hospital Tobar García</h1>
              <p className="text-xs text-slate-500">Módulo de Vigilancia Gastrointestinal y Farmacológica</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 transition"
          >
            <Plus className="h-4 w-4" />
            Nuevo Paciente
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código (ej: TG-001)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div className="text-sm text-slate-500">
            Total activos: <span className="font-semibold text-slate-700">{filteredPatients.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-500">Cargando pacientes...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <User className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-700">No se encontraron pacientes</p>
            <p className="text-xs text-slate-500">Crea uno nuevo usando el botón superior.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-100">
                      {patient.codigo}
                    </span>
                    <span className="text-xs text-slate-400">
                      {patient.modalidad || 'Internación'}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-slate-800">
                    {patient.diagnosticoPrincipal || 'Sin diagnóstico asignado'}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <p>Edad: <span className="font-medium text-slate-700">{patient.edad} años</span> | Sexo: <span className="font-medium text-slate-700">{patient.sexo}</span></p>
                    {patient.antecedenteConstipacionPrevia && (
                      <p className="text-amber-600 font-medium">⚠️ Antecedente de constipación</p>
                    )}
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4 flex gap-2">
                  <button onClick={() => {
                    setSelectedPatientForRecord(patient);
                    setIsRecordModalOpen(true);
                  }} 
                  className="flex-1 rounded-lg bg-slate-900 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition">
                    Cargar Turno
                  </button>
                  <button
                    onClick={()=> {
                      setSelectedPatientForHistory(patient);
                      setIsHistoryModalOpen(true);
                    }}
                   className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                    Ver Historial
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientCreated={fetchPatients}
      />
      <PatientHistoryModal
        isOpen={isHistoryModalOpen}
        patient={selectedPatientForHistory}
        onClose={()=> {
          setIsHistoryModalOpen(false);
          setSelectedPatientForHistory(null);
        }}/>

      <DailyRecordModal
        isOpen={isRecordModalOpen}
        patient={selectedPatientForRecord}
        onClose={() => {
          setIsRecordModalOpen(false);
          setSelectedPatientForRecord(null);
        }}
        onRecordCreated={() => {
          fetchPatients();
        }}
      />
    </div>
    
  );
}