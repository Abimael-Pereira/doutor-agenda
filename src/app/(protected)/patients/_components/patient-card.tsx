"use client";

import { Mail, Phone } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { patientsTable } from "@/db/schema";

import UpsertPatientForm from "./upsert-patient-form";

interface PatientCardProps {
  patient: typeof patientsTable.$inferSelect;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const patientInitials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sexLabel = patient.sex === "male" ? "Masculino" : "Feminino";

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const numbers = phone.replace(/\D/g, "");
    // Format as (XX) XXXXX-XXXX
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{patientInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{patient.name}</h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {sexLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            <span className="truncate">{patient.email}</span>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>{formatPhoneNumber(patient.phoneNumber)}</span>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="pt-4">
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Editar Paciente
            </Button>
          </DialogTrigger>
          <UpsertPatientForm
            patient={patient}
            onSuccess={() => setDialogIsOpen(false)}
            isOpen={dialogIsOpen}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
