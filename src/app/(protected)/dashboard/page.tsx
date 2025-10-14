import { addMonths, format } from "date-fns";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getDashboard } from "@/data/get-dashboard";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";

import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import AppointmentChart from "./_components/appointment-chart";
import { DatePicker } from "./_components/date-picker";
import StatsCards from "./_components/stats-cards";
import TopDoctors from "./_components/top-doctors";
import TopSpecialties from "./_components/top-specialties";

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

  const { from, to } = await searchParams;
  if (!from || !to) {
    const from = format(new Date(), "yyyy-MM-dd");
    const to = format(addMonths(new Date(), 1), "yyyy-MM-dd");
    redirect(`/dashboard?from=${from}&to=${to}`);
  }

  const {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  } = await getDashboard({
    from,
    to,
    clinic: {
      id: session!.user.clinic.id!,
    },
  });

  return (
    <WithAuthentication mustHaveClinic mustHaveEssentialPlan>
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2.25fr_1fr]">
            <AppointmentChart dailyAppointmentsData={dailyAppointmentsData} />
            <TopDoctors doctors={topDoctors} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2.25fr_1fr]">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="h-5 w-5" />
                  <CardTitle className="text-base sm:text-lg">
                    Agendamentos de Hoje
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={appointmentsTableColumns}
                  data={todayAppointments}
                />
              </CardContent>
            </Card>
            <TopSpecialties topSpecialties={topSpecialties} />
          </div>
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default DashboardPage;
