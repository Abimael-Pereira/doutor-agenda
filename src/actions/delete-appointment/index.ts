"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

export const deleteAppointment = actionClient
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

    const appointmentToDelete = await db.query.appointmentsTable.findFirst({
      where: and(
        eq(appointmentsTable.id, parsedInput.id),
        eq(appointmentsTable.clinicId, clinic.id),
      ),
    });

    if (!appointmentToDelete) {
      throw new Error(
        "Agendamento não encontrado ou você não tem permissão para deletá-lo",
      );
    }

    await db
      .delete(appointmentsTable)
      .where(eq(appointmentsTable.id, parsedInput.id));
    revalidatePath("/appointments");
  });
