"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { formatCurrencyInCents } from "@/_helpers/currency";
import { appointmentsTable } from "@/db/schema";

import AppointmentsTableActions from "./table-actions";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patient: {
    name: string;
  };
  doctor: {
    name: string;
  };
};

export const appointmentsTableColumns: ColumnDef<Appointment>[] = [
  {
    id: "patient",
    accessorKey: "patient.name",
    header: "Paciente",
  },
  {
    id: "doctor",
    accessorKey: "doctor.name",
    header: "Médico",
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Data e Hora",
    cell: ({ row }) => {
      const date = row.original.date;
      return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    },
  },
  {
    id: "specialty",
    accessorKey: "doctor.specialty",
    header: "Especialidade",
  },
  {
    id: "appointmentPriceInCents",
    accessorKey: "appointmentPriceInCents",
    header: "Valor",
    cell: ({ row }) => {
      const price = row.original.appointmentPriceInCents;
      return formatCurrencyInCents(price);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original;
      return <AppointmentsTableActions appointment={appointment} />;
    },
  },
];
