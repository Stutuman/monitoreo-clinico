import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { api } from '../services/api';
import type { CreatePatientInput, ModalidadAtencion, SexoBiologico } from '../types/clinical';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated: () => void;
}

export const PatientModal: React.FC<PatientModalProps> = ({ isOpen, onClose, onPatientCreated }) => {
  const [formData, setFormData] = useState<CreatePatientInput>({
    codigo: '',
    edad: 12,
    sexo: 'M',
    modalidad: 'Internación',
    diagnosticoPrincipal: '',
    otrosDiagnosticos: '',
    antecedenteConstipacionPrevia: false,
    nivelDiscapacidadIntelectual: 'Ninguna',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/patients', {
        ...formData,
        edad: Number(formData.edad),
      });
      onPatientCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2 text-slate-800">
            <UserPlus className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-semibold">Alta de Paciente Anónimo</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Código Único</label>
              <input
                type="text"
                placeholder="Ej: TG-002"
                required
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Edad (años)</label>
              <input
                type="number"
                min="0"
                max="120"
                required
                value={formData.edad}
                onChange={(e) => setFormData({ ...formData, edad: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Sexo Biológico</label>
              <select
                value={formData.sexo}
                onChange={(e) => setFormData({ ...formData, sexo: e.target.value as SexoBiologico })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Modalidad</label>
              <select
                value={formData.modalidad}
                onChange={(e) => setFormData({ ...formData, modalidad: e.target.value as ModalidadAtencion })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="Internación">Internación</option>
                <option value="Hospital de Día">Hospital de Día</option>
                <option value="Ambulatorio">Ambulatorio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase">Diagnóstico Principal</label>
            <input
              type="text"
              placeholder="Ej: Esquizofrenia, Trastorno Bipolar..."
              value={formData.diagnosticoPrincipal || ''}
              onChange={(e) => setFormData({ ...formData, diagnosticoPrincipal: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="constipacionPrevia"
              checked={formData.antecedenteConstipacionPrevia}
              onChange={(e) => setFormData({ ...formData, antecedenteConstipacionPrevia: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="constipacionPrevia" className="text-sm text-slate-700">
              Antecedente de constipación previa al ingreso
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};