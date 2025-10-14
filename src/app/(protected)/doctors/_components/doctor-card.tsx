"use client";

import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { useState } from "react";

import { formatCurrencyInCents } from "@/_helpers/currency";
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
import { doctorsTable } from "@/db/schema";

import { getAvailability } from "../_helpers/availability";
import UpsertDoctorForm from "./upsert-doctor-form";

interface DoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const doctorInitials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const availability = getAvailability(doctor);
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground truncate text-xs sm:text-sm">
              {doctor.specialty}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-1 flex-col gap-2 py-3">
        <Badge variant="outline" className="w-full justify-start text-xs">
          <CalendarIcon className="mr-1 h-3 w-3" />
          <span className="truncate">
            {availability.from.format("dddd")} a{" "}
            {availability.to.format("dddd")}
          </span>
        </Badge>
        <Badge variant="outline" className="w-full justify-start text-xs">
          <ClockIcon className="mr-1 h-3 w-3" />
          {availability.from.format("HH:mm")} às{" "}
          {availability.to.format("HH:mm")}
        </Badge>
        <Badge variant="outline" className="w-full justify-start text-xs">
          <DollarSignIcon className="mr-1 h-3 w-3" />
          {formatCurrencyInCents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />

      <CardFooter className="pt-3">
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full text-sm">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            onSuccess={() => setDialogIsOpen(false)}
            doctor={{
              ...doctor,
              availableFromTime: availability.from.format("HH:mm:ss"),
              availableToTime: availability.to.format("HH:mm:ss"),
            }}
            isOpen={dialogIsOpen}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
