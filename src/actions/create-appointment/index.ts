"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { getAvailableTimes } from "../get-available-times";
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

    const availableTimes = await getAvailableTimes({
      doctorId: parsedInput.doctorId,
      date: dayjs(parsedInput.date).format("YYYY-MM-DD"),
    });
    if (!availableTimes.data) {
      throw new Error("Erro ao verificar horários disponíveis");
    }

    const isTimeAvailable = availableTimes.data?.some(
      (time) => time.value === parsedInput.time && time.available,
    );
    if (!isTimeAvailable) {
      throw new Error("Horário não disponível");
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
