import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import PricingCard from "../(protected)/subscription/_components/subscription-card";

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  if (!session.user.clinic.id) {
    redirect("/clinic-form");
  }
  if (session.user.plan === "essential") {
    redirect("/dashboard");
  }
  return (
    <main className="from-background via-secondary/20 to-background flex min-h-screen items-center justify-center bg-gradient-to-br p-8">
      <div className="w-full max-w-2xl space-y-12 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
            Transforme a Gestão da Sua Clínica
          </h1>
          <p className="text-muted-foreground text-xl leading-relaxed text-balance">
            Para começar a revolucionar seus agendamentos e oferecer uma
            experiência excepcional aos seus pacientes, você precisa escolher o
            plano ideal para sua clínica.
          </p>
          <span className="text-muted-foreground text-sm leading-relaxed text-balance">
            Profissionais que utilizam nossa plataforma economizam em média 15
            horas por semana em tarefas administrativas. Não perca mais tempo
            com agendas manuais e processos ineficientes!
          </span>
          <div className="text-muted-foreground mt-5 flex items-center justify-center gap-2 text-sm">
            <svg
              className="text-primary h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Pagamento seguro • Cancele quando quiser</span>
          </div>
        </div>
        {/* </CHANGE> */}

        <div className="flex justify-center">
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
            userEmail={session.user.email!}
          />
        </div>
        {/* </CHANGE> */}

        <div className="space-y-4 pt-8">
          <p className="text-muted-foreground text-sm">
            Junte-se a mais de 500 clínicas que já transformaram sua gestão
          </p>
          <div className="text-muted-foreground flex items-center justify-center gap-8 text-xs">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Dados protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Ativação imediata</span>
            </div>
          </div>
        </div>
        {/* </CHANGE> */}
      </div>
    </main>
  );
};

export default SubscriptionPage;
