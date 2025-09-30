"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

import { formatCurrencyInCents } from "@/_helpers/currency";
import { createAppointment } from "@/actions/create-appointment";
import {
  type CreateAppointmentSchema,
  createAppointmentSchema,
} from "@/actions/create-appointment/schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { doctorsTable, patientsTable } from "@/db/schema";

interface AddAppointmentFormProps {
  doctors: (typeof doctorsTable.$inferSelect)[];
  patients: (typeof patientsTable.$inferSelect)[];
  onSuccess?: () => void;
}

export function AddAppointmentForm({
  doctors,
  patients,
  onSuccess,
}: AddAppointmentFormProps) {
  const form = useForm<CreateAppointmentSchema>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      date: undefined,
      appointmentPriceInCents: 0,
    },
  });

  const { executeAsync, isExecuting } = useAction(createAppointment, {
    onSuccess: ({ data }) => {
      toast.success(data?.message || "Agendamento criado com sucesso!");
      form.reset();
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao criar agendamento");
    },
  });

  const watchedDoctorId = form.watch("doctorId");
  const watchedPatientId = form.watch("patientId");

  // Atualizar o preço quando o médico é selecionado
  useEffect(() => {
    if (watchedDoctorId) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor.id === watchedDoctorId,
      );
      if (selectedDoctor) {
        form.setValue(
          "appointmentPriceInCents",
          selectedDoctor.appointmentPriceInCents,
        );
      }
    }
  }, [watchedDoctorId, doctors, form]);

  const isPatientAndDoctorSelected = watchedPatientId && watchedDoctorId;

  const onSubmit = async (data: CreateAppointmentSchema) => {
    await executeAsync(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex flex-col">
                          <span>{doctor.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {doctor.specialty} -{" "}
                            {formatCurrencyInCents(
                              doctor.appointmentPriceInCents,
                            )}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="appointmentPriceInCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Consulta</FormLabel>
              <FormControl>
                <NumericFormat
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  disabled={!watchedDoctorId || isExecuting}
                  value={field.value / 100}
                  onValueChange={(values) => {
                    field.onChange(Math.round((values.floatValue || 0) * 100));
                  }}
                  placeholder="R$ 0,00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data e Horário</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      disabled={!isPatientAndDoctorSelected || isExecuting}
                      className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                      data-empty={!field.value}
                    >
                      <CalendarIcon />
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    autoFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={() => (
            <FormItem>
              <FormLabel>Horário</FormLabel>
              <Select disabled={!isPatientAndDoctorSelected || isExecuting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: Implementar lógica de horários disponíveis */}
                  <SelectItem value="placeholder" disabled>
                    Horários serão implementados
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isExecuting}>
            {isExecuting ? "Salvando..." : "Salvar Agendamento"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
