# Sistema de Monitoreo Clínico y Farmacológico

Plataforma digital para el registro clínico estructurado y seguimiento gastrointestinal de pacientes internados bajo esquemas psicofarmacológicos (antipsicóticos como Clozapina).

El sistema sustituye planillas físicas manuales por un flujo digital estandarizado, orientado a la prevención clínica y a la recolección de datos para investigación médica.

---

## 🎯 Objetivos del Sistema

- **Seguimiento Preventivo:** Registro diario por turnos (enfermería/médicos) evaluando deposiciones y síntomas según criterios clínicos estandarizados (Escala de Bristol y criterios Roma IV).
- **Control Farmacológico:** Monitoreo de dosis (mg/día) y carga anticolinérgica asociada a esquemas terapéuticos.
- **Privacidad por Diseño (Data Anonymization):** El sistema no almacena Nombres, Apellidos ni DNI. Los registros se asocian a un identificador alfanumérico único (`TG-XXX`) para cumplir normativas de protección de datos de salud.
- **Facilidad de Extracción:** Estructura preparada para auditoría médica y exportación de datos a formatos tabulares (CSV/Excel).

---

## 🛠 Stack Tecnológico

- **Backend:** NestJS (Node.js, TypeScript)
- **Base de Datos:** PostgreSQL en la nube (Neon.tech)
- **ORM:** TypeORM
- **Validación:** Class-Validator & Class-Transformer
- **Frontend (en desarrollo):** React + Vite + Tailwind CSS

---

## 🏛️ Modelo de Datos y Entidades

1. **`Patient`**: Perfil clínico anónimo (Código identificador, edad, sexo biológico, modalidad de atención, diagnóstico principal, antecedentes basales).
2. **`DailyRecord`**: Carga diaria vinculada al paciente:
   - Registro de deposición y categorización de Escala de Bristol (1 a 7).
   - Variables clínicas Roma IV (esfuerzo, sensación incompleta, distensión, dolor).
   - Medicación administrada (fármacos, dosis en mg, marcadores anticolinérgicos).
   - Intervenciones preventivas (laxantes, hidratación, fibra).

---

## 🚀 Puesta en Marcha Local

### Prerrequisitos

- Node.js (versión 18 o superior)
- Acceso a una instancia PostgreSQL (ej. Neon.tech)

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/Stutuman/monitoreo-clinico.git](https://github.com/Stutuman/monitoreo-clinico.git)
   cd monitoreo-clinico/backend
