import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
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
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddPatientButton from "./_components/add-patient-button";
import { patientsTableColumns } from "./_components/table-columns";

const PatientsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (session.user.plan === "free") {
    redirect("/new-subscription");
  }

  if (!session.user.clinic.id) {
    redirect("/clinic-form");
  }

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, session.user.clinic.id),
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>Gerencie os pacientes da clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        {patients.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-sm">
            Nenhum paciente encontrado. Adicione um paciente para começar a
            gerenciar.
          </p>
        ) : (
          <DataTable data={patients} columns={patientsTableColumns} />
        )}
      </PageContent>
    </PageContainer>
  );
};

export default PatientsPage;
