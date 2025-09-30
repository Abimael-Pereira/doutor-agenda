"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertAppointmentSchema } from "./schema";

export const upsertAppointment = actionClient
  .inputSchema(upsertAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("Unauthorized");
    }

    const clinic = session.user.clinic;
    if (!clinic.id) {
      throw new Error("Usuário não pertence a nenhuma clínica");
    }

    if (parsedInput.id) {
      const existingAppointment = await db.query.appointmentsTable.findFirst({
        where: and(
          eq(appointmentsTable.id, parsedInput.id),
          eq(appointmentsTable.clinicId, clinic.id),
        ),
      });

      if (!existingAppointment) {
        throw new Error(
          "Agendamento não encontrado ou você não tem permissão para editá-lo",
        );
      }

      await db
        .update(appointmentsTable)
        .set({
          patientId: parsedInput.patientId,
          doctorId: parsedInput.doctorId,
          date: parsedInput.date,
          appointmentPriceInCents: parsedInput.appointmentPriceInCents,
        })
        .where(eq(appointmentsTable.id, parsedInput.id));
    } else {
      // Create new appointment
      await db.insert(appointmentsTable).values({
        patientId: parsedInput.patientId,
        doctorId: parsedInput.doctorId,
        clinicId: clinic.id,
        date: parsedInput.date,
        appointmentPriceInCents: parsedInput.appointmentPriceInCents,
      });
    }

    revalidatePath("/appointments");

    return {
      success: true,
      message: parsedInput.id
        ? "Agendamento atualizado com sucesso!"
        : "Agendamento criado com sucesso!",
    };
  });
