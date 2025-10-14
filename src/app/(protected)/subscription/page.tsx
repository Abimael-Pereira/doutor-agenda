import { headers } from "next/headers";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";

import PricingCard from "./_components/subscription-card";

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <WithAuthentication mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Assinatura</PageTitle>
            <PageDescription>Gerencie a sua assinatura</PageDescription>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <PricingCard
            active={session!.user.plan === "essential"}
            planName="Essential"
            description="Para profissionais autônomos ou pequenas clínicas"
            price="R$59"
            priceUnit="/ mês"
            features={[
              "Cadastro de até 3 médicos",
              "Agendamentos ilimitados",
              "Métricas básicas",
              "Cadastro de pacientes",
              "Confirmação manual",
              "Suporte via e-mail",
            ]}
            userEmail={session!.user.email}
          />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default SubscriptionPage;
