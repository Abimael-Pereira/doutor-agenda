"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

export const deletePatient = actionClient
  .inputSchema(z.object({ id: z.uuid() }))
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("Unauthorized");
    }

    const clinic = session?.user.clinic;
    if (!clinic?.id) {
      throw new Error("Usuário não pertence a nenhuma clínica");
    }

    const patientToDelete = await db.query.patientsTable.findFirst({
      where: and(
        eq(patientsTable.id, parsedInput.id),
        eq(patientsTable.clinicId, clinic.id),
      ),
    });

    if (!patientToDelete) {
      throw new Error(
        "Paciente não encontrado ou você não tem permissão para deletá-lo",
      );
    }

    await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id));
    revalidatePath("/patients");
  });
