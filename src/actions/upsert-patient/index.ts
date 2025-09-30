"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertPatientSchema } from "./schema";

export const upsertPatient = actionClient
  .inputSchema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw new Error("Unauthorized");
    }
    if (!session.user.clinic.id) {
      throw new Error("Usuário não pertence a nenhuma clínica");
    }

    if (parsedInput.id) {
      const patientToEdit = await db.query.patientsTable.findFirst({
        where: (patients, { and, eq }) =>
          and(
            eq(patients.id, parsedInput.id!),
            eq(patients.clinicId, session.user.clinic.id!),
          ),
      });

      if (!patientToEdit) {
        throw new Error(
          "Paciente não encontrado ou você não tem permissão para editá-lo",
        );
      }
    }

    const existingPatient = await db.query.patientsTable.findFirst({
      where: (patients, { and, eq, ne }) =>
        and(
          eq(patients.email, parsedInput.email),
          eq(patients.clinicId, session.user.clinic.id!),
          parsedInput.id ? ne(patients.id, parsedInput.id) : undefined,
        ),
    });

    if (existingPatient) {
      throw new Error("Já existe um paciente com este email");
    }

    await db
      .insert(patientsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: patientsTable.id,
        set: {
          name: parsedInput.name,
          email: parsedInput.email,
          phoneNumber: parsedInput.phoneNumber,
          sex: parsedInput.sex,
          updatedAt: new Date(),
        },
      });

    revalidatePath("/patients");
  });
