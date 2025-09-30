import { z } from "zod";

export const upsertAppointmentSchema = z.object({
  id: z.uuid().optional(),
  patientId: z.uuid({
    message: "Selecione um paciente",
  }),
  doctorId: z.uuid({
    message: "Selecione um médico",
  }),
  date: z.date({
    message: "Selecione uma data e horário",
  }),
  appointmentPriceInCents: z
    .number({
      message: "O valor da consulta é obrigatório",
    })
    .min(1, "O valor da consulta deve ser maior que zero"),
});

export type UpsertAppointmentSchema = z.infer<typeof upsertAppointmentSchema>;
