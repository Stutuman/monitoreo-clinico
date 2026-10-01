# Sistema de Monitoreo Clínico - Hospital Tobar García

## Stack Tecnológico
- Backend: NestJS con TypeORM, PostgreSQL y TypeScript.
- Validaciones: class-validator y class-transformer en todos los DTOs.
- Arquitectura: Modular, controllers limpios, lógica en services.

## Reglas de Dominio y Seguridad Clínica (Críticas)
1. ANONIMIZACIÓN TOTAL: Está terminantemente prohibido almacenar nombres, apellidos, DNIs o iniciales.
   El identificador del paciente debe ser un código alfanumérico (ej: "TG-001").
2. REGISTROS DIARIOS: La evaluación gastrointestinal se divide en:
   - Frecuencia y consistencia (Escala de Bristol del 1 al 7).
   - Síntomas binarios (esfuerzo excesivo, dolor abdominal, distensión, sensación incompleta).
   - Fármacos administrados (droga, dosis diaria en mg, si es anticolinérgico).
   - Medidas preventivas (laxantes, hidratación, fibra).
3. Todo endpoint POST/PATCH debe validar tipos de datos estrictamente.