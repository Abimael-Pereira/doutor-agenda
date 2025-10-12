import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import PricingCard from "./_components/subscription-card";

const SubscriptionPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>Gerencie a sua assinatura</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <PricingCard
          active={false}
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
        />
      </PageContent>
    </PageContainer>
  );
};

export default SubscriptionPage;
