import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddAppointmentButton } from "./_components/add-appointment-button";

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  const clinic = session?.user.clinic;
  if (!clinic?.id) {
    redirect("/clinic-form");
  }

  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, clinic.id),
    orderBy: (table, { asc }) => [asc(table.name)],
  });

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, clinic.id),
    orderBy: (table, { asc }) => [asc(table.name)],
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>Gerencie os agendamentos da clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton doctors={doctors} patients={patients} />
        </PageActions>
      </PageHeader>

      {/* TODO: Lista de agendamentos será implementada posteriormente */}
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-muted-foreground text-sm">
            Você pode começar criando um novo agendamento.
          </p>
          <AddAppointmentButton
            doctors={doctors}
            patients={patients}
            className="mt-4"
          />
        </div>
      </div>
    </PageContainer>
  );
}
