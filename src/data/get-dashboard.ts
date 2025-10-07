import { addDays } from "date-fns";
import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

interface GetDashboardParams {
  from: string;
  to: string;
  clinic: { id: string };
}

export const getDashboard = async ({
  from,
  to,
  clinic,
}: GetDashboardParams) => {
  const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate();
  const chartEndDate = dayjs().add(10, "days").endOf("day").toDate();

  const [
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  ] = await Promise.all([
    db
      .select({ total: sum(appointmentsTable.appointmentPriceInCents) })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, clinic.id!),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, addDays(new Date(to), 1)),
        ),
      )
      .then((result) => result[0]),
    db
      .select({ total: count() })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, clinic.id!),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, addDays(new Date(to), 1)),
        ),
      )
      .then((result) => result[0]),
    db
      .select({ total: count() })
      .from(patientsTable)
      .where(and(eq(patientsTable.clinicId, clinic.id!)))
      .then((result) => result[0]),
    db
      .select({ total: count() })
      .from(doctorsTable)
      .where(and(eq(doctorsTable.clinicId, clinic.id!)))
      .then((result) => result[0]),
    db
      .select({
        id: doctorsTable.id,
        name: doctorsTable.name,
        avatarImageUrl: doctorsTable.avatarImageUrl,
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(doctorsTable)
      .leftJoin(
        appointmentsTable,
        and(
          eq(appointmentsTable.doctorId, doctorsTable.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .where(eq(doctorsTable.clinicId, clinic.id!))
      .groupBy(doctorsTable.id)
      .orderBy(desc(count(appointmentsTable.id)))
      .limit(10),
    db
      .select({
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(appointmentsTable)
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(
        and(
          eq(appointmentsTable.clinicId, clinic.id!),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .groupBy(doctorsTable.specialty)
      .orderBy(desc(count(appointmentsTable.id))),
    db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.clinicId, clinic.id!),
        gte(appointmentsTable.date, dayjs().subtract(1, "day").toDate()),
        lte(appointmentsTable.date, new Date()),
      ),
      with: {
        patient: true,
        doctor: true,
      },
    }),
    db
      .select({
        date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
        appointments: count(appointmentsTable.id),
        revenue:
          sql<number>`COALESCE(SUM(${appointmentsTable.appointmentPriceInCents}), 0)`.as(
            "revenue",
          ),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, clinic.id!),
          gte(appointmentsTable.date, chartStartDate),
          lte(appointmentsTable.date, chartEndDate),
        ),
      )
      .groupBy(sql`DATE(${appointmentsTable.date})`)
      .orderBy(sql`DATE(${appointmentsTable.date})`),
  ]);

  return {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  };
};
