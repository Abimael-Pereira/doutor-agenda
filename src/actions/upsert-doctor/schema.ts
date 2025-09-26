import z from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.uuid().optional(),
    name: z.string().trim().min(1, "Nome é obrigatório"),
    specialty: z.string().trim().min(1, "Especialidade é obrigatória"),
    appointmentPriceInCents: z
      .number("Preço da consulta é obrigatório")
      .min(1, "Preço da consulta deve ser obrigatório"),
    availableFromWeekDay: z.number().min(0).max(6, "Dia da semana inválido"),
    availableToWeekDay: z.number().min(0).max(6, "Dia da semana inválido"),
    availableFromTime: z.string().min(1, "Hora é obrigatória"),
    availableToTime: z.string().min(1, "Hora é obrigatória"),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      error: "Hora inicial deve ser menor que hora final",
      path: ["availableFromTime"],
    },
  );

export type UpsertDoctorFormData = z.infer<typeof upsertDoctorSchema>;
