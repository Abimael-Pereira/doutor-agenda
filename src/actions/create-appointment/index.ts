"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { createAppointmentSchema } from "./schema";

export const createAppointment = actionClient
  .inputSchema(createAppointmentSchema)
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

    const [hours, minutes] = parsedInput.time.split(":");
    const appointmentDateTime = dayjs(parsedInput.date)
      .hour(parseInt(hours))
      .minute(parseInt(minutes))
      .second(0)
      .toDate();

    await db.insert(appointmentsTable).values({
      patientId: parsedInput.patientId,
      doctorId: parsedInput.doctorId,
      clinicId: clinic.id,
      date: appointmentDateTime,
      appointmentPriceInCents: parsedInput.appointmentPriceInCents,
    });

    revalidatePath("/appointments");

    return {
      success: true,
      message: "Agendamento criado com sucesso!",
    };
  });
