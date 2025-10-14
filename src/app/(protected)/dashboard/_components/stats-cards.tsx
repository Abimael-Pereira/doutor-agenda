import {
  CalendarIcon,
  DollarSignIcon,
  Stethoscope,
  UsersIcon,
} from "lucide-react";

import { formatCurrencyInCents } from "@/_helpers/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalRevenue: {
    total: string | null;
  };
  totalAppointments: {
    total: number;
  };
  totalPatients: {
    total: number;
  };
  totalDoctors: {
    total: number;
  };
}

const StatsCards = ({
  totalRevenue,
  totalAppointments,
  totalPatients,
  totalDoctors,
}: StatsCardsProps) => {
  const stats = [
    {
      label: "Faturamento",
      value: formatCurrencyInCents(Number(totalRevenue.total) || 0),
      icon: DollarSignIcon,
    },
    {
      label: "Agendamentos",
      value: totalAppointments.total,
      icon: CalendarIcon,
    },
    {
      label: "Pacientes",
      value: totalPatients.total,
      icon: UsersIcon,
    },
    {
      label: "Médicos",
      value: totalDoctors.total,
      icon: Stethoscope,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                <Icon className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <CardTitle className="text-muted-foreground text-xs font-medium sm:text-sm">
                {stat.label}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold sm:text-2xl">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
