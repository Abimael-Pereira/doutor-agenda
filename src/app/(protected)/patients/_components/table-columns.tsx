"use client";

import { ColumnDef } from "@tanstack/react-table";

import { patientsTable } from "@/db/schema";

import PatientsTableActions from "./table-actions";

type Patients = typeof patientsTable.$inferSelect;

export const patientsTableColumns: ColumnDef<Patients>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sexo",
    cell: ({ row }) => (row.original.sex === "male" ? "Masculino" : "Feminino"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;
      return <PatientsTableActions patient={patient} />;
    },
  },
];
