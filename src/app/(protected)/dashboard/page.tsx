import { addDays, addMonths, format } from "date-fns";
import dayjs from "dayjs";
import { and, count, eq, gte, lte, sql, sum } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AppointmentChart from "./_components/appointment-chart";
import { DatePicker } from "./_components/date-picker";
import StatsCards from "./_components/stats-cards";

interface DashboardPageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  const clinic = session.user.clinic;

  const { from, to } = await searchParams;
  if (!from || !to) {
    const from = format(new Date(), "yyyy-MM-dd");
    const to = format(addMonths(new Date(), 1), "yyyy-MM-dd");
    redirect(`/dashboard?from=${from}&to=${to}`);
  }

  const [totalRevenue, totalAppointments, totalPatients, totalDoctors] =
    await Promise.all([
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
    ]);

  const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate();
  const chartEndDate = dayjs().add(10, "days").endOf("day").toDate();

  const dailyAppointmentsData = await db
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
    .orderBy(sql`DATE(${appointmentsTable.date})`);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCards
          totalRevenue={totalRevenue}
          totalAppointments={totalAppointments}
          totalPatients={totalPatients}
          totalDoctors={totalDoctors}
        />
        <div className="grid grid-cols-[2.25fr_1fr]">
          <AppointmentChart dailyAppointmentsData={dailyAppointmentsData} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
