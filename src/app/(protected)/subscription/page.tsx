import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import PricingCard from "./_components/subscription-card";

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic.id) {
    redirect("/clinic-form");
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>Gerencie a sua assinatura</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent className="flex flex-col gap-10 md:flex-row md:items-stretch">
        <PricingCard
          active={session?.user.plan === "essential"}
          planName="Essential"
          description="Para profissionais autônomos ou pequenas clínicas"
          price="R$59"
          priceUnit="/ mês"
          features={[
            "Cadastro ilimitado de médicos",
            "Agendamentos ilimitados",
            "Métricas básicas",
            "Cadastro de pacientes",
            "Confirmação manual",
            "Suporte via e-mail",
          ]}
          userEmail={session?.user.email}
        />
        <PricingCard
          active={session?.user.plan === "premium"}
          planName="Premium"
          description="Para clínicas de médio a grande porte"
          price="R$**"
          priceUnit="/ mês"
          features={[
            "Tudo do Essential",
            "Métricas completas",
            "Histórico do paciente",
            "Atendimento por agente IA",
            "Confirmação automática",
            "Suporte prioritário",
          ]}
          userEmail={session?.user.email}
          buttonPlaceholder="Em breve"
        />
      </PageContent>
    </PageContainer>
  );
};

export default SubscriptionPage;
