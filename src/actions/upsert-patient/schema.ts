import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  email: z.email("Email inválido").trim().min(1, "Email é obrigatório"),
  phoneNumber: z.string().trim().min(10, "Número de telefone é obrigatório"),
  sex: z.enum(["male", "female"], {
    message: "Sexo é obrigatório",
  }),
});

export type UpsertPatientFormData = z.infer<typeof upsertPatientSchema>;
